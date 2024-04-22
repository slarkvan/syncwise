import { beautifyLogseqText } from '@/parser/twitter/bookmark'
import { blockRending } from '@/utils'
import { DataBlock } from '@/types/logseq/block'
import { getUnSyncedTwitterBookmarks } from '../background'
import logseqClient from '@/pkms/logseq/client'
import { getLogseqSyncConfig } from '@/config/logseq'

export const saveToLogseq = async () => {
    const list = await getUnSyncedTwitterBookmarks()
    if (!Array.isArray(list) || list.length === 0) {
        console.log('all bookmarks are synced')
        return
    }
    const now = new Date()
    const resp = await logseqClient.getUserConfig()
    const formattedList: any = list.map((item) => {
        item.full_text = beautifyLogseqText(item.full_text as string, item.urls)
        return {
            ...item,
            preferredDateFormat: resp['preferredDateFormat'],
            time: now,
        }
    })

    const blocks = formattedList.map((item: any) => blockRending(item))
    const { pageName } = await getLogseqSyncConfig()
    //  如果 batch block 困难，可以 loop await。先暂时这样
    for (let i = 0; i < blocks.length; i++) {
        const resp1: DataBlock = await logseqClient.appendBlock(pageName, blocks[i][0])
        await logseqClient.appendBlock(resp1.uuid, blocks[i][1])
    }
}
