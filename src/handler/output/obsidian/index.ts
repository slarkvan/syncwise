import { beautifyObsidianText } from '../../../parser/twitter/bookmark'
import obsidianClient from '../../../pkms/obsidian/client'
import { blockObsidianRending } from '../../../utils'
import { getUnSyncedTwitterBookmarks } from '../background'

export const saveToObsidian = async () => {
    const list = await getUnSyncedTwitterBookmarks()
    if (!Array.isArray(list) || list.length === 0) {
        console.log('all bookmarks are synced')
        return
    }

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
