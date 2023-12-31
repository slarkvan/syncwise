import { t } from './constants/i18n'
import Browser, { Runtime } from 'webextension-polyfill'
import {
    MESSAGE_COLLECT_TWEETS_BOOKMARKS,
    MESSAGE_ORIGIN_POPUP,
    MESSAGE_SYNC_TO_OBSIDIAN,
    MESSAGE_SYNC_TO_LOGSEQ,
    MESSAGE_PAUSE_TWITTER_BOOKMARKS_COLLECTION,
} from './constants/twitter'
import { useEffect, useState } from 'react'

export function App() {
    console.log('popup js init.')
    const [count, setCount] = useState(0)
    useEffect(() => {
        ;(async () => {
            const obj = await Browser.storage.local.get('count')
            setCount(obj.count || 0)
        })()
        // local 是本都
        // sync 随人走的
        Browser.storage.local.onChanged.addListener((v) => {
            // { count: {newValue: 40, oldValue: 20 }}
            if (v.count.newValue !== v.count.oldValue) {
                setCount(v.count.newValue)
            }
            console.log(' Browser.storage.sync.onChanged', v)
        })
    }, [])
    // debounce

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
        <form className='min-w-[400px] space-y-4 p-4'>
            <header>
                <h2 className={'flex-grow text-lg font-bold'}>{t('config.title')}</h2>
            </header>
            <div className='flex items-center space-x-2'>已收集{count}条书签🔖</div>
            <div className='flex items-center space-x-2'>
                {/* TODO: 可以类似在浏览器的右中区，提供快捷按钮 */}
                <button onClick={handlePauseCollect}>
                    <label className='font-bold'>PAUSE Collect Twitter Bookmarks</label>
                </button>
            </div>
            <div className='flex items-center space-x-2'>
                <button onClick={handleCollect}>
                    <label className='font-bold'>Collect Twitter Bookmarks</label>
                </button>
            </div>
            <div className='flex items-center space-x-2'>
                <button onClick={handleSync}>
                    <label className='font-bold'>Sync To PKM</label>
                </button>
            </div>

            <div className='flex items-center space-x-2'>
                <button onClick={handleSyncToObsidian}>
                    <label className='font-bold'>Sync To Obsidian</label>
                </button>
            </div>
        </form>
    )
}
