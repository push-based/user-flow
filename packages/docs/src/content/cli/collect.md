`collect` executes user flows and takes care of post-processing and persisting the reports. It needs an rc file, or enough command line options to replace one, and runs against remote or local URLs on your machine as well as in CI.

```bash
npx user-flow collect [options]
# collect is the default command, so this is equivalent:
npx user-flow [options]
```

## Options that override the rc file

| Option               | Alias | Type     | Default        | Description                                                          |
| -------------------- | ----- | -------- | -------------- | -------------------------------------------------------------------- |
| `--url`              | `-t`  | `string` |                | URL to analyse.                                                      |
| `--ufPath`           | `-u`  | `string` | `./user-flows` | A flow file or a folder of flow files (`*.uf.mts` or `*.uf.js`).     |
| `--configPath`       | `-c`  | `string` |                | Path to a Lighthouse `config.json`.                                  |
| `--format`           | `-f`  | `string` | `html`         | Report format: `html`, `json`, `md` or `stdout`. Repeat for several. |
| `--outPath`          | `-o`  | `string` | `./measures`   | Output folder for the reports.                                       |
| `--serveCommand`     | `-s`  | `string` |                | npm script that serves the target app. Needs `--awaitServeStdout`.   |
| `--awaitServeStdout` | `-a`  | `string` |                | Console output to wait for before collecting.                        |

## Additional options

| Option         | Alias | Type      | Default | Description                                         |
| -------------- | ----- | --------- | ------- | --------------------------------------------------- |
| `--openReport` | `-e`  | `boolean` | `true`  | Open the report after the run. `false` in CI mode.  |
| `--dryRun`     | `-d`  | `boolean` | `false` | Perform the interactions but skip the measurements. |

> [!NOTE]
> Any boolean option can be negated by prefixing it with `no-`, for example `--no-openReport`. See [Prompts and debugging](/docs/cli/prompts-and-debugging).

## Overriding rc values

Values passed on the command line are used for this run only; the rc file stays untouched:

```bash
npx user-flow collect --url http://test.io --ufPath user-flows --format json --outPath measures
```

Switch between whole configurations with `--rcPath`:

```bash
npx user-flow collect --rcPath .user-flowrc.ci.json
```

And add `--verbose` to see every detail of the run, including the resolved options:

```bash
npx user-flow collect --verbose
```

## url

The page the browser opens first. It is required for every run and must start with `http://` or `https://`.

```bash
npx user-flow collect --url https://my.test.io
```

Inside a flow the value is available as `ctx.collectOptions.url`.

## ufPath

Either a folder, in which case every flow in it runs, or a single file:

```bash
# run every flow in a folder
npx user-flow collect --ufPath ./user-flows/special-folder

# run one flow
npx user-flow collect --ufPath ./user-flows/special-flow.uf.mts
```

## format

The report format or formats to produce. The CLI writes one file per format and flow.

```bash
npx user-flow collect --format md
npx user-flow collect --format md --format html
```

| Format   | Output                                                                                                                                                  |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `json`   | The raw Lighthouse flow result. Drop it into the [Lighthouse viewer](https://googlechrome.github.io/lighthouse/viewer/) or process it programmatically. |
| `html`   | A single self-contained HTML report. The default.                                                                                                       |
| `md`     | A Markdown summary of the steps and their scores. Ideal for PR comments.                                                                                |
| `stdout` | The same summary printed to the console.                                                                                                                |

See [Report formats and viewer](/docs/cli/reports) for examples of each.

## outPath

Folder for the reports. The CLI creates it if it does not exist.

```bash
npx user-flow collect --outPath ./measures
```

## configPath

Path to a Lighthouse configuration file. The file is parsed and passed to Lighthouse for every flow in the run. The same value can live in the rc file under `collect.configPath`.

```bash
npx user-flow collect --configPath ./lh-config.json
```

Details and alternatives are in [Lighthouse configuration](/docs/cli/lighthouse-configuration).

## dryRun

Skips the real measurements and replaces them with mock reports. Chrome still starts and every interaction still runs, so you get fast feedback while writing or debugging a flow.

```bash
npx user-flow collect --dryRun
# switch it off explicitly
npx user-flow collect --no-dryRun
```

A simple two step flow with navigation takes about **3 seconds** in a dry run compared to **53 seconds** with measurements. Reports are produced in all configured formats, with dummy numbers.

## openReport

Opens the generated report on your machine once the run is finished.

```bash
npx user-flow collect --openReport
npx user-flow collect --no-openReport
```

- `html` reports open in the default browser.
- `json` and `md` reports open in the default text editor.

## serveCommand and awaitServeStdout

These two options start your application before the flows run. They only work together.

```bash
npx user-flow collect --serveCommand "npm run serve" --awaitServeStdout "Server available under"
```

- `serveCommand` is executed as a shell command and its output is logged.
- `awaitServeStdout` is a string the CLI waits for in that output. Once it appears the server is considered ready and the flows start.

For an Angular application the serve script might print `Server available under: http://localhost:4200/my-app`, so `"Server available under"` is a good marker. Put both values into the rc file to make `npx user-flow` start the server on its own:

```json title=".user-flowrc.json"
{
  "collect": {
    "url": "http://localhost:4200/",
    "ufPath": "./user-flows",
    "serveCommand": "npm run serve",
    "awaitServeStdout": "Server available under"
  },
  "persist": { "outPath": "./measures", "format": ["html"] }
}
```
