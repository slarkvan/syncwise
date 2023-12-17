import { AsyncArray } from '@liuli-util/async'
import dayjs from 'dayjs'
import Browser from 'webextension-polyfill'
import { initIndexeddb } from './utils/initIndexeddb'
import { BackgroundChannel } from '../background'
import { warp } from './listenRefreshToken'
import { oncePerHour } from '../utils/oncePerHour'

export async function f() {
    const blocks = [
        'https://github.com/daymade/Twitter-Block-Porn/raw/master/lists/all.json',
        'https://github.com/rxliuli/clean-twttier/raw/master/public/blockList.json',
    ]
    const db = await initIndexeddb()
    await AsyncArray.forEach(blocks, async (url) => {
        const api = warp<BackgroundChannel>({ name: 'background' })
        const list = (await api.get(url)) as {
            id_str: string
            username: string
        }[]
        const updateList = await AsyncArray.filter(list, async (it) => !(await db.getKey('block', it.id_str)))
        console.log('updateList', updateList)
        if (updateList.length === 0) {
            return
        }
        await AsyncArray.forEach(updateList, async (it) => {
            await db.put('block', {
                id: it.id_str,
                username: it.username,
            })
        })
    })
}

export const syncBlockList = oncePerHour(f, 'syncBlockList')
