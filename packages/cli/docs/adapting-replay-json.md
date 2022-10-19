// Explain how to create a recording

# Using Recorder Replay files in Userflow

User the Chrome Devtools Recorder to create a user flow of a website
https://developer.chrome.com/docs/devtools/recorder/
and export the recording as a JSON file
https://developer.chrome.com/docs/devtools/recorder/reference/#:~:text=Export%20as%20a%20JSON%20file.

- Store the json files in the userflow project

```
coffee-app-userflows
|- measures/...
|- recordings/recording.json
|- 
... 
```

## Using the file in your userflow
To execute the replay recording you need to
- Create and PuppeteerRunnerExtension
- Parse the recording into a replay userflow
- Create and run a Puppeteer Replay Runner inside a timespan

```ts
import {
  UserFlowContext,
  UserFlowInteractionsFn,
  UserFlowProvider,
} from '@push-based/user-flow';

import { 
  createRunner, 
  parse, 
  PuppeteerRunnerExtension, 
  Step, 
  UserFlow 
} from '@puppeteer/replay';

import recording from '../recordings/recording.json';

const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {
  const { flow, collectOptions, page, browser } = ctx;
  const { url } = collectOptions;

  // Create and PuppeteerRunnerExtension
  //@ts-ignore
  const userflowReplayExtension = new PuppeteerRunnerExtension(browser, page);

  await flow.startTimespan({ stepName: 'Checkout order' });

  // Parse the recording into a replay userflow
  const recording = parse(recordingText);

  // Create and run a Puppeteer Replay Runner
  const runner = await createRunner(recording, userflowReplayExtension);
  await runner.run();

  await flow.endTimespan();
};

const userFlowProvider: UserFlowProvider = {
  flowOptions: { name: "Order Coffee" },
  interactions,
};

module.exports = userFlowProvider;
```
// TODO add image of ufo 

## Separating the recording into multiple timespams
Now that we have a basic userflow running we can split the recording to get more details information about the website performance. 

We can separate the recording into navigations, timespans and snapshots to: 
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
    },
  ]
}
```

Then create a flow navigation in your userflow:

```ts
await flow.navigate(url, {
    stepName: "Navigate to coffee cart",
});
```


import { PuppeteerRunnerExtension } from from '@puppeteer/replay';
// TODO Rest of min userflow example 
const userflowReplayExtension = new PuppeteerRunnerExtension(browser, page);
``` 
- Add the replay file as a `Timespan` 

```
// TODO Rest of min userflow example 
await flow.startTimespan({ stepName: 'Checkout order' });
//@ts-ignore
const userflowReplayExtension = new PuppeteerRunnerExtension(browser, page)

const recordingText = fs.readFileSync(__dirname + '/../recording.json', 'utf8');
const recording = parse(JSON.parse(recordingText));
const runner = await createRunner(recording, userflowReplayExtension);
await runner.run();

await flow.endTimespan();
```
- Remove un unwanted configs eg. Desktop only
- Extract the action you want 
  - Cold Initial Navigation
  - Warm Initial Navigation

- Separate actions into timespans
- Add snapshots
- Add additional logic


// TODO compair output of of recording vs user-flow recording
