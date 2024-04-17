import Browser from 'webextension-polyfill'
import injectScript from './injectScript?script&module'
import {
    MESSAGE_COLLECT_TWEETS_BOOKMARKS,
    MESSAGE_GET_PHASE_SPECIFIC_RAW_DATA,
    MESSAGE_ORIGIN_BACKGROUND,
    MESSAGE_PAUSE_TWITTER_BOOKMARKS_COLLECTION,
    TASK_TWITTER_BOOKMARKS_SCROLL_FOR_COLLECTION,
    TWITTER_BOOKMARKS_XHR_HIJACK,
} from '../constants/twitter'
import { collectTwitterBookmarks } from './plugins/collect-twitter-bookmarks'

// inject XHR
import { getUnSyncedTwitterBookmarksList } from './handlers/twitter'
import { bookmarksStore } from './utils/store'
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
    console.log('content JS chrome.runtime.onMessage.addListener:', JSON.stringify(message), typeof message)
    if (message?.from === MESSAGE_ORIGIN_BACKGROUND) {
        if (message?.type === MESSAGE_COLLECT_TWEETS_BOOKMARKS) {
            collectTwitterBookmarks('message')
        }

        if (message?.type === MESSAGE_GET_PHASE_SPECIFIC_RAW_DATA) {
            getUnSyncedTwitterBookmarksList(sendResponse)
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

const port = Browser.runtime.connect({ name: 'port1' })
port.postMessage({ type: 'type1' })
port.onMessage.addListener((msg) => {
    console.log('content JS chrome.runtime.onMessage.addListener:', JSON.stringify(msg), typeof msg)
})
port.onDisconnect.addListener(() => {
    console.log('content JS chrome.runtime.onDisconnect.addListener')
})

// 建立轮询，查询 key_twitter_bookmarks 的长度， 因为在 XHR 里不允许执行 Browser.storage.local API
;(async () => {
    let lastCount = 0
    while (true) {
        await delay(5000)
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
