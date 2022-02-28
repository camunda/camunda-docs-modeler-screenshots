const quickstart = require('./quickstart');
const userGuide = require('./userGuide');
const cloudReference = require('./cloudRefrence');

const runAll = async () => {

  await cloudReference();
  await quickstart();
  await userGuide();
};

runAll();
