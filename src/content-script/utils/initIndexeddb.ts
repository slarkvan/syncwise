import { DBSchema, IDBPDatabase, openDB } from 'idb'

export interface TweetInfo {
    id: string // 唯一 id，目前与 restId 相同
    fullText: string // 全部的文本
    description: string // 个人简介
    name: string // 名称
    userId: string // 用户 id
    username: string // 用户名
    avatar: string // 头像
    lang: string
    following: boolean // 是否关注
}

export interface AllDBSchema extends DBSchema {
    config: {
        key: string
        value: any
    }
    tweet: {
        key: string
        value: TweetInfo
        indexes: {
            userId: string
            username: string
        }
    }
    block: {
        key: string
        value: {
            id: string
            username: string
        }
        indexes: {
            username: string
        }
    }
}

export const initIndexeddb = async (): Promise<IDBPDatabase<AllDBSchema>> =>
    await openDB<AllDBSchema>('clean-twitter-data', 1, {
        upgrade(db) {
            const names = db.objectStoreNames
            if (!names.contains('config')) {
                db.createObjectStore('config', {
                    keyPath: 'key',
                })
            }
            if (!names.contains('tweet')) {
                const store = db.createObjectStore('tweet', {
                    keyPath: 'id',
                })
                store.createIndex('userId', 'userId')
                store.createIndex('username', 'username')
            }
            if (!names.contains('block')) {
                const store = db.createObjectStore('block', {
                    keyPath: 'id',
                })
                store.createIndex('username', 'username')
            }
        },
    })
