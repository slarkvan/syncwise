import { bookmarksStore, syncedBookmarksStore } from '../utils/store'

export const getUnSyncedTwitterBookmarksList = (cb: (d: { data: TweetBookmarkParsedItem[] }) => void) => {
    const rawList: any = bookmarksStore.load()
    // 去掉 synced 的书签
    const syncedList: any = syncedBookmarksStore.load() ?? []
    const list = rawList?.filter((item: any) => !syncedList.includes(item.id))
    cb({ data: list })
    // TODO: sync to local storage
    // syncedBookmarksStore.upsert(
    //   list?.map((x: TweetBookmarkParsedItem) => x.id),
    // );
    console.log('content js list:', list)
}
