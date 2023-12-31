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
