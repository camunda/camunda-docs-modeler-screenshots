const cloudReference = require('./camunda-docs/cloudReference');
const modelingGuidance = require('./camunda-docs/modelingGuidance');
const userGuide = require('./camunda-docs-manual/userGuide');
const webapps = require('./camunda-docs-manual/webapps');
const quickstart = require('./camunda-docs-static/quickstart');
const modelerC7 = require('./camunda-docs-manual/modeler');

const { killModelerInstances } = require('./helper/createModeler');
const pAll = require('p-all');

const concurrency = parseInt(process.env.MAX_PARALLEL_EXECUTIONS) || 1;

async function runAll(displayVersion) {

  const tasks = [
    cloudReference(displayVersion),
    quickstart(),
    userGuide(),
    webapps(),
    modelingGuidance(),
    modelerC7()
  ].flat();

  const onlyTasks = tasks.map(t => t.only).filter(t => t);

  const actualTasks = onlyTasks.length ? onlyTasks : tasks;

  await pAll(actualTasks, { concurrency });

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
