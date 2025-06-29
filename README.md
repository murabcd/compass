<h1 align="center">Compass</h1>

<p align="center">
  Open source AI-powered recruiting platform for modern talent acquisition teams.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#model-provider"><strong>Model Provider</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a>
</p>
<br/>

## Features

- [Tanstack Start](https://tanstack.com/start/latest)
  - File-based routing, type-safe from server to client
  - Built on Vite for a lightning-fast HMR development experience
- [OpenAI](https://openai.com/)
  - Leverages OpenAI's powerful models for generation.
  - Direct API calls for text generation and other AI features.
- [Shadcn/ui](https://ui.shadcn.com)
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - Component primitives from [Radix UI](https://radix-ui.com) for accessibility and flexibility

## Model Provider

This app utilizes the [OpenAI API](https://openai.com/) for its AI capabilities. You will need to provide your own OpenAI API key in the environment variables.

## Deploy Your Own

You can deploy your own version of Compass to a hosting provider like Vercel or Netlify.

## Running locally

You will need to use environment variables to run Compass. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for this, but a local `.env` file is also sufficient.

> Note: You should not commit your `.env` file as it may expose secrets that could compromise your accounts.

1. Install dependencies:

```bash
bun install
```

2. If using Vercel for environment variables:
   a. Install Vercel CLI: `bun i -g vercel`
   b. Link local instance: `vercel link`
   c. Download environment variables: `vercel env pull`

3. Start the development server:

```bash
bun dev
```

Your app should now be running on [localhost:3000](http://localhost:3000/).
