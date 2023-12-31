import { OBSIDIAN_HTTP_TOKEN } from '../../constants/token'

// export async function _obsidianRequest(
//   hostname: string,
//   apiKey: string = OBSIDIAN_HTTP_TOKEN,
//   path: string,
//   options: RequestInit,
//   insecureMode: boolean = true,
// ): ReturnType<typeof fetch> {
//   const requestOptions: RequestInit = {
//     ...options,
//     headers: {
//       ...options.headers,
//       Authorization: `Bearer ${apiKey}`,
//     },
//     method: options.method?.toUpperCase(),
//     mode: 'cors',
//   };
//   console.log('obsidian requestOptions:', requestOptions);

//   return fetch(
//     `http${insecureMode ? '' : 's'}://${hostname}:${
//       insecureMode ? '27123' : '27124'
//     }${path}`,
//     requestOptions,
//   );
// }

class ObsidianClient {
    private static instance: ObsidianClient

    private constructor() {
        // 私有构造函数确保不会外部实例化
    }

    public static getInstance(): ObsidianClient {
        if (!ObsidianClient.instance) {
            ObsidianClient.instance = new ObsidianClient()
        }
        return ObsidianClient.instance
    }

    public async request(
        hostname: string,
        apiKey: string = OBSIDIAN_HTTP_TOKEN,
        path: string,
        options: RequestInit,
        insecureMode: boolean = true
    ): ReturnType<typeof fetch> {
        const requestOptions: RequestInit = {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${apiKey}`,
            },
            method: options.method?.toUpperCase(),
            mode: 'cors',
        }
        console.log('obsidian requestOptions:', requestOptions)

        return fetch(
            `http${insecureMode ? '' : 's'}://${hostname}:${insecureMode ? '27123' : '27124'}${path}`,
            requestOptions
        )
    }
}

const obsidianClient = ObsidianClient.getInstance()

export default obsidianClient
