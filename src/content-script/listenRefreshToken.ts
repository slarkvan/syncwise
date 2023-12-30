import Browser from 'webextension-polyfill';
import { TweetInfo } from './utils/initIndexeddb';
import { BackgroundChannel, Channel } from '../background';
import { createBlockIssue } from './plugins/blockScamTweets';
import { once } from 'lodash-es';

export function warp<T extends Channel<string>>(options: {
  name: T['name'];
}): T {
  return new Proxy({} as any, {
    get(_, p) {
      return async (...args: any[]) => {
        const r = await Browser.runtime.sendMessage({
          method: options.name + '.' + (p as string),
          params: args,
        });
        if ('error' in r) {
          throw new (class extends Error {
            readonly code = r.error.code;
            readonly data = r.error.data;
            constructor() {
              super(r.error.message);
            }
          })();
        }
        return r.result;
      };
    },
  }) as any;
}

async function listenRefreshToken() {
  console.log('content-script mount');
  window.addEventListener(
    'message',
    once(async (ev) => {
      // We only accept messages from ourselves
      if (ev.source !== window) {
        return;
      }
      if (ev.data.type !== 'FROM_PAGE') {
        return;
      }
      const data = ev.data.data as {
        code: string;
        state: TweetInfo & { link: string };
      };
      const api = warp<BackgroundChannel>({ name: 'background' });
      const authToken = await api.createToken({
        code: data.code,
        state: JSON.stringify(data.state),
      });
      console.log('authToken', authToken);
      await Browser.storage.local.set({
        refreshToken: data.code,
        refreshState: JSON.stringify(data.state),
        accessToken: authToken,
      });
      await createBlockIssue(data.state);
    }),
    false,
  );
  document.body.dataset.contentScript = 'true';
}

// listenRefreshToken()
