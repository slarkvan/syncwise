function get_cookie(cname: string) {
    const name = cname + '='
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; ++i) {
        const c = ca[i].trim()
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length)
        }
    }
    return ''
}

export async function blockUser(id: string) {
    // https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/mute-block-report-users/api-reference/post-blocks-create
    const p = new URLSearchParams([['user_id', id]])
    await fetch('https://twitter.com/i/api/1.1/blocks/create.json', {
        headers: {
            'authorization': import.meta.env.VITE_TWITTER_TOKEN,
            'content-type': 'application/x-www-form-urlencoded',
            'X-Csrf-Token': get_cookie('ct0'),
            'x-twitter-active-user': 'yes',
            'x-twitter-auth-type': 'OAuth2Session',
        },
        body: p.toString(),
        method: 'POST',
    })
}
