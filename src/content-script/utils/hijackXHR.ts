import { AsyncArray } from '@liuli-util/async'
import { get, pick } from 'lodash-es'
import { bookmarksStore } from './store'
import { TWITTER_BOOKMARKS_XHR_HIJACK } from '../../constants/twitter'
import { parseBookmarkResponse } from '../../parser/twitter'

function hookXHR(options: { after(xhr: XMLHttpRequest): string | void }) {
    const send = XMLHttpRequest.prototype.send

    XMLHttpRequest.prototype.send = function () {
        this.addEventListener('readystatechange', () => {
            if (this.readyState === 4) {
                const r = options.after(this)
                if (!r) {
                    return
                }
                Object.defineProperty(this, 'responseText', {
                    value: r,
                    writable: true,
                })
                Object.defineProperty(this, 'response', {
                    value: r,
                    writable: true,
                })
            }
        })

        return send.apply(this, arguments as any)
    }
}

export async function hijackXHR() {
    console.log('hijackXHR')
    hookXHR({
        after(xhr) {
            const isHijack = localStorage.getItem(TWITTER_BOOKMARKS_XHR_HIJACK)
            console.log('isHijack', isHijack)
            if (!isHijack) return

            if (/https:\/\/twitter.com\/i\/api\/graphql\/.*\/Bookmarks/.test(xhr.responseURL)) {
                if (xhr.responseType === '' || xhr.responseType === 'text') {
                    const response = JSON.parse(xhr.responseText)
                    // handleTweetDetail(response)
                    const entries = filterEntries(
                        response?.data?.bookmark_timeline_v2?.timeline?.instructions?.[0]?.entries ?? []
                    )
                    console.log('Bookmarks entries', entries)
                    const parsedList = entries.map(parseBookmarkResponse)
                    // sendMessageToBackground(parsedList)
                    // if (db) {
                    //   parsedList.map((x) => {
                    //     db.put('bookmarks', {
                    //       url: x.url,
                    //       screen_name: x.screen_name,
                    //     });
                    //   });
                    // } else {
                    //   console.log('db not initialized');
                    // }
                    console.log('parsedList:', parsedList)
                    // 去重逻辑
                    bookmarksStore.upsert(parsedList)
                }
            }
        },
    })
}

// function sendMessageToBackground(list: TweetBookmarkParsedItem[]) {
//   Browser.runtime.sendMessage({
//     from: MESSAGE_SAVE_DATA_TO_DB,
//     type: "save",
//     data: list
//   });
// }
