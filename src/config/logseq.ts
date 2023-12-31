import Browser from 'webextension-polyfill'

export type LogseqSyncConfig = {
    version: string
    logseqHost: string
    logseqHostName: string
    logseqPort: number
    logseqAuthToken: string
    enableClipNoteFloatButton: boolean
    clipNoteLocation: string
    clipNoteCustomPage: string
    clipNoteTemplate: string
}

export const getLogseqSyncConfig = async (): Promise<LogseqSyncConfig> => {
    const {
        version = '',
        logseqHost = 'http://localhost:12315',
        logseqHostName = 'localhost',
        logseqPort = 12315,
        logseqAuthToken = '666', // TODO: 动态设置
        enableClipNoteFloatButton = false,
        clipNoteLocation = 'journal',
        clipNoteCustomPage = '',
        // clipNoteTemplate = `{% raw %}{{twitter {% endraw %}{{url}}{% raw %}}}{% endraw %}
        // collapsed:: true
        // > {{full_text}}`,
        clipNoteTemplate = `{{full_text}}
    collapsed:: true
    {% raw %}{{twitter {% endraw %}{{url}}{% raw %}}}{% endraw %}`,
    } = await Browser.storage.local.get()
    return {
        version,
        logseqHost,
        logseqHostName,
        logseqPort,
        logseqAuthToken,
        enableClipNoteFloatButton,
        clipNoteLocation,
        clipNoteCustomPage,
        clipNoteTemplate,
    }
}

export const saveLogseqSyncConfig = async (updates: Partial<LogseqSyncConfig>) => {
    console.log('saveLogseqSyncConfig', updates)
    await Browser.storage.local.set(updates)
}
