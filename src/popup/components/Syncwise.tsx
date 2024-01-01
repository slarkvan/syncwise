import { Button } from '@geist-ui/core'
import React from 'react'
import { NoteSyncTarget } from '../../types/pkm.d'
import {
    MESSAGE_COLLECT_TWEETS_BOOKMARKS,
    MESSAGE_ORIGIN_POPUP,
    MESSAGE_PAUSE_TWITTER_BOOKMARKS_COLLECTION,
    MESSAGE_SYNC_TO_LOGSEQ,
    MESSAGE_SYNC_TO_OBSIDIAN,
} from '../../constants/twitter'
import Browser from 'webextension-polyfill'

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
            <Button onClick={handlePauseCollect} placeholder={'11'}>
                PAUSE Collect Twitter Bookmark
            </Button>
            <Button onClick={handleCollect} placeholder={'11'}>
                Collect Twitter Bookmarks
            </Button>
            {target === NoteSyncTarget.Logseq && (
                <Button onClick={handleSync} placeholder={'11'}>
                    Sync To Logseq
                </Button>
            )}
            {target === NoteSyncTarget.Obsidian && (
                <Button onClick={handleSyncToObsidian} placeholder={'11'}>
                    Sync To Obsidian
                </Button>
            )}
        </>
    )
}
