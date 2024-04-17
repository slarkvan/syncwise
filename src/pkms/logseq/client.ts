import { LogseqSearchResult, LogseqPageIdentity, LogseqBlockType } from '../../types/logseq/block'
import { marked } from 'marked'
import { getLogseqSyncConfig } from '../../config/logseq'

import {
    CannotConnectWithLogseq,
    LogseqVersionIsLower,
    TokenNotCorrect,
    UnknownIssues,
    NoSearchingResult,
} from './error'
import { LogseqSyncConfig } from '../../config/config'

const logseqLinkExt = (graph: string, query: string) => {
    return {
        name: 'logseqLink',
        level: 'inline',
        tokenizer: function (src: string) {
            const match = src.match(/^#?\[\[(.*?)\]\]/)
            if (match) {
                return {
                    type: 'logseqLink',
                    raw: match[0],
                    text: match[1],
                    href: match[1].trim(),
                    tokens: [],
                }
            }
            return false
        },
        renderer: function (token: any) {
            const { text, href } = token
            const fillText = query ? text.replaceAll(query, '<mark>' + query + '</mark>') : text
            return `<a class="logseq-page-link" href="logseq://graph/${graph}?page=${href}"><span class="tie tie-page"></span>${fillText}</a>`
        },
    }
}

const highlightTokens = (query: string) => {
    return (token: any) => {
        if (token.type !== 'code' && token.type !== 'codespan' && token.type !== 'logseqLink' && token.text) {
            token.text = query ? token.text.replaceAll(query, '<mark>' + query + '</mark>') : token.text
        }
    }
}

type Graph = {
    name: string
    path: string
}

type LogseqSearchResponse = {
    'blocks': {
        'block/uuid': string
        'block/content': string
        'block/page': number
    }[]
    'pages-content': {
        'block/uuid': string
        'block/snippet': string
    }[]
    'pages': string[]
}

export type LogseqPageResponse = {
    'name': string
    'uuid': string
    'journal?': boolean
}

export type LogseqResponseType<T> = {
    status: number
    msg: string
    response: T
    count?: number
}

class LogseqClient {
    private static instance: LogseqClient

    private constructor() {}

    public static getInstance(): LogseqClient {
        if (!LogseqClient.instance) {
            LogseqClient.instance = new LogseqClient()
        }
        return LogseqClient.instance
    }

    async getLogseqSyncConfig(): Promise<LogseqSyncConfig> {
        return await getLogseqSyncConfig()
    }

    private baseFetch = async (method: string, args: any[]) => {
        const config = await getLogseqSyncConfig()
        const endPoint = new URL(`http://${config.host}:${config.port}`)
        const apiUrl = new URL(`${endPoint.origin}/api`)
        const body = JSON.stringify({
            method: method,
            args: args,
        })
        console.log(`logseq method:${method} body: ${body}`)
        const resp = await fetch(apiUrl, {
            mode: 'cors',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.token}`,
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: body,
        })

        if (resp.status !== 200) {
            throw resp
        }

        return resp
    }

    private baseJson = async (method: string, args: any[]) => {
        const resp = await this.baseFetch(method, args)
        const data = await resp.json()
        console.log('logseq response data:', data)
        return data
    }

    private trimContent = (content: string): string => {
        return content
            .replace(/!\[.*?\]\(\.\.\/assets.*?\)/gm, '')
            .replace(/^[\w-]+::.*?$/gm, '') // clean properties
            .replace(/{{renderer .*?}}/gm, '') // clean renderer
            .replace(/^deadline: <.*?>$/gm, '') // clean deadline
            .replace(/^scheduled: <.*?>$/gm, '') // clean schedule
            .replace(/^:logbook:[\S\s]*?:end:$/gm, '') // clean logbook
            .replace(/\$pfts_2lqh>\$(.*?)\$<pfts_2lqh\$/gm, '<em>$1</em>') // clean highlight
            .replace(/^\s*?-\s*?$/gm, '')
            .trim()
    }

    private format = async (content: string, graphName: string, query: string) => {
        marked.use({
            gfm: true,
            tables: true,
            walkTokens: highlightTokens(query),
            extensions: [logseqLinkExt(graphName, query)],
        } as any)
        const html = await marked.parse(this.trimContent(content))
        return html.trim()
    }

    // public appendBlock = async (page: string, content: string) => {
    //   const resp = await this.baseJson('logseq.Editor.appendBlockInPage', [
    //     page,
    //     content,
    //   ]);
    //   return resp;
    // };

    private getCurrentGraph = async (): Promise<{
        name: string
        path: string
    }> => {
        const resp: Graph = await this.baseJson('logseq.getCurrentGraph', [])
        return resp
    }

    public appendBlock = async (page: string, content: string) => {
        const resp = await this.baseJson('logseq.Editor.appendBlockInPage', [page, content])
        return resp
    }

    public appendBatchBlock = async (page: string, content: string[]) => {
        const resp = await this.baseJson('logseq.Editor.insertBatchBlock', [
            page,
            content,
            {
                sibling: false,
            },
        ])
        return resp
    }

    public getCurrentPage = async () => {
        return await this.catchIssues(async () => {
            return await this.baseJson('logseq.Editor.getCurrentPage', [])
        })
    }

    private getAllPage = async () => {
        return await this.baseJson('logseq.Editor.getAllPages', [])
    }

    private getPage = async (pageIdentity: LogseqPageIdentity): Promise<LogseqPageIdentity> => {
        const resp: LogseqPageIdentity = await this.baseJson('logseq.Editor.getPage', [
            pageIdentity.id || pageIdentity.uuid || pageIdentity.name,
        ])
        return resp
    }

    private search = async (query: string): Promise<LogseqSearchResponse> => {
        const resp = await this.baseJson('logseq.App.search', [query])
        if (resp.error) {
            throw LogseqVersionIsLower
        }
        return resp
    }

    private showMsgInternal = async (message: string): Promise<LogseqResponseType<null>> => {
        await this.baseFetch('logseq.showMsg', [message])
        return {
            status: 200,
            msg: 'success',
            response: null,
        }
    }

    private async catchIssues(func: Function) {
        try {
            return await func()
        } catch (e: any) {
            console.info(e)
            if (e.status === 401) {
                return TokenNotCorrect
            } else if (e.toString() === 'TypeError: Failed to fetch' || e.toString().includes('Invalid URL')) {
                return CannotConnectWithLogseq
            } else if (e === LogseqVersionIsLower || e === NoSearchingResult) {
                return e
            } else {
                return UnknownIssues
            }
        }
    }

    private getVersionInternal = async (): Promise<LogseqResponseType<string>> => {
        const resp = await this.baseJson('logseq.App.getAppInfo', [])
        return {
            status: 200,
            msg: 'success',
            response: resp.version,
        }
    }

    private find = async (query: string) => {
        const escapedQuery = query.replace(/"/g, '\\"')
        const data = await this.baseJson('logseq.DB.q', [`"${escapedQuery}"`])
        return data
    }

    private findLogseqInternal = async (query: string): Promise<LogseqResponseType<LogseqSearchResult>> => {
        const { name: graphName } = await this.getCurrentGraph()
        const res = await this.find(query)
        const blocks = (
            await Promise.all(
                res.map(async (item: any) => {
                    const content = this.format(item.content, graphName, query)
                    if (!content) return null
                    return {
                        html: content,
                        uuid: item.uuid,
                        page: await this.getPage({
                            id: item.page.id,
                        } as LogseqPageIdentity),
                    } as unknown as LogseqBlockType
                })
            )
        ).filter((b) => b)
        return {
            status: 200,
            msg: 'success',
            response: {
                blocks: blocks,
                pages: [],
                graph: graphName,
            },
            count: blocks.length,
        }
    }

    private searchLogseqInternal = async (query: string): Promise<LogseqResponseType<LogseqSearchResult>> => {
        const { name: graphName } = await this.getCurrentGraph()
        const { blocks, pages }: LogseqSearchResponse = await this.search(query)

        const result: LogseqSearchResult = {
            pages: await Promise.all(
                pages.map(async (page) => await this.getPage({ name: page } as LogseqPageIdentity))
            ),
            blocks: (await Promise.all(
                blocks.map(async (block) => {
                    return {
                        html: this.format(block['block/content'], graphName, query),
                        uuid: block['block/uuid'],
                        page: await this.getPage({
                            id: block['block/page'],
                        } as LogseqPageIdentity),
                    }
                })
            )) as any,
            graph: graphName,
        }

        console.debug(result)
        return {
            msg: 'success',
            status: 200,
            response: result,
            count: result.blocks.length + result.pages.length,
        }
    }

    public getUserConfig = async () => {
        return await this.catchIssues(async () => await this.baseJson('logseq.App.getUserConfigs', []))
    }

    public showMsg = async (message: string): Promise<LogseqResponseType<null>> => {
        return await this.catchIssues(async () => await this.showMsgInternal(message))
    }

    public getAllPages = async (): Promise<string> => {
        return await this.catchIssues(async () => await this.getAllPage())
    }

    public getGraph = async (): Promise<string> => {
        return await this.catchIssues(async () => await this.getCurrentGraph())
    }

    public getVersion = async (): Promise<LogseqResponseType<string>> => {
        return await this.catchIssues(async () => await this.getVersionInternal())
    }

    public searchLogseq = async (query: string): Promise<LogseqResponseType<LogseqSearchResult | null>> => {
        return await this.catchIssues(async () => {
            return await this.searchLogseqInternal(query.trim())
        })
    }

    public blockSearch = async (query: string): Promise<LogseqResponseType<LogseqSearchResult | null>> => {
        return await this.catchIssues(async () => {
            return this.findLogseqInternal(query)
        })
    }
}

const logseqClient = LogseqClient.getInstance()

export default logseqClient
