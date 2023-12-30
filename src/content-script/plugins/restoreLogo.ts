import { t } from '../../constants/i18n';
import { BasePlugin } from './plugin';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" style="width: 30px; height: 30px;" xml:space="preserve" viewBox="0 0 248 204">
<path fill="#1d9bf0" d="M221.95 51.29c.15 2.17.15 4.34.15 6.53 0 66.73-50.8 143.69-143.69 143.69v-.04c-27.44.04-54.31-7.82-77.41-22.64 3.99.48 8 .72 12.02.73 22.74.02 44.83-7.61 62.72-21.66-21.61-.41-40.56-14.5-47.18-35.07 7.57 1.46 15.37 1.16 22.8-.87-23.56-4.76-40.51-25.46-40.51-49.5v-.64c7.02 3.91 14.88 6.08 22.92 6.32C11.58 63.31 4.74 33.79 18.14 10.71c25.64 31.55 63.47 50.73 104.08 52.76-4.07-17.54 1.49-35.92 14.61-48.25 20.34-19.12 52.33-18.14 71.45 2.19 11.31-2.23 22.15-6.38 32.07-12.26-3.77 11.69-11.66 21.62-22.2 27.93 10.01-1.18 19.79-3.86 29-7.95-6.78 10.16-15.32 19.01-25.2 26.16z"/>
</svg>`;

export function restoreLogo(): BasePlugin {
  return {
    name: 'restoreLogo',
    default: false,
    description: t('plugin.restoreLogo.name'),
    init: () => {
      const $logo = document.querySelector(
        'svg path[d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"]',
      );
      if ($logo) {
        $logo.outerHTML = svg;
      }
      const $ico = document.querySelector(`head>link[rel="shortcut icon"]`);
      if ($ico) {
        ($ico as HTMLAnchorElement).href =
          '//abs.twimg.com/favicons/twitter.ico';
      }
    },
    observer() {
      this.init?.();
    },
  };
}
