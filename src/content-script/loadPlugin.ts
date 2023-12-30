import i18next from 'i18next';
import { getConfig, onChange } from '../constants/config';
import { plugins } from './plugins';
import { cleanCSS } from '../utils/css';
import { initI18n } from '../constants/i18n';

export async function loadPlugin() {
  const config = await getConfig();

  console.log('config:', config);

  const activePlugins = () => {
    return plugins().filter((it) => (config as any)[it.name]);
  };

  console.log('activePlugins', activePlugins());

  await initI18n();
  if (config.language) {
    await i18next.changeLanguage(config.language);
  }

  console.log('--content-script');
  // init
  activePlugins().filter((it) => it.init?.());
  // observer
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(async function (node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            activePlugins().forEach((it) => it.observer?.());
          }
        });
      }
    });
  });

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  await delay(2000);

  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    console.log('Document body is not available.');
  }

  // storage 里存储改变的回调
  onChange((items) => {
    // {
    //     "hideHomeTabs": {
    //         "newValue": false,
    //         "oldValue": true
    //     }
    // }
    console.log('onChange items', items);
    // Object.assign(
    //     config,
    //     Object.entries(items).reduce((acc, [key, value]) => ({ ...acc, [key]: value.newValue }), {} as any)
    // )
    // cleanCSS()
    // activePlugins().forEach((it) => it.init?.())

    // const keys = Object.keys(items);
    // if (keys.includes("syncTwitterBookmarks")) {
    //     const value = items["syncTwitterBookmarks"].newValue;
    //     if (value === 'pending') {
    //         const plugin = activePlugins().find((it) => it.name ==='syncTwitterBookmarks');
    //         console.log("execute syncTwitterBookmarks eventHandler")
    //         plugin?.eventHandler?.()
    //     }
    // }
  });
}
