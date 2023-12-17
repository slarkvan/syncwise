import { t } from 'i18next'
import { addCSS, generateHideCSS } from '../../utils/css'
import { BasePlugin } from './plugin'

export function hideRightSidebar(): BasePlugin {
    return {
        name: 'hideRightSidebar',
        description: t('plugin.hideRightSidebar.name'),
        default: false,
        init() {
            addCSS(
                generateHideCSS(
                    // sidebar
                    `[data-testid="sidebarColumn"]:has([aria-label="${t('symbol.Trending')}"])`
                )
            )
            addCSS(`
        /* Timeline */
        main *:has(> [aria-label="${t('symbol.HomeTimeline')}"]),
        [aria-label="${t('symbol.HomeTimeline')}"] > *:last-child
        {
            max-width: initial;
        }
        /* Toolbar */
        [data-testid="tweet"] [role="group"]:has([aria-label*="${t('symbol.Toolbar.reply')}"]):has([aria-label*="${t(
            'symbol.Toolbar.Retweet'
        )}"]):has([aria-label*="${t('symbol.Toolbar.likes')}"]) {
            max-width: initial;
        }
        /* Image */
        [data-testid="tweet"] div:has(> div> div > div > a[role="link"] > div [aria-label="${t('symbol.Image')}"]),
        [data-testid="tweet"] a[role="link"] > div:has([aria-label="${t('symbol.Image')}"]) {
            width: 100% !important;
            height: 100% !important;
        }
        /* Profile */
        div:has(> nav[aria-label="${t('symbol.ProfileTimelines')}"]) {
          max-width: initial;
        }
      `)
            addCSS(`
        [data-testid="primaryColumn"] {
          max-width: initial;
        }
        [data-testid="primaryColumn"] > div > div:last-child {
          max-width: initial;
        }
      `)
        },
    }
}
