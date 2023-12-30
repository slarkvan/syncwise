import {
  KEY_SYNCED_TWITTER_BOOKMARKS_ID_LIST,
  KEY_TWITTER_BOOKMARKS,
} from '../../constants/twitter';

class LocalStorageStore<T> {
  private storeKey: string;

  constructor(storeKey: string) {
    this.storeKey = storeKey;
  }

  // 创建或更新记录
  upsert(data: T): void {
    const currentData = this.load();
    if (currentData == null) {
      this.save(data);
    } else {
      this.insert(data);
    }
  }

  load(): T | null {
    const data = localStorage.getItem(this.storeKey);
    return data ? JSON.parse(data) : null;
  }

  // 删除数据
  delete(): void {
    localStorage.removeItem(this.storeKey);
  }

  // 创建或更新数据
  private save(data: T): void {
    localStorage.setItem(this.storeKey, JSON.stringify(data));
  }

  // 读取数据

  // 去重更新数据
  private insert(data: T): void {
    const currentData = this.load();

    if (Array.isArray(currentData)) {
      const savedList = currentData.map((item: any) => item.id);
      const index = (data as any).findIndex((item: any) =>
        savedList.includes(item.id),
      );

      if (index !== -1) {
        //  不需要更新
        // currentData[index] = data;
      } else {
        // 如果没有找到相同id的项，添加新数据
        currentData.push(data);
      }

      this.save(currentData);
    }
  }
}

// 或许加上这个人的 ID，以防多账号
const bookmarksStore = new LocalStorageStore(KEY_TWITTER_BOOKMARKS);
const syncedBookmarksStore = new LocalStorageStore(
  KEY_SYNCED_TWITTER_BOOKMARKS_ID_LIST,
);

export { bookmarksStore, syncedBookmarksStore };
