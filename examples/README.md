# Generative.js Examples

Example built using Generative.js + Vite + React + Typescript.

## Try online

Go to https://generativejs.dev/examples

## Try locally

- Clone this repo 
- Install dependencies using pnpm. 
  - Generative.js uses PNPM workspaces. 
  - Running ```pnpm install``` in any directory will update dependencies in all packages. 
- Add secrets in `.env` file. 
  - See `.env.example` for requirements
- Run vite from the `./examples` directory
  - ```pnpm run dev```

## How to add a new example

Examples are defined in `./src/index.json`. `index.json` list example so they can be copied to the doc site and loaded by the router in `./src/main.tsx`.

Create a new entry in `./src/index.json`.

Add your example source in a new subdirectory in `./src` with the chosen slug. e.g. `./src/<slug>`.







