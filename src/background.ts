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
  MESSAGE_SYNC_TO_PKM,
} from './constants/twitter';

const logseqClient = new LogseqClient();

export interface Channel<T extends string> {
  name: T;
}

export interface BackgroundChannel extends Channel<'background'> {
  get(url: string): Promise<any>;
  createToken(
    data: CreateTokenWebFlowOptions & {
      scopes?: string[];
    },
  ): Promise<string>;
  createIssue(tweet: TweetInfo & { link: string }): Promise<void>;
}

function backApi(): BackgroundChannel {
  return {
    name: 'background',
    async get(url) {
      return await (await fetch(url)).json();
    },
    async createToken(data) {
      const auth = await oAuthApp.createToken(data);
      return auth.authentication.token;
    },
    async createIssue(tweet) {
      const auth = await Browser.storage.local.get([
        'refreshToken',
        'accessToken',
      ]);
      const octokit = new Octokit({ auth: auth.accessToken });
      const owner = import.meta.env.VITE_GITHUB_BLOCKLIST_OWNER;
      const repo = import.meta.env.VITE_GITHUB_BLOCKLIST_REPO;
      const issues = await octokit.rest.search.issuesAndPullRequests({
        q: `repo:${owner}/${repo} ${tweet.userId} in:title type:issue`,
      });
      if (issues.data.total_count > 0) {
        console.log('issue is exist');
        return;
      }
      await octokit.rest.issues.create({
        owner,
        repo,
        title: `Block ${tweet.userId} ${tweet.username}`,
        body:
          '```json\n' +
          JSON.stringify(tweet, undefined, 2) +
          '\n```' +
          `\n${tweet.link}`,
      });
      console.log('issue created');
    },
  };
}

function register<T extends Channel<string>>(api: T) {
  Browser.runtime.onMessage.addListener((message, _sender, sendMessage) => {
    if (
      typeof message.method !== 'string' ||
      !message.method.startsWith(api.name + '.')
    ) {
      return;
    }
    const p = (message.method as string).slice((api.name + '.').length);
    if (typeof (api as any)[p] !== 'function') {
      throw new Error('method not found');
    }
    (async () => {
      console.log('background receive message', message);
      try {
        const r = await (api as any)[p](...message.params);
        // @ts-expect-error
        sendMessage({ result: r });
      } catch (err: any) {
        // @ts-expect-error
        sendMessage({
          error: {
            code: err.code,
            message: err.message,
            data: err.stack,
          },
        });
      }
    })();
    return true;
  });
}

register(backApi());

// 监听消息
Browser.runtime.onMessage.addListener(
  async function (message, sender, sendResponse) {
    console.log(
      'background JS chrome.runtime.onMessage.addListener::',
      message,
    );
    if (
      message?.from === MESSAGE_ORIGIN_POPUP &&
      message.type === MESSAGE_SYNC_TO_PKM
    ) {
      // quickCapture('hello world')
      console.log("will parse storage's data...");
      console.log('get data from content script');
      
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
  },
);

// MORE, 发送内容到 logseq
const quickCapture = async (data: string) => {
  const tab = await Browser.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;
  const activeTab = tab[0];
  const { clipNoteLocation, clipNoteCustomPage, clipNoteTemplate } =
    await getLogseqSyncConfig();
  const now = new Date();
  const resp = await logseqClient.getUserConfig();

  console.log('quickCapture', now, resp, activeTab, tab);

  const block = blockRending({
    url: activeTab?.url || 'https://google.com', // popup 上没有 url & title 这些
    title: activeTab?.title,
    data,
    clipNoteTemplate,
    preferredDateFormat: resp['preferredDateFormat'],
    time: now,
  });

  if (clipNoteLocation === 'customPage') {
    await logseqClient.appendBlock(clipNoteCustomPage, block);
  } else if (clipNoteLocation === 'currentPage') {
    const { name: currentPage } = await logseqClient.getCurrentPage();
    await logseqClient.appendBlock(currentPage, block);
  } else {
    const journalPage = format(now, resp['preferredDateFormat']);
    await logseqClient.appendBlock(journalPage, block);
  }
  // debounceBadgeSearch(activeTab.url, activeTab.id!);
};
