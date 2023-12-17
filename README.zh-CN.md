# Clean Twitter

<!-- markdownlint-disable MD033 -->

<a href="https://chrome.google.com/webstore/detail/lbbfmkbgembfbohdadeggdcgdkmfdmpb"><img src="https://user-images.githubusercontent.com/585534/107280622-91a8ea80-6a26-11eb-8d07-77c548b28665.png" alt="Get uBlock Origin for Chromium"></a> <a href="https://addons.mozilla.org/zh-CN/firefox/addon/clean-twitter-2333/"><img src="https://user-images.githubusercontent.com/585534/107280546-7b9b2a00-6a26-11eb-8f9f-f95932f4bfec.png" alt="Get uBlock Origin for Firefox"></a> <a href="https://www.producthunt.com/posts/clean-twitter?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-clean&#0045;twitter" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=401819&theme=light" alt="Clean&#0032;Twitter - Some&#0032;features&#0032;of&#0032;cleaning&#0032;Twitter | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

清理 twitter 上烦人的内容或功能，让你的 twitter 体验更加干净。

✨ 功能

- 隐藏首页的标签页
- 隐藏搜索页面的推荐
- 隐藏主页右侧边栏
- 隐藏查看推文分析链接
- 隐藏发现更多
- 隐藏直播
- 隐藏其他的广告
- 恢复分享链接
- 恢复 Twitter 的 Logo
- 恢复底部选项卡
- 屏蔽诈骗推文

🎉 观看演示视频

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/dYWI7RQMH_A/0.jpg)](https://www.youtube.com/watch?v=dYWI7RQMH_A)

🚀 开始使用

1. 在 chrome 或 firefox 扩展商店安装插件
2. 点击工具栏选择 twitter 使用的语言（默认会根据浏览器语言推测）
3. 选择哪些功能启用或关闭（一些功能会自动启用）

![Get started](https://github.com/rxliuli/clean-twitter/assets/24560368/1b8a82a2-1ade-46d2-a8fb-f2e67d111c32)

## 屏蔽评论区的黄推

该功能默认启用，会自动屏蔽在 [黑名单](https://github.com/daymade/Twitter-Block-Porn/blob/master/lists/all.json) 中黄推诈骗用户。

如何报告让所有人共同免受黄推侵扰

1. 点击每条回复推文的菜单
   <img width="900" alt="image" src="https://github.com/daymade/Twitter-Block-Porn/assets/24560368/201da897-f781-41bd-bb6b-bb30bddb84fd">

2. 看到菜单中新增了 block and report，点击即可，它会立刻使用 twitter 屏蔽用户，并且报告给 github 项目
   <img width="295" alt="image" src="https://github.com/daymade/Twitter-Block-Porn/assets/24560368/da5ceafb-3aed-4e1f-825c-e62aafa00f7e">

3. 第一次使用会自动跳转到 github 要求授权（如果没有账户则需要注册）

自动屏蔽逻辑如下

1. 拦截网络请求找到在屏蔽列表中的用户，调用 twitter 的屏蔽 api
2. 如果出现在页面上就隐藏它，适用于第一次遇到及钞能力用户

## 局限性

由于 Firefox 默认不支持 CSS 特性 `:has`，所以需要手动启用它，参考：<https://developer.mozilla.org/en-US/docs/Web/CSS/:has#browser_compatibility>
