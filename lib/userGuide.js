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


  await triggerScreenshot('camunda-docs-manual/content/user-guide/task-forms/img/reference-camunda-form.png', async (filepath) => {
    const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/show_form.bpmn') ],
          config = path.join(__dirname, './fixtures/user-data/large_with_prop_panel.json');

    modeler = await createModeler({ diagramPaths, configPath: config });

    await modeler.click('[data-element-id="Activity_0qkkllp"]');

    await modeler.click('[title="Forms"]');
    await modeler.annotate('input[name="formKey"]', 'Provide form key here', annotationOptions.left);
    
    await modeler.takeScreenshot(filepath);
  });


  await triggerScreenshot('camunda-docs-manual/content/user-guide/task-forms/img/variable-mapping-camunda-form.png', async (filepath) => {
    const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/show_form.bpmn') ],
          config = path.join(__dirname, './fixtures/user-data/large_with_prop_panel.json');

    modeler = await createModeler({ diagramPaths, configPath: config });

    await modeler.click('[data-element-id="Activity_0qkkllp"]');

    await modeler.click('[title="Inputs"]');
    await modeler.click('[title="formKeyA"]');

    await modeler.click('[title="Outputs"]');
    await modeler.click('[title="myProcessVariableName"]');

    await modeler.takeScreenshot(filepath, {
      left: 2725,
      top: 580,
      width: 850,
      height: 1055
    });
  });


  await triggerScreenshot('camunda-docs-manual/content/user-guide/task-forms/img/deploy-form.png', async (filepath) => {
    const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/show_form.bpmn') ],
          config = path.join(__dirname, './fixtures/user-data/large_with_prop_panel.json');

    modeler = await createModeler({ diagramPaths, configPath: config });

    await modeler.click('[title="Deploy current diagram"]');

    await modeler.waitForExist('[for="deployment.attachments"]');
    await modeler.annotate('[for="deployment.attachments"]', 'Click <b>Select files</b> to include</br>your form in a deployment', annotationOptions.right);

    await modeler.takeScreenshot(filepath);
  });

};
