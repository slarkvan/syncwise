import { t } from '../../constants/i18n';
import { addCSS, cleanCSS, generateHideCSS } from '../../utils/css';
import { BasePlugin } from './plugin';

/**
 * 隐藏主页的 Following Tab
 */
function hideSelectedFollowingTab() {
  addCSS(
    generateHideCSS('[role="tablist"]:has([href="/home"][role="tab"])'),
    'hideHomeTabs',
  );
  addCSS(
    `
    @media (max-width: 500px) {
      header[role="banner"] > * {
        height: 54px !important;
      }
    }
  `,
    'hideHomeTabs',
  );
}

function selectedFollowingTab() {
  const tabs = [
    ...document.querySelectorAll('[href="/home"][role="tab"]'),
  ] as HTMLElement[];
  if (tabs.length === 2 && tabs[1].getAttribute('aria-selected') === 'false') {
    tabs[1].click();
  }
}

function hideTabs() {
  if (window.location.pathname !== '/home') {
    cleanCSS('hideHomeTabs');
    return;
  }
  if (!document.querySelector('style[data-clean-twitter="hideHomeTabs"]')) {
    hideSelectedFollowingTab();
  }
  selectedFollowingTab();
}

export function hideHomeTabs(): BasePlugin {
  return {
    name: 'hideHomeTabs',
    description: t('plugin.hideHomeTabs.name'),
    default: false,
    init: hideTabs,
    observer: hideTabs,
  };
}
