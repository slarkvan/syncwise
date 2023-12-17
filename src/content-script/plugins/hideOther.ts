import { t } from '../../constants/i18n'
import { addCSS, generateHideCSS } from '../../utils/css'
import { BasePlugin } from './plugin'

export function hideOther(): BasePlugin {
    return {
        name: 'hideOther',
        description: t('plugin.hideOther.name'),
        default: false,
        init() {
            addCSS(
                generateHideCSS(
                    `[aria-label="${t('symbol.CommunitiesNewItems')}"]`,
                    `[aria-label="${t('symbol.Communities')}"]`,
                    `[aria-label="${t('symbol.TwitterBlue')}"]`,
                    `[aria-label="${t('symbol.Verified')}"]`,
                    `[aria-label="${t('symbol.TimelineTrendingNow')}"]`,
                    `[aria-label="${t('symbol.Trending')}"] *:has(> [aria-label="${t('symbol.WhoToFollow')}"])`,
                    `[aria-label="${t('symbol.VerifiedOrganizations')}"]`,
                    // submean
                    '* > [href="/i/verified-orgs-signup"]',
                    '* > [href="/i/blue_sign_up"]',
                    '* > [href="/i/verified-choose"]',
                    '* > [href="/settings/monetization"]',
                    // sidebar
                    `[aria-label="${t('symbol.Trending')}"] > * > *:nth-child(3):not([aria-label="${t(
                        'symbol.Trending'
                    )}"] *:has(> [aria-label="${t('symbol.VerifiedAccount')}"]))`,
                    `[aria-label="${t('symbol.Trending')}"] > * > *:nth-child(4)`,
                    `[aria-label="${t('symbol.Trending')}"] > * > *:nth-child(5)`,
                    // "Verified" tab
                    '[role="presentation"]:has(> [href="/notifications/verified"][role="tab"])'
                    // who to follow
                    // `div[data-testid="cellInnerDiv"]:has(> div > div > div > h2), div[data-testid="cellInnerDiv"]:has([d="M17.863 13.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44zM12 2C9.791 2 8 3.79 8 6s1.791 4 4 4 4-1.79 4-4-1.791-4-4-4z"]), div[data-testid="cellInnerDiv"]:has([d="M17.863 13.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44zM12 2C9.791 2 8 3.79 8 6s1.791 4 4 4 4-1.79 4-4-1.791-4-4-4z"]) + *`,
                )
            )
        },
    }
}
