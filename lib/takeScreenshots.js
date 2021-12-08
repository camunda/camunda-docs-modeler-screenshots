const modelerReferenceBpmn = require('./modeler-reference-bpmn');
const modelerReferenceDmn = require('./modeler-reference-dmn');
const modelerReferenceForms = require('./modeler-reference-forms');
const quickstart = require('./quickstart');
const userGuide = require('./userGuide');
const formsGuide = require('./formsGuide');


const runAll = async () => {

  await modelerReferenceForms();
  await modelerReferenceBpmn();
  await modelerReferenceDmn();
  await quickstart();
  await userGuide();
  await formsGuide();
};

runAll();
