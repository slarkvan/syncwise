import { t } from '../../constants/i18n'
import { addCSS, generateHideCSS } from '../../utils/css'
import { BasePlugin } from './plugin'

function getSelectedElements(): HTMLElement[] {
    // 首先，我们选择所有带有特定属性的元素
    let elements = [...document.querySelectorAll('[data-testid="cellInnerDiv"]')] as HTMLElement[]

    const findMoreIndex = elements.findIndex((it) => {
        const s = it.textContent
        if (!s) {
            return false
        }
        return (
            (s.includes(t('symbol.DiscoverMore')) && s.includes(t('symbol.SourcedFromAcrossTwitter'))) ||
            s.includes(t('symbol.MoreTween'))
        )
    })
    if (findMoreIndex === -1) {
        return []
    }
    return elements.slice(findMoreIndex)
}

function _hideDiscoverMore() {
    const regex = /^https:\/\/twitter\.com\/[^\/]+\/status\/[^\/]+$/
    if (!regex.test(location.href)) {
        // console.log('hideDiscoverMore ignore url')
        return
    }

    // 每次 DOM 变化时，重新计算 selectedElements
    const selectedElements = getSelectedElements()
    // 打印 selectedElements
    console.log('selectedElements', selectedElements)
    // 隐藏 selectedElements
    selectedElements.forEach((it) => (it.style.display = 'none'))
}

export function hideDiscoverMore(): BasePlugin {
    return {
        name: 'hideDiscoverMore',
        description: t('plugin.hideDiscoverMore.name'),
        default: false,
        // observer() {
        //   _hideDiscoverMore()
        // },
        init() {
            addCSS(
                generateHideCSS(
                    `section div[data-testid=cellInnerDiv]:has(h2[role="heading"] + div)`,
                    `section div[data-testid=cellInnerDiv]:has(h2[role="heading"] + div) ~ div`
                )
            )
        },
    }
}
