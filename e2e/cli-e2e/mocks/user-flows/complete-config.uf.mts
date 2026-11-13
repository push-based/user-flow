// @ts-expect-error // This is a mock file!
import { UserFlowContext, UserFlowInteractionsFn, UserFlowProvider } from '@push-based/user-flow';
import DevtoolsLog from 'lighthouse/core/gather/gatherers/devtools-log.js';

const interactions: UserFlowInteractionsFn = async (ctx: UserFlowContext): Promise<any> => {
  const { flow, collectOptions } = ctx;
  const { url } = collectOptions;

  await flow.navigate(url, {
    name: `Navigate to ${url}`,
  });
};

export default {
  flowOptions: {
    name: 'Complete Config Example',
    // A complete config: it lists its own artifacts and does not extend the
    // default config. The default config names the DevtoolsLog gatherer by
    // path, this one gives its implementation.
    config: {
      artifacts: [
        { id: 'DevtoolsLog', gatherer: { implementation: DevtoolsLog } },
      ],
      audits: ['network-requests'],
      categories: {
        network: {
          title: 'Network',
          auditRefs: [{ id: 'network-requests', weight: 0 }],
        },
      },
    },
  },
  interactions,
  launchOptions: {
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  }
} satisfies UserFlowProvider;
