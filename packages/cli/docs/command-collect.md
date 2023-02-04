# `collect` command

## General

The general purpos of the `collect` command and its parameters is,  
executing user flows and managing post processing and persistence for the flow reports.
 
> **Note:**
> In this section we assume user flow is installed already  
> and therefore directly executable over `npx user-flow collect`.   
 
**Execution:**   
```
npx user-flow collect [options]
```  

**Description:**
This command helps you to execute user flows and save them.
It needs a existing `.user-flowrc.json` as pre condition.

It can execute against remote or local URLs on your local machine or in the CI.

The result can be stored in different formats or printed in the console.
 
**Options over-writing the `user-flowrc.json` configuration:** 
|  Option                            |  Type     | Default                | Description                                                                                              |  
| ---------------------------------- | --------- | ---------------------- |----------------------------------------------------------------------------------------------------------|  
| **`-t`**, **`--url`**              | `string`  | n/a                    | Value for `collect.url` in your                                                                                            |  
| **`-u`**, **`--ufPath`**           | `string`  | `./user-flows`         | Path to user-flow file or folder containg user-flow files to run. (`*.uf.ts` or`*.uf.js`)                |  
| **`-b`**, **`--budget-path`**      | `string`  | n/a                    | Path to the lighthouse `budget.json` file                                                                |  
| **`-c`**, **`--config-path`**      | `string`  | n/a                    | Path to the lighthouse `config.json` file                                                                |  
| **`-f`**, **`--format`**           | `string`  | `html`, `json` setting | Format of the creates reports                                                                            |  
| **`-o`**, **`--outPath`**          | `string`  | `./measures`           | output folder for the user-flow reports                                                                  |  
| **`-s`**, **`--serveCommand`**     | `string`  | n/a                    | Runs a npm script to serve the target app. This has to be used in combination with `--awaitServeStdout`  |  
| **`-a`**, **`--awaitServeStdout`** | `string`  | `.user-flowrc` setting | Waits for stdout from the serve command to start collecting user-flows                                   |  

**Additional options:**  

|  Option                            |  Type     | Default                | Description                                                                                              |  
| ---------------------------------- | --------- | ---------------------- |----------------------------------------------------------------------------------------------------------|  
| **`-e`**, **`--openReport`**       | `boolean` | `true`                 | Opens browser automatically after the user-flow is captured                                              |  
| **`-d`**, **`--dryRun`**           | `boolean` | `false`                | When true the user-flow test will get executed without measures (for fast development)                   |  

## Options related to the `user-flowrc.json` file  

All of the listed options can be used to set values in the rc file. 

**Execution:**   
```
npx user-flow collect --url http://test.io --format json --format md --outPath tmp/user-flows
```  

**Description:**  
If a value is provided where normally a prompt would ask for a value it will skip the question and take the provided value.

For example, executing the following command in a new project:
```
npx user-flow collect --url http://test.io --ufPath user-flows --format json --outPath measures
```  

would ignore defined values in the rc file and take the provide values instead for the run.

You can execute `collect` against a existing rc json file by using the `--rcPath`param.
This can be handy to quickly change between different configurations:  

```
npx user-flow init --rcPath .user-flowrc.ci.json --outPath tmp/measures
```  

Another helpful feature is using init in combination with `--verbose` to quickly log all details of the run process:
```
npx user-flow collect --verbose
```  

### url

|  Option                            |  Type     | Default                |   
| ---------------------------------- | --------- | ---------------------- |  
| **`-t`**, **`--url`**              | `string`  | n/a                    |  

**Execution:**   
```
npx user-flow collect --url https://my.test.io
```  

**Description:**   
The target URL to navigate to in chromium. Requirement for every run.
It has to start with `http://` or `https://` to be valid.
 
### ufPath

|  Option                            |  Type     | Default                |   
| ---------------------------------- | --------- | ---------------------- |  
| **`-u`**, **`--ufPath`**           | `string`  | `./user-flows`         |  


**Execution:**   
```
npx user-flow collect --ufPath ./user-flows/spectial-folder
  
# reference a flow directly

npx user-flow collect --ufPath ./user-flows/spectial-flow.uf.ts
```

**Description:**   
The path to user-flow file or folder containing user-flows. 

You can point to a folder to execute all user flows in there, or execute one file directly.

File formats accepted:
- `*.uf.ts` 
- `*.js`

### format

|  Option                            |  Type     | Default                |   
| ---------------------------------- | --------- | ---------------------- |  
| **`-f`**, **`--format`**           | `string`  | `html`, `json` setting |    

**Execution:**   
```
npx user-flow collect --format md

# or for multiple formats at the same time

npx user-flow collect --format md --format html
```  

**Description:**   
The format in which the report should get produced.

The following formats are available:
- json - The raw `LHR` as `.json` file e.g. [lhr-9.json]()
- html - The default `LHR` as `.html` file e.g. [lhr-9.json](). This is a single `.html` file visualizing the report. 
- md - A `.md` file including a summary of the raw `.json` file 
- stdout -  A standard output of the console including a summary of the raw `.json` file (same as for the `md` format)

### outPath

|  Option                            |  Type     | Default                |   
| ---------------------------------- | --------- | ---------------------- |  
| **`-o`**, **`--outPath`**          | `string`  | `./measures`           |  


**Execution:**   
```
npx user-flow collect --outPath ./measures
```

**Description:**   
The path to store user-flow reports. 
The CLI will automatically create the folder if it does not exist.

### budgetPath

|  Option                            |  Type     | Default                |   
| ---------------------------------- | --------- | ---------------------- |  
| **`-b`**, **`--budgetPath`**      | `string`  | n/a                    |  

**Execution:**   
```
npx user-flow collect --budgetPath ./budgets.json
```  

**Description:**  
  
When used it will parse the given file and uses its content as configuration for budgets in the [LH config](link to docs).

Details on usage and configuration are available in the [lighthouse budgets](https://github.com/push-based/user-flow/blob/main/packages/cli/docs/performance-budgets.md) section.

The `budgets.json` file path can also be placed directly into the rc file under `assert.budgetPath`.

### configPath

|  Option                            |  Type     | Default                |   
| ---------------------------------- | --------- | ---------------------- |  
| **`-c`**, **`--configPath`**      | `string`  | n/a                    |  

**Execution:**   
```
npx user-flow collect --configPath ./lh-config.json
```  

**Description:**  
Path to the lighthouse configuration file.
When used it will parse the given file and uses its content as configuration.  
If `budgets` are given it will merge them into the existing LH config.

Details on usage and configuration are available in the [lighthouse configuration](https://github.com/push-based/user-flow/blob/main/packages/cli/docs/lighthouse-configuration.md) section.

The `lh-config.json` file path can also be placed directly into the rc file under `collect.configPath`.


## Additional options

This params help to get better DX or debugging configurations.

### dryRun

This param is usefule while developing or debugging a user flow.  
It skips the real measurements and fakes them with mock reports.

|  Option                            |  Type     | Default                |   
| ---------------------------------- | --------- | ---------------------- |  
| **`-d`**, **`--dryRun`**           | `boolean` | `false`                | When true the user-flow test will get executed without measures (for fast development)                   |  

**Execution:**   
```
npx user-flow collect --dryRun
  
# or as negation

npx user-flow collect --no-dryRun
```  

**Description:**   

For a faster development process you can use the `--dryRun` option to skip measurement and perform the interactions only.    
This is a multitude faster e.g. **3s** vs **53s** for a simple 2 step flow with navigation.

It will produce a dummy report in all formats and spin up chromium as usual.  


### openReport

This param is responsible to open reports automatically on your machine

|  Option                            |  Type     | Default                |   
| ---------------------------------- | --------- | ---------------------- |  
| **`-e`**, **`--openReport`**       | `boolean` | `true`                 | Opens browser automatically after the user-flow is captured                                              |  

**Execution:**   
```
npx user-flow collect --openReport
  
# or as negation

npx user-flow collect --no-openReport
```  

**Description:**  
  
When used it will open the generated report on your machine.

Ways to open reports:
- Browser - a `*.html` report will open automatically in the devices default browser
- Text editor - a `*.json` or `*.md` will open automatically in the devices default text editor

### serveCommand & awaitServeStdout

This prama is used to spin up custom servers and wait for them to be ready for the user flow to execute.
This params has to be used together to work.  

|  Option                            |  Type     | Default                |   
| **`-s`**, **`--serveCommand`**     | `string`  | n/a                    |  
| **`-a`**, **`--awaitServeStdout`** | `string`  | `.user-flowrc` setting |  

**Execution:**   
```
npx user-flow collect --serveCommand "npm run serve" --awaitServeStdout "Server available under"
```  

**Description:**  

The `serveCommand` string is used to execute serving of the files.
The `awaitServeStdout` is used to determine if the server is ready.

For example:  
`--serveCommand "npm run serve-my-app"`  

This will execute `npm run serve-my-app` and logs the output 

For example:  
`Server available under: http://localhost:4200//my-app`  

The resulting output of that command is used to determine if the server is ready.

The `awaitServeStdout` value is used to determine if a particular string is present as output from the server.

For example:  
`--awaitServeStdout "Server available under"`  

This would be configured as following:
```
npx user-flow collect --serveCommand "npm run serve" --awaitServeStdout "Server available under"
```  

---

made with ❤ by [push-based.io](https://www.push-based.io)
