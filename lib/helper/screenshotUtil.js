const queue = [];
const maxParallelExecutions = process.env.MAX_PARALLEL_EXECUTIONS || Infinity;

let running = 0;

async function runNext() {
  if (queue.length === 0) {
    return;
  }

  if (running >= maxParallelExecutions) {
    return;
  }

  running++;
  await queue.shift()();
  running--;
  runNext();
}

function queAndExecute(callback) {
  return new Promise((resolve) => {
    queue.push(async () => {
      await callback();
      resolve();
    });

    runNext();
  });
}

async function triggerScreenshot(name, func) {
  await queAndExecute(async () => {
    console.log('Creating Modeler screenshot');

    console.log(`- Taking screenshot: ${name}`);

    const modeler = await func(name);

    await modeler.close();

    console.log(`- Done: ${name}`);
  });
}

module.exports.triggerScreenshot = triggerScreenshot;