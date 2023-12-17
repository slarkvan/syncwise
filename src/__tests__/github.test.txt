import { it, beforeAll } from 'vitest'
import { Octokit, OAuthApp } from 'octokit'
import express from 'express'
import open from 'open'

let octokit: Octokit
beforeAll(() => {
  octokit = new Octokit({
    auth: import.meta.env.GITHUB_API_TOKEN,
  })
})

it.skip('create pr', async () => {})

it('get login user', async () => {
  const user = await octokit.rest.users.getAuthenticated()
  console.log(user)
})

it('get user repos', async () => {
  const r = await octokit.rest.repos.listForAuthenticatedUser()
  console.log(r.data)
})

function wait(
  param: () => boolean | Promise<boolean>,
  ms: number = 100,
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof param === 'number') {
      setTimeout(resolve, param)
    } else if (typeof param === 'function') {
      const timer = setInterval(async () => {
        if (await param()) {
          clearInterval(timer)
          resolve()
        }
      }, ms)
    } else {
      resolve()
    }
  })
}

it('fork repo', async () => {
  await octokit.rest.repos.createFork({
    owner: 'rxliuli',
    repo: 'clean-twitter',
  })
  const {
    data: { login: username },
  } = await octokit.rest.users.getAuthenticated()
  await wait(async () => {
    try {
      await octokit.rest.repos.get({
        owner: username,
        repo: 'clean-twitter',
      })
      return true
    } catch {
      return false
    }
  })
  const r = await octokit.rest.repos.get({
    owner: username,
    repo: 'clean-twitter',
  })
  console.log(username, r.data)
})

it('create issue', async () => {
  // const title = '1588312978268786688'
  // const r = await octokit.rest.search.issuesAndPullRequests({
  //   q: `repo:rxliuli/clean-twitter label:"report" ${title} in:title type:issue`,
  // })
  // console.log(r.data)
  await octokit.rest.issues.create({
    owner: 'rxliuli',
    repo: 'clean-twitter',
    title: '1143743380486275072',
    body: 'test',
  })
})

it('github app', async () => {
  const githubApp = new OAuthApp({
    clientId: import.meta.env.VITE_GITHUB_OAUTH_CLIENT_ID,
    clientSecret: import.meta.env.VITE_GITHUB_OAUTH_CLIENT_SECRET,
    redirectUrl: import.meta.env.VITE_GITHUB_OAUTH_REDIRECT_URL,
  })
  const url = githubApp.getWebFlowAuthorizationUrl({}).url
  console.log(url)
  const app = express()
  const refreshCode = await new Promise<string>(async (resolve) => {
    app.get('/callback', (req, res) => {
      console.log('req.query', req.query)
      res.send('ok')
      resolve(req.query.code as string)
      server.close()
    })
    const server = app.listen(8080)
    await open(url)
  })
  console.log('refreshCode', refreshCode)
  const { authentication } = await githubApp.createToken({
    code: refreshCode,
  })
  console.log(authentication.token)
  await new Octokit({
    auth: authentication.token,
  }).rest.issues.create({
    owner: 'rxliuli',
    repo: 'clean-twitter',
    title: '1143743380486275072',
    body: 'test',
    labels: ['report'],
  })
}, 100_000)
