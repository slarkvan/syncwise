import { TASK_TWITTER_BOOKMARKS_SCROLL_FOR_COLLECTION } from '@/constants/twitter'
import { scrollUntilLastBookmark } from '@/content-script/plugins/collect-twitter-bookmarks'

export function twitterScroll() {
    window.onload = function () {
        const value = localStorage.getItem(TASK_TWITTER_BOOKMARKS_SCROLL_FOR_COLLECTION)
        if (value === 'init') {
            scrollUntilLastBookmark()
        }
    }
}
