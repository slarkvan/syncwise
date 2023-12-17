import { t } from '../../constants/i18n'
import { addCSS, generateHideCSS } from '../../utils/css'
import { BasePlugin } from './plugin'

export function hideViewTweetAnalytics(): BasePlugin {
    return {
        name: 'hideViewTweetAnalytics',
        description: t('plugin.hideViewTweetAnalytics.name'),
        default: false,
        init() {
            addCSS(
                generateHideCSS(
                    `[data-testid="tweet"] [role="group"]:has([aria-label*="${t(
                        'symbol.Toolbar.reply'
                    )}"]):has([aria-label*="${t(
                        'symbol.Toolbar.likes'
                    )}"]) div:has(> [href^="/"][href*="/status/"][href$="/analytics"])`
                )
            )
        },
    }
}
