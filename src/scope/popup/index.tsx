import { GearIcon, QuestionIcon } from '@primer/octicons-react'
import { useCallback, useEffect, useState } from 'react'
import Browser from 'webextension-polyfill'
import logo from '@/assets/logo.png'
import { getUserConfig } from '@/config/config'
import { NoteSyncTarget } from '@/types/pkm.d'
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

        Browser.storage.local.onChanged.addListener((v) => {
            if (v.count.newValue !== v.count.oldValue) {
                setCount(v.count.newValue)
            }
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
                <a href='https://github.com/slarkvan/syncwise' target='_blank'>
                    <QuestionIcon size={16} /> 配置文档
                </a>
            </div>
            {target ? <Syncwise count={count} target={target} /> : <div>你还未选择同步到哪个笔记</div>}
        </div>
    )
}

export default PopupPage
