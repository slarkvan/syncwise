import { plugins } from '../content-script/plugins';
import { Lang } from './langs';
import type { Storage } from 'webextension-polyfill';
import Browser from 'webextension-polyfill';

export interface Config {
  language?: Lang; // default: Display language
  hideDiscoverMore?: boolean; // default: true
  hideHomeTabs?: boolean; // default: true
  hideRightSidebar?: boolean; // default: false
  hideTimelineExplore?: boolean; // default: true
  hideOther?: boolean; // default: true
  blockScamTweets?: boolean; // default: true
}

export const defaultConfig = plugins().reduce(
  (acc, it) => ({ ...acc, [it.name]: it.default }),
  {
    language: navigator.language as Lang,
  } as any,
) as Config;

export async function getConfig() {
  return {
    ...defaultConfig,
    ...(await Browser.storage.sync.get([
      ...plugins().map((it) => it.name),
      'language',
    ])),
  } as Config;
}

export async function setConfig(config: Partial<Config>) {
  // 本地存储
  console.log('本地存储 config', config);
  await Browser.storage.sync.set(config);
}

export async function onChange(
  cb: (changes: Storage.StorageAreaOnChangedChangesType) => void,
) {
  Browser.storage.sync.onChanged.addListener(cb);
  return async () => Browser.storage.sync.onChanged.removeListener(cb);
}
