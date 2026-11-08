Every run produces one report per flow in each configured format. Choose formats in the rc file under `persist.format` or per run with `--format`.

```bash
# one format
npx user-flow collect --format html

# several formats at once
npx user-flow collect --format html --format json
```

```json title=".user-flowrc.json"
{
  "persist": {
    "outPath": "./measures",
    "format": ["html", "json"]
  }
}
```

## The four formats

| Format   | File                  | Best for                                                                                                           |
| -------- | --------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `html`   | `<flow-name>.uf.html` | Reading a report in the browser. It is a single self-contained file with the full Lighthouse UI for every step.    |
| `json`   | `<flow-name>.uf.json` | Programmatic processing, archiving and the Lighthouse viewer. Most other features of the CLI build on this format. |
| `md`     | `<flow-name>.uf.md`   | Pull request comments and chat messages. It summarises each step and its category scores in a table.               |
| `stdout` |                       | Quick checks in the terminal and CI logs. Same content as `md`, printed to the console.                            |

The same run, in each format:

<!-- diagram: report-formats -->

Example files from the repository: [order-coffee.json](https://github.com/push-based/user-flow/blob/main/packages/cli/docs/raw/order-coffee.json), [order-coffee.html](https://github.com/push-based/user-flow/blob/main/packages/cli/docs/raw/order-coffee.html) and [order-coffee.md](https://github.com/push-based/user-flow/blob/main/packages/cli/docs/raw/order-coffee.md).

## Opening reports

By default the CLI opens the report as soon as the run finishes. HTML opens in the browser, JSON and Markdown in your text editor. Turn it off with `--no-openReport` or `-e false`; in CI mode it is off already.

> [!TIP]
> If only a JSON report is configured, `--openReport` serves it through the Lighthouse report viewer instead, so you still get the visual report.

## The Lighthouse viewer

A JSON report can be dragged and dropped into the [Lighthouse viewer](https://googlechrome.github.io/lighthouse/viewer/) at any time. This is handy for reports that were produced in CI and stored as artefacts.

![The Lighthouse viewer, waiting for a JSON report to be dropped](images/lighthouse-viewer-drop.png)

## Reading a report

Each step in a flow appears in the report with the icon of its measurement mode and the category scores that mode supports.

![The summary of a user flow report: one navigation, three timespans and three snapshots, each with its mode icon and scores](images/report-steps.png)

See [Basic user flows](/docs/user-flows/basics) for what each mode measures and [Understanding the Lighthouse result](https://github.com/GoogleChrome/lighthouse/blob/master/docs/understanding-results.md) for the structure of the JSON.
