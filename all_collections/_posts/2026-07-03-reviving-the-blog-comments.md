---
layout: post
title: Reviving the blog comments
tags: [GitHub Pages, blog, heroku, vercel]
---

## Comments are closed

You probably never saw that message because this blog has been _neglected_ neglected.
A Nevada mining camp long abandoned beneath rusting desert dust.

The comment system in those early days used Heroku to let readers authenticate with GitHub, and the comments they added on blog post pages became comments on a GitHub issue in the blog's repo.
But Heroku hasn't had a free tier [since November 2022](https://help.heroku.com/RSBRUH58/removal-of-heroku-free-product-plans-faq), and so there hasn't been any way for readers to login so they can leave a comment.
I want to get it working again, though.

## Resurvey the landscape

I am not very familiar with web application development, and so I don't recall the whole collection of cloud companies that competed with Heroku in the 2010s.
Nor do I have any intuition about current offerings today, like Render, Fly.io, Railway, or Azure.

I briefly looked at Azure's free tier, and hats off to the Microsoft marketing writers for quickly removing this as an option.
Truly the most efficient I've felt using their software or sites in a good long while.
Azure has two flavors of free, at least there were when I checked, and they differ in both what features are included and how much usage of each has zero cost.
As a hobbyist, I am not ready for an _Enterprise™️_ partner or their lingo or their rent-seeking.

Continuing to comparatively evaluate each company from search results seems like it could grow into a grueling, confusing effort that would drain my free time and energy.
I'm doing this more for the vibes than for the closed-form solution.

## Trust a domain leader

