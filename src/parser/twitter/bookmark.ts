export function parseBookmarkResponse(tweetData: TweetEntry): TweetBookmarkParsedItem {
    const { rest_id, core, legacy, note_tweet } = tweetData?.content?.itemContent?.tweet_results?.result ?? {}
    const images = (legacy?.entities?.media ?? []).map((x) => x?.media_url_https)
    const screen_name = core?.user_results?.result?.legacy?.screen_name
    const url = `https://twitter.com/${screen_name}/status/${rest_id}`
    const id = rest_id
    const nickname = core?.user_results?.result?.legacy?.name ?? 'no nickname'

    const uniqueUrls: any = {}
    const urls: any = []

    ;(legacy?.entities?.urls ?? []).forEach((x: any) => {
        if (!uniqueUrls.hasOwnProperty(x.display_url)) {
            uniqueUrls[x.display_url as string] = true // 标记 label 为已处理
            urls.push({ label: x.display_url, value: x.url })
        }
    })

    return {
        id,
        url,
        rest_id,
        nickname,
        screen_name,
        full_text: note_tweet?.note_tweet_results?.result?.text ?? legacy?.full_text,
        images,
        urls,
    }
}

/**
 * twitter to logseq
 */
export function beautifyLogseqText(text: string, urls: UrlItem[]) {
    if (!text) {
        return ''
    }
    // \r\n 换行
    // # twitter hash
    let str1 = text.replace(/\n\n/g, '\r\n').replace(/#/g, '')

    if (urls.length > 0) {
        console.log('str1 before:', str1, urls)

        urls.forEach((item) => {
            const { label, value } = item
            const markdownUrl = `[${label}](${value})`
            const regex = new RegExp(value, 'g')
            str1 = str1.replace(regex, () => markdownUrl)
        })
        console.log('str1 after:', str1, urls)
    }
    // 用户数 &gt; 5000
    const entities: any = {
        '&lt;': '<',
        '&gt;': '>',
        '&amp;': '&',
        '&quot;': '"',
        '&apos;': "'",
        '&cent;': '¢',
        '&pound;': '£',
        '&yen;': '¥',
        '&euro;': '€',
        '&copy;': '©',
        '&reg;': '®',
        '&trade;': '™',
        '&nbsp;': ' ',
        '&iexcl;': '¡',
        '&curren;': '¤',
        '&brvbar;': '¦',
        '&sect;': '§',
        '&uml;': '¨',
        '&ordf;': 'ª',
        '&laquo;': '«',
        '&not;': '¬',
        '&shy;': '­',
        '&macr;': '¯',
        '&deg;': '°',
        '&plusmn;': '±',
        '&sup2;': '²',
        '&sup3;': '³',
        '&acute;': '´',
        '&micro;': 'µ',
        '&para;': '¶',
        '&middot;': '·',
        '&cedil;': '¸',
        '&sup1;': '¹',
        '&ordm;': 'º',
        '&raquo;': '»',
        '&frac14;': '¼',
        '&frac12;': '½',
        '&frac34;': '¾',
        '&iquest;': '¿',
        '&times;': '×',
        '&divide;': '÷',
        // ...可以继续添加更多
    }

    str1 = str1.replace(/&[a-zA-Z]+;/g, (match) => entities[match] || match)
    return str1
}

/**
 * twitter to obsidian
 */
export function beautifyObsidianText(text: string, urls: UrlItem[]) {
    if (!text) {
        return ''
    }
    let str1 = text

    if (urls.length > 0) {
        urls.forEach((item) => {
            const { label, value } = item
            const markdownUrl = `[${label}](${value})`
            // 逐个替换文本中的每个 URL 实例
            const regex = new RegExp(value, 'g')
            str1 = str1.replace(regex, () => markdownUrl)
        })
        console.log('str1 after:', str1, urls)
    }
    // 用户数 &gt; 5000
    const entities: any = {
        '&lt;': '<',
        '&gt;': '>',
        '&amp;': '&',
        '&quot;': '"',
        '&apos;': "'",
        '&cent;': '¢',
        '&pound;': '£',
        '&yen;': '¥',
        '&euro;': '€',
        '&copy;': '©',
        '&reg;': '®',
        '&trade;': '™',
        '&nbsp;': ' ',
        '&iexcl;': '¡',
        '&curren;': '¤',
        '&brvbar;': '¦',
        '&sect;': '§',
        '&uml;': '¨',
        '&ordf;': 'ª',
        '&laquo;': '«',
        '&not;': '¬',
        '&shy;': '­',
        '&macr;': '¯',
        '&deg;': '°',
        '&plusmn;': '±',
        '&sup2;': '²',
        '&sup3;': '³',
        '&acute;': '´',
        '&micro;': 'µ',
        '&para;': '¶',
        '&middot;': '·',
        '&cedil;': '¸',
        '&sup1;': '¹',
        '&ordm;': 'º',
        '&raquo;': '»',
        '&frac14;': '¼',
        '&frac12;': '½',
        '&frac34;': '¾',
        '&iquest;': '¿',
        '&times;': '×',
        '&divide;': '÷',
        // ...可以继续添加更多
    }

    str1 = str1.replace(/&[a-zA-Z]+;/g, (match) => entities[match] || match)
    return str1
}
