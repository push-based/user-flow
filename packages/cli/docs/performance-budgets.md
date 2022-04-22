# How to use performance budgets with lighthouse user flow?

Implementing performance improvements without breaking something is hard. 
Even harder is it to keep it that way.

## Availability

At the moment budgets are only supported for "Navigation". "Timespan" and "Snapshot" measures are not supported by user flows directly. 

![Modes that support budgets]()

**Budget Structure**
The CLI follows exactly the same budget structure as lighthouse. 

The [`Budget` types](https://github.com/GoogleChrome/lighthouse/blob/89a61379e6bd0a55b94643b3ce583c00203c0fbc/types/lhr/budget.d.ts) can be used from the node package.  
However, if you use JSON, there is also provide a [`lighthouse-budgets.schema.json`](../src/lighthouse-budgets.schema.json) provided.

_Schema JSON validation in IDE_
![budgets-json-validation](https://user-images.githubusercontent.com/10064416/164541563-57379716-ec88-423b-9e5d-bd10d0c4a78d.PNG)

## Setup budgets in RC file

1. Create a `budget.json` file and paste the following content:  

**./my-app-user-flows/budget.json**
```json
[
  {
    "path": "/*",
    "resourceSizes": [
      {
        "resourceType": "total",
        "budget": 11
      },
      {
        "resourceType": "script",
        "budget": 22
      }
    ],
    "resourceCounts": [
      {
        "resourceType": "third-party",
        "budget": 3
      }
    ],
    "timings": [
      {
        "metric": "interactive",
        "budget": 44
      },
      {
        "metric": "first-meaningful-paint",
        "budget": 55
      }
    ]
  }
]
```

2. open your `.user-flowrc.json` and add assert options:

**./my-app-user-flows/.user-flowrc.json**
```json
{
  ...
  "assert": {
    "budgetPath": "./budget.json"
  }
}
```
You can also paste the whole configuration directly as array:

**./my-app-user-flows/.user-flowrc.json**
```json
{
  ...
  "assert": {
    "budgetPath": [...]
  }
}
```

Optionally you can use the `--budgetPath` or `-b` option.
Budgets configured in the RC file (or over the CLI option `--budgetPath` or `-b`).

3. Run the `collect` command and check the output.

### Setup budgets per user flow

1. Open the respective user flow test and add config options to the flowOptions:

**./my-app-user-flows/.user-flowrc.json**
 ```typescript
// ...

const userFlowProvider: UserFlowProvider = {
  // ...
  flowOptions : {
    name: 'user-flow with budgets',
    config: {
      settings: {
        budgets: "./budget.json"
      }
    }
  }
};

module.exports = userFlowProvider;
```
You can also paste the whole configuration directly as array:

**./my-app-user-flows/.user-flowrc.json**
 ```typescript
// ...

const userFlowProvider: UserFlowProvider = {
  // ...
  flowOptions : {
    name: 'user-flow with budgets',
    config: {
      settings: {
        budgets: [...]
      }
    }
  }
};

module.exports = userFlowProvider;
```
3. Run the `collect` command and check the output.

## How to debug?

The different metrics available in the budget schema are derived from CDP and also present in the DevTools.
Sometimes it helps to relate to some visual representation when dealing with numbers, so here is a listing on how you can gather the numbers manually:

All of the resource related metrics can be found in the "Network" tab.

![performance-budget--devtools-network-tab](https://user-images.githubusercontent.com/10064416/164570333-f11c2ec2-64b3-4f95-b845-0ba19fb23c30.png)

The many of the timing related metrics are visible in the "Performance" tab
![performance-budget--devtools-performance-tab](https://user-images.githubusercontent.com/10064416/164570353-6f9ff215-ad25-4928-9ca1-49151a4e57ed.png)


# Resources
- [Use Lighthouse for performance budgets](https://web.dev/use-lighthouse-for-performance-budgets/?utm_source=lighthouse&utm_medium=node)
- [Understand the performance budget structure](https://github.com/GoogleChrome/lighthouse/blob/master/docs/performance-budgets.md)

made with ❤ by [push-based.io](https://www.push-based.io)
