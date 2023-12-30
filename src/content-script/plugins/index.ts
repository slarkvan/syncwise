import { restoreTabbar } from './restoreTabbar';
import { blockScamTweets } from './blockScamTweets';
import { hideDiscoverMore } from './hideDiscoverMore';
import { hideHomeTabs } from './hideHomeTabs';
import { hideLive } from './hideLive';
import { hideOther } from './hideOther';
import { hideRightSidebar } from './hideRightSidebar';
import { hideTimelineExplore } from './hideTimelineExplore';
import { hideViewTweetAnalytics } from './hideViewTweetAnalytics';
import { restoreLogo } from './restoreLogo';
import { restoreShareLink } from './restoreShareLink';
import { hidePremium } from './hidePremium';
import { syncTwitterBookmarks } from './syncTwitterBookmarks';

export const plugins = () => [
  syncTwitterBookmarks(),
  hideHomeTabs(),
  // hideTimelineExplore(),
  // hideRightSidebar(),
  // hideViewTweetAnalytics(),
  // hideDiscoverMore(),
  // hideLive(),
  // hidePremium(),
  // // hideOther(),
  // restoreShareLink(),
  // restoreLogo(),
  // restoreTabbar(),
  // blockScamTweets(),
];
