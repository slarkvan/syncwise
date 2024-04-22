import { hijackXHR } from '@/content-script/utils/hijack-xhr'
import { twitterScroll } from '@/content-script/utils/twitter-scroll'

hijackXHR()
twitterScroll()
