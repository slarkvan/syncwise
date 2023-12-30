import { t } from '../../constants/i18n';
import { addCSS } from '../../utils/css';
import { BasePlugin } from './plugin';

export function restoreTabbar(): BasePlugin {
  return {
    name: 'restoreTabbar',
    description: t('plugin.restoreTabbar.name'),
    default: false,
    init() {
      addCSS(
        `
          [data-testid="BottomBar"], div:has( > [href="/compose/tweet"]) {
            opacity: 1 !important;
          }
      `,
        'restoreTabbar',
      );
    },
  };
}
