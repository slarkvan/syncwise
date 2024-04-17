import { beautifyText } from '../../../parser/twitter/bookmark'
import LogseqClient from '../../../pkms/logseq/client'
import { blockRending } from '../../../utils'
import { DataBlock } from '../../../types/logseq/block'
import { getUnSyncedTwitterBookmarks } from '../background'

const logseqClient = new LogseqClient()

// MORE, 发送内容到 logseq
export const saveToLogseq = async () => {
    const list = await getUnSyncedTwitterBookmarks()
    if (!Array.isArray(list) || list.length === 0) {
        console.log('all bookmarks are synced')
        return
    }
    const now = new Date()
    const resp = await logseqClient.getUserConfig()
    // TODO: block Rendering
    const formattedList: any = list.map((item) => {
        item.full_text = beautifyText(item.full_text as string, item.urls)
        return {
            ...item,
            preferredDateFormat: resp['preferredDateFormat'],
            time: now,
        }
    })

    // TODO: ai 会内容基于已有的 tab 打标，参考 ai-tab

    const blocks = formattedList.map((item: any) => blockRending(item))

    //  如果 batch block 困难，可以 loop await。先暂时这样
    for (let i = 0; i < blocks.length; i++) {
        // TODO: 用户可以自定义
        const resp1: DataBlock = await logseqClient.appendBlock(
            // journalPage,
            'twitter bookmarks',
            blocks[i][0]
        )
        await logseqClient.appendBlock(resp1.uuid, blocks[i][1])
    }
}
