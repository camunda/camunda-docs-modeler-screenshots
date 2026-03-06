const cloudReference = require('./camunda-docs/cloudReference');
const modelingGuidance = require('./camunda-docs/modelingGuidance');
const userGuide = require('./camunda-docs-manual/userGuide');
const webapps = require('./camunda-docs-manual/webapps');
const quickstart = require('./camunda-docs-static/quickstart');
const modelerC7 = require('./camunda-docs-manual/modeler');
const { CAMUNDA_7_MODELER_VERSION } = require('./config/versions');

const { killModelerInstances } = require('./helper/createModeler');
const pAll = require('p-all').default;

const concurrency = parseInt(process.env.MAX_PARALLEL_EXECUTIONS) || 1;
const stopOnError = process.env.STOP_ON_ERROR === 'true';

async function runAll(displayVersion) {

  // For Camunda 8 docs (cloudReference and modelingGuidance):
  // - If displayVersion is provided, use it (backward compatibility)
  // - Otherwise, generate for all configured versions
  //
  // For Camunda 7 docs (quickstart, userGuide, webapps, modelerC7):
  // - Always use CAMUNDA_7_MODELER_VERSION (8.7.0)
  const c7Version = CAMUNDA_7_MODELER_VERSION;

  const tasks = [
    cloudReference(displayVersion),
    modelingGuidance(displayVersion),
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

let displayVersion = undefined;

args.forEach(arg => {
  if (arg.startsWith('--display-version')) {
    displayVersion = arg.slice(18);
  }
});


// (2) Run screenshot scripts
runAll(displayVersion);
