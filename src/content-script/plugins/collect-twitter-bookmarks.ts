import { TASK_TWITTER_BOOKMARKS_SCROLL_FOR_COLLECTION, TWITTER_BOOKMARKS_XHR_HIJACK } from '../../constants/twitter'

let preScrollTop = 0
//  测试专用
let count = 0

function scroll() {
    const value = localStorage.getItem(TASK_TWITTER_BOOKMARKS_SCROLL_FOR_COLLECTION)

    if (value !== 'init') {
        console.log('用户主动终止滚动')
        return false
    }

    console.log('scroll before', count)
    window.scrollBy(0, 4000)
    count++

    if (count > 8) {
        console.log('测试环境已经滚动到页面底部了！')
        return false
    }

    var scrollTop = window.scrollY || document.documentElement.scrollTop
    if (scrollTop === preScrollTop) {
        console.log('已经滚动到页面底部了！')
        return false
    } else {
        preScrollTop = scrollTop
    }
    return true
}

function reset() {
    preScrollTop = 0
    count = 0
}

export function scrollUntilLastBookmark() {
    const scrollInterval = setInterval(function () {
        const hasNext = scroll()
        if (!hasNext) {
            clearInterval(scrollInterval) // 如果找到元素，停止滚动
            // 通知已经全部劫持完成
            localStorage.removeItem(TWITTER_BOOKMARKS_XHR_HIJACK)
            reset()
        }
    }, 1000) // 每秒执行一次
}

export function collectTwitterBookmarks(mode: string) {
    console.log('collectTwitterBookmarks init:', mode, window.location.pathname)
    localStorage.setItem(TASK_TWITTER_BOOKMARKS_SCROLL_FOR_COLLECTION, 'init')
    if (window.location.pathname !== '/i/bookmarks') {
        console.log('collectTwitterBookmarks NOT on /i/bookmarks')
        location.href = '/i/bookmarks'
    } else {
        console.log('collectTwitterBookmarks on /i/bookmarks')
        scrollUntilLastBookmark()
    }
}
