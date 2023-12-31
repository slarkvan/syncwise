import Browser from 'webextension-polyfill'
import {
    MESSAGE_COLLECT_TWEETS_BOOKMARKS,
    MESSAGE_ORIGIN_BACKGROUND,
    MESSAGE_ORIGIN_POPUP,
    MESSAGE_SYNC_TO_OBSIDIAN,
    MESSAGE_SYNC_TO_LOGSEQ,
    MESSAGE_PAUSE_TWITTER_BOOKMARKS_COLLECTION,
} from './constants/twitter'
import { saveToLogseq } from './handler/output/logseq'
import { saveToObsidian } from './handler/output/obsidian'

Browser.action.setBadgeText({ text: '66%' })

// 监听消息
Browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log('background JS chrome.runtime.onMessage.addListener::', message, JSON.stringify(message))

    if (message?.from === MESSAGE_ORIGIN_POPUP && message.type === MESSAGE_SYNC_TO_LOGSEQ) {
        console.log('will execute saveToLogseq()')
        saveToLogseq()
    }

    // save to Obsidian
    if (message?.from === MESSAGE_ORIGIN_POPUP && message.type === MESSAGE_SYNC_TO_OBSIDIAN) {
        console.log('will execute saveToObsidian()')
        saveToObsidian()
    }

    // forward message to content script
    if (message?.from === MESSAGE_ORIGIN_POPUP && message.type === MESSAGE_COLLECT_TWEETS_BOOKMARKS) {
        console.log('forward message to content script')
        Browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
            const tab: any = tabs[0]
            if (tab) {
                Browser.tabs.sendMessage(tab.id, {
                    from: MESSAGE_ORIGIN_BACKGROUND,
                    type: MESSAGE_COLLECT_TWEETS_BOOKMARKS,
                })
            }
        })
    }

    // pause
    if (message?.from === MESSAGE_ORIGIN_POPUP && message.type === MESSAGE_PAUSE_TWITTER_BOOKMARKS_COLLECTION) {
        console.log('forward message to content script')
        Browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
            const tab: any = tabs[0]
            if (tab) {
                Browser.tabs.sendMessage(tab.id, {
                    from: MESSAGE_ORIGIN_BACKGROUND,
                    type: MESSAGE_PAUSE_TWITTER_BOOKMARKS_COLLECTION,
                })
            }
        })
    }

    // forward to popup

    sendResponse()
})
;(async () => {
    const val = await Browser.storage.local.get('count')
    console.log('background val:', val)
})()
