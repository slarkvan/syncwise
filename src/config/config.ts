import Browser from 'webextension-polyfill'
import { defaults, merge } from 'lodash-es'
import { NoteSyncLocationType, NoteSyncTarget } from '../types/pkm.d'
export type LogseqSyncConfig = {
    host: string
    port: string
    token: string | null
    pageType: NoteSyncLocationType
    pageName: string // 同步去哪里
}

export type ObsidianSyncConfig = {
    host: string
    port: string // http port
    token: string | null
    pageType: NoteSyncLocationType
    pageName: string // 同步去哪里
    insecureMode: boolean
    httpsPort: string
}

export type UserConfig = {
    target: NoteSyncTarget
    logseq: LogseqSyncConfig
    obsidian: ObsidianSyncConfig
}

const DEFAULT_PAGE_NAME = 'twitter bookmarks'

const userConfigWithDefaultValue: UserConfig = {
    target: NoteSyncTarget.Obsidian,
    logseq: {
        host: '127.0.0.1',
        port: '12315',
        token: null,
        pageType: NoteSyncLocationType.CustomPage,
        pageName: DEFAULT_PAGE_NAME, // Default destination page for Logseq
    },
    obsidian: {
        host: '127.0.0.1',
        port: '27123',
        httpsPort: '27124',
        token: null,
        pageType: NoteSyncLocationType.CustomPage,
        pageName: DEFAULT_PAGE_NAME, // Default destination page for Obsidian
        insecureMode: false, // 不安全模式
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
