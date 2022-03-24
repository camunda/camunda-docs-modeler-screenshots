const quickstart = require('./quickstart');
const userGuide = require('./userGuide');
const cloudReference = require('./cloudRefrence');

const runAll = async displayVersion => {

  await cloudReference(displayVersion);
  await quickstart();
  await userGuide();
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
