export type LogseqPageIdentity = {
    name: string
    id: number
    uuid: string
}

export type LogseqBlockType = {
    uuid: string
    html: string
    page: LogseqPageIdentity
}

export type LogseqPageContentType = {
    uuid: string
    content: string
    page: LogseqPageIdentity
}

export type LogseqSearchResult = {
    blocks: LogseqBlockType[]
    pages: LogseqPageIdentity[]
    // pageContents: LogseqPageContentType[];
    graph: string
}

interface Macro {
    ident: string
    type: string
    properties: {
        logseq: {
            macroName: string
            macroArguments: string[]
        }
    }
}

export interface DataBlock {
    properties: Record<string, unknown>
    tags: string[]
    pathRefs: string[]
    propertiesTextValues: Record<string, unknown>
    uuid: string
    content: string
    macros: Macro[]
    page: number
    collapsed?: boolean
    propertiesOrder: string[]
    format: string
    refs: string[]
}
