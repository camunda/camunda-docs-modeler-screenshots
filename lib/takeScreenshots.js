const quickstart = require('./quickstart');
const userGuide = require('./userGuide');
const cloudReference = require('./cloudRefrence');
const spring = require('./spring');
const webapps = require('./webapps');

const { killModelerInstances } = require('./helper/createModeler');

const runAll = async displayVersion => {

  await Promise.all([
    cloudReference(displayVersion),
    quickstart(),
    userGuide(),
    spring(),
    webapps()
  ]);

  await killModelerInstances();
};


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
