import Browser from 'webextension-polyfill'
import { defaults, merge } from 'lodash-es'
import { NoteSyncTarget } from '../types/pkm.d'
export type LogseqSyncConfig = {
    host: string
    port: string
    token: string | null
    pageType: 'journal' | 'custom'
    pageName: string // 同步去哪里
}

export type UserConfig = {
    target: NoteSyncTarget
    logseq: LogseqSyncConfig
    obsidian: {
        host: string
        port: string
        token: string | null
        pageType: 'journal' | 'custom'
        pageName: string // 同步去哪里
    }
}

const userConfigWithDefaultValue: UserConfig = {
    target: NoteSyncTarget.Obsidian,
    logseq: {
        host: 'localhost',
        port: '12315',
        token: null,
        pageType: 'custom',
        pageName: 'twitter bookmarks', // Default destination page for Logseq
    },
    obsidian: {
        host: 'localhost',
        port: '8080',
        token: null,
        pageType: 'journal',
        pageName: 'twitter bookmarks', // Default destination page for Obsidian
    },
}

export async function getUserConfig(): Promise<UserConfig> {
    const result = await Browser.storage.local.get(Object.keys(userConfigWithDefaultValue))
    return defaults(result, userConfigWithDefaultValue)
}

export async function updateUserConfig(updates: Partial<UserConfig>) {
    console.debug('update configs', updates)
    const currentConfig = await getUserConfig() // 获取当前配置
    const mergedConfig = merge({}, currentConfig, updates) // 合并配置
    return Browser.storage.local.set(mergedConfig)
}
