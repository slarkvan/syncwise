import { CreateTokenWebFlowOptions } from '@octokit/oauth-app/dist-types/methods/create-token';
import Browser from 'webextension-polyfill';
import { oAuthApp } from './constants/github';
import { Octokit } from '@octokit/rest';
import { TweetInfo } from './content-script/utils/initIndexeddb';
import { getLogseqSyncConfig } from './config/logseq';
import LogseqClient from './pkms/logseq/client';
import { blockRending } from './utils';
import { format } from 'date-fns';
import {
  MESSAGE_COLLECT_TWEETS_BOOKMARKS,
  MESSAGE_GET_PHASE_SPECIFIC_RAW_DATA,
  MESSAGE_ORIGIN_BACKGROUND,
  MESSAGE_ORIGIN_POPUP,
  MESSAGE_SYNC_TO_OBSIDIAN,
  MESSAGE_SYNC_TO_PKM,
} from './constants/twitter';
import { DataBlock } from './types/logseq/block';
import { beautifyText } from './parser/twitter/bookmark';

const logseqClient = new LogseqClient();

async function getUnSyncedTwitterBookmarks(): Promise<
  TweetBookmarkParsedItem[] | undefined
> {
  const tabs = await Browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  const tabId = tabs?.[0]?.id;
  if (!tabId) {
    console.log('no active tab');
    return;
  }
  console.log('tabId:', tabId);
  const result = await sendMessageToContentScript(tabId, {
    from: MESSAGE_ORIGIN_BACKGROUND,
    type: MESSAGE_GET_PHASE_SPECIFIC_RAW_DATA,
  });
  // 异步获取 DB, 只能得到 true
  console.log('result:', result);
  return result?.data ?? [];
}

// export interface Channel<T extends string> {
//   name: T;
// }

// export interface BackgroundChannel extends Channel<'background'> {
//   get(url: string): Promise<any>;
//   createToken(
//     data: CreateTokenWebFlowOptions & {
//       scopes?: string[];
//     },
//   ): Promise<string>;
//   createIssue(tweet: TweetInfo & { link: string }): Promise<void>;
// }

// function backApi(): BackgroundChannel {
//   return {
//     name: 'background',
//     async get(url) {
//       return await (await fetch(url)).json();
//     },
//     async createToken(data) {
//       const auth = await oAuthApp.createToken(data);
//       return auth.authentication.token;
//     },
//     async createIssue(tweet) {
//       const auth = await Browser.storage.local.get([
//         'refreshToken',
//         'accessToken',
//       ]);
//       const octokit = new Octokit({ auth: auth.accessToken });
//       const owner = import.meta.env.VITE_GITHUB_BLOCKLIST_OWNER;
//       const repo = import.meta.env.VITE_GITHUB_BLOCKLIST_REPO;
//       const issues = await octokit.rest.search.issuesAndPullRequests({
//         q: `repo:${owner}/${repo} ${tweet.userId} in:title type:issue`,
//       });
//       if (issues.data.total_count > 0) {
//         console.log('issue is exist');
//         return;
//       }
//       await octokit.rest.issues.create({
//         owner,
//         repo,
//         title: `Block ${tweet.userId} ${tweet.username}`,
//         body:
//           '```json\n' +
//           JSON.stringify(tweet, undefined, 2) +
//           '\n```' +
//           `\n${tweet.link}`,
//       });
//       console.log('issue created');
//     },
//   };
// }

// function register<T extends Channel<string>>(api: T) {
//   Browser.runtime.onMessage.addListener((message, _sender, sendMessage) => {
//     if (
//       typeof message.method !== 'string' ||
//       !message.method.startsWith(api.name + '.')
//     ) {
//       return;
//     }
//     const p = (message.method as string).slice((api.name + '.').length);
//     if (typeof (api as any)[p] !== 'function') {
//       throw new Error('method not found');
//     }
//     (async () => {
//       console.log('background receive message', message);
//       try {
//         const r = await (api as any)[p](...message.params);
//         // @ts-expect-error
//         sendMessage({ result: r });
//       } catch (err: any) {
//         // @ts-expect-error
//         sendMessage({
//           error: {
//             code: err.code,
//             message: err.message,
//             data: err.stack,
//           },
//         });
//       }
//     })();
//     return true;
//   });
// }

