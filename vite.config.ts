/// <reference types="vitest" />
import { defineConfig, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import { fileURLToPath, URL } from 'url'
import manifest from './manifest.json'
import { i18nextDtsGen } from '@liuli-util/rollup-plugin-i18next-dts-gen'
import { firefox } from '@liuli-util/vite-plugin-firefox-dist'
import { UserConfig as TestConfig } from 'vitest/config'
import path from 'path'

export default defineConfig(({ mode }) => {
    const plugins = [
        react(),
        i18nextDtsGen({
            dirs: ['src/i18n'],
        }) as any,
    ]
    if (mode !== 'web') {
        plugins.push(
            crx({ manifest }),
            firefox({
                browser_specific_settings: {
                    gecko: {
                        // TODO: change
                        id: '11',
                        strict_min_version: '109.0',
                    },
                },
            })
        )
    }
    return {
        plugins: plugins,
        base: './',
        build: {
            target: 'esnext',
            minify: false,
            cssMinify: false,
            rollupOptions: {
                input: {
                    main: path.resolve(__dirname, './index.html'),
                    callback: path.resolve(__dirname, './callback/index.html'),
                },
            },
        },
        server: {
            port: 5173,
            strictPort: true,
            hmr: {
                port: 5173,
            },
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        test: {
            environment: 'happy-dom',
            setupFiles: ['./src/setupTests.ts'],
        } as TestConfig['test'],
    } as UserConfig
})
