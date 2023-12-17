import 'fake-indexeddb/auto'
import { AllDBSchema, TweetInfo, initIndexeddb } from '../initIndexeddb'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { IDBPDatabase } from 'idb'
import { wait } from '@liuli-util/async'

it('initIndexeddb', async () => {
    const db = await initIndexeddb()
    expect(db).not.eq(null)
})

it('initIndexeddb: 重复调用', async () => {
    const [db1, db2] = await Promise.all([initIndexeddb(), initIndexeddb()])
    expect(db1).eq(db2)
})

describe('service', () => {
    let db: IDBPDatabase<AllDBSchema>
    beforeEach(async () => {
        db = await initIndexeddb()
    })
    afterEach(async () => {
        await db.clear('config')
        await db.clear('tweet')
        await wait(50)
    })

    it('config', async () => {
        const configStore = db.transaction('config', 'readwrite').objectStore('config')
        await configStore.add({
            key: 'test',
            value: 'test',
        })
        const res = await configStore.get('test')
        expect(res!.value).eq('test')
    })

    it('tweet', async () => {
        const tweetStore = db.transaction('tweet', 'readwrite').objectStore('tweet')
        const tweet: TweetInfo = {
            id: 'test',
            fullText: 'test',
            description: 'test',
            name: 'test',
            username: 'test',
            avatar: 'test',
            lang: 'zh',
            userId: 'test',
            following: false,
        }
        await tweetStore.add(tweet)
        expect(await tweetStore.get('test')).deep.eq(tweet)
    })
})
