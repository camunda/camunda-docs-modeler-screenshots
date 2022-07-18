const createModeler = require('./helper/createModeler');

const path = require('path');


module.exports = async function startScreenshotBatch() {
  let modeler;

  async function triggerScreenshot(name, func) {
    console.log('Creating Modeler screenshot');

    console.log(`- Taking screenshot: ${name}`);

    await func(name);

    await modeler.close();

    console.log('- Done.');
  }

  await triggerScreenshot('camunda-docs-manual/content/webapps/tasklist/img/tasklist-task-form-modeler.png', async (filepath) => {
    const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/invoice.bpmn') ],
          config = path.join(__dirname, './fixtures/user-data/large_with_prop_panel.json');

    modeler = await createModeler({ diagramPaths, configPath: config });

    await modeler.click('[data-element-id="approveInvoice"]');

    await modeler.click('[title="General"]');
    await modeler.click('[title="Documentation"]');
    await modeler.click('[title="User assignment"]');
    await modeler.click('[title="Asynchronous continuations"]');

    await modeler.takeScreenshot(filepath);
  });
};