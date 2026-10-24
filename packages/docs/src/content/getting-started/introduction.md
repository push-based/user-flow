`@push-based/user-flow` is a command line tool and library that organises and runs [Lighthouse user flows](https://web.dev/lighthouse-user-flows/). It measures how a page loads **and** how it behaves while a user interacts with it, then turns the result into reports you can read locally or post into a pull request.

## The problem it solves

A classic Lighthouse run audits one cold page load. Real users do more than that: they open a menu, add an item to a cart, scroll a list. Lighthouse user flows can measure those interactions, but writing them by hand means a lot of Puppeteer boilerplate, report plumbing and CI glue for every project.

user-flow takes that boilerplate away. You describe interactions in a small TypeScript file, the CLI launches Chrome, drives Lighthouse through the flow and writes the report for you.

![Code reduction when switching from a hand-written Lighthouse user flow to user-flow](https://user-images.githubusercontent.com/10064416/197062344-4c49c73b-beed-4a7e-92f9-c4855e9f436d.PNG)

## What you get

- **Runtime performance measurements.** Navigation, timespan and snapshot steps cover page load, interaction and page state. See [Basic user flows](/docs/user-flows/basics).
- **Zero setup cost.** `npx user-flow init` writes the config and an example flow for you. See the [Quick start](/docs/getting-started/quick-start).
- **TypeScript first.** Flows live in `*.uf.mts` files and are compiled on the fly. There is no build step to maintain.
- **Excellent developer experience.** `--dryRun` skips the slow measurements while you iterate, `--verbose` shows what the CLI is doing, and boolean flags can be negated with `--no-`.
- **Ready for CI.** A non-interactive mode, Markdown and stdout reports and a [GitHub action](/docs/integrations/github-workflow) put numbers on every pull request.
- **DevTools Recorder support.** Export a recording from Chrome and [replay it](/docs/user-flows/recorder-exports) without writing any interaction code.
- **An Nx plugin.** Generators and an executor make user flows a target in any [Nx workspace](/docs/integrations/nx-plugin).
- **A scalable architecture.** [UFOs](/docs/user-flows/ufo-architecture) keep selectors, interactions and measurements apart so large suites stay maintainable.
- **Always current.** The CLI tracks the latest Lighthouse and Chrome DevTools features.

## How it fits together

```text
.user-flowrc.json        → where to run, which flows, where to store reports
user-flows/*.uf.mts      → your interactions and measurement steps
npx user-flow collect    → launches Chrome, runs Lighthouse, writes reports
measures/*.html          → the reports (also json, md or stdout)
```

The rc file holds project defaults. Every value in it can be overridden on the command line, which is how the same flows run on a laptop against `localhost` and in CI against a preview deployment.

## Where to go next

1. [Install the CLI](/docs/getting-started/installation) in your project.
2. Follow the [Quick start](/docs/getting-started/quick-start) to run your first flow.
3. Learn the three measurement modes in [Basic user flows](/docs/user-flows/basics).
