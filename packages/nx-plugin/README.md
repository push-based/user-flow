# Nx plugin to execute lighthouse user flows

Run generators, executors and helper code to seamlessly integrate user flow into your Nx workspace.

## Quick Start

1. Add `@push-based/user-flow-nx-plugin` to your project. It will unlock generators, executors and migrations for a
   seamless DX:

```bash  
npm install --save-dev @push-based/user-flow-nx-plugin
nx generate @push-based/user-flow-nx-plugin:init
```  

2. Add a target to your project and configure it.

 ```sh  
  nx generate @push-based/user-flow-nx-plugin:target
 ```

optionally provide a different target name

```sh
   nx generate @push-based/user-flow-nx-plugin:target --targetName=xyz
```

2.1 To test out the result before changing your code add `--dry-run` to the options

## Init user flows in your Nx workspace

You can easily use the generators to setup user flows in the workspace.

run:
`nx generate @push-based/user-flow-nx-plugin:init`

This should add the necessary dependencies your `package.json`.

```shell
>  NX  Generating @push-based/user-flow-nx-plugin:install

Adding packages
UPDATE nx.json
UPDATE package.json
```

In your workspace `package.json` you will find the packages added.
You can find the details about the executor options under [Executor Options](#Executor-Options).

In your `nx.json` you will find the generator defaults. You can set the workspace base configurations.

Now you can go and setup user-flows under a target or generate tests over the CLI.

## Add a target to execute user flows in a project

You have to add a target over the generator to be able to execute user-flows.

run:  
`nx generate @push-based/user-flow-nx-plugin:target`

This should add the new target to your `project.json`.

```shell
>  NX  Generating @push-based/user-flow-nx-plugin:target [target-name-here]

? What project would you like to add your target to? …
project-name

Adding target user-flow to project project-name
UPDATE packages/project-name/project.json
```

In your workspace `project.json` you will find the target added.
Now you can go and execute the target over the CLI.

## Execute user flows as Nx target

To execute user flows you need to have a target set up as pre-condition.

`npx user-flow [project-name]`

This should add the new target to your `project.json`.

```shell
> nx run user-flow-gh-integration:user-flow

 >  NX   Successfully ran target user-flow for project [project-name]
```

You will find the artefacts in your configured outpath, by default `dist/user-flow`.

### Executor Options

| Option                 | Type      | Default     | Description                                                                                    |  
|------------------------|-----------|-------------|------------------------------------------------------------------------------------------------|  
| **`--help`**, **`-h`** | `boolean` | `undefined` | Show help                                                                                      |  
| **`--targetName`**,    | `string`  | `user-flow` | The target name for user-flow execution                                                        |  
| **`--projectName`**,   | `string`  | `user-flow` | The project name to add the user-flow target                                                   |  
| **`--cliMode`**,       | `string`  | `DEFAULT`   | CLI mode for execution of user-flows  `SANDBOX`. This is useful when you debug or write tests. |  
| **`--ouputPath`**      | `boolean` | `undefined` | Alias for `--outPath`.                                                                         |  

Other available options are listed under [collect command](./packages/cli/docs/command-collect.md) options.

