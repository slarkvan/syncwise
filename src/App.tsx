import { t } from './constants/i18n';
import Browser from 'webextension-polyfill';
import {
  MESSAGE_COLLECT_TWEETS_BOOKMARKS,
  MESSAGE_ORIGIN_POPUP,
  MESSAGE_SYNC_TO_OBSIDIAN,
  MESSAGE_SYNC_TO_PKM,
} from './constants/twitter';


export function App() {

  //   console.log('plugins()', config, plugins());

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

  const handleSyncToObsidian = () => {
    Browser.runtime.sendMessage({
      from: MESSAGE_ORIGIN_POPUP,
      type: MESSAGE_SYNC_TO_OBSIDIAN,
    });
  };

  return (
    <form className="min-w-[400px] space-y-4 p-4">
      <header>
        <h2 className={'flex-grow text-lg font-bold'}>{t('config.title')}</h2>
      </header>
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

      <div className="flex items-center space-x-2">
        <button onClick={handleSyncToObsidian}>
          <label className="font-bold">Sync To Obsidian</label>
        </button>
      </div>
    </form>
  );
}
