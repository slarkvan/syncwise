import { t } from '../../constants/i18n';
import { addCSS, generateHideCSS } from '../../utils/css';
import { BasePlugin } from './plugin';

export function hideLive(): BasePlugin {
  return {
    name: 'hideLive',
    description: t('plugin.hideLive.name'),
    default: false,
    init() {
      addCSS(
        generateHideCSS(
          '[role="grid"]:has( > div > [aria-live="polite"] [data-testid="placementTracking"])',
        ),
        'hideLive',
      );
    },
  };
}
