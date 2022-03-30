const createModeler = require('./helper/createModeler');

const path = require('path');

const annotationOptions = {
  top: { x: 0, y: -50 },
  right: { x: 50, y: 0 },
  bottom: { x: 0, y: 50 },
  left: { x: -50, y: 0 }
};

module.exports = async function startScreenshotBatch() {
  let modeler;

  async function triggerScreenshot(name, func) {
    console.log('Creating Modeler screenshot');

    console.log(`- Taking screenshot: ${name}`);

    await func(name);

    await modeler.close();

    console.log('- Done.');
  }

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/spring/img/process-model.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/spring/loan_approval.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_large_with_prop_panel.json');

      modeler = await createModeler(diagramPaths, config);

      await modeler.click('[title="General"]');
      await modeler.click('[title="Documentation"]');
      await modeler.click('[title="Job execution"]');

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/spring/img/service-task.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/spring/loan_approval.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_large_with_prop_panel.json');

      modeler = await createModeler(diagramPaths, config);

      await modeler.click('[data-element-id="ServiceTask_1"]');

      await modeler.click('[title="General"]');
      await modeler.click('[title="Documentation"]');
      await modeler.click('[title="Implementation"]');
      await modeler.click('[title="Asynchronous continuations"]');
      await modeler.click('#bio-properties-panel-delegateExpression');

      await modeler.takeScreenshot(filepath);
    }
  );
};