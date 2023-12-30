import { t } from '../../constants/i18n';
import { BasePlugin } from './plugin';
import copy from 'copy-to-clipboard';

let lastClickShareTweet: string;
function listenTweetShareClick(tweet: HTMLElement) {
  if (tweet.querySelector('[role="group"] [data-restore-share-link="true"]')) {
    return;
  }
  const shareButton = tweet.querySelector(
    '[role="group"]  div + svg:has(path[d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"],path[d="M17 4c-1.1 0-2 .9-2 2 0 .33.08.65.22.92C15.56 7.56 16.23 8 17 8c1.1 0 2-.9 2-2s-.9-2-2-2zm-4 2c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4c-1.17 0-2.22-.5-2.95-1.3l-4.16 2.37c.07.3.11.61.11.93s-.04.63-.11.93l4.16 2.37c.73-.8 1.78-1.3 2.95-1.3 2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4c0-.32.04-.63.11-.93L8.95 14.7C8.22 15.5 7.17 16 6 16c-2.21 0-4-1.79-4-4s1.79-4 4-4c1.17 0 2.22.5 2.95 1.3l4.16-2.37c-.07-.3-.11-.61-.11-.93zm-7 4c-1.1 0-2 .9-2 2s.9 2 2 2c.77 0 1.44-.44 1.78-1.08.14-.27.22-.59.22-.92s-.08-.65-.22-.92C7.44 10.44 6.77 10 6 10zm11 6c-.77 0-1.44.44-1.78 1.08-.14.27-.22.59-.22.92 0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2z"])',
  ) as HTMLElement | null;
  if (!shareButton) {
    return;
  }
  // console.log('shareLink', shareButton)
  shareButton.dataset.restoreShareLink = 'true';
  const link = tweet.querySelector(
    'a[role="link"][href*="/status/"]:has(time)',
  ) as HTMLAnchorElement;
  if (!link) {
    return;
  }
  const shareLink = link.href;
  shareButton.addEventListener('click', () => {
    // console.log('click share link', shareLink)
    lastClickShareTweet = shareLink;
  });
}
function addShareLink() {
  if (!lastClickShareTweet) {
    return;
  }
  if (document.getElementById('clone-share-link')) {
    return;
  }
  const menu = document.querySelector('[role="menu"]');
  if (!menu) {
    return;
  }
  const shareButton = menu.querySelector(
    '[role="menuitem"]:has([d="M18.36 5.64c-1.95-1.96-5.11-1.96-7.07 0L9.88 7.05 8.46 5.64l1.42-1.42c2.73-2.73 7.16-2.73 9.9 0 2.73 2.74 2.73 7.17 0 9.9l-1.42 1.42-1.41-1.42 1.41-1.41c1.96-1.96 1.96-5.12 0-7.07zm-2.12 3.53l-7.07 7.07-1.41-1.41 7.07-7.07 1.41 1.41zm-12.02.71l1.42-1.42 1.41 1.42-1.41 1.41c-1.96 1.96-1.96 5.12 0 7.07 1.95 1.96 5.11 1.96 7.07 0l1.41-1.41 1.42 1.41-1.42 1.42c-2.73 2.73-7.16 2.73-9.9 0-2.73-2.74-2.73-7.17 0-9.9z"])',
  ) as HTMLElement | null;
  if (!shareButton) {
    return;
  }
  // console.log('shareButton', shareButton)
  shareButton.addEventListener('click', async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    console.log('copy link', lastClickShareTweet, copy(lastClickShareTweet));
  });
}
export function restoreShareLink(): BasePlugin {
  return {
    name: 'restoreShareLink',
    description: t('plugin.restoreShareLink.name'),
    default: false,
    observer() {
      // console.log('restoreShareLink')
      const elements = [
        ...document.querySelectorAll('[data-testid="cellInnerDiv"]'),
      ] as HTMLElement[];
      if (elements.length === 0) {
        return;
      }
      elements.forEach(listenTweetShareClick);
      addShareLink();
    },
  };
}
