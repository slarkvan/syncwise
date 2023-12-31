import Browser from 'webextension-polyfill'
import { ObsidianSyncConfig } from '../../config/config'

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

    private async getLogseqSyncConfig(): Promise<ObsidianSyncConfig> {
        const data = await Browser.storage.local.get('obsidian')
        const { host, port, token, pageType, pageName, httpsPort, insecureMode } = data?.obsidian ?? {}
        return {
            host,
            port,
            token,
            pageType,
            pageName,
            httpsPort,
            insecureMode,
        }
    }

    public async checkConnectStatus(): Promise<any> {
        const res = await this.request('/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((r) => {
                console.log('r', r)
                if (!r.authenticated) {
                    return { msg: 'Failed to authenticate with Obsidian, please check if the token is correct.' }
                }
                return { msg: 'success' }
            })
            .catch((e) => ({
                status: 'error',
                msg: e?.message ?? 'unknown error, please check obsidian Local REST API plugin settings.',
            }))
        console.log('checkConnectStatus', res)
        return res
    }

    public async request(path: string, options: RequestInit): ReturnType<typeof fetch> {
        const { host, port, httpsPort, token, insecureMode } = await this.getLogseqSyncConfig()
        const requestOptions: RequestInit = {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${token}`,
            },
            method: options.method?.toUpperCase(),
            mode: 'cors',
        }
        console.log('obsidian requestOptions:', requestOptions)

        return fetch(
            `http${insecureMode ? '' : 's'}://${host}:${insecureMode ? port : httpsPort}${path}`,
            requestOptions
        )
    }
}

const obsidianClient = ObsidianClient.getInstance()

export default obsidianClient
