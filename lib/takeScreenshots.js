const modelerReferenceBpmn = require('./modeler-reference-bpmn');
const modelerReferenceDmn = require('./modeler-reference-dmn');
const quickstart = require('./quickstart');



const runAll = async () => {
  await modelerReferenceBpmn();
  await modelerReferenceDmn();
  await quickstart();
};

runAll();
