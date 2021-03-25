const modelerReference = require('./modeler-reference');
const quickstart = require('./quickstart');



const runAll = async () => {
  await modelerReference();
  await quickstart();
};

runAll();

