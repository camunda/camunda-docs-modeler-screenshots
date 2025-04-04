const createModeler = require('../helper/createModeler');

const path = require('path');


const { triggerScreenshot } = require('../helper/screenshotUtil');

module.exports = function startScreenshotBatch() {

  return [
    () => triggerScreenshot('camunda-docs-manual/content/modeler/img/history-time-to-live.png', async (filepath) => {
      const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/modeling-guidance/history-time-to-live/info.bpmn') ],
            config = path.join(__dirname, '../fixtures/user-data/small_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[title="Toggle problems view"]');

      await modeler.click('.linting-tab-item');

      await modeler.takeScreenshot(filepath);

      return modeler;
    })
  ];

};