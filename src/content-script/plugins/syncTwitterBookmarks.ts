import { t } from '../../constants/i18n';
import { TWITTER_BOOKMARKS_XHR_HIJACK } from '../../constants/twitter';
import { addCSS, cleanCSS, generateHideCSS } from '../../utils/css';
import { BasePlugin } from './plugin';

/**
 * 隐藏主页的 Following Tab
 */
function hideSelectedFollowingTab() {
  addCSS(
    generateHideCSS('[role="tablist"]:has([href="/home"][role="tab"])'),
    'hideHomeTabs',
  );
  addCSS(
    `
    @media (max-width: 500px) {
      header[role="banner"] > * {
        height: 54px !important;
      }
    }
  `,
    'hideHomeTabs',
  );
}

function selectedFollowingTab() {
  const tabs = [
    ...document.querySelectorAll('[href="/home"][role="tab"]'),
  ] as HTMLElement[];
  if (tabs.length === 2 && tabs[1].getAttribute('aria-selected') === 'false') {
    tabs[1].click();
  }
}

function hideTabs() {
  if (window.location.pathname !== '/home') {
    cleanCSS('hideHomeTabs');
    return;
  }
  if (!document.querySelector('style[data-clean-twitter="hideHomeTabs"]')) {
    hideSelectedFollowingTab();
  }
  selectedFollowingTab();
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function scrollUntilElementAppears(selector: string) {
  // 定义滚动函数
  function scroll() {
    window.scrollBy(0, 2000);
  }

  // 设置定时器以定期滚动页面和检查元素
  const scrollInterval = setInterval(function () {
    scroll();
    checkIfElementExists();
  }, 1000); // 每秒执行一次

  // 定义检查元素是否出现的函数
  function checkIfElementExists() {
    const element = document.querySelector(selector);
    if (element) {
      clearInterval(scrollInterval); // 如果找到元素，停止滚动
      console.log('元素已出现在页面上。');
    }
  }
}

function syncBookmarks(mode: string) {
  console.log(
    'fn syncBookmarks init',
    window.location.pathname,
    window.top === window,
    mode,
  );
  if (window.location.pathname !== '/i/bookmarks') {
    location.href = '/i/bookmarks';
  } else {
    // reload page for first XHR
  }
  // await delay(2000)
  // 让 XHR 开始劫持
  localStorage.setItem(TWITTER_BOOKMARKS_XHR_HIJACK, '1');
  console.log('让 XHR 开始劫持');
  // 页面滚动
  // 调用函数，传入你想要查找的元素的选择器
  // 哪个是到底部的标准
  scrollUntilElementAppears('#yourElementId');
  return;
}

export function syncTwitterBookmarks(): BasePlugin {
  return {
    type: 'button',
    name: 'syncTwitterBookmarks',
    description: '同步Twitter书签',
    default: false,
    init: () => {
      // 选择 option 页面的按钮，会每一次触发这个函数
      // syncBookmarks('init')
    },
    // observer: () => {
    //     syncBookmarks('observer')
    // },
    eventHandler: () => {
      console.log('eventHandler');
      syncBookmarks('eventHandler');
    },
  };
}
