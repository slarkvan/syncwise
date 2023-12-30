import { DBSchema, IDBPDatabase, openDB } from 'idb';

export interface TDBSchema extends DBSchema {
  config: {
    key: string;
    value: any;
  };
  bookmarks: {
    key: string;
    value: TweetBookmarkParsedItem;
    indexes: {
      url: string;
      screen_name: string;
    };
  };
}

export const initDB = async (): Promise<
  IDBPDatabase<TweetBookmarkParsedItem>
> =>
  await openDB<any>('twitter-bookmarks', 1, {
    upgrade(db) {
      const names = db.objectStoreNames;
      if (!names.contains('config')) {
        db.createObjectStore('config', {
          keyPath: 'key',
        });
      }
      if (!names.contains('bookmarks')) {
        const store = db.createObjectStore('bookmarks', {
          // URL 可能重复保存 ??
          keyPath: 'url',
        });
        store.createIndex('url', 'url');
        store.createIndex('screen_name', 'screen_name');
      }
    },
  });
