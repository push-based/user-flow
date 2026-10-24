`@push-based/user-flow-nx-plugin` integrates user flows into an [Nx](https://nx.dev) workspace. It provides generators that install the CLI and add a target to a project, and an executor that runs the flows through `nx run`, with caching, `affected` and the rest of the Nx tooling included.

## Quick start

1. Install the plugin and run its `init` generator. It adds the required packages to your `package.json` and generator defaults to `nx.json`:

   ```bash
   npm install --save-dev @push-based/user-flow-nx-plugin
   nx generate @push-based/user-flow-nx-plugin:init
   ```

2. Add a `user-flow` target to a project:

   ```bash
   nx generate @push-based/user-flow-nx-plugin:target
   ```

   Optionally choose a different target name:

   ```bash
   nx generate @push-based/user-flow-nx-plugin:target --targetName=perf
   ```

3. Run it:

   ```bash
   nx run my-project:user-flow
   ```

> [!TIP]
> Add `--dry-run` to any generator call to preview the changes before anything is written.

## The init generator

```bash
nx generate @push-based/user-flow-nx-plugin:init
```

```text
>  NX  Generating @push-based/user-flow-nx-plugin:init

Adding packages
UPDATE nx.json
UPDATE package.json
```

The generator adds `@push-based/user-flow` to the workspace dependencies and registers defaults for the plugin's generators in `nx.json`. Edit those defaults to change the base configuration for every target you generate later.

| Option              | Type      | Default | Description                                |
| ------------------- | --------- | ------- | ------------------------------------------ |
| `--skipPackageJson` | `boolean` | `false` | Do not add dependencies to `package.json`. |

## The target generator

```bash
nx generate @push-based/user-flow-nx-plugin:target
```

```text
>  NX  Generating @push-based/user-flow-nx-plugin:target

? What project would you like to add your target to? … my-project
? What URL you want to target? … https://coffee-cart.netlify.app/

Adding target user-flow to project my-project
UPDATE packages/my-project/project.json
```

| Option          | Type     | Default                            | Description                                                  |
| --------------- | -------- | ---------------------------------- | ------------------------------------------------------------ |
| `--projectName` | `string` |                                    | The project that receives the target. Prompted when missing. |
| `--targetName`  | `string` | `user-flow`                        | Name of the generated target.                                |
| `--url`         | `string` | `https://coffee-cart.netlify.app/` | The URL the flows run against. Prompted when missing.        |

The generator writes an empty `.user-flowrc.json` into the project root (it stops with an error if one already exists, so your configuration is never overwritten) and adds a target that uses the plugin's executor:

```json title="packages/my-project/project.json"
{
  "targets": {
    "user-flow": {
      "executor": "@push-based/user-flow-nx-plugin:user-flow",
      "outputs": ["{options.outputPath}"],
      "options": {
        "url": "https://coffee-cart.netlify.app/",
        "rcPath": "packages/my-project/.user-flowrc.json",
        "ufPath": "packages/my-project/user-flows",
        "outputPath": "dist/user-flow/packages/my-project",
        "format": ["md"]
      }
    }
  }
}
```

Because `outputs` is declared, Nx caches the reports and restores them on a cache hit. Create the `user-flows` folder in the project and add your first flow, for example by running `npx user-flow init --rcPath packages/my-project/.user-flowrc.json --generateFlow`.

## The executor

The executor runs `collect` with the options from the target. Every option of the CLI's [`collect` command](/docs/cli/collect) is available, plus a few that are specific to the executor.

```bash
nx run my-project:user-flow
```

```text
> nx run my-project:user-flow

 >  NX   Successfully ran target user-flow for project my-project
```

Reports land in the configured `outputPath`, by default below `dist/user-flow`.

### Executor options

| Option             | Type       | Description                                                                                                              |
| ------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| `rcPath`           | `string`   | Path to the `.user-flowrc.json`. **Required.**                                                                           |
| `outputPath`       | `string`   | Output folder for the reports. **Required.** Alias for the CLI's `outPath`.                                              |
| `url`              | `string`   | Target URL.                                                                                                              |
| `ufPath`           | `string`   | Flow file or folder.                                                                                                     |
| `configPath`       | `string`   | Path to a Lighthouse `config.json`.                                                                                      |
| `format`           | `string[]` | Report formats: `html`, `json`, `md`, `stdout`.                                                                          |
| `serveCommand`     | `string`   | npm script that serves the app. Needs `awaitServeStdout`.                                                                |
| `awaitServeStdout` | `string`   | Console output to wait for before collecting.                                                                            |
| `openReport`       | `boolean`  | Open the report after the run.                                                                                           |
| `dryRun`           | `boolean`  | Skip measurements.                                                                                                       |
| `verbose`          | `boolean`  | Verbose logging.                                                                                                         |
| `interactive`      | `boolean`  | Enable prompts.                                                                                                          |
| `cliMode`          | `string`   | Force a [CLI mode](/docs/cli/overview#cli-modes): `DEFAULT`, `CI` or `SANDBOX`. Useful while debugging or writing tests. |

Options can be overridden on the command line like any Nx target option:

```bash
nx run my-project:user-flow --dryRun --format=stdout
nx run my-project:user-flow --url=http://localhost:4200
```

## Serving the app from the target

Combine the executor with `dependsOn` or with `serveCommand` to make sure the application is running before the flows start. With `serveCommand` the executor starts the server and waits for the ready message, exactly like the CLI does:

```json title="packages/my-project/project.json"
{
  "targets": {
    "user-flow": {
      "executor": "@push-based/user-flow-nx-plugin:user-flow",
      "options": {
        "rcPath": "packages/my-project/.user-flowrc.json",
        "ufPath": "packages/my-project/user-flows",
        "outputPath": "dist/user-flow/packages/my-project",
        "url": "http://localhost:4200/",
        "serveCommand": "nx serve my-project",
        "awaitServeStdout": "Local:"
      }
    }
  }
}
```

## Running in CI

Because the executor is a regular Nx target it participates in `nx affected`. Running only the flows of projects that changed keeps pipelines fast:

```bash
nx affected -t user-flow --format=md
```
