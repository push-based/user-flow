`init` prepares a project for the CLI. In a fresh project it guides you through the configuration and writes the rc file. In a project that already has a `.user-flowrc.json` it walks through the prompts again so you can reconfigure or migrate settings. On top of that it scaffolds the files you need to get going: an example flow and a GitHub workflow.

```bash
npx user-flow init [options]
```

## Options for the rc file

Every `collect` option can also be passed to `init`. A value given on the command line skips the corresponding prompt and is written straight into the rc file.

| Option               | Alias | Type     | Default        | Writes                                                 |
| -------------------- | ----- | -------- | -------------- | ------------------------------------------------------ |
| `--url`              | `-t`  | `string` |                | `collect.url`                                          |
| `--ufPath`           | `-u`  | `string` | `./user-flows` | `collect.ufPath`                                       |
| `--outPath`          | `-o`  | `string` | `./measures`   | `persist.outPath`                                      |
| `--format`           | `-f`  | `string` | `html`         | `persist.format`. Repeat the flag for several formats. |
| `--configPath`       | `-c`  | `string` |                | `collect.configPath`                                   |
| `--serveCommand`     | `-s`  | `string` |                | `collect.serveCommand`                                 |
| `--awaitServeStdout` | `-a`  | `string` |                | `collect.awaitServeStdout`                             |

## Options for scaffolding

| Option                 | Alias | Type      | Description                                          |
| ---------------------- | ----- | --------- | ---------------------------------------------------- |
| `--generateFlow`       | `-h`  | `boolean` | Create `basic-navigation.uf.mts` inside `ufPath`.    |
| `--generateGhWorkflow` | `-g`  | `boolean` | Create `user-flow-ci.yml` under `.github/workflows`. |

## Create an rc file without prompts

Supplying every value makes `init` fully non-interactive, which is useful in setup scripts:

```bash
npx user-flow init --url http://test.io --ufPath user-flows --format json --outPath measures
```

For several formats, repeat the flag:

```bash
npx user-flow init --url http://test.io --format json --format md --outPath tmp/user-flows
```

## Update an existing rc file

Point `--rcPath` at the file you want to change and pass only the values that should differ. Existing values are kept:

```bash
npx user-flow init --rcPath .user-flowrc.ci.json --outPath tmp/measures
```

> [!TIP]
> Combine `init` with `--verbose` to print the resolved rc file without changing anything:
> `npx user-flow init --rcPath .user-flowrc.ci.json --verbose`

## Scaffold an example flow

```bash
npx user-flow init --generateFlow
```

This writes `basic-navigation.uf.mts` to the folder configured as `collect.ufPath`. The file navigates to the configured URL and is the starting point used in the [Quick start](/docs/getting-started/quick-start). Pass `--no-generateFlow` to skip both the file and the prompt.

## Scaffold a GitHub workflow

```bash
npx user-flow init --generateGhWorkflow
```

This writes `.github/workflows/user-flow-ci.yml`, a workflow that runs the CLI on every pull request with the [user-flow GitHub action](https://github.com/marketplace/actions/lighthouse-user-flow-ci-action). See [GitHub workflow](/docs/integrations/github-workflow) for the full setup, including PR comments. Pass `--no-generateGhWorkflow` to skip it.
