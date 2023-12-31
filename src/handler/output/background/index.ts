import Browser from 'webextension-polyfill'
import { MESSAGE_GET_PHASE_SPECIFIC_RAW_DATA, MESSAGE_ORIGIN_BACKGROUND } from '../../../constants/twitter'

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

export async function getUnSyncedTwitterBookmarks(): Promise<TweetBookmarkParsedItem[] | undefined> {
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
    return result?.data ?? []
}
