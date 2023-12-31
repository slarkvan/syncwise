import Browser from 'webextension-polyfill'
import { LogseqSyncConfig } from './config'

export const getLogseqSyncConfig = async (): Promise<LogseqSyncConfig> => {
    const data = await Browser.storage.local.get('logseq')
    const { host, port, token, pageType, pageName } = data?.logseq ?? {}
    return {
        host,
        port,
        token,
        pageType,
        pageName,
    }
}

export const saveLogseqSyncConfig = async (updates: Partial<LogseqSyncConfig>) => {
    console.log('saveLogseqSyncConfig', updates)
    await Browser.storage.local.set(updates)
}
