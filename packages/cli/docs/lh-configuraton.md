# Lighthouse configuration

## General

User flow wraps [lighthouse](https://www.npmjs.com/package/lighthouse) and executes actions against chromium while measuring.
Lighthouse itself can get configured over a json object where any detail regards settings, audits and postprocessing can be placed.

The official docs on [how to configure lighthouse](https://github.com/GoogleChrome/lighthouse/blob/main/docs/configuration.md) are located in their repository's docs.
The [default lighthouse config](https://github.com/GoogleChrome/lighthouse/blob/946075bb7f0858861067d161a414bdccc0a19007/core/config/constants.js#L92) can be found in their repository's source.
 
The CLI will start lighthouse as with its default configuration.

### Configuration Options

The CLI provides multiple ways of configuration, every one with a different granularity.  

Places to put configurations:
- in a `.user-flowrc.json` - used for all flows (**global**)
- in the console as CLI param - used for all flows, overwrites rc file (**global**)
- in a `<user-flow-name>.uf.mts` - used for 1 specific flow (**local**)

Local configurations will overwrite global configurations.

Custom configurations can be provided over a external `.json` file using `--configPath <path/to/config.json>`.  
This option is also available in the `.user-flowrc.json` file under the `collect.configPath` property.

It is also possible to provide the configurations directly as `JSON` object in the `.user-flowrc.json` file under the `collect.config` property.

The `configPath` property is handy when all parameters should exist as CLI params only.

### Configuration option short-hands

As the configuration object can get quite big lighthouse provides a couple of short-hands to directly configure specific parts over a flag.  
The user-flow CLI ports perts of this behavior.

Those options can be used similar to the general configurations globally as well as locally.

## Options

**RC properties**  

Used in the rc.json file directly.  

|  Option                         |  Type     | Default                | Description                                                                                              |  
| ------------------------------- | --------- | ---------------------- |----------------------------------------------------------------------------------------------------------|  
| **`collect.configPath`**        | `string`  | n/a                    | Path to the lighthouse `config.json` file                                                                |  
| **`collect.config`**            | `object`  | n/a                    | The lighthouse configuration as `JSON` object                                                            |

**CLI params**  

Used in the console as `user-flow collect <param>`.  

|  Option                         |  Type     | Default                | Description                                                                                              |  
| ------------------------------- | --------- | ---------------------- |----------------------------------------------------------------------------------------------------------|  
| **`-c`**, **`--configPath`**    | `string`  | n/a                    | Path to the lighthouse `config.json` file                                                                |  

### Configuration over RC properties 

#### collect.configPath property

|  Property                       |  Type     | Default                |   
| ------------------------------- | --------- | ---------------------- |  
| **`collect.configPath`**        | `string`  | n/a                    |   

**Usage:**   
```json
{
  "collect": {
    "configPath": "./config.json",
    # ...  
  },
  # ...
}
```  

**Description:**  
If a lighthouse configuration exists as separate file you can use the `collect.configPath` to use it.
The path is, same as all other paths, relative to the execution context of the CLI.  

If possible configuration file looks like this:  

**./config.json**  
```json
{
 "extends": "lighthouse:default",
   "settings": {
     "onlyAudits": [
       "first-meaningful-paint",
       "speed-index",
       "interactive"
     ]
   }
}
```

The usage of it in the rc file looks like this:  

**./.user-flowrc.json**  
```json
{
  "collect": {
    "configPath": "./config.json",
    # ...  
  },
  # ...
}
```

#### collect.config property

|  Property                       |  Type     | Default                |   
| ------------------------------- | --------- | ---------------------- |  
| **`collect.config`**            | `object`  | n/a                    |   

**Usage:**   
```json
{
  "collect": {
    "config": {
      "extends": "lighthouse:default",
      "settings": {
        "onlyAudits": [
          "first-meaningful-paint",
          "speed-index",
          "interactive"
        ]
      }
    },
    # ...  
  },
  # ...
}
```  

**Description:**  

You can directly use a lighthouse config object in the rc file by placing it under the `collect.config` property.

**./.user-flowrc.json**  
```json
{
  "collect": {
    "config": {
        "extends": "lighthouse:default",
        "settings": {
          "onlyAudits": [
            "first-meaningful-paint",
            "speed-index",
            "interactive"
          ]
        }
    },
    # ...  
  },
  # ...
}
```

### Lighthouse configuration over the CLI params 

#### configPath  

See [CLI collect command - configPath](https://github.com/push-based/user-flow/blob/main/packages/cli/docs/command-collect.md#configpath)  

---

made with ❤ by [push-based.io](https://www.push-based.io)
