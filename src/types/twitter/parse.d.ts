type UrlItem = { label: string; value: string };

interface TweetBookmarkParsedItem {
  id: string; // 去重专用
  url: string;
  rest_id: string;
  screen_name: string; // 这个不能变
  nickname: string; // 这个可以变
  full_text: string | undefined; // Assuming 'legacy?.full_text' can be undefined
  // all_text: string | undefined; // Assuming 'note_tweet?.note_tweet_results?.result?.text' can be undefined
  images: string[]; // Assuming 'images' is an array of strings (URLs)
  urls: UrlItem[];
}
