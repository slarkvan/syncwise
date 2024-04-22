import { bookmarksStore, syncedBookmarksStore } from '../utils/store'

export const getUnsyncedTwitterBookmarks = (cb: (d: { data: TweetBookmarkParsedItem[] }) => void) => {
    const rawList: any = bookmarksStore.load()
    const syncedList: any = syncedBookmarksStore.load() ?? []
    const list = rawList?.filter((item: any) => !syncedList.includes(item.id))
    cb({ data: list })
}
