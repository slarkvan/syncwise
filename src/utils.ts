import { format } from 'date-fns';
import { Liquid } from 'liquidjs';

const engine = new Liquid();

export const removeUrlHash = (url: string) => {
  const hashIndex = url.indexOf('#');
  return hashIndex > 0 ? url.substring(0, hashIndex) : url;
};

export const logseqTimeFormat = (date: Date): string => {
  return format(date, 'HH:mm');
};

const mappingVersionToNumbers = (version: string): Array<number> => {
  return version
    .split('.')
    .slice(0, 3)
    .map((x) => {
      return parseInt(x.split('0')[0]);
    });
};

export const versionCompare = (versionA: string, versionB: string) => {
  const [majorA, minorA, patchA] = mappingVersionToNumbers(versionA);
  const [majorB, minorB, patchB] = mappingVersionToNumbers(versionB);
  if (majorA < majorB) return -1;
  if (majorA > majorB) return 1;
  if (minorA < minorB) return -1;
  if (minorA > minorB) return 1;
  if (patchA < patchB) return -1;
  if (patchA > patchB) return 1;
  return 0;
};

export function logseqEscape(str: string): string {
  // return str.replace(/([\[\{\(])/g, '\\$1');
  return str;
}

interface LogSeqRenderVariables {
  title: string;
  url: string;
  screen_name: string;
  rest_id: string;
  full_text: string;
  preferredDateFormat: any;
  time: any;
}

export function blockRending(
  clipNoteTemplate: string,
  {
    title,
    url,
    screen_name,
    rest_id,
    full_text,
    preferredDateFormat,
    time,
  }: LogSeqRenderVariables,
): [string, string] {
  console.log(preferredDateFormat);

  // collapsed:: true
  // {% raw %}{{twitter {% endraw %}{{url}}{% raw %}}}{% endraw %}

  // TODO: better
  const template1 = `@{{screen_name}}:{{full_text}}`;

  const render1 = engine
    .parseAndRenderSync(template1, {
      date: format(time, preferredDateFormat),

      title: title,
      url: url,
      full_text: logseqEscape(full_text),
      screen_name,
      rest_id,

      time: logseqTimeFormat(time),
      dt: time,
    })
    .trim();

  const template2 = `{% raw %}{{twitter {% endraw %}{{url}}{% raw %}}}{% endraw %}`;

  const render2 = engine
    .parseAndRenderSync(template2, {
      date: format(time, preferredDateFormat),
      url: url,
      time: logseqTimeFormat(time),
      dt: time,
    })
    .trim();

  return [render1, render2];
}