So I just went with [T3 Stack's](https://github.com/t3-oss/create-t3-app) direct [recommendation](https://create.t3.gg/en/deployment/vercel) to use [Vercel](https://vercel.com/home) because he's a large streamer with deep, varied experience and opinions in this domain.
Reading through Vercel's documentation, it looks like I can experiment with their [Express](https://vercel.com/docs/frameworks/backend/express) backend as the replacement for Heroku's Dyno.

### It's init, isn't it?

Vercel _develops_ [Next.js](https://nextjs.org/), and so their business depends on running well with Node.js.
Building with Node.js means building with JavaScript and TypeScript and using the package managers for that ecosystem.
Rather than survey npm and alternatives, I again trusted the experts and followed the various getting started guides.

But those early **git** tutorials _really_ incepted developers to adopt the **`init`** command in their tooling.

## Getting started with Vercel

The [getting started page](https://vercel.com/docs/getting-started-with-vercel) is brief and clear for an experienced audience.
But I am not in that audience.
There are steps _before_ these that I need to learn and do.

### Install Node.js

My experience as an engineer reminds me ... _haunts_ me with ...  _"you'll never use just **one** version of **any** runtime"_.
So I searched for [the tool](https://www.nvmnode.com/cli/) that installs Node.js.

```powershell
# Install the Node.js Version Manager
choco install nvm

# Install latest version of stable Node.js
nvm install latest

# Enable that version
nvm use 26.4.0
```

When installing Node.js, it's best to _not_ install Node.js.

### Install a package manager

I am approaching the beginning of **Step 1** in Vercel's guide when they immediately use a command I've never seen.

While I am equipped to _run_ Node.js code, I cannot yet _author_ any.
I can't do any meaningful work until I can reuse other people's code to help me sleep-sort integers by their evenness.
To get these long-suffering production-hardened components, I need a manager for their published packages.

I need a _package_ manager in addition to a version manager.

Thankfully, Vercel's guide made the decision of [which Node.js package manager](https://pnpm.io/) to use for me: `pnpm`.
Unfortunately, the `choco` installer package for it has [a bug](https://github.com/MKMZ/ChocolateyPackages/issues/6) that prevents it from installing the latest major version.
So I'll use `winget` for this one.

```powershell
# Install pnpm
winget install --exact --id pnpm.pnpm
pnpm self-update

# Prepare global tool folder
pnpm setup

# Install Vercel CLI
pnpm add --global vercel
```

But there's a typo in Vercel's command because the `install` command has [no `-g` option](https://pnpm.io/10.x/cli/install).
The `install` command appears to install the dependencies of the working directory's Node.js project, but I don't have a project yet.
It's possible that Vercel expects people to install this package as a dependency in their pre-existing project, but that doesn't explain the `-g` option.

The [`add` command](https://pnpm.io/10.x/cli/add) **does** have a `-g` or `--global` option, however.
This command appears to include the specified package as a dependency in the working directory's project.
But the `--global` option skips that entirely and instead installs it as a callable system tool.
This seems like the intended outcome.

### Reinstall the version manager

Reading the [feature page](https://pnpm.io/feature-comparison), I learned that `pnpm` can also manage versions of Node.js.
It's _both_ a version manager and a package manager.
So I removed `nvm` and used `pnpm` to install Node.js.

```powershell
# Remove nvm's Node.js
nvm uninstall 26.4.0

# Remove nvm
choco uninstall nvm

# Install pnpm's Node.js
pnpm runtime set node latest --global

# Install pnpm's npm
pnpm add --global npm
```

### Create a project

It's init time, innit?

```powershell
# Set up a repo
mkdir vercel-preview
cd vercel-preview

# Init git
git init

# Init Vercel example for Express
vercel init express
```

### Inspect the example

```powershell
# Use Vercel to build and host the app locally
vercel dev

# Hello app
curl http://localhost:3000/
Hello Express!

# Get fake user
curl http://localhost:3000/api/users/wireddown
{"id":"wireddown"}

# Get fake post comment
curl http://localhost:3000/api/posts/8647/comments/1312
{"postId":"8647","commentId":"1312"}
```

The example shows three HTTP GET end points that can extract request parameters from URL segments.

```javascript
import express from 'express'

const app = express()

app.get('/', (_req, res) => {
  res.send('Hello Express!')
})

app.get('/api/users/:id', (_req, res) => {
  res.json({ id: _req.params.id })
})

app.get('/api/posts/:postId/comments/:commentId', (_req, res) => {
  res.json({ postId: _req.params.postId, commentId: _req.params.commentId })
})

export default app
```

I briefly deployed the app publicly and it behaved the same.

## Implement GitHub OAuth

Just like the draw-the-rest-of-the-owl meme, I used [this GitHub tutorial](https://docs.github.com/en/apps/creating-github-apps/writing-code-for-a-github-app/building-a-login-with-github-button-with-a-github-app) as a resource to implement the web flow authentication.
The basic sequence was

- [Register](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/registering-a-github-app) a new GitHub App for the blog comments
- Write the Vercel code that uses the app's secret to [exchange a login code for a user token](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
- Run the Vercel code in the production environment
  - I didn't want to follow the preview redirects or setup a reverse proxy
  - And you either test in prod or live a lie 🌈⭐
- Update the blog's javascript and settings to use the new authentication flow
- Use the Vercel logs and browser console to identify bugs

### The app

The Express app is 30 lines and doesn't have any other package dependencies.
It requires three environment variables.

- `ORIGIN_HOST` -- _the URL of the site's host like **https://downtothewire.io**_
- `GH_CLIENT_ID` -- _the **Client ID** of the GitHub App_
- `GH_CLIENT_SECRET` -- _the **Client Secret** of the GitHub App_

[**`github-app.ts`**]({{ site.baseurl }}/assets/gallery/posts/github-app.ts)
```javascript
import express from "express"

const app = express()

app.get("/exchange_token/:user_code", async (req, res) => {
  const allowed_origin = process.env.ORIGIN_HOST ?? ""
  res.header("Access-Control-Allow-Origin", allowed_origin)

  const oauth_token_params = {
    "client_id": process.env.GH_CLIENT_ID ?? "",
    "client_secret": process.env.GH_CLIENT_SECRET ?? "",
    "code": req.params.user_code,
  }
  const oauth_token_url = "https://github.com/login/oauth/access_token"
  const oauth_token_response = await fetch(oauth_token_url, {
    method: "POST",
    headers: {
      "Accept": "application/json",
    },
    body: new URLSearchParams(oauth_token_params),
  });
  if (!oauth_token_response.ok) { console.log(oauth_token_response); return res.sendStatus(400) }

  const oauth_token_result = await oauth_token_response.json();
  if (oauth_token_result.access_token === undefined) { return res.sendStatus(500) }

  const response_details = {
    "token": oauth_token_result.access_token,
  }
  res.json(response_details)
})

export default app
```

## Vercel recipe

If you want to deploy this app on Vercel for your own site, follow this recipe.

```powershell
# Begin from a new Express template
vercel init express new-github-app
cd new-github-app
pnpm install

# Create and configure a new Vercel project
# The project's name becomes part of the URL: the-project-name.vercel.app
vercel

# Add environment variables to the Vercel project
# ORIGIN_HOST
# GH_CLIENT_ID
# GH_CLIENT_SECRET

# Replace the template's source code with the GitHub app
cp github-app.ts src/index.ts

# Update preview environment
vercel

# Publish to production
vercel --prod
```

Throw in a `git init` with `add` and `commit` if you want to version control it or publish it somewhere.
Otherwise, you can delete the folder and revisit the source in its Vercel deployment view.

## TTFN

So that was a another dev-procedural with some twists and turns, _BUT!_

<span style="color: var(--oc-violet-4)">( •\_•)>⌐■-■</span> &nbsp; What was once ... _unknow-ed_ ... to me has now become ... _Node_  &nbsp; <span style="color: var(--oc-violet-4)">(⌐■\_■)</span>

Thanks for reading.
