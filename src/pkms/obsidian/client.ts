import { OBSIDIAN_HTTP_TOKEN } from '../../constants/token';

export async function _obsidianRequest(
  hostname: string,
  apiKey: string = OBSIDIAN_HTTP_TOKEN,
  path: string,
  options: RequestInit,
  insecureMode: boolean = true,
): ReturnType<typeof fetch> {
  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${apiKey}`,
    },
    method: options.method?.toUpperCase(),
    mode: 'cors',
  };
  console.log('obsidian requestOptions:', requestOptions);

  return fetch(
    `http${insecureMode ? '' : 's'}://${hostname}:${
      insecureMode ? '27123' : '27124'
    }${path}`,
    requestOptions,
  );
}
