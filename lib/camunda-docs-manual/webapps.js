const createModeler = require('../helper/createModeler');

const path = require('path');
const { triggerScreenshot } = require('../helper/screenshotUtil');


module.exports = function startScreenshotBatch() {

  return [

    () => triggerScreenshot('camunda-docs-manual/content/webapps/tasklist/img/tasklist-task-form-modeler.png', async (filepath) => {
      const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/invoice.bpmn') ],
            config = path.join(__dirname, '../fixtures/user-data/large_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="approveInvoice"]');

      await modeler.click('[data-group-id="group-general"]');
      await modeler.click('[data-group-id="group-documentation"]');
      await modeler.click('[data-group-id="group-CamundaPlatform__UserAssignment"]');
      await modeler.click('[data-group-id="group-CamundaPlatform__AsynchronousContinuations"]');

      await modeler.takeScreenshot(filepath);
      return modeler;
    })

  ];
};