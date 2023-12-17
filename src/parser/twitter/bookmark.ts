export function parseBookmarkResponse(tweetData: TweetEntry) {
    const { rest_id, core, legacy, note_tweet } = tweetData?.content?.itemContent?.tweet_results?.result ?? {}
    const images = (legacy?.entities?.media ?? []).map((x) => x?.media_url_https)
    const screen_name = core?.user_results?.result?.legacy?.screen_name
    const url = `https://twitter.com/${screen_name}/status/${rest_id}`

    return {
        url,
        rest_id,
        screen_name,
        full_text: legacy?.full_text,
        all_text: note_tweet?.note_tweet_results?.result?.text,
        images,
    }
}
