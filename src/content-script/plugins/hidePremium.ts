import { t } from '../../constants/i18n';
import { addCSS, generateHideCSS } from '../../utils/css';
import { BasePlugin } from './plugin';

export function hidePremium(): BasePlugin {
  return {
    name: 'hidePremium',
    description: t('plugin.hidePremium.name'),
    default: false,
    init() {
      addCSS(
        generateHideCSS(
          'div[data-testid="cellInnerDiv"]:has([href="/i/premium_sign_up?referring_page=timeline_prompt"])',
          '* > [href="/i/verified-choose"]',
          `[aria-label="${t(
            'symbol.Trending',
          )}"] > * > *:nth-child(3):not([aria-label="${t(
            'symbol.Trending',
          )}"] *:has(> [aria-label="${t('symbol.VerifiedAccount')}"]))`,
        ),
      );
    },
  };
}
