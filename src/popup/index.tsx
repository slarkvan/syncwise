import { t } from 'i18next'
import { GearIcon, QuestionIcon } from '@primer/octicons-react'
import { useCallback, useEffect, useState } from 'react'
import Browser from 'webextension-polyfill'
import logo from '../assets/logo.png'
import {
    MESSAGE_ORIGIN_POPUP,
    MESSAGE_PAUSE_TWITTER_BOOKMARKS_COLLECTION,
    MESSAGE_SYNC_TO_LOGSEQ,
    MESSAGE_COLLECT_TWEETS_BOOKMARKS,
    MESSAGE_SYNC_TO_OBSIDIAN,
} from '../constants/twitter'
import { Button } from '@geist-ui/core'
import { getUserConfig } from '../config/config'
import { NoteSyncTarget } from '../types/pkm.d'
import Syncwise from './components/Syncwise'

function PopupPage() {
    const [target, setTarget] = useState<NoteSyncTarget | null>(null)
    const [count, setCount] = useState(0)

    useEffect(() => {
        getUserConfig().then((config) => {
            setTarget(config.target)
        })
    }, [])

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

    const openOptionsPage = useCallback(() => {
        Browser.runtime.sendMessage({ type: 'OPEN_OPTIONS_PAGE' })
    }, [])

    if (!target) {
    }

    return (
        <div className='min-w-[400px] space-y-4 p-4 flex flex-col h-full bg-white text-black'>
            <div className='mb-2 flex flex-row items-center px-1'>
                <img src={logo} className='w-5 h-5 rounded-sm' />
                <p className='text-sm font-semibold m-0 ml-1'>Syncwise</p>
                <div className='grow'></div>
                <span className='cursor-pointer leading-[0]' onClick={openOptionsPage}>
                    <GearIcon size={16} />
                </span>
            </div>
            <div>
                <QuestionIcon size={16} /> how to config it?
            </div>
            {/* <header>
                <h2 className={'flex-grow text-lg font-bold'}>{t('config.title')}</h2>
            </header> */}
            {/* TODO: 可以类似在浏览器的右中区，提供快捷按钮 */}
            {target ? <Syncwise count={count} target={target} /> : <div>no target</div>}
            {/* TODO: help how to config */}
        </div>
    )
}

export default PopupPage
