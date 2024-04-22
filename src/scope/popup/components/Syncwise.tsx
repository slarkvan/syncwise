import { Button } from '@geist-ui/core'
import React from 'react'
import { NoteSyncTarget } from '@/types/pkm.d'
import {
    MESSAGE_COLLECT_TWEETS_BOOKMARKS,
    MESSAGE_ORIGIN_POPUP,
    MESSAGE_PAUSE_TWITTER_BOOKMARKS_COLLECTION,
    MESSAGE_SYNC_TO_LOGSEQ,
    MESSAGE_SYNC_TO_OBSIDIAN,
} from '@/constants/twitter'
import Browser from 'webextension-polyfill'
import { PlayIcon } from '@primer/octicons-react'
import { Pause } from 'lucide-react'

export default function Syncwise({ count, target }: any) {
    const handlePauseCollect = () => {
        Browser.runtime.sendMessage({
            from: MESSAGE_ORIGIN_POPUP,
            type: MESSAGE_PAUSE_TWITTER_BOOKMARKS_COLLECTION,
        })
    }

    const handleSync = () => {
        Browser.runtime.sendMessage({
            from: MESSAGE_ORIGIN_POPUP,
            type: MESSAGE_SYNC_TO_LOGSEQ,
        })
    }

    const handleCollect = () => {
        Browser.runtime.sendMessage({
            from: MESSAGE_ORIGIN_POPUP,
            type: MESSAGE_COLLECT_TWEETS_BOOKMARKS,
        })
    }

    const handleSyncToObsidian = () => {
        Browser.runtime.sendMessage({
            from: MESSAGE_ORIGIN_POPUP,
            type: MESSAGE_SYNC_TO_OBSIDIAN,
        })
    }

    return (
        <>
            <div className='flex items-center space-x-2'>已收集{count}条书签🔖</div>
            <Button onClick={handleCollect} placeholder={''}>
                <PlayIcon size={16} />
                &nbsp;开始收集
            </Button>
            <Button onClick={handlePauseCollect} placeholder={''}>
                <Pause className='text-sm' size={18} />
                &nbsp;暂停收集
            </Button>

            {target === NoteSyncTarget.Logseq && (
                <Button onClick={handleSync} placeholder={''}>
                    同步到 Logseq
                </Button>
            )}
            {target === NoteSyncTarget.Obsidian && (
                <Button onClick={handleSyncToObsidian} placeholder={''}>
                    同步到 Obsidian
                </Button>
            )}
        </>
    )
}
