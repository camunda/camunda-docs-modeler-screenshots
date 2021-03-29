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

  // camunda-docs-manual Modeler screenshots /////////////////////////////


  await triggerScreenshot('camunda-docs-manual/content/modeler/bpmn/img/quickstart-1.png', async (filepath) => {
    modeler = await createModeler();

    await modeler.click('[title="Create diagram options"]');
    await modeler.mouseOver('.dropdown > .item', 0, 10);

    await modeler.takeScreenshot(filepath, {
      x: 0,
      y: 0,
      width: 350,
      height: 120
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
    await modeler.mouseOver('.dropdown > .item', 0, 30);

    await modeler.takeScreenshot(filepath, {
      x: 0,
      y: 0,
      width: 350,
      height: 120
    });
  });


  await triggerScreenshot('camunda-docs-manual/content/modeler/dmn/img/main.png', async (filepath) => {
    const diagramPaths = [ path.join(__dirname, './fixtures/dmn/dinner_party.dmn') ],
          config = path.join(__dirname, './fixtures/user-data/small_with_prop_panel.json');

    modeler = await createModeler(diagramPaths, config);

    await modeler.takeScreenshot(filepath, { });
  });


  await triggerScreenshot('camunda-docs-manual/content/modeler/dmn/img/save.png', async (filepath) => {
    const diagramPaths = [ path.join(__dirname, './fixtures/dmn/dinner_party.dmn') ],
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


  await triggerScreenshot('camunda-docs-manual/content/modeler/dmn/img/decision-table.png', async (filepath) => {
    const diagramPaths = [ path.join(__dirname, './fixtures/dmn/dinner_party.dmn') ],
          config = path.join(__dirname, './fixtures/user-data/extra_small_no_prop_panel.json');

    modeler = await createModeler(diagramPaths, config);

    await modeler.click('[data-container-id="dishDecision"] [class="drill-down-overlay interactive"]');

    await modeler.takeScreenshot(filepath, { });
  });


  await triggerScreenshot('camunda-docs-manual/content/modeler/dmn/img/dmn-modeler-right-click.png', async (filepath) => {
    const diagramPaths = [ path.join(__dirname, './fixtures/dmn/dinner_party.dmn') ],
          config = path.join(__dirname, './fixtures/user-data/extra_small_no_prop_panel.json');

    modeler = await createModeler(diagramPaths, config);

    await modeler.click('[data-container-id="dishDecision"] [class="drill-down-overlay interactive"]');
    await modeler.rightClick('[data-coords="0:0"]');

    await modeler.takeScreenshot(filepath, {
      x: 110,
      y: 110,
      width: 350,
      height: 325
    });
  });


  await triggerScreenshot('camunda-docs-manual/content/modeler/dmn/img/dmn-modeler-double-click.png', async (filepath) => {
    const diagramPaths = [ path.join(__dirname, './fixtures/dmn/dinner_party.dmn') ],
          config = path.join(__dirname, './fixtures/user-data/small_with_prop_panel.json');

    modeler = await createModeler(diagramPaths, config);

    await modeler.click('[data-container-id="dishDecision"] [class="drill-down-overlay interactive"]');
    await modeler.doubleClick('[data-col-id="Input_1"]');

    await modeler.takeScreenshot(filepath, {
      x: 65,
      y: 110,
      width: 275,
      height: 750
    });
  });


  await triggerScreenshot('camunda-docs-manual/content/modeler/dmn/img/dmn-modeler-toggle-overview.png', async (filepath) => {
    const diagramPaths = [ path.join(__dirname, './fixtures/dmn/dinner_party.dmn') ],
          config = path.join(__dirname, './fixtures/user-data/large_drd_overview.json');

    modeler = await createModeler(diagramPaths, config);

    await modeler.click('[data-container-id="Decision_1ev2uzr"] [class="drill-down-overlay interactive"]');
    await modeler.click('[data-element-id="dishDecision"]');

    await modeler.takeScreenshot(filepath, { });
  });


  await triggerScreenshot('camunda-docs-manual/content/modeler/dmn/img/dmn-modeler-drd-prop-panel.png', async (filepath) => {
    const diagramPaths = [ path.join(__dirname, './fixtures/dmn/dinner_party.dmn') ],
          config = path.join(__dirname, './fixtures/user-data/small_with_prop_panel.json');

    modeler = await createModeler(diagramPaths, config);

    await modeler.click('[data-element-id="dishDecision"]');

    await modeler.takeScreenshot(filepath, { });
  });


  await triggerScreenshot('camunda-docs-manual/content/modeler/dmn/img/literal-expression.png', async (filepath) => {
    const diagramPaths = [ path.join(__dirname, './fixtures/dmn/literal_expression.dmn') ],
          config = path.join(__dirname, './fixtures/user-data/small_with_prop_panel.json');

    modeler = await createModeler(diagramPaths, config);

    await modeler.click('[data-container-id="expression1"] [class="drill-down-overlay interactive"]');

    await modeler.takeScreenshot(filepath, { });
  });


  await triggerScreenshot('camunda-docs-manual/content/modeler/img/camunda-modeler.png', async (filepath) => {
    const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/invoice.bpmn') ],
          config = path.join(__dirname, './fixtures/user-data/large_with_prop_panel.json');

    modeler = await createModeler(diagramPaths, config);

    await modeler.click('[data-element-id="approveInvoice"]');

    await modeler.takeScreenshot(filepath, { });
  });
};
