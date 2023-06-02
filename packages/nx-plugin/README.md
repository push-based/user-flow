# Nx plugin to execute lighthouse user flows

Run generators, executors and helper code to seamlessly integrate user flow into your Nx workspace.

## Quick Start

1. Add `user-flow-nx-plugin` to your project. It will unlock generators, executors and migrations for a seamless DX:

    ```bash
    npm install --save-dev user-flow-nx-plugin
    nx generate user-flow-nx-plugin:install
    ```

2. Add a target to your project and configure it.

   ```sh
   nx generate user-flow-nx-plugin:target --targetName=xyz
   ```

2.1 To test out the result before changing your code add `--dry-run` to the options

## Install user flows in your Nx workspace

You can easily use the generators to setup user flows in the workspace.

run:  
`nx generate user-flow-nx-plugin:install`

This should add the necessary dependencies your `package.json`.

```shell
>  NX  Generating @push-based/user-flow-nx-plugin:install

Adding packages
UPDATE package.json
```

In your workspace `package.json` you will find the packages added.
Now you can go and setup user-flows under a target or generate tests over the CLI.

## Add a target to execute user flows in a project

You have to add a target over the generator to be able to execute user-flows.

run:  
`nx generate user-flow-nx-plugin:target e2e`

This should add the new target to your `project.json`.

```shell
>  NX  Generating @push-based/user-flow-nx-plugin:target [target-name-here]

? What project would you like to add your target to? …
project-name

Adding target e2e to project project-name
UPDATE packages/project-name/project.json
```

In your workspace `project.json` you will find the target added.
Now you can go and execute the target over the CLI.

## Execute user flows as Nx target

To execute user flows you need to have a target set up as pre-condition.

`npx [target-name] [project-name]`

This should add the new target to your `project.json`.

```shell
> nx run user-flow-ci-integration:ux-e2e

 >  NX   Successfully ran target [target-name] for project [project-name]
```

You will find the artefacts in your configured outpath, by default `dist/user-flow`.

### Executor Options

| Option                 | Type      | Default     | Description                                                                                    |  
|------------------------|-----------|-------------|------------------------------------------------------------------------------------------------|  
| **`--help`**, **`-h`** | `boolean` | `undefined` | Show help                                                                                      |  
| **`--cliMode`**,       | `string`  | `DEFAULT`   | CLI mode for execution of user-flows  `SANDBOX`. This is useful when you debug or write tests. |  
| **`--ouputPath`**      | `boolean` | `undefined` | Alias for `--outPath`.                                                                         |  

Other available options are listed under [collect command](./packages/cli/docs/command-collect.md) options.

