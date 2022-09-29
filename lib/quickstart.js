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

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/quick-start/img/modeler-new-bpmn-diagram.png',
    async (filepath) => {
      const config = path.join(__dirname, './fixtures/user-data/quickstart_large_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths: [], configPath: config });

      await modeler.click('[title="Create new ..."]');
      await modeler.mouseOver('[role="dialog"] [title="BPMN diagram"]');

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/quick-start/img/modeler-step1.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/quickstart/step1.1.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="StartEvent_1"]');

      await modeler.annotate('.djs-context-pad.open .bpmn-icon-task', 'Select <b>activity shape (rectangle)</b>', annotationOptions.right);
      await modeler.annotate('[data-element-id="StartEvent_1"]', 'Double-click <b>Start Event</b> to edit label\\n(Use SHIFT + ENTER for line break)', { x: 0, y: -40 });

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/quick-start/img/modeler-step2.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/quickstart/step1.2.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="serviceTask1"]');
      await modeler.click('[data-action="replace"]');
      await modeler.mouseOver('[data-id="replace-with-service-task"]');

      await modeler.annotate('[data-action="replace"]', '1. Select <b>activity</b>\\n2. Click <b>wrench icon</b> and change type to <b>Service Task</b>', annotationOptions.right);

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/quick-start/img/modeler-step3.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/quickstart/step1.3.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="endEvent1"]');

      await modeler.click('[data-group-id="group-general"]');

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/quick-start/img/modeler-step4.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/quickstart/step1.3.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_no_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="serviceTask1"]');
      await modeler.annotate('.properties .toggle', "If it\\'s not already visible, click \\n on the <b>Properties Panel toggle</b>", annotationOptions.left);

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/quick-start/img/modeler-step5.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/quickstart/step1.3.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-group-id="group-general"]');

      await modeler.annotate('input[name="id"]', 'Set <b>Process ID</b>', annotationOptions.left);
      await modeler.annotate('input[name="name"]', 'Set <b>Process Name</b>', annotationOptions.left);
      await modeler.annotate('input[name="isExecutable"]', 'Mark the process to be <b>executable</b>', annotationOptions.left);

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/quick-start/img/modeler-deploy1.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/quickstart/step1.3.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.mouseOver('button[title="Deploy current diagram"]');

      await modeler.takeScreenshot(filepath,
        {
          left: 0,
          top: 600,
          width: 374,
          height: 72
        });
    }
  );

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/quick-start/img/modeler-deploy2.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/quickstart/step1.3.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('button[title="Deploy current diagram"]');

      // Prepare input
      await modeler.waitForExist('#deployment\\.name');
      await modeler.doubleClick('#deployment\\.name');
      await modeler.keys('Backspace');
      await modeler.setValue('#deployment\\.name', 'Payment Retrieval');

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/quick-start/img/modeler-deploy3.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/quickstart/step1.3.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('button[title="Deploy current diagram"]');

      // Prepare input
      await modeler.waitForExist('#deployment\\.name');
      await modeler.doubleClick('#deployment\\.name');
      await modeler.keys('Backspace');
      await modeler.setValue('#deployment\\.name', 'Payment Retrieval');
      await modeler.click('[role="dialog"] button[type="submit"]');
      await modeler.pause(1000);

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/quick-start/img/modeler-usertask1.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/quickstart/step2.1.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.annotate(
        '[data-action="create.task"]',
        'Select <b>activity shape</b> and drag\\ninto position between <b>Start\\nEvent</b> and <b>\\"Charge Credit\\nCard\\" Service Task</b>',
        annotationOptions.right
      );

      await modeler.connectTwoElements('.SCREENSHOT__ANNOTATION', '[data-element-id="userTask"]');

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/quick-start/img/modeler-usertask2.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/quickstart/step2.1.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="userTask"]');
      await modeler.click('[data-action="replace"]');
      await modeler.mouseOver('[data-id="replace-with-user-task"]');

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/quick-start/img/modeler-usertask3.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/quickstart/step2.2.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/large_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="userTask"]');
      await modeler.click('[data-group-id="group-CamundaPlatform__UserAssignment"]');
      await modeler.click('input[name="assignee"]');

      await modeler.takeScreenshot(filepath,
        {
          left: 1379,
          top: 156,
          width: 420,
          height: 452
        });
    }
  );

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/quick-start/img/modeler-usertask-add.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/quickstart/step2.2.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="userTask"]');
      await modeler.click('[data-group-id="group-CamundaPlatform__Form"]');

      await modeler.takeScreenshot(filepath);
    }
  );

  // TODO: require automation of form editor
  /* await triggerScreenshot(
    'camunda-docs-static/get-started/content/quick-start/img/modeler-usertask4.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/quickstart/step2.3.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_large_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="userTask"]');
      await modeler.click('[data-tab-target="forms"]');
      await modeler.click('[data-name="extensionElementValue"]');

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/quick-start/img/modeler-usertask5.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/quickstart/step2.3.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_large_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="userTask"]');
      await modeler.click('[data-tab-target="forms"]');
      await modeler.click('[data-name="extensionElementValue"][data-index="1"]');

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/quick-start/img/modeler-usertask6.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/quickstart/step2.3.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_large_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="userTask"]');
      await modeler.click('[data-tab-target="forms"]');
      await modeler.click('[data-name="extensionElementValue"][data-index="2"]');

      await modeler.takeScreenshot(filepath);
    }
  );*/

  await triggerScreenshot('camunda-docs-static/get-started/content/quick-start/img/modeler-gateway1.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/quickstart/step3.1.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.annotate('[data-action="create.exclusive-gateway"]', 'Gateway', annotationOptions.right);

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot('camunda-docs-static/get-started/content/quick-start/img/modeler-gateway2.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/quickstart/step3.2.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-group-id="group-general"]');

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot('camunda-docs-static/get-started/content/quick-start/img/modeler-gateway3.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/quickstart/step3.2.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/large_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="SequenceFlow_0ilu8bp"]');

      await modeler.click('[data-group-id="group-general"]');
      await modeler.click('[data-group-id="group-CamundaPlatform__Condition"]');

      await modeler.takeScreenshot(filepath,
        {
          left: 1379,
          top: 86,
          width: 420,
          height: 450
        });
    }
  );


  await triggerScreenshot('camunda-docs-static/get-started/content/quick-start/img/modeler-gateway4.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/quickstart/step3.2.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      // The actual sequence flow is not clickable in the middle of the Bounding Box, so we use the label
      await modeler.click('[data-element-id="SequenceFlow_0di0jwo_label"]');

      await modeler.click('[data-group-id="group-general"]');
      await modeler.click('[data-group-id="group-CamundaPlatform__Condition"]');

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot('camunda-docs-static/get-started/content/quick-start/img/modeler-gateway5.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/quickstart/step3.2.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="SequenceFlow_187qbq7_label"]');

      await modeler.click('[data-group-id="group-general"]');
      await modeler.click('[data-group-id="group-CamundaPlatform__Condition"]');

      await modeler.takeScreenshot(filepath);
    }
  );


  await triggerScreenshot('camunda-docs-static/get-started/content/quick-start/img/modeler-gateway6.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/quickstart/step3.2.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="SequenceFlow_0ypgah8_label"]');

      await modeler.click('[data-group-id="group-general"]');
      await modeler.click('[data-group-id="group-CamundaPlatform__Condition"]');

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot('camunda-docs-static/get-started/content/quick-start/img/modeler-businessrule-task1.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/quickstart/step3.2.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="userTask"]');
      await modeler.click('[data-action="replace"]');
      await modeler.mouseOver('[data-id="replace-with-rule-task"]');

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot('camunda-docs-static/get-started/content/quick-start/img/modeler-businessrule-task2.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/quickstart/step4.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/large_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="Task_1j42goo"]');

      await modeler.click('[data-group-id="group-CamundaPlatform__Implementation"]');

      await modeler.takeScreenshot(filepath,
        {
          left: 1379,
          top: 156,
          width: 420,
          height: 512
        });
    }
  );


  await triggerScreenshot('camunda-docs-static/get-started/content/quick-start/img/modeler-new-dmn-diagram-properties.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/dmn/quickstart/step4.2.dmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="approve-payment"]');

      await modeler.takeScreenshot(filepath);
    }
  );

  // TODO: waiting for https://github.com/bpmn-io/dmn-js-properties-panel/issues/29
  /* await triggerScreenshot('camunda-docs-static/get-started/content/quick-start/img/modeler-new-dmn-diagram.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/quickstart/step4.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[title="Create diagram options"]');
      await modeler.mouseOver('.dropdown > .item', 0, 70);

      await modeler.takeScreenshot(filepath, {
        left: 0,
        top: 0,
        width: 350,
        height: 150
      });
    }
  );


  await triggerScreenshot('camunda-docs-static/get-started/content/quick-start/img/modeler-new-dmn-table.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/dmn/quickstart/step4.2.dmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="approve-payment"]');

      await modeler.takeScreenshot(filepath, {
        left: 140,
        top: 115,
        width: 100,
        height: 100
      });
    }
  );

  await triggerScreenshot('camunda-docs-static/get-started/content/quick-start/img/modeler-dmn2.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/dmn/quickstart/step4.1.dmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-container-id="approve-payment"] .drill-down-overlay');
      await modeler.doubleClick('.input-expression');
      await modeler.click('[data-placeholder="enter expression"]');
      await modeler.keys('item');

      await modeler.takeScreenshot(filepath);

      await modeler.doubleClick('.output-name');
      await modeler.click('.ref-output-name');
      await modeler.keys('approved');

      await modeler.takeScreenshot('camunda-docs-static/get-started/content/quick-start/img/modeler-dmn3.png');
    }
  );

  await triggerScreenshot('camunda-docs-static/get-started/content/quick-start/img/modeler-dmn4.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/dmn/quickstart/step4.2.dmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-container-id="approve-payment"] .drill-down-overlay');

      await modeler.doubleClick('.output-label');
      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot('camunda-docs-static/get-started/content/quick-start/img/modeler-dmn5.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/dmn/quickstart/step4.2.dmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-container-id="approve-payment"] .drill-down-overlay');

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot('camunda-docs-static/get-started/content/quick-start/img/modeler-dmn6.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/dmn/quickstart/step4.2.dmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-container-id="approve-payment"] .drill-down-overlay');
      await modeler.click('.app-icon-deploy');

      // Prepare input
      await modeler.waitForExist('#deployment\\.name');
      await modeler.doubleClick('#deployment\\.name');
      await modeler.keys('Backspace');
      await modeler.setValue('#deployment\\.name', 'Payment Retrieval Decision');

      await modeler.takeScreenshot(filepath);
    }
  );*/
};
