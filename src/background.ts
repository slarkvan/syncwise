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
import { isProduction } from './utils/env'

// 显示可以同步多少条
Browser.action.setBadgeText({ text: '1' })

// 监听消息
Browser.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
    console.log('background JS chrome.runtime.onMessage.addListener::', message, JSON.stringify(message))
    if (message?.type === 'OPEN_OPTIONS_PAGE') {
        Browser.runtime.openOptionsPage()
    } else if (message.type === MESSAGE_SYNC_TO_LOGSEQ) {
        console.log('will execute saveToLogseq()')
        saveToLogseq()
    } else if (message.type === MESSAGE_SYNC_TO_OBSIDIAN) {
        // save to Obsidian
        console.log('will execute saveToObsidian()')
        saveToObsidian()
    } else if (message.type === MESSAGE_COLLECT_TWEETS_BOOKMARKS) {
        // forward message to content script
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
    } else if (message.type === MESSAGE_PAUSE_TWITTER_BOOKMARKS_COLLECTION) {
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

Browser.runtime.onConnect.addListener(async (port) => {
    switch (port.name) {
        case 'port1':
            port.onMessage.addListener((msg) => {
                if (msg.type === 'query') {
                    port.postMessage({ type: '666' })
                } else if (msg.type === 'open-options') {
                    Browser.runtime.openOptionsPage()
                } else if (msg.type === 'type1') {
                    port.postMessage({ type: 'type2' })
                    console.log('type1', msg)
                } else {
                    console.debug('background receive msg', msg)
                }
            })

            break
    }
    return
})

isProduction()
