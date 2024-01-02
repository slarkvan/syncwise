import { beautifyObsidianText } from '../../../parser/twitter/bookmark'
import obsidianClient from '../../../pkms/obsidian/client'
import { blockObsidianRending } from '../../../utils'
import { getUnSyncedTwitterBookmarks } from '../background'

const saveToObsidianSharding = async (list: TweetBookmarkParsedItem[]) => {
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
    // 切换到阅读模式
    const resp = await obsidianClient.request('/vault/twitter bookmarks.md', {
        // const resp = await obsidianClient.request('/vault/twitter.md', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/markdown',
        },
        body: mdContent,
    })
    console.log(resp)
}

export const saveToObsidian = async () => {
    const list = await getUnSyncedTwitterBookmarks()
    if (!Array.isArray(list) || list.length === 0) {
        console.log('all bookmarks are synced')
        return
    }

    // 将 list 切片上传
    while (list.length > 0) {
        const chunk = list.splice(0, 100)
        await saveToObsidianSharding(chunk)
    }
}
