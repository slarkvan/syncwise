/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_GITHUB_CLIENT_SECRET: string
}

declare module '*?script&module' {
    const src: string
    export default src
}
