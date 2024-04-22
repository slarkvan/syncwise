import { TASK_TWITTER_BOOKMARKS_SCROLL_FOR_COLLECTION, TWITTER_BOOKMARKS_XHR_HIJACK } from '@/constants/twitter'
import { isProduction } from '@/constants/env'

let count = 0
let tryTime = 0

function scroll() {
    const value = localStorage.getItem(TASK_TWITTER_BOOKMARKS_SCROLL_FOR_COLLECTION)

    if (value !== 'init') {
        console.log('用户主动终止滚动')
        return false
    }

    console.log('scroll before', count)
    window.scrollBy(0, 2000)
    count++

    if (!isProduction()) {
        //  自测
        if (count > 8) {
            console.log('测试环境已经滚动到页面底部了！')
            return false
        }
    }

    var scrollTop = window.scrollY || document.documentElement.scrollTop
    if (scrollTop + window.innerHeight >= document.body.scrollHeight) {
        // 到底了
        if (tryTime >= 3) {
            console.log('已经滚动到页面底部了！')
            return false
        } else {
            tryTime++
        }
    } else {
        tryTime = 0
    }

    return true
}

function reset() {
    count = 0
}

export function scrollUntilLastBookmark() {
    const scrollInterval = setInterval(function () {
        const hasNext = scroll()
        if (!hasNext) {
            clearInterval(scrollInterval)
            localStorage.removeItem(TWITTER_BOOKMARKS_XHR_HIJACK)
            localStorage.removeItem(TASK_TWITTER_BOOKMARKS_SCROLL_FOR_COLLECTION)
            reset()
        }
    }, 1000)
}

export function collectTwitterBookmarks() {
    localStorage.setItem(TASK_TWITTER_BOOKMARKS_SCROLL_FOR_COLLECTION, 'init')
    if (window.location.pathname !== '/i/bookmarks') {
        location.href = '/i/bookmarks'
    } else {
        scrollUntilLastBookmark()
    }
}
