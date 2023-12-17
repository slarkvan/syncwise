class LocalStorageStore<T> {
    private storeKey: string

    constructor(storeKey: string) {
        this.storeKey = storeKey
    }

    // 创建或更新记录
    upsert(data: T): void {
        const currentData = this.load()
        if (currentData == null) {
            this.save(data)
        } else {
            this.insert(data)
        }
    }

    load(): T | null {
        const data = localStorage.getItem(this.storeKey)
        return data ? JSON.parse(data) : null
    }

    // 删除数据
    delete(): void {
        localStorage.removeItem(this.storeKey)
    }

    // 创建或更新数据
    private save(data: T): void {
        localStorage.setItem(this.storeKey, JSON.stringify(data))
    }

    // 读取数据

    // 更新数据
    private insert(data: T): void {
        const currentData = this.load()
        if (Array.isArray(currentData)) {
            this.save([...currentData, ...(data as any)] as any)
        }
    }
}

// 或许加上这个人的 ID，以防多账号
const bookmarksStore = new LocalStorageStore('twitter_bookmarks')

export { bookmarksStore }
