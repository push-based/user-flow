# `init` command

## General

The general purpos of the `init` command and its parameters is,  
initializing a project for the user flow CLI or enabling additional features of it.
 
> **Note:**
> In this section we assume user flow is installed already  
> and therefore directly executable over `npx user-flow init`.   
 
**Execution:**   
```
npx user-flow init [options]
```  

**Description:**
This command helps you to set up a `.user-flowrc.json` and asks for input over CLI prompts.
In a fresh project it helps to guide you through the configuration and creates the rc file for you.

If the command is executed in a project with an existing `.user-flowrc.json` file,  
it can help to reconfigure the existing file or migrating to a new release by walking through the propmts again.

In addition, it helps to do scaffolding by create basic files and folders needed to run the CLI and execute flows.

**Options related to the `user-flowrc.json` file:** 
|  Option                            |  Type     | Default                | Description                                                                                              |  
| ---------------------------------- | --------- | ---------------------- |----------------------------------------------------------------------------------------------------------|  
| **`-t`**, **`--url`**              | `string`  | n/a                    | Value for `collect.url` in your                                                                                            |  
| **`-u`**, **`--ufPath`**           | `string`  | `./user-flows`         | Path to user-flow file or folder containg user-flow files to run. (`*.uf.ts` or`*.uf.js`)                |  
| **`-o`**, **`--outPath`**          | `string`  | `./measures`           | output folder for the user-flow reports                                                                  |  
| **`-s`**, **`--serveCommand`**     | `string`  | n/a                    | Runs a npm script to serve the target app. This has to be used in combination with `--awaitServeStdout`  |  
| **`-a`**, **`--awaitServeStdout`** | `string`  | `.user-flowrc` setting | Waits for stdout from the serve command to start collecting user-flows                                   |  
| **`-f`**, **`--format`**           | `string`  | `html`, `json` setting | Format of the creates reports                                                                            |  
| **`-b`**, **`--budget-path`**      | `string`  | n/a                    | Path to the lighthouse `budget.json` file                                                                |  
| **`-c`**, **`--config-path`**      | `string`  | n/a                    | Path to the lighthouse `config.json` file                                                                |  

**Options file scaffolding:**  

|  Option                            |  Type     | Default                | Description                                                                                              |  
| ---------------------------------- | --------- | ---------------------- |----------------------------------------------------------------------------------------------------------|  
| **`-h`**, **`--generateFlow`**     | `boolean` | n/a                    | Generate basic user-flow file under `ufPath`                                                             |    

## Options related to the `user-flowrc.json` file  

All of the listed options can be used to set values in the rc file. 

**Execution:**   
```
npx user-flow init --url http://test.io --format json --format md --outPath tmp/user-flows
```  

**Description:**  
If a value is provided where normally a prompt would ask for a value it will skip the question and take the provided value.
After the init command ran the rc file should be updated with answers of possible prompts as well as the provided values.

For example, executing the following command in a new project:
```
npx user-flow init --url http://test.io --ufPath user-flows --format json --outPath measures
```  

would directly create a rc file without any prompt showing up.

You can execute `init` against a existing rc json file by using the `--rcPath`param.
This can be handy to quickly update a setting in you rc file:  
```
npx user-flow init --rcPath .user-flowrc.ci.json --outPath tmp/measures
```  

Another helpful feature is using init in combination with `--verbose` to quickly log rc files:
```
npx user-flow init --rcPath .user-flowrc.ci.json --verbose
```  



## Options file scaffolding

This params help to create additional files like user flows or CI integration.

### generateFlow

|  Option                            |  Type     | Default                |   
| ---------------------------------- | --------- | ---------------------- |  
| **`-h`**, **`--generateFlow`**     | `boolean` | n/a                    |

**Execution:**   
```
npx user-flow init --generateFlow
  
# or as negation

npx user-flow init --no-generateFlow
```  

**Description:**   

If the `init` command is executed with `--generateFlow` it will generate a file named `basic-navigation.uf.ts`.  
It contains a basic user flow and will be placed in the folder configured in you `.user-flowrc.json` file for `collect.ufPath`.

The `basic-navigation.uf.ts` template can be found [here](https://github.com/push-based/user-flow/blob/ba6a8d4fbf8060bea067e0fa3528611be5653ddf/packages/cli/src/lib/commands/init/static/basic-navigation.uf.ts#L2)
 
If the `init` command executes with `--no-generateFlow` nothing will be created nor prompted in the console.

---

made with ❤ by [push-based.io](https://www.push-based.io)
