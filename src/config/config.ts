import Browser from 'webextension-polyfill'
import { defaults } from 'lodash-es'
import { NoteSyncTarget } from '../types/pkm.d'

export type UserConfig = {
    target: NoteSyncTarget
    logseq: {
        host: string
        port: string
        token: string | null
        pageType: 'journal' | 'custom'
        pageName: string // 同步去哪里
    }
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
    return Browser.storage.local.set(updates)
}
