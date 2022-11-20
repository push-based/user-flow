# General CLI interaction

## Prompts and interaction

We provide general interaction through the keyboard or `stdin` directly for testing and other crazy hacks.

### Multiselect choices

 These key combinations can be used on _multiple_ choice prompts.For more details see [enquirer - multiselect](https://github.com/enquirer/enquirer/blob/master/docs/prompts/multiselect.md)

 | **command**       | **description**                                                                                                      |
 | ----------------- | -------------------------------------------------------------------------------------------------------------------- |
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
