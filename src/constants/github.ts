import { OAuthApp } from '@octokit/oauth-app'

export const oAuthApp = new OAuthApp({
    clientId: import.meta.env.VITE_GITHUB_OAUTH_CLIENT_ID,
    clientSecret: import.meta.env.VITE_GITHUB_OAUTH_CLIENT_SECRET,
    redirectUrl: import.meta.env.VITE_GITHUB_OAUTH_REDIRECT_URL,
})
