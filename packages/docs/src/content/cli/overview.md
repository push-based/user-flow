The CLI has two commands, `init` and `collect`, and a handful of global options that apply to both. Running `npx user-flow` without a command executes `collect`.

```bash
npx user-flow [command] [options]
```

| Command                        | Purpose                                                                                 |
| ------------------------------ | --------------------------------------------------------------------------------------- |
| [`init`](/docs/cli/init)       | Create or update `.user-flowrc.json` and scaffold an example flow or a GitHub workflow. |
| [`collect`](/docs/cli/collect) | Execute user flows against a URL and persist the reports. This is the default command.  |

## Global options

| Option          | Alias | Type      | Default                | Description                                                                |
| --------------- | ----- | --------- | ---------------------- | -------------------------------------------------------------------------- |
| `--help`        | `-h`  | `boolean` |                        | Show help for the CLI or for the given command.                            |
| `--version`     |       | `boolean` |                        | Print the CLI version.                                                     |
| `--rcPath`      | `-p`  | `string`  | `./.user-flowrc.json`  | Path to the rc file to read.                                               |
| `--verbose`     | `-v`  | `boolean` | `false`                | Log details about the run, including the resolved configuration.           |
| `--interactive` | `-i`  | `boolean` | `true` (`false` in CI) | When `false`, prompts are skipped and the suggested value is used instead. |

## The rc file

`.user-flowrc.json` is the single place for project defaults. It has two sections that mirror the two halves of a run:

```json title=".user-flowrc.json"
{
  "collect": {
    "url": "https://coffee-cart.netlify.app/",
    "ufPath": "./user-flows",
    "configPath": "./lh-config.json",
    "serveCommand": "npm run serve",
    "awaitServeStdout": "Server available under"
  },
  "persist": {
    "outPath": "./measures",
    "format": ["html", "json"]
  }
}
```

| Property                   | Type       | Description                                                                                           |
| -------------------------- | ---------- | ----------------------------------------------------------------------------------------------------- |
| `collect.url`              | `string`   | The URL the browser opens. Must start with `http://` or `https://`.                                   |
| `collect.ufPath`           | `string`   | A folder of flows or a single flow file.                                                              |
| `collect.configPath`       | `string`   | Path to a Lighthouse config file. See [Lighthouse configuration](/docs/cli/lighthouse-configuration). |
| `collect.config`           | `object`   | A Lighthouse config inlined into the rc file.                                                         |
| `collect.serveCommand`     | `string`   | An npm script that serves the application before measuring.                                           |
| `collect.awaitServeStdout` | `string`   | The console output that signals the serve command is ready.                                           |
| `persist.outPath`          | `string`   | Folder for the reports. Created on demand.                                                            |
| `persist.format`           | `string[]` | Any of `html`, `json`, `md` and `stdout`. See [Report formats](/docs/cli/reports).                    |

**Precedence.** Options given on the command line win over the rc file. Options set inside a flow file, such as a Lighthouse config in `flowOptions`, win over both for that flow.

## Multiple rc files

Because `--rcPath` is a global option you can keep several configurations side by side, for example one for local development and one for CI:

```bash
npx user-flow collect --rcPath .user-flowrc.ci.json
```

## CLI modes

The CLI adapts its defaults to the environment it runs in. It reads the `CI` environment variable to decide:

| Mode      | Detected when                                                            | Defaults                                                                         |
| --------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| `DEFAULT` | `CI` is not set                                                          | Interactive prompts, reports open automatically, `html` format.                  |
| `CI`      | `CI` is `true` or `1` (set by GitHub Actions and most other CI services) | `--interactive false`, `--openReport false`, `--dryRun false`.                   |
| `SANDBOX` | `CI` is `SANDBOX`                                                        | `--verbose`, `--dryRun`, `--openReport false`. Used by the CLI's own test suite. |

In practice this means a plain `npx user-flow` does the right thing on a CI runner without extra flags, while the same command on a laptop opens the report for you.