// register(backApi());

// let db: any = null;

// (async () => {
//   db = await initDB();
//   console.log('Content-js Database initialized', db);
// })();

// 监听消息
Browser.runtime.onMessage.addListener(
  async function (message, sender, sendResponse) {
    console.log(
      'background JS chrome.runtime.onMessage.addListener::',
      message,
      JSON.stringify(message),
    );
    if (
      message?.from === MESSAGE_ORIGIN_POPUP &&
      message.type === MESSAGE_SYNC_TO_PKM
    ) {
      // quickCapture('hello world')
      console.log("will parse storage's data...");
      console.log('get data from content script');
      // 多种 PKM 适配
      const list = await getUnSyncedTwitterBookmarks();
      if (Array.isArray(list) && list.length > 0) {
        quickCapture(list);
      }

      // syncedBookmarksStore.upsert(result.map((x: TweetBookmarkParsedItem) => x.id));
    }

    // Obsidian
    if (
      message?.from === MESSAGE_ORIGIN_POPUP &&
      message.type === MESSAGE_SYNC_TO_OBSIDIAN
    ) {
      const list = await getUnSyncedTwitterBookmarks();
      console.log('message/sync_to_obsidian', list);
      if (Array.isArray(list) && list.length > 0) {
      }
    }

    // 收集 twitter bookmarks
    if (
      message?.from === MESSAGE_ORIGIN_POPUP &&
      message.type === MESSAGE_COLLECT_TWEETS_BOOKMARKS
    ) {
      console.log('will collect twitter bookmarks...');
      // forward to content script
      // last active tab will receive this message
      Browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        const tab: any = tabs[0];
        if (tab) {
          Browser.tabs.sendMessage(tab.id, {
            from: MESSAGE_ORIGIN_BACKGROUND,
            type: MESSAGE_COLLECT_TWEETS_BOOKMARKS,
          });
        }
      });
    }

    return true;
  },
);

// Function to send a message to the content script and await the response
async function sendMessageToContentScript(tabId: number, message: any) {
  try {
    const response = await Browser.tabs.sendMessage(tabId, message);
    console.log('Response:', response);
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// MORE, 发送内容到 logseq
const quickCapture = async (list: TweetBookmarkParsedItem[]) => {
  const { clipNoteLocation, clipNoteCustomPage, clipNoteTemplate } =
    await getLogseqSyncConfig();
  const now = new Date();
  const resp = await logseqClient.getUserConfig();

  console.log('quickCapture', now, resp);

  // TODO: block Rendering

  const formattedList: any = list.map((item) => {
    item.full_text = beautifyText(item.full_text as string, item.urls);
    return {
      title: 'ss',
      ...item,
      preferredDateFormat: resp['preferredDateFormat'],
      time: now,
    };
  });

  // TODO: ai 会内容基于已有的 tab 打标，参考 ai-tab

  console.log(
    `clipNoteLocation:${clipNoteLocation}, formattedList: ${formattedList}`,
  );

  const blocks = formattedList.map((item: any) =>
    blockRending(clipNoteTemplate, item),
  );
  const journalPage = format(now, resp['preferredDateFormat']);
  // await logseqClient.appendBatchBlock(journalPage, blocks);

  //  如果 batch block 困难，可以 loop await。先暂时这样
  for (let i = 0; i < blocks.length; i++) {
    // TODO: 用户可以自定义
    const resp1: DataBlock = await logseqClient.appendBlock(
      // journalPage,
      'twitter bookmarks',
      blocks[i][0],
    );
    await logseqClient.appendBlock(resp1.uuid, blocks[i][1]);
  }

  // if (clipNoteLocation === 'customPage') {
  //   await logseqClient.appendBlock(clipNoteCustomPage, blocks);
  // } else if (clipNoteLocation === 'currentPage') {
  //   const { name: currentPage } = await logseqClient.getCurrentPage();
  //   await logseqClient.appendBlock(currentPage, blocks);
  // } else {
  //   const journalPage = format(now, resp['preferredDateFormat']);
  //   await logseqClient.appendBlock(journalPage, blocks);
  // }
  // debounceBadgeSearch(activeTab.url, activeTab.id!);
};
