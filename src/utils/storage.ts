import Browser from 'webextension-polyfill';

export const getSyncStorage = () => Browser.storage.sync;
