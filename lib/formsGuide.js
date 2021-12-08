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

  await triggerScreenshot('camunda-cloud-documentation/docs/guides/img/form-email-example.png', async (filepath) => {
    //const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/show_form.bpmn') ],
          config = path.join(__dirname, './fixtures/user-data/large_with_prop_panel.json');

    modeler = await createModeler(diagramPaths, config);

    await modeler.takeScreenshot(filepath);
  });

  await triggerScreenshot('camunda-cloud-documentation/docs/guides/img/form-palette.png', async (filepath) => {
    //const diagramPaths = [ path.join(__dirname, './fixtures/forms/customer-credit-limit.form') ],
          config = path.join(__dirname, './fixtures/user-data/large_with_prop_panel.json');

    modeler = await createModeler(diagramPaths, config);

    await modeler.takeScreenshot(filepath);
  });

  await triggerScreenshot('camunda-cloud-documentation/docs/guides/img/form-properties-email.png', async (filepath) => {
    //const diagramPaths = [ path.join(__dirname, './fixtures/forms/customer-credit-limit.form') ],
          config = path.join(__dirname, './fixtures/user-data/large_with_prop_panel.json');

    modeler = await createModeler(diagramPaths, config);

    await modeler.takeScreenshot(filepath);
  });

};