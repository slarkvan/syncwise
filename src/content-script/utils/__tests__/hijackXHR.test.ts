import { expect, it } from 'vitest'
import { filterTweets, parseTwitterResponserInfo, parseTwitterTimeline } from '../hijackXHR'
import tweetDetail from './assets/tweetDetail.json'
import tweetDetail2 from './assets/tweetDetail2.json'
import tweetDetail3 from './assets/tweetDetail3.json'
import timeline from './assets/timeline.json'

it('parseTwitterResponserInfo', () => {
    const r = parseTwitterResponserInfo(tweetDetail)
    console.log(r)
    expect(r.map((it) => it.id)).deep.eq(['1698910902328946772', '1698911099025068275', '1698915213247173085'])
    // expect(r.map((it) => pick(it, 'id', 'userId', 'username'))).deep.eq([
    //   {
    //     id: '1698911099025068275',
    //     userId: '1400043510242418694',
    //     username: '3GXAt2etoYJ9ivO',
    //   },
    //   {
    //     id: '1698915213247173085',
    //     userId: '88457089',
    //     username: 'aoi_nishimata',
    //   },
    // ] as TweetInfo[])
})

it('tweetDetail2', () => {
    const r = parseTwitterResponserInfo(tweetDetail2)
    // console.log(r.length, uniqBy(r, 'id').length)
    expect(r.length).eq(11)
})

it('tweetDetail3', () => {
    const r = parseTwitterResponserInfo(tweetDetail3)
    // console.log(r)
    expect(r.map((it) => it.id)).deep.eq(['1707239775076553129', '1707254451520901563'])
})

it('parseTimeline', () => {
    const r = parseTwitterTimeline(timeline)
    console.log(r)
})

it('filterTweets', () => {
    const r = filterTweets(tweetDetail2, () => false)
    console.log(r)
})
