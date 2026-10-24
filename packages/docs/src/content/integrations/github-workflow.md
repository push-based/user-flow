With a few steps your user flows run on every pull request and the Markdown report is posted as a comment. Reviewers see the performance impact of a change next to the code.

![A pull request with a user flow report comment](https://user-images.githubusercontent.com/10064416/216605948-b8fffdda-3459-48c9-975a-75ec95544d30.png)

If GitHub Actions are new to you, start with the [GitHub Actions features](https://github.com/features/actions) page. The action used here is published on the [marketplace](https://github.com/marketplace/actions/lighthouse-user-flow-ci-action).

## 1. Make sure the flow runs locally

The workflow needs a working `.user-flowrc.json` and at least one flow, as set up in the [Quick start](/docs/getting-started/quick-start). Verify the setup with a dry run that prints to the console:

```bash
npx user-flow collect --dryRun --format stdout
```

Add `--rcPath path/to/.user-flowrc.json` if the rc file is not in the repository root. When the steps show up without errors you are ready.

## 2. Generate the workflow

`init` can write the workflow file for you:

```bash
npx user-flow init --generateGhWorkflow
```

This creates `.github/workflows/user-flow-ci.yml`. A complete, up-to-date version of it looks like this:

```yaml title=".github/workflows/user-flow-ci.yml"
name: user-flow-ci

on:
  pull_request:

jobs:
  user-flow:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci

      - name: Install Chrome for Puppeteer
        run: npx puppeteer browsers install chrome

      - name: Run user flows
        uses: push-based/user-flow-gh-action@v0.3.2
        with:
          # defaults to .user-flowrc.json in the repository root
          rcPath: .user-flowrc.json
```

What the pieces do:

- **`permissions`** lets the action comment on the pull request.
- **`npx puppeteer browsers install chrome`** downloads the Chrome build Lighthouse needs. Runners do not ship a compatible build.
- **`push-based/user-flow-gh-action`** runs `collect` in CI mode, so prompts are off and reports are not opened, and attaches the Markdown summary to the PR.

> [!NOTE]
> The CLI detects the `CI` environment variable that GitHub Actions sets and switches to [CI mode](/docs/cli/overview#cli-modes) on its own. You do not need `--interactive false` or `--no-openReport` in the workflow.

## 3. Test the setup

Open a pull request. The workflow appears in the checks of the PR and runs your flows:

![The action is executing](https://user-images.githubusercontent.com/10064416/216594684-ea9e3a5e-007e-47d6-b438-c16d2158f940.PNG)
![The action completed](https://user-images.githubusercontent.com/10064416/216594803-65cb2cfd-1924-44ae-84ec-8b1d09e49ada.PNG)

When it finishes, the Markdown report is attached to the pull request as a comment:

![The report comment on the pull request](https://user-images.githubusercontent.com/10064416/216596391-35a041e2-9839-4cf5-b8c5-b55e93cb622e.PNG)

## Alternative: post the report yourself

If you need more control, run the CLI directly and post the `md` report with a sticky comment action. This is what the user-flow repository does for its own [github-report example](https://github.com/push-based/user-flow/tree/main/examples/github-report). The rc file requests only the Markdown format:

```json title="examples/github-report/.user-flowrc.json"
{
  "collect": {
    "url": "https://coffee-cart.netlify.app/",
    "ufPath": "./examples/github-report/user-flows"
  },
  "persist": {
    "outPath": "./examples/github-report/measures",
    "format": ["md"]
  }
}
```

The workflow collects the report and hands the file to [`marocchino/sticky-pull-request-comment`](https://github.com/marocchino/sticky-pull-request-comment), which replaces its previous comment on every run instead of adding a new one:

```yaml title=".github/workflows/user-flow-md-report.yml"
name: user-flow-md-report

on:
  pull_request:

jobs:
  report:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci

      - name: Collect report
        run: npx user-flow --rcPath ./examples/github-report/.user-flowrc.json --openReport false

      - name: Add report as PR comment
        uses: marocchino/sticky-pull-request-comment@v2
        with:
          hide_and_recreate: true
          header: user-flow-report
          path: ./examples/github-report/measures/*.md
```

![The sticky report comment produced by the example](images/github-report-comment.png)

## Measuring a preview deployment

Pass the URL of the deployment under test to the CLI instead of hard coding it in the rc file. Most hosting providers expose the preview URL as an output of their deploy step:

```yaml
- name: Run user flows against the preview
  run: npx user-flow --url ${{ steps.deploy.outputs.url }} --format md --format html
```

Upload the HTML report as a workflow artefact if you want the full Lighthouse UI for a run:

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: user-flow-reports
    path: measures
```
