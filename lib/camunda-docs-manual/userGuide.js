const createModeler = require('../helper/createModeler');

const path = require('path');
const { triggerScreenshot } = require('../helper/screenshotUtil');

const annotationOptions = {
  top: { x: 0, y: -50 },
  right: { x: 50, y: 0 },
  bottom: { x: 0, y: 50 },
  left: { x: -50, y: 0 }
};


module.exports = function startScreenshotBatch(displayVersion) {

  return [

    () => triggerScreenshot('camunda-docs-manual/content/user-guide/task-forms/img/reference-camunda-form.png', async (filepath) => {
      const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/show_form.bpmn') ],
            config = path.join(__dirname, '../fixtures/user-data/large_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

      await modeler.click('[data-element-id="Activity_0qkkllp"]');

      await modeler.click('text="Forms"');
      await modeler.annotate('input[name="formKey"]', 'Provide form key here', annotationOptions.left);

      await modeler.takeScreenshot(filepath);
      return modeler;
    }),

    () => triggerScreenshot('camunda-docs-manual/content/user-guide/task-forms/img/variable-mapping-camunda-form.png', async (filepath) => {
      const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/show_form.bpmn') ],
            config = path.join(__dirname, '../fixtures/user-data/large_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

      await modeler.click('[data-element-id="Activity_0qkkllp"]');

      await modeler.click('text="Inputs"');
      await modeler.click('text="formKeyA"');

      await modeler.click('text="Outputs"');
      await modeler.click('text="myProcessVariableName"');

      // crop starting at the "Inputs" group, wherever the panel layout puts it
      const inputs = await modeler.getElement('.bio-properties-panel-group-header:has-text("Inputs")');

      await inputs.evaluate(element => element.scrollIntoView({ block: 'start' }));

      const panel = await (await modeler.getElement('.bio-properties-panel')).boundingBox(),
            header = await inputs.boundingBox();

      // screenshot pixels, not CSS pixels
      const scale = await modeler.window.evaluate(() => globalThis.devicePixelRatio);

      await modeler.takeScreenshot(filepath, {
        left: Math.round(panel.x * scale),
        top: Math.round(header.y * scale),
        width: Math.floor(panel.width * scale),
        height: 512 * scale
      });
      return modeler;
    }),

    () => triggerScreenshot('camunda-docs-manual/content/user-guide/task-forms/img/deploy-form.png', async (filepath) => {
      const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/show_form.bpmn') ],
            config = path.join(__dirname, '../fixtures/user-data/large_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

      await modeler.click('[title="Deploy current diagram"]');

      await modeler.waitForExist('button[aria-label="Select files"]');
      await modeler.annotate('button[aria-label="Select files"]', 'Click <b>Select files</b> to include</br>your form in a deployment', annotationOptions.right);

      await modeler.takeScreenshot(filepath);
      return modeler;
    })
  ];
};
