The Chrome DevTools [Recorder](https://developer.chrome.com/docs/devtools/recorder/) records clicks, inputs and navigations as you use a page and exports them as a JSON file. user-flow can replay such a recording as a Lighthouse user flow and lets you add measurement steps directly to the JSON. The result is a flow without a single line of hand written interaction code.

If the Recorder is new to you, these resources cover the basics:

- [Record, replay and measure user flows](https://developer.chrome.com/docs/devtools/recorder/)
- [Recorder features reference](https://developer.chrome.com/docs/devtools/recorder/reference/)
- [How to edit and extend user flows with Recorder and Puppeteer Replay](https://youtu.be/LBgzmqzp7ew) (video)

## 1. Record and export

1. Open DevTools, switch to the **Recorder** panel and start a new recording for your page.

   ![Start a new recording in the DevTools Recorder](images/chrome-recorder-start-new.png)

2. Perform the interactions you want to measure, then stop the recording.

3. [Export the recording as a JSON file](https://developer.chrome.com/docs/devtools/recorder/reference/#:~:text=Export%20as%20a%20JSON%20file).

   ![Export the recording as JSON](images/chrome-recorder-export-json.png)

4. Store the file in your project, for example under `recordings`:

   ```text
   📦 my-app
    ┣ 📂 src
    ┃ ┗ 📂 my-app-user-flows
    ┃   ┣ 📂 user-flows
    ┃   ┗ 📂 recordings
    ┃     ┗ 📄 order-coffee.replay.json
    ┗ 📄 .user-flowrc.json
   ```

## 2. Replay it inside a flow

`createUserFlowRunner` turns a recording into a runner that drives the page from the flow's context. Wrap the run in a timespan so Lighthouse measures the whole recording as one step:

```typescript title="user-flows/order-coffee.uf.mts"
import { createUserFlowRunner, UserFlowContext, UserFlowInteractionsFn, UserFlowProvider } from '@push-based/user-flow';

const interactions: UserFlowInteractionsFn = async (ctx: UserFlowContext): Promise<any> => {
  const { flow } = ctx;

  await flow.startTimespan({ name: 'Checkout order' });

  const runner = await createUserFlowRunner('./recordings/order-coffee.replay.json', ctx);
  await runner.run();

  await flow.endTimespan();
};

export default {
  flowOptions: { name: 'Order Coffee' },
  interactions,
} satisfies UserFlowProvider;
```

Run `npx user-flow` and the report shows a single timespan covering the entire recording:

![Report of a replayed recording wrapped in one timespan](images/lhr-replay-example-results-1.png)

## 3. Add measurement steps to the recording

One timespan over everything is a coarse measurement. To see each interaction on its own, add measurement steps to the recording's `steps` array. user-flow understands the following step types next to the regular Recorder steps:

| Type                                | Lighthouse call                                   |
| ----------------------------------- | ------------------------------------------------- |
| `startNavigation` / `endNavigation` | `flow.startNavigation()` / `flow.endNavigation()` |
| `startTimespan` / `endTimespan`     | `flow.startTimespan()` / `flow.endTimespan()`     |
| `snapshot`                          | `flow.snapshot()`                                 |

```json title="recordings/order-coffee.replay.json"
{
  "title": "Order coffee",
  "steps": [
    { "type": "startTimespan" },
    {
      "type": "click",
      "selectors": [["[data-test=Cappucino]"]],
      "offsetX": 10,
      "offsetY": 10
    },
    { "type": "endTimespan" },
    { "type": "snapshot" }
  ]
}
```

Because the recording now contains its own measurement steps, remove the surrounding timespan from the flow:

```typescript title="user-flows/order-coffee.uf.mts"
const interactions: UserFlowInteractionsFn = async (ctx: UserFlowContext): Promise<any> => {
  const runner = await createUserFlowRunner('./recordings/order-coffee-2.replay.json', ctx);
  await runner.run();
};
```

![Report of a recording with its own timespans and snapshots](images/lhr-replay-example-results-2.png)

## 4. Name the steps

Measurement steps accept the same options as their Lighthouse counterparts through `stepOptions`. A `name` makes the report readable:

```json title="recordings/order-coffee.replay.json"
{
  "steps": [
    {
      "type": "startTimespan",
      "stepOptions": { "name": "Select coffee" }
    },
    {
      "type": "click",
      "selectors": [["[data-test=Cappucino]"]],
      "offsetX": 10,
      "offsetY": 10
    },
    { "type": "endTimespan" },
    {
      "type": "snapshot",
      "stepOptions": { "name": "Coffee selected" }
    }
  ]
}
```

![Report with named steps from the recording](images/lhr-replay-example-results-3.png)

## Mixing recordings and code

A recording and hand written code are not mutually exclusive. A flow can navigate with `flow.navigate`, replay a recording for the tricky part of an interaction and finish with a snapshot written by hand. The runner uses the same `page` as the rest of the flow, so state carries over.

The repository contains complete examples under [`packages/user-flow-example/replay-examples`](https://github.com/push-based/user-flow/tree/main/packages/user-flow-example/replay-examples) together with the recordings they use.
