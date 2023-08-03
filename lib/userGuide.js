const createModeler = require('./helper/createModeler');

const path = require('path');
const { triggerScreenshot } = require('./helper/screenshotUtil');

const annotationOptions = {
  top: { x: 0, y: -50 },
  right: { x: 50, y: 0 },
  bottom: { x: 0, y: 50 },
  left: { x: -50, y: 0 }
};


module.exports = async function startScreenshotBatch() {

  const promises = [];

  promises.push(triggerScreenshot('camunda-docs-manual/content/user-guide/task-forms/img/reference-camunda-form.png', async (filepath) => {
    const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/show_form.bpmn') ],
          config = path.join(__dirname, './fixtures/user-data/large_with_prop_panel.json');

    const modeler = await createModeler({ diagramPaths, configPath: config });

    await modeler.click('[data-element-id="Activity_0qkkllp"]');

    await modeler.click('[title="Forms"]');
    await modeler.annotate('input[name="formKey"]', 'Provide form key here', annotationOptions.left);

    await modeler.takeScreenshot(filepath);
    return modeler;
  }));

  promises.push(triggerScreenshot('camunda-docs-manual/content/user-guide/task-forms/img/variable-mapping-camunda-form.png', async (filepath) => {
    const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/show_form.bpmn') ],
          config = path.join(__dirname, './fixtures/user-data/large_with_prop_panel.json');

    const modeler = await createModeler({ diagramPaths, configPath: config });

    await modeler.click('[data-element-id="Activity_0qkkllp"]');

    await modeler.click('[title="Inputs"]');
    await modeler.click('[title="formKeyA"]');

    await modeler.click('[title="Outputs"]');
    await modeler.click('[title="myProcessVariableName"]');

    await modeler.takeScreenshot(filepath, {
      left: 1379,
      top: 285,
      width: 420,
      height: 512
    });
    return modeler;
  }));


  promises.push(triggerScreenshot('camunda-docs-manual/content/user-guide/task-forms/img/deploy-form.png', async (filepath) => {
    const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/show_form.bpmn') ],
          config = path.join(__dirname, './fixtures/user-data/large_with_prop_panel.json');

    const modeler = await createModeler({ diagramPaths, configPath: config });

    await modeler.click('[title="Deploy current diagram"]');

    await modeler.waitForExist('[for="deployment.attachments"]');
    await modeler.annotate('[for="deployment.attachments"]', 'Click <b>Select files</b> to include</br>your form in a deployment', annotationOptions.right);

    await modeler.takeScreenshot(filepath);
    return modeler;
  }));

  await Promise.all(promises);
};
