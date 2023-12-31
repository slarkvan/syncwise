import Browser from 'webextension-polyfill'
import { getLogseqSyncConfig } from './config/logseq'
import LogseqClient from './pkms/logseq/client'
import { blockObsidianRending, blockRending } from './utils'
import { format } from 'date-fns'
import {
    MESSAGE_COLLECT_TWEETS_BOOKMARKS,
    MESSAGE_GET_PHASE_SPECIFIC_RAW_DATA,
    MESSAGE_ORIGIN_BACKGROUND,
    MESSAGE_ORIGIN_POPUP,
    MESSAGE_SYNC_TO_OBSIDIAN,
    MESSAGE_SYNC_TO_PKM,
} from './constants/twitter'
import { DataBlock } from './types/logseq/block'
import { beautifyObsidianText, beautifyText } from './parser/twitter/bookmark'
import obsidianClient from './pkms/obsidian/client'

const logseqClient = new LogseqClient()

async function getUnSyncedTwitterBookmarks(): Promise<TweetBookmarkParsedItem[] | undefined> {
    const tabs = await Browser.tabs.query({
        active: true,
        currentWindow: true,
    })
    const tabId = tabs?.[0]?.id
    if (!tabId) {
        console.log('no active tab')
        return
    }
    console.log('tabId:', tabId)
    const result = await sendMessageToContentScript(tabId, {
        from: MESSAGE_ORIGIN_BACKGROUND,
        type: MESSAGE_GET_PHASE_SPECIFIC_RAW_DATA,
    })
    // 异步获取 DB, 只能得到 true
    console.log('result:', result)
    return result?.data ?? []
}

// 监听消息
Browser.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
    console.log('background JS chrome.runtime.onMessage.addListener::', message, JSON.stringify(message))
    if (message?.from === MESSAGE_ORIGIN_POPUP && message.type === MESSAGE_SYNC_TO_PKM) {
        // quickCapture('hello world')
        console.log("will parse storage's data...")
        console.log('get data from content script')
        // 多种 PKM 适配
        const list = await getUnSyncedTwitterBookmarks()
        if (Array.isArray(list) && list.length > 0) {
            await quickCapture(list)
        }

        // syncedBookmarksStore.upsert(result.map((x: TweetBookmarkParsedItem) => x.id));
    }

    // save to Obsidian
    if (message?.from === MESSAGE_ORIGIN_POPUP && message.type === MESSAGE_SYNC_TO_OBSIDIAN) {
        const list = await getUnSyncedTwitterBookmarks()
        console.log('message/sync_to_obsidian', list)
        if (Array.isArray(list) && list.length > 0) {
            await saveToObsidian(list)
        }
    }

    // 收集 twitter bookmarks
    if (message?.from === MESSAGE_ORIGIN_POPUP && message.type === MESSAGE_COLLECT_TWEETS_BOOKMARKS) {
        console.log('will collect twitter bookmarks...')
        // forward to content script
        // last active tab will receive this message
        Browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
            const tab: any = tabs[0]
            if (tab) {
                Browser.tabs.sendMessage(tab.id, {
                    from: MESSAGE_ORIGIN_BACKGROUND,
                    type: MESSAGE_COLLECT_TWEETS_BOOKMARKS,
                })
            }
        })
        // 显示返回 true
        return true
    }

    return true
})

// Function to send a message to the content script and await the response
async function sendMessageToContentScript(tabId: number, message: any) {
    try {
        const response = await Browser.tabs.sendMessage(tabId, message)
        console.log('Response:', response)
        return response
    } catch (error: any) {
        throw new Error(error.message)
    }
}

// MORE, 发送内容到 logseq
const quickCapture = async (list: TweetBookmarkParsedItem[]) => {
    const { clipNoteLocation, clipNoteCustomPage, clipNoteTemplate } = await getLogseqSyncConfig()
    const now = new Date()
    const resp = await logseqClient.getUserConfig()

    console.log('quickCapture', now, resp)

    // TODO: block Rendering

    const formattedList: any = list.map((item) => {
        item.full_text = beautifyText(item.full_text as string, item.urls)
        return {
            title: 'ss',
            ...item,
            preferredDateFormat: resp['preferredDateFormat'],
            time: now,
        }
    })

    // TODO: ai 会内容基于已有的 tab 打标，参考 ai-tab

    console.log(`clipNoteLocation:${clipNoteLocation}, formattedList: ${formattedList}`)

    const blocks = formattedList.map((item: any) => blockRending(clipNoteTemplate, item))
    const journalPage = format(now, resp['preferredDateFormat'])
    // await logseqClient.appendBatchBlock(journalPage, blocks);

    //  如果 batch block 困难，可以 loop await。先暂时这样
    for (let i = 0; i < blocks.length; i++) {
        // TODO: 用户可以自定义
        const resp1: DataBlock = await logseqClient.appendBlock(
            // journalPage,
            'twitter bookmarks',
            blocks[i][0]
        )
        await logseqClient.appendBlock(resp1.uuid, blocks[i][1])
    }

    // if (clipNoteLocation === 'customPage') {
    //   await logseqClient.appendBlock(clipNoteCustomPage, blocks);
    // } else if (clipNoteLocation === 'currentPage') {
    //   const { name: currentPage } = await logseqClient.getCurrentPage();
    //   await logseqClient.appendBlock(currentPage, blocks);
    // } else {
    //   const journalPage = format(now, resp['preferredDateFormat']);
    //   await logseqClient.appendBlock(journalPage, blocks);
    // }
    // debounceBadgeSearch(activeTab.url, activeTab.id!);
}

const saveToObsidian = async (list: TweetBookmarkParsedItem[]) => {
    const formattedList: any = list.map((item) => {
        item.full_text = beautifyObsidianText(item.full_text as string, item.urls)
        return {
            ...item,
        }
    })

    const mdContent = formattedList.reduce((accr: string, item: any) => {
        return accr + blockObsidianRending(item)
    }, '')

    console.log('mdContent', mdContent)

    const resp = await obsidianClient.request('127.0.0.1', undefined, '/vault/twitter.md', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/markdown',
        },
        body: mdContent,
    })
    console.log(resp)
}
