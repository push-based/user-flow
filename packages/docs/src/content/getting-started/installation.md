The CLI runs inside an npm project. It needs Node.js and a folder to keep flows and reports in.

## Requirements

- **Node.js 22.19 or newer.** Check with `node -v` and `npm -v`.
- **Chrome.** Lighthouse drives Chrome through Puppeteer. Puppeteer downloads a matching Chrome build during installation; on a CI runner you may need to trigger that explicitly; see [GitHub workflow](/docs/integrations/github-workflow).

## Install in an existing project

Add the package as a development dependency:

```bash
npm i @push-based/user-flow --save-dev
```

or with Yarn:

```bash
yarn add @push-based/user-flow --dev
```

Afterwards the `user-flow` binary is available through `npx`:

```bash
npx user-flow --help
```

## Run without installing

For one-off runs or CI jobs you can execute the package directly:

```bash
npx @push-based/user-flow --help
```

The rest of these docs use the short `npx user-flow` form and assume the package is installed.

## Start from an empty folder

If you prefer to keep user flows out of your application repository, create a dedicated project for them.

1. Create a folder, for example `user-flow-demo`, and initialise npm inside it:

   ```bash
   mkdir user-flow-demo && cd user-flow-demo
   npm init -y
   ```

2. Install the CLI:

   ```bash
   npm i @push-based/user-flow --save-dev
   ```

3. Verify the installation:

   ```bash
   npx user-flow --version
   ```

From here the [Quick start](/docs/getting-started/quick-start) applies in exactly the same way. Point `url` at the application you want to measure; it does not have to live in the same repository.

## Nx workspaces

Nx users can skip the manual setup and let the [Nx plugin](/docs/integrations/nx-plugin) install the dependency and generate a target:

```bash
npm install --save-dev @push-based/user-flow-nx-plugin
nx generate @push-based/user-flow-nx-plugin:init
```
