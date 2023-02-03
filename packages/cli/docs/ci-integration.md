# Use user flows in GitHub actions to get performance reports as comment in your PR

If you are not familiar with GitHub actions please read the following content:

- [GitHub action features](https://github.com/features/actions)
- [GitHub action marketplace](https://github.com/marketplace?type=actions&query=user+flow+)

In this document we will learn:
- How to setup user flow for CI
- How to setup a `workflow.yml`
- How to test the setup

## Setup user flow for the CI

As pre-condition we assume you have a correct setup of the CLI as descried in [basic setup](writing-basic-user-flows.md).  
This means you have a `user-flowrc.json` to point to as well as a `flow-name.ts` to execute.

To test if you flow is working quickly run the CLI in 'dry run' and print it to the console to see the test passes:  
`user-flow collect --dryRun --format stdout` optionally use `--rcPath /path/to/user-flowrc.json` if the rc file is not located in root.

If everything works you are good to go!

## How to setup a `workflow.yml`

1. Create a file called `user-flow-ci` and paste the following content:

```yml
name: user-flow-ci
on:
  pull_request:
jobs:
  user-flow-integrated-in-ci:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x]
    steps:
      - uses: actions/checkout@v2
      - name: Executing user-flow CLI
        # without any parameters the rcPath defaults to `.user-flowrc.json`
        uses: push-based/user-flow-gh-action@v0.0.0-alpha.20
```

# How to test the setup
1. If you open a new PR in your repository you should see the runner execution your user-flow in the CI

<img width="672" alt="gh-ci-running" title="Action is executing" src="https://user-images.githubusercontent.com/10064416/216594684-ea9e3a5e-007e-47d6-b438-c16d2158f940.PNG">

2. After the user flow executed you should see a mark down report as comment attached to your PR

<img width="583" alt="gh-ci-complete" title="Action completed" src="https://user-images.githubusercontent.com/10064416/216594803-65cb2cfd-1924-44ae-84ec-8b1d09e49ada.PNG">

made with ❤ by [push-based.io](https://www.push-based.io)
