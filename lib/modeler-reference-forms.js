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


  await triggerScreenshot('camunda-docs-manual/content/modeler/forms/img/create-form.png', async (filepath) => {
    modeler = await createModeler();

    await modeler.click('[title="Create diagram options"]');
    await modeler.mouseOver('.dropdown > .item', 0, 90);

    await modeler.takeScreenshot(filepath, {
      left: 0,
      top: 0,
      width: 350,
      height: 160
    });
  });


  await triggerScreenshot('camunda-docs-manual/content/modeler/forms/img/build-form.png', async (filepath) => {
    const diagramPaths = [ path.join(__dirname, './fixtures/forms/customer-credit-limit.form') ],
          config = path.join(__dirname, './fixtures/user-data/large_with_prop_panel.json');

    modeler = await createModeler(diagramPaths, config);

    await modeler.takeScreenshot(filepath);
  });


  await triggerScreenshot('camunda-docs-manual/content/modeler/forms/img/form-properties-panel.png', async (filepath) => {
    const diagramPaths = [ path.join(__dirname, './fixtures/forms/customer-credit-limit.form') ],
          config = path.join(__dirname, './fixtures/user-data/large_with_prop_panel.json');

    modeler = await createModeler(diagramPaths, config);

    await modeler.takeScreenshot(filepath, {
      left: 1490,
      top: 75,
      width: 300,
      height: 550
    });
  });


  await triggerScreenshot('camunda-docs-manual/content/modeler/forms/img/save-form.png', async (filepath) => {
    const diagramPaths = [ path.join(__dirname, './fixtures/forms/customer-credit-limit.form') ],
          config = path.join(__dirname, './fixtures/user-data/large_with_prop_panel.json');

    modeler = await createModeler(diagramPaths, config);

    await modeler.click('[title="Save diagram as..."]');

    await modeler.takeScreenshot(filepath, {
      left: 0,
      top: 0,
      width: 300,
      height: 100
    });
  });

};
