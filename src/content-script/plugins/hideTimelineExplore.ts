import { t } from '../../constants/i18n'
import { addCSS, cleanCSS, generateHideCSS } from '../../utils/css'
import { BasePlugin } from './plugin'

export function hideTimelineExplore(): BasePlugin {
    return {
        name: 'hideTimelineExplore',
        description: t('plugin.hideTimelineExplore.name'),
        default: false,
        init() {
            if (location.pathname !== '/explore') {
                cleanCSS('hideTimelineExplore')
                return
            }
            if (document.querySelector('style[data-clean-twitter="hideTimelineExplore"]')) {
                return
            }
            addCSS(
                generateHideCSS(
                    `[aria-label="${t('symbol.HomeTimeline')}"] [aria-label="${t('symbol.TimelineExplore')}"]`,
                    `[role="tablist"]:has(> [role="presentation"])`
                ),
                'hideTimelineExplore'
            )
        },
        observer() {
            this.init!()
        },
    }
}
