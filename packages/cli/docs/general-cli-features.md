# General CLI interaction

## Set up an empty project

If you don't want to maintain your user flows in the same repository the following steps describe how to setup a new
project.
You can skip this steps and go directly to the setup below.

0. Create a new folder e.g. `user-flow-demo` for the user flows and initialize npm: `npm init`

run

```
npm version
```

to check it.  
You should see `'user-flow-demo': '1.0.0',` as first line.

Make sure you have the CLI installed:

```bash
npm i @push-based/user-flow --save-dev
```

now you can run it directly with `user-flow`. Test it:

```bash
npx user-flow --version
```

## Prompts and interaction

We provide general interaction through the keyboard or `stdin` directly for testing and other crazy hacks.

### Multiselect choices

These key combinations can be used on _multiple_ choice prompts.For more details
see [enquirer - multiselect](https://github.com/enquirer/enquirer/blob/master/docs/prompts/multiselect.md)

| **command**       | **description**                                                                                                      |
|-------------------|----------------------------------------------------------------------------------------------------------------------|
| <kbd>space</kbd>  | Toggle the currently selected choice when `options.multiple` is true.                                                |
| <kbd>number</kbd> | Move the pointer to the choice at the given index. Also toggles the selected choice when `options.multiple` is true. |
| <kbd>a</kbd>      | Toggle all choices to be enabled or disabled.                                                                        |
| <kbd>i</kbd>      | Invert the current selection of choices.                                                                             |
| <kbd>g</kbd>      | Toggle the current choice group.                                                                                     |

### Multiple choices in the CLI

To assign multiple choices to a multiselect CLI param you have to use the param multiple times.

e.g. to select multiple formats for the collect output write:

```text
@npx @push-based/user-flow collect -f=md -f=json
```

### Negation

any boolean parameter of the CLI can be negated by adding `--no-` in front of the parameter name.
A good example is the `dryRun` parameter. You can negate it as follow: `--no-dryRun`.

## Report Formats and Viewer

You can either export the report as `HTML` or `JSON` format. The html file can be opened in any browser.

Use the `.user-flowrc.json` property `persist.format` and give an array as value. e.g. `['html']` or `['html', 'json']`.

You can also use the CLI option `--format` to choose a format.

- single format: `@push-based/user-flow collect --format html`
- multiple formats: `@push-based/user-flow collect --format html --format json`

> **🤓 DX Tip:**  
> For a faster development process you can use the `--openReport` or `-e` option to automatically open the report in the
> browser.
> The CLI will serve either the HTML report or opens the lighthouse report viewer if only a JSON format is available and
> displays it there.
> e.g. `@push-based/user-flow collect --openReport`

The json file can be drag & dropped into the [lighthouse viewer](https://googlechrome.github.io/lighthouse/viewer/).
This format is very good for programmatic processing and foundation for most of the features of this lib.
![Lighthouse Viewer - File drop area](https://user-images.githubusercontent.com/10064416/168185615-3ed66255-5287-4de3-a32a-cb9b053589de.PNG)

## Debugging

`@push-based/user-flow` ships with small helpers for logging and debugging.

### `logVerbose`

A function that logs the passed string only if the CIL options `--verbose` or `-v`is true.

**Usage**

_./order-coffee.uf.ts_

```typescript
import { logVerbose } from '@push-based/user-flow';
// ...

logVerbose('test');
```

`npx user-flow collect` logs nothing  
`npx user-flow collect --verbose` logs "test"

---

made with ❤ by [push-based.io](https://www.push-based.io)
