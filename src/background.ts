import Browser from 'webextension-polyfill'
import {
    MESSAGE_COLLECT_TWEETS_BOOKMARKS,
    MESSAGE_ORIGIN_BACKGROUND,
    MESSAGE_SYNC_TO_OBSIDIAN,
    MESSAGE_SYNC_TO_LOGSEQ,
    MESSAGE_PAUSE_TWITTER_BOOKMARKS_COLLECTION,
} from '@/constants/twitter'
import { saveToLogseq } from './handler/output/logseq'
import { saveToObsidian } from './handler/output/obsidian'

// 监听消息
Browser.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
    console.log('background JS chrome.runtime.onMessage.addListener::', message, JSON.stringify(message))
    if (message?.type === 'OPEN_OPTIONS_PAGE') {
        Browser.runtime.openOptionsPage()
    } else if (message.type === MESSAGE_SYNC_TO_LOGSEQ) {
        saveToLogseq()
    } else if (message.type === MESSAGE_SYNC_TO_OBSIDIAN) {
        saveToObsidian()
    } else if (message.type === MESSAGE_COLLECT_TWEETS_BOOKMARKS) {
        Browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
            const tab: any = tabs[0]
            if (tab) {
                Browser.tabs.sendMessage(tab.id, {
                    from: MESSAGE_ORIGIN_BACKGROUND,
                    type: MESSAGE_COLLECT_TWEETS_BOOKMARKS,
                })
            }
        })
    } else if (message.type === MESSAGE_PAUSE_TWITTER_BOOKMARKS_COLLECTION) {
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
