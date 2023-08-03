const createModeler = require('./helper/createModeler');

const path = require('path');
const { triggerScreenshot } = require('./helper/screenshotUtil');


module.exports = async function startScreenshotBatch() {

  const promises = [];

  promises.push(triggerScreenshot(
    'camunda-docs-static/get-started/content/spring/img/process-model.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/spring/loan_approval.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_large_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[title="General"]');
      await modeler.click('[title="Documentation"]');
      await modeler.click('[title="Job execution"]');

      await modeler.takeScreenshot(filepath);
      return modeler;
    }
  ));

  promises.push(triggerScreenshot(
    'camunda-docs-static/get-started/content/spring/img/service-task.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/spring/loan_approval.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_large_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="ServiceTask_1"]');

      await modeler.click('[title="General"]');
      await modeler.click('[title="Documentation"]');
      await modeler.click('[title="Implementation"]');
      await modeler.click('[title="Asynchronous continuations"]');
      await modeler.click('#bio-properties-panel-delegateExpression');

      await modeler.takeScreenshot(filepath);
      return modeler;
    }
  ));
};