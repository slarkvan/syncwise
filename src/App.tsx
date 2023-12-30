import { useState } from 'react';
import { initI18n, langs, t } from './constants/i18n';
import Browser from 'webextension-polyfill';
import { Lang } from './constants/langs';
import {
  Config,
  defaultConfig,
  getConfig,
  setConfig,
} from './constants/config';
import { useMount } from 'react-use';
import { plugins } from './content-script/plugins';
import i18next from 'i18next';
import {
  MESSAGE_COLLECT_TWEETS_BOOKMARKS,
  MESSAGE_ORIGIN_POPUP,
  MESSAGE_SYNC_TO_PKM,
} from './constants/twitter';

function useConfig(): [Config, (value: Partial<Config>) => Promise<void>] {
  const [v, set] = useState<Config>(defaultConfig);

  useMount(async () => {
    const result = await getConfig();
    // TODO: dev mode，会一直 init。暂时关掉
    // await initI18n()
    // await i18next.changeLanguage(result.language)
    set(result);
  });

  return [
    v,
    async (newV) => {
      set({ ...v, ...newV });
      await setConfig(newV);
    },
  ];
}

export function App() {
  const [config, setConfig] = useConfig();

  console.log('plugins()', config, plugins());

  const handleClick = () => {
    console.log('nothing happened.');
  };

  // debounce
  const handleSync = () => {
    Browser.runtime.sendMessage({
      from: MESSAGE_ORIGIN_POPUP,
      type: MESSAGE_SYNC_TO_PKM,
    });
  };

  const handleCollect = () => {
    Browser.runtime.sendMessage({
      from: MESSAGE_ORIGIN_POPUP,
      type: MESSAGE_COLLECT_TWEETS_BOOKMARKS,
    });
  };

  return (
    <form className="min-w-[400px] space-y-4 p-4">
      <header>
        <h2 className={'flex-grow text-lg font-bold'}>{t('config.title')}</h2>
      </header>
      <div className="flex items-center space-x-2">
        <label htmlFor="language" className="font-bold">
          {t('config.language')}:{' '}
        </label>
        <select
          id="language"
          value={config.language}
          onChange={async (ev) => {
            await setConfig({ language: ev.target.value as Lang });
            location.reload();
          }}
          className="rounded bg-white px-2 text-black dark:bg-black dark:text-white outline-none"
        >
          {langs.map((it) => (
            <option key={it.value} value={it.value}>
              {it.label}
            </option>
          ))}
        </select>
      </div>
      {plugins().map((it) => {
        console.log('it::', it);
        if (it.type === 'button') {
          return (
            <div className="flex items-center space-x-2" key={it.name}>
              <button onClick={handleClick}>
                <label htmlFor={it.name} className="font-bold">
                  {it.description}
                </label>
              </button>
            </div>
          );
        } else {
          return (
            <div className="flex items-center space-x-2" key={it.name}>
              <input
                type="checkbox"
                id={it.name}
                checked={(config as any)[it.name] as boolean}
                onChange={(ev) => setConfig({ [it.name]: ev.target.checked })}
                className="border border-gray-300 rounded-md p-2"
              ></input>
              <label htmlFor={it.name} className="font-bold">
                {it.description}
              </label>
            </div>
          );
        }
      })}
      <div className="flex items-center space-x-2">
        <button onClick={handleCollect}>
          <label className="font-bold">Collect Twitter Bookmarks</label>
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={handleSync}>
          <label className="font-bold">Sync To PKM</label>
        </button>
      </div>
    </form>
  );
}
