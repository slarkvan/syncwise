import Browser from 'webextension-polyfill'
import injectScript from '@/content-script/inject-script?script&module'
import {
    MESSAGE_COLLECT_TWEETS_BOOKMARKS,
    MESSAGE_GET_PHASE_SPECIFIC_RAW_DATA,
    MESSAGE_ORIGIN_BACKGROUND,
    MESSAGE_PAUSE_TWITTER_BOOKMARKS_COLLECTION,
    TASK_TWITTER_BOOKMARKS_SCROLL_FOR_COLLECTION,
    TWITTER_BOOKMARKS_XHR_HIJACK,
} from '@/constants/twitter'
import { collectTwitterBookmarks } from '@/content-script/plugins/collect-twitter-bookmarks'

import { getUnsyncedTwitterBookmarks } from '@/content-script/handlers/twitter'
import { bookmarksStore } from '@/content-script/utils/store'
;(function insertScript() {
    const script = document.createElement('script')
    script.src = Browser.runtime.getURL(injectScript)
    script.type = 'module'
    document.head.prepend(script)
})()
;(function switchOnHijack() {
    localStorage.setItem(TWITTER_BOOKMARKS_XHR_HIJACK, '1')
})()

// 不能写成 async & 必须返回 true
// 不然 background.js 不能拿到数据
Browser.runtime.onMessage.addListener(function (message, sender, sendResponse: any) {
    if (message?.from === MESSAGE_ORIGIN_BACKGROUND) {
        if (message?.type === MESSAGE_COLLECT_TWEETS_BOOKMARKS) {
            collectTwitterBookmarks()
        }

        if (message?.type === MESSAGE_GET_PHASE_SPECIFIC_RAW_DATA) {
            getUnsyncedTwitterBookmarks(sendResponse)
        }

        if (message?.type === MESSAGE_PAUSE_TWITTER_BOOKMARKS_COLLECTION) {
            localStorage.setItem(TASK_TWITTER_BOOKMARKS_SCROLL_FOR_COLLECTION, 'pause')
        }
    }

    sendResponse()
})

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

;(async () => {
    let lastCount = 0
    while (true) {
        await delay(3000)
        const count = ((bookmarksStore.load() as any) ?? []).length
        try {
            if (lastCount !== count) {
                await Browser.storage.local.set({ count })
                lastCount = count
            }
        } catch (e) {
            console.log('error in content script:', e)
        }
    }
})()
