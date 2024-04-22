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

function filterEntries(list: any[]) {
    return list.filter((item) => !item.entryId.includes('cursor'))
}

export async function hijackXHR() {
    hookXHR({
        after(xhr) {
            const isHijack = localStorage.getItem(TWITTER_BOOKMARKS_XHR_HIJACK)
            if (!isHijack) return

            if (/https:\/\/twitter.com\/i\/api\/graphql\/.*\/Bookmarks/.test(xhr.responseURL)) {
                if (xhr.responseType === '' || xhr.responseType === 'text') {
                    const response = JSON.parse(xhr.responseText)
                    // handleTweetDetail(response)
                    const entries = filterEntries(
                        response?.data?.bookmark_timeline_v2?.timeline?.instructions?.[0]?.entries ?? []
                    )
                    const parsedList = entries.map(parseBookmarkResponse)
                    // 去重逻辑
                    bookmarksStore.upsert(parsedList, (obj) => {
                        console.log('upsert callback', obj.length)
                    })
                }
            }
        },
    })
}
