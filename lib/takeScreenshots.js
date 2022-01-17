const quickstart = require('./quickstart');
const userGuide = require('./userGuide');


const runAll = async () => {

  await quickstart();
  await userGuide();
};

runAll();
