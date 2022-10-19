// Explain how to create a recording

# Basic Setup

We start with a basic setup of a user-flow

```ts
import {
  UserFlowContext,
  UserFlowInteractionsFn,
  UserFlowProvider,
} from '@push-based/user-flow';

const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {
  const { flow, page, browser } = ctx;

  await flow.startTimespan({ stepName: 'Checkout order' });
  
  //... Interactions

  await flow.endTimespan();
};

const userFlowProvider: UserFlowProvider = {
  flowOptions: { name: "Order Coffee" },
  interactions,
};

module.exports = userFlowProvider;
```


# Using Recorder Replay files in Userflow

1. User the [Chrome Devtools Recorder](https://developer.chrome.com/docs/devtools/recorder/#open) to create a user-flow recording for a specific website.
2. [Export the recording as a JSON file](https://developer.chrome.com/docs/devtools/recorder/reference/#:~:text=Export%20as%20a%20JSON%20file).
3. Store the json files in the related project e.g. under `recordings`

```
coffee-app-userflows
|- measures/...
|- recordings/recording.json
|- 
... 
```

## Using the file in your user-flow

To execute the replay recording you need to
- Create and runner over `createUserFlowRunner` inside a timespan
- Run the runner inside a timespan measurement 

## Create and runner over `createUserFlowRunner` inside a timespan

```typescript
const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {
  // ...

  await flow.startTimespan({ stepName: 'Checkout order' });
  
  // Use the create function to instanciate a the user-flow runner.
  const runner = await createUserFlowRunner('./recordings/order-coffee.replay.json')
  await runner.run();

  await flow.endTimespan();
};
```

## Run the runner inside a timespan measurement 

Now you can execute it with `npx @push-based/user-flow`. 
You should see the browser opening a report.

// TODO add image of ufo 

## Separating the recording into multiple timespan's

Now that we have a basic userflow running we can add actions to get more detailed information about the different interactions. 

We can add the a set of `@push-based/user-flow` actions as simple object to the steps array:

```json
[
  { 
    "type": "click",
    ...
  },
  { "type": "snapshot" }
]
```

The available types next to the navigate action type are:
- snapshot
- startTimespan
- stopTimespan

// TODO add link

To extract the navigation add the domain url from the recording an add it to the `.user-flowrc.json` file in the base of the directory: 

```json
{
  "collect": {
    "url": "https://coffee-cart.netlify.app/", // Add the domain url
    "ufPath": "./user-flows"
  },
  "persist": { "outPath": "./measures", "format": ["html"] }
} 
```
And remove the step from the recording navigation:
```json
{
  "title": "recording",
  "steps": [
    // Remove the navigation step
    {
      "type": "navigate",
      "url": "https://coffee-cart.netlify.app/",
      "assertedEvents": [
        {
          "type": "navigation",
          "url": "https://coffee-cart.netlify.app/",
          "title": "Coffee cart"
        }
      ]
    }
  ]
}
```

Then create a flow navigation in your userflow:

```ts
await flow.navigate(url, {
    stepName: "Navigate to coffee cart",
});
```

- Remove un unwanted configs eg. Desktop only
- Extract the action you want 
  - Cold Initial Navigation
  - Warm Initial Navigation

- Separate actions into timespans
- Add snapshots
- Add additional logic


// TODO compair output of of recording vs user-flow recording
