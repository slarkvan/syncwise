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
