const { AsyncLocalStorage } = require('node:async_hooks');

const DEFAULT_TIMEOUT = 120 * 1000;

const storage = new AsyncLocalStorage();

/**
 * Register a Modeler instance with the screenshot task currently running,
 * so it can be closed if the task fails or times out.
 *
 * @param {{ close: () => Promise<void> }} modeler
 */
function registerModeler(modeler) {
  const store = storage.getStore();

  if (store) {
    store.modelers.push(modeler);
  }
}

module.exports.registerModeler = registerModeler;

async function triggerScreenshot(name, func) {
  console.log('Creating Modeler screenshot');

  console.log(`- Taking screenshot: ${name}`);

  const store = { modelers: [] };

  const timeout = parseInt(process.env.SCREENSHOT_TIMEOUT) || DEFAULT_TIMEOUT;

  let timer;

  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Timed out after ${ timeout }ms`)), timeout);
  });

  try {

    // closing may hang, too, so it is covered by the timeout
    await storage.run(store, () => {
      return Promise.race([ run(name, func), timeoutPromise ]);
    });

    console.log(`- Done: ${name}`);
  } catch (err) {
    console.log(`- Failed: ${name}`);
    err.failureName = name;

    // do not leak the Modeler, it would keep running until the very end
    await closeAll(store.modelers);

    // re-throw error to allow customizable error aggregation
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

module.exports.triggerScreenshot = triggerScreenshot;


// helpers //////////

async function run(name, func) {
  const modeler = await func(name);

  await modeler.close();
}

async function closeAll(modelers) {
  await Promise.all(modelers.map(modeler => {
    return modeler.close().catch(() => {});
  }));
}
