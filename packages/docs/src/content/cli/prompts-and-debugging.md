Beyond the command options, the CLI has a few conventions that make it quicker to work with: keyboard shortcuts in prompts, multi-value options, boolean negation and verbose logging.

## Prompts

When a required value is missing and the CLI runs interactively it asks for it. Single-value prompts take text input. Multi-select prompts, such as the report format, support these keys (see the [enquirer multiselect reference](https://github.com/enquirer/enquirer/blob/master/docs/prompts/multiselect.md) for more):

| Key                          | Effect                                          |
| ---------------------------- | ----------------------------------------------- |
| <kbd>space</kbd>             | Toggle the highlighted choice.                  |
| <kbd>0</kbd> to <kbd>9</kbd> | Move to the choice at that index and toggle it. |
| <kbd>a</kbd>                 | Toggle all choices.                             |
| <kbd>i</kbd>                 | Invert the current selection.                   |
| <kbd>g</kbd>                 | Toggle the current choice group.                |

To avoid prompts altogether, run with `--interactive false` (or `-i false`). The CLI then uses the suggested default for every question, or fails with a clear error when there is no sensible default. This is the automatic behaviour in CI mode; see [CLI modes](/docs/cli/overview#cli-modes).

## Options with several values

Options that accept a list, such as `--format`, are set by repeating the flag:

```bash
npx user-flow collect -f md -f json
```

## Negating booleans

Every boolean option can be switched off by prefixing its name with `no-`. This is useful to override a default or a value coming from the environment:

```bash
npx user-flow collect --no-dryRun
npx user-flow collect --no-openReport
npx user-flow init --no-generateFlow
```

## Verbose logging

`--verbose` (`-v`) prints what the CLI is doing: the resolved configuration, the flows it found, the steps it runs and where it writes reports.

```bash
npx user-flow collect --verbose
```

Combined with `init` it is a quick way to print an rc file:

```bash
npx user-flow init --rcPath .user-flowrc.ci.json --verbose
```

## Logging from a flow

The package exports `logVerbose`, a helper that prints its arguments only when the CLI runs with `--verbose`. Use it inside flows to trace interactions without cluttering normal runs:

```typescript title="user-flows/order-coffee.uf.mts"
import { logVerbose, UserFlowProvider } from '@push-based/user-flow';

export default {
  flowOptions: { name: 'Order coffee' },
  interactions: async ({ flow, page, collectOptions }) => {
    await flow.navigate(collectOptions.url);
    logVerbose('Navigation done, selecting a coffee');
    await page.click('[data-test=Cappucino]');
  },
} satisfies UserFlowProvider;
```

```bash
npx user-flow collect            # prints nothing from logVerbose
npx user-flow collect --verbose  # prints "Navigation done, selecting a coffee"
```

## Faster iterations with dry runs

The single biggest time saver while writing a flow is `--dryRun`. Chrome starts and every interaction runs, but Lighthouse measurements are replaced by mock data. Combine it with `stdout` output for the quickest possible check:

```bash
npx user-flow collect --dryRun --format stdout
```
