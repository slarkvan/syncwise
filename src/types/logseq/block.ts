export type LogseqPageIdentity = {
  name: string;
  id: number;
  uuid: string;
};

export type LogseqBlockType = {
  uuid: string;
  html: string;
  page: LogseqPageIdentity;
};

export type LogseqPageContentType = {
  uuid: string;
  content: string;
  page: LogseqPageIdentity;
};

export type LogseqSearchResult = {
  blocks: LogseqBlockType[];
  pages: LogseqPageIdentity[];
  // pageContents: LogseqPageContentType[];
  graph: string;
};

interface Macro {
  ident: string;
  type: string;
  properties: {
    logseq: {
      macroName: string;
      macroArguments: string[];
    };
  };
}

export interface DataBlock {
  properties: Record<string, unknown>;
  tags: string[];
  pathRefs: string[];
  propertiesTextValues: Record<string, unknown>;
  uuid: string;
  content: string;
  macros: Macro[];
  page: number;
  collapsed?: boolean;
  propertiesOrder: string[];
  format: string;
  refs: string[];
}

// const a = {
//   properties: {},
//   tags: [],
//   pathRefs: [],
//   propertiesTextValues: {},
//   uuid: '658fcff5-6bcb-4346-a3b1-75b3a7ecdfd8',
//   content:
//     '韩国将2024年1月1日起试点实施数码游牧签证制度，旨在吸引全球范围内以远程方式工作的外企高收入群体。https://t.co/mGJNTjBnhS\n    collapsed:: true\n    {{twitter https://twitter.com/zaobaosg/status/1740628730194653588}}',
//   macros: [
//     {
//       ident: 'twitter https://twitter.com/zaobaosg/status/1740628730194653588',
//       type: 'macro',
//       properties: {
//         'logseq.macroName': 'twitter',
//         'logseq.macroArguments': [
//           'https://twitter.com/zaobaosg/status/1740628730194653588',
//         ],
//       },
//     },
//   ],
//   page: 10953,
//   'collapsed?': true,
//   propertiesOrder: [],
//   format: 'markdown',
//   refs: [],
// };
