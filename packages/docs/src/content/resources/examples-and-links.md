## Examples in the repository

| Example                                                                                                      | What it shows                                                                                               |
| ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| [`packages/user-flow-example`](https://github.com/push-based/user-flow/tree/main/packages/user-flow-example) | Fixtures, UFOs and flows for the coffee cart demo, plus DevTools recordings and the flows that replay them. |
| [`examples/github-report`](https://github.com/push-based/user-flow/tree/main/examples/github-report)         | A minimal flow executed in a GitHub workflow with the Markdown report posted as a sticky PR comment.        |
| [`packages/cli/docs/raw`](https://github.com/push-based/user-flow/tree/main/packages/cli/docs/raw)           | Raw reports in every format for the "order coffee" flow, useful to see what the output looks like.          |

## Real-world usage

- [angular-movies](https://github.com/tastejs/angular-movies/tree/main/projects/movies-user-flows/src) keeps its user flows in a dedicated project and uses the UFO architecture for a production Angular application.

## Related projects

<!-- cards -->

- [user-flow-gh-action](https://github.com/push-based/user-flow-gh-action): The GitHub action that runs the CLI and comments on pull requests.
- [@push-based/user-flow-nx-plugin](https://www.npmjs.com/package/@push-based/user-flow-nx-plugin): The Nx plugin.

## Lighthouse and Chrome DevTools

<!-- cards -->

- [Lighthouse user flows](https://web.dev/lighthouse-user-flows/): Introduces the navigation, timespan and snapshot modes.
- [Understanding the Lighthouse result](https://github.com/GoogleChrome/lighthouse/blob/master/docs/understanding-results.md): Explains the JSON structure.
- [Lighthouse configuration](https://github.com/GoogleChrome/lighthouse/blob/main/docs/configuration.md): Documents every config property.
- [Lighthouse viewer](https://googlechrome.github.io/lighthouse/viewer/): Renders a JSON report in the browser.
- [Chrome DevTools Recorder](https://developer.chrome.com/docs/devtools/recorder/): Records and exports user flows.
- [Recorder features](https://m.youtube.com/watch?v=PupwBARjaYU): The Recorder's features in a short video.

## Getting help

- Open an issue in the [GitHub repository](https://github.com/push-based/user-flow/issues).
- Consulting and workshops on web performance are available from [push-based.io](https://www.push-based.io).
