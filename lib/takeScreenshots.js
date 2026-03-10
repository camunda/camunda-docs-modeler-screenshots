const cloudReference = require('./camunda-docs/cloudReference');
const modelingGuidance = require('./camunda-docs/modelingGuidance');
const userGuide = require('./camunda-docs-manual/userGuide');
const webapps = require('./camunda-docs-manual/webapps');
const quickstart = require('./camunda-docs-static/quickstart');
const modelerC7 = require('./camunda-docs-manual/modeler');
const { CAMUNDA_7_ENGINE_VERSION } = require('./config/versions');

const { killModelerInstances } = require('./helper/createModeler');
const pAll = require('p-all').default;

const concurrency = parseInt(process.env.MAX_PARALLEL_EXECUTIONS) || 1;
const stopOnError = process.env.STOP_ON_ERROR === 'true';

async function runAll(c8EngineVersion) {

  // For Camunda 8 docs (cloudReference and modelingGuidance):
  // - If c8EngineVersion is provided, use it (backward compatibility)
  // - Otherwise, generate for all configured versions with appropriate engine versions
  //
  // For Camunda 7 docs (quickstart, userGuide, webapps, modelerC7):
  // - Always use CAMUNDA_7_ENGINE_VERSION (7.24)
  const c7Version = CAMUNDA_7_ENGINE_VERSION;

  const tasks = [
    cloudReference(c8EngineVersion),
    modelingGuidance(c8EngineVersion),
    quickstart(c7Version),
    userGuide(c7Version),
    webapps(c7Version),
    modelerC7(c7Version)
  ].flat();

  /**
   * Run single tasks by wrapping them in an object with `only` property.
   * @example { only: () => triggerScreenshot(...) }
   */
  const onlyTasks = tasks.map(t => t.only).filter(t => t);

  const actualTasks = onlyTasks.length ? onlyTasks : tasks;

  /**
   * Skip tasks by wrapping them in an object with `skip` property.
   * @example { skip: () => triggerScreenshot(...) }
   */
  const notSkippedTasks = actualTasks.filter(t => !t.skip);

  await pAll(notSkippedTasks, { concurrency, stopOnError });

  await killModelerInstances();
}


// (1) Parse arguments
const args = process.argv.slice(2);

let c8EngineVersion = undefined;

args.forEach(arg => {
  // Support both --c8-engine-version and --display-version for backward compatibility
  if (arg.startsWith('--c8-engine-version')) {
    c8EngineVersion = arg.slice(20);
  } else if (arg.startsWith('--display-version')) {
    // Backward compatibility: treat --display-version as --c8-engine-version
    c8EngineVersion = arg.slice(18);
  }
});


// (2) Run screenshot scripts
runAll(c8EngineVersion);
