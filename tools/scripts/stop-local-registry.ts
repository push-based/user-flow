/**
 * This script stops the local registry for e2e testing purposes.
 * It is meant to be called in jest's globalTeardown.
 */

export default () => {
  console.log('Teardown registry')
  if (global.stopLocalRegistry) {
    global.stopLocalRegistry();
    console.log('Registry down')
  }
};
