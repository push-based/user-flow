/**
 * This script stops the local registry for e2e testing purposes.
 * It is meant to be called in jest's globalTeardown.
 */

// registry.d.ts declares a global, which only a reference can pull in
// oxlint-disable-next-line typescript/triple-slash-reference
/// <reference path="registry.d.ts" />

export default () => {
  if (global.stopLocalRegistry) {
    global.stopLocalRegistry();
  }
};
