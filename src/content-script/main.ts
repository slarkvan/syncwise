import Browser from 'webextension-polyfill'
import hijackXHR from './injectHijackXHR?script&module'
import { Config } from '../constants/config'

function insertScript() {
    const script = document.createElement('script')
    script.src = Browser.runtime.getURL(hijackXHR)
    console.log('script:', script)
    script.type = 'module'
    document.head.prepend(script)
}

insertScript()

Browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log('content JS chrome.runtime.onMessage.addListener:', JSON.stringify(message), typeof message)
    if (message?.from === 'background') {
        console.log('Received message from background: ' + message)

        if (message?.type === 'SYNC_TWITTER_BOOKMARKS') {
            console.log('xi:Let us sync twitter bookmarks')
            syncBookmarks('message')
        }

        if (message?.type === 'SYNC_TO_PKM') {
            console.log('xi:Let us SYNC_TO_PKM', message?.from)
            syncToPKM()
        }
    }
})

await import('./loader')

let preScrollTop = 0

//  测试专用
let count = 0

function scroll() {
    window.scrollBy(0, 2000)

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

function scrollUntilLastBookmark() {
    const scrollInterval = setInterval(function () {
        const hasNext = scroll()
        if (!hasNext) {
            clearInterval(scrollInterval) // 如果找到元素，停止滚动
            // 通知已经全部劫持完成
        }
    }, 1000) // 每秒执行一次
}

function syncBookmarks(mode: string) {
    console.log('fn syncBookmarks init', window.location.pathname, window.top === window, mode)
    if (window.location.pathname !== '/i/bookmarks') {
        location.href = '/i/bookmarks'
    } else {
        // reload page for first XHR
    }
    // await delay(2000)
    // 让 XHR 开始劫持
    localStorage.setItem('TWITTER_BOOKMARKS_XHR_HIJACK', '1')
    console.log('让 XHR 开始劫持')
    // 页面滚动
    // 调用函数，传入你想要查找的元素的选择器
    // 哪个是到底部的标准
    // -api  的 entry 返回不是 22（20+2） 个。
    // 或者 翻到底了
    scrollUntilLastBookmark()
}

function syncToPKM() {
    console.log('fn syncToPKM init')
}
