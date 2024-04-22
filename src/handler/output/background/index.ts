import Browser from 'webextension-polyfill'
import { MESSAGE_GET_PHASE_SPECIFIC_RAW_DATA, MESSAGE_ORIGIN_BACKGROUND } from '../../../constants/twitter'

async function sendMessageToContentScript(tabId: number, message: any) {
    try {
        const response = await Browser.tabs.sendMessage(tabId, message)
        console.log('Response:', response)
        return response
    } catch (error: any) {
        // TODO: error handling
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
    const result = await sendMessageToContentScript(tabId, {
        from: MESSAGE_ORIGIN_BACKGROUND,
        type: MESSAGE_GET_PHASE_SPECIFIC_RAW_DATA,
    })
    return result?.data ?? []
}
