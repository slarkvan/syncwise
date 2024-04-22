interface TweetBookmarkResponse {
    data: {
        bookmark_timeline_v2: {
            timeline: {
                instructions: [
                    {
                        entries: TweetEntry[]
                    },
                ]
            }
        }
    }
}

interface TweetEntry {
    entryId: string
    sortIndex: string
    content: TimelineTimelineItem
}

interface TimelineTimelineItem {
    entryType: string
    __typename: string
    itemContent: TimelineTweet
}

interface TimelineTweet {
    itemType: string
    __typename: string
    tweet_results: TweetResults
}

interface TweetResults {
    result: TweetResult
}

interface TweetResult {
    __typename: string
    rest_id: string
    core: Core
    unmention_data: any
    note_tweet?: NoteTweet // 只有在「展开的case」下出现
    edit_control: EditControl
    is_translatable: boolean
    views: Views
    source: string
    quoted_status_result: QuotedStatusResult
    legacy: TweetLegacy
}

interface Core {
    user_results: UserResults
}

interface UserResults {
    result: User
}

interface User {
    __typename: string
    id: string
    rest_id: string
    affiliates_highlighted_label: any
    has_graduated_access: boolean
    is_blue_verified: boolean
    profile_image_shape: string
    legacy: UserLegacy
    professional: Professional
}

interface UserLegacy {
    can_dm: boolean
    can_media_tag: boolean
    created_at: string
    default_profile: boolean
    default_profile_image: boolean
    description: string
    entities: UserEntities
    fast_followers_count: number
    favourites_count: number
    followers_count: number
    friends_count: number
    has_custom_timelines: boolean
    is_translator: boolean
    listed_count: number
    location: string
    media_count: number
    name: string
    normal_followers_count: number
    pinned_tweet_ids_str: string[]
    possibly_sensitive: boolean
    profile_banner_url: string
    profile_image_url_https: string
    profile_interstitial_type: string
    screen_name: string
    statuses_count: number
    translator_type: string
    verified: boolean
    want_retweets: boolean
    withheld_in_countries: any[]
}

interface UserEntities {
    description: Description
}

interface Description {
    urls: Url[]
}

interface Url {
    display_url: string
    expanded_url: string
    url: string
    indices: number[]
}

interface Professional {
    rest_id: string
    professional_type: string
    category: Category[]
}

interface Category {
    id: number
    name: string
    icon_name: string
}

interface EditControl {
    edit_tweet_ids: string[]
    editable_until_msecs: string
    is_edit_eligible: boolean
    edits_remaining: string
}

interface Views {
    count: string
    state: string
}

interface QuotedStatusResult {
    result: QuotedTweetResult
}

interface QuotedTweetResult {
    __typename: string
    rest_id: string
    core: QuotedCore
    unmention_data: any
    unified_card: UnifiedCard
    edit_control: EditControl
    is_translatable: boolean
    views: Views
    source: string
    legacy: QuotedTweetLegacy
}

interface QuotedCore {
    user_results: UserResults
}

interface UnifiedCard {
    card_fetch_state: string
}

interface QuotedTweetLegacy {
    bookmark_count: number
    bookmarked: boolean
    created_at: string
    conversation_id_str: string
    display_text_range: number[]
    entities: TweetEntities
    extended_entities: ExtendedEntities
    favorite_count: number
    favorited: boolean
    full_text: string
    is_quote_status: boolean
    lang: string
    possibly_sensitive: boolean
    possibly_sensitive_editable: boolean
    quote_count: number
    reply_count: number
    retweet_count: number
    retweeted: boolean
    user_id_str: string
    id_str: string
}

interface TweetEntities {
    hashtags: Hashtag[]
    media: Media[]
    symbols: any[]
    timestamps: any[]
    urls: Url[]
    user_mentions: UserMention[]
}

interface Hashtag {
    indices: number[]
    text: string
}

interface Media {
    display_url: string
    expanded_url: string
    id_str: string
    indices: number[]
    media_key: string
    media_url_https: string
    type: string
    url: string
    additional_media_info: AdditionalMediaInfo
    ext_media_availability: ExtMediaAvailability
    sizes: Sizes
    original_info: OriginalInfo
    video_info: VideoInfo
}

interface AdditionalMediaInfo {
    monetizable: boolean
}

interface ExtMediaAvailability {
    status: string
}

interface Sizes {
    large: SizeDetail
    medium: SizeDetail
    small: SizeDetail
    thumb: SizeDetail
}

interface SizeDetail {
    h: number
    w: number
    resize: string
}

interface OriginalInfo {
    height: number
    width: number
    focus_rects: any[]
}

interface VideoInfo {
    aspect_ratio: number[]
    duration_millis: number
    variants: Variant[]
}

interface Variant {
    bitrate?: number
    content_type: string
    url: string
}

interface UserMention {
    id_str: string
    name: string
    screen_name: string
    indices: number[]
}

interface ExtendedEntities {
    media: Media[]
}

interface TweetLegacy {
    bookmark_count: number
    bookmarked: boolean
    created_at: string
    conversation_id_str: string
    display_text_range: number[]
    entities: TweetEntities
    favorite_count: number
    favorited: boolean
    full_text: string // TODO: 全文
    is_quote_status: boolean
    lang: string
    quote_count: number
    quoted_status_id_str: string
    quoted_status_permalink: QuotedStatusPermalink
    reply_count: number
    retweet_count: number
    retweeted: boolean
    user_id_str: string
    id_str: string
}

interface QuotedStatusPermalink {
    url: string
    expanded: string
    display: string
}

// 展开更多

interface NoteTweet {
    is_expandable: boolean
    note_tweet_results: NoteTweetResults
}

interface NoteTweetResults {
    result: NoteTweetResult
}

interface NoteTweetResult {
    id: string
    text: string
    entity_set: EntitySet
}

interface EntitySet {
    hashtags: any[]
    symbols: any[]
    timestamps: any[]
    urls: any[]
    user_mentions: any[]
}
