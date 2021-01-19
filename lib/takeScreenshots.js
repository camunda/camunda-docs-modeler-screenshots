const createModeler = require('./helper/createModeler');

const path = require('path');


async function startScreenshotBatch() {
  let modeler;

  async function triggerScreenshot(name, func) {
    console.log('Creating Modeler screenshot');

    console.log(`- Taking screenshot: ${name}`);

    await func(name);

    await modeler.close();

    console.log('- Done.');
  }


  await triggerScreenshot('camunda-docs-manual/content/modeler/bpmn/img/quickstart-1.png', async (filepath) => {
    modeler = await createModeler();

    await modeler.click('[title="Create diagram options"]');
    await modeler.mouseOver('.dropdown > .item', 0, 0);

    await modeler.takeScreenshot(filepath, {
      x: 0,
      y: 0,
      width: 300,
      height: 150
    });
  });


  await triggerScreenshot('camunda-docs-manual/content/modeler/bpmn/img/quickstart-2.png', async (filepath) => {
    const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/review_invoice.bpmn') ],
          config = path.join(__dirname, './fixtures/user-data/small_with_prop_panel.json');

    modeler = await createModeler(diagramPaths, config);

    await modeler.click('[data-element-id="invoiceValidGateway"]');

    await modeler.takeScreenshot(filepath);
  });


  await triggerScreenshot('camunda-docs-manual/content/modeler/bpmn/img/quickstart-3.png', async (filepath) => {
    const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/calculate_order.bpmn') ],
          config = path.join(__dirname, './fixtures/user-data/small_with_prop_panel.json');

    modeler = await createModeler(diagramPaths, config);

    await modeler.click('[data-element-id="ServiceTask_ShipOrder"]');

    await modeler.takeScreenshot(filepath);
  });


  await triggerScreenshot('camunda-docs-manual/content/modeler/bpmn/img/quickstart-4.png', async (filepath) => {
    const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/calculate_order.bpmn') ],
          config = path.join(__dirname, './fixtures/user-data/small_with_prop_panel.json');

    modeler = await createModeler(diagramPaths, config);

    await modeler.takeScreenshot(filepath, {
      x: 775,
      y: 150,
      width: 200,
      height: 300
    });
  });


  await triggerScreenshot('camunda-docs-manual/content/modeler/bpmn/img/quickstart-5.png', async (filepath) => {
    const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/calculate_order.bpmn') ],
          config = path.join(__dirname, './fixtures/user-data/small_with_prop_panel.json');

    modeler = await createModeler(diagramPaths, config);

    await modeler.click('[title="Save diagram as..."]');

    await modeler.takeScreenshot(filepath, {
      x: 0,
      y: 0,
      width: 300,
      height: 100
    });
  });


  await triggerScreenshot('camunda-docs-manual/content/modeler/dmn/img/create-dmn.png', async (filepath) => {
    modeler = await createModeler();

    await modeler.click('[title="Create diagram options"]');
    await modeler.mouseOver('.dropdown > .item', 0, 40);

    await modeler.takeScreenshot(filepath, {
      x: 0,
      y: 0,
      width: 300,
      height: 100
    });
  });
}

startScreenshotBatch();
