import { AsyncArray } from '@liuli-util/async'
import { BasePlugin } from './plugin'
import { TweetInfo, initIndexeddb } from '../utils/initIndexeddb'
import { t } from '../../constants/i18n'
import Browser from 'webextension-polyfill'
import { oAuthApp } from '../../constants/github'
import { Octokit } from '@octokit/rest'
import { BackgroundChannel } from '../../background'
import { warp } from '../listenRefreshToken'
import { blockUser } from '../utils/blockUser'

function extractUsernameFromTweet(elements: HTMLElement): string | undefined {
    const avatar = elements.querySelector('[data-testid^="UserAvatar-Container-"]') as HTMLElement
    if (!avatar) {
        return
    }
    const username = avatar.dataset.testid?.slice('UserAvatar-Container-'.length)
    return username
}

async function hideTweet(elements: HTMLElement[]) {
    const db = await initIndexeddb()
    const list = await AsyncArray.filter(elements, async (it) => {
        if (it.style.display) {
            return false
        }
        const username = extractUsernameFromTweet(it)
        if (!username) {
            return false
        }
        const r = (await db.countFromIndex('block', 'username', username)) > 0
        // console.log('isBlock: ', username, r)
        return r
    })
    if (list.length === 0) {
        return
    }
    console.log('blockTweets: ', list)
    list.forEach((it) => (it.style.display = 'none'))
}

function parseQuotesLink(quotesLink: string): {
    link: string
    tweetId: string
    username: string
} {
    const u = new URL(quotesLink)
    const tweetId = u.pathname.split('/')[3]
    const username = u.pathname.split('/')[1]
    const link = quotesLink.slice(0, quotesLink.lastIndexOf('/'))
    return { link, tweetId, username }
}

export async function createBlockIssue(tweet: TweetInfo & { link: string }) {
    function redirect() {
        open(
            oAuthApp.getWebFlowAuthorizationUrl({
                state: JSON.stringify(tweet),
                scopes: ['public_repo'],
            }).url,
            '_blank'
        )
    }

    const auth = await Browser.storage.local.get(['refreshToken', 'accessToken'])
    if (!auth.refreshToken) {
        redirect()
        return
    }
    const api = warp<BackgroundChannel>({ name: 'background' })
    try {
        await api.createIssue(tweet)
    } catch (err) {
        if ((err as any).code === 401) {
            redirect()
            return
        }
        throw err
    }
}

async function addBlockButton() {
    if (document.getElementById('block-and-report')) {
        return
    }
    const menu = document.querySelector('[role="menu"]')
    if (!menu) {
        return
    }
    const blockButton = menu.querySelector('[role="menu"] [role="menuitem"][data-testid="block"]')
    if (!blockButton) {
        return
    }
    const newNode = blockButton.cloneNode(true) as HTMLElement
    newNode.querySelector('div > div > span')!.textContent = 'Block and report'
    newNode.id = 'block-and-report'

    newNode.addEventListener('click', async (ev) => {
        const quotesLink = (
            menu.querySelector('[role="menuitem"][data-testid="tweetEngagements"]') as HTMLAnchorElement
        ).href
        const db = await initIndexeddb()
        const parsed = parseQuotesLink(quotesLink)
        const tweet = await db.get('tweet', parsed.tweetId)
        console.log('click', parsed, tweet)
        if (!tweet) {
            throw new Error('not found tweet')
        }
        if (await db.get('block', tweet.userId)) {
            console.log('block user exist')
            ;(menu.parentElement!.firstElementChild as HTMLElement).click()
            return
        }
        await Promise.all([
            blockUser(tweet.userId),
            createBlockIssue({
                ...tweet,
                link: parsed.link,
            }),
        ])
        ;([...document.querySelectorAll('[data-testid="tweet"]')] as HTMLElement[]).forEach((it) => {
            const username = extractUsernameFromTweet(it)
            if (!username) {
                return
            }
            if (username === tweet.username) {
                it.style.display = 'none'
            }
        })
        alert('block success')
        ;(menu.parentElement!.firstElementChild as HTMLElement).click()
        ;(document.querySelector('[data-testid="mask"]') as HTMLElement)?.click()
    })
    const p = blockButton.parentElement!
    p.insertBefore(newNode, p.firstChild)
}

export function blockScamTweets(): BasePlugin {
    return {
        name: 'blockScamTweets',
        description: t('plugin.blockScamTweets.name'),
        default: false,
        async observer() {
            if (!/^\/.*\/status\/.*/.test(location.pathname)) {
                return
            }
            const elements = [...document.querySelectorAll('[data-testid="cellInnerDiv"]')] as HTMLElement[]
            if (elements.length === 0) {
                return
            }
            await Promise.all([hideTweet(elements), addBlockButton()])
        },
    }
}
