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
    'camunda-docs-static/get-started/content/java-process-app/img/modeler-step1.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/java-process-app/loan_approval1.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_large_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[title="General"]');
      await modeler.click('[title="Documentation"]');
      await modeler.click('[title="Job execution"]');
      await modeler.click('[title="External task"]');

      await modeler.mouseOver('[data-element-id="StartEvent_1"]');

      await modeler.annotate('[data-element-id="StartEvent_1"]', 'Double click <b>Start Event</b> to edit label\\n(Type SHIFT + ENTER for line break)', annotationOptions.right);

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/java-process-app/img/modeler-step2.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/java-process-app/loan_approval2.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/large_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[title="General"]');
      await modeler.click('[title="Documentation"]');

      await modeler.click('[data-element-id="Activity_1ef1b5y"]');

      await modeler.click('[title="Asynchronous continuations"]');

      await modeler.click('[data-action="replace"]');
      await modeler.mouseOver('[data-id="replace-with-user-task"]');

      await modeler.annotate('[class="djs-popup-header"]', '3. Select the <b>Approve Loan</b> activity and click on <b>wrench icon</b>\\n4. Select the <b>User Task</b> type', annotationOptions.right);
      await modeler.annotate('[data-element-id="StartEvent_1"]', '1. Select <b>Start Event</b>\\n2. Click and drag the activity shape (rectangle)', annotationOptions.top);

      await modeler.connectTwoElements('.SCREENSHOT__ANNOTATION', '[data-action="replace"]');

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/java-process-app/img/modeler-step3.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/java-process-app/loan_approval3.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_large_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[title="General"]');
      await modeler.click('[title="Documentation"]');
      await modeler.click('[title="Job execution"]');
      await modeler.click('[title="External task"]');

      await modeler.mouseOver('[data-element-id="Event_19mg6hk"]');

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/java-process-app/img/modeler-step4.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/java-process-app/loan_approval4.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_large_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="Activity_06ar1u1"]');

      await modeler.click('[title="General"]');
      await modeler.click('[title="Documentation"]');
      await modeler.click('[title="User assignment"]');
      await modeler.click('[title="Asynchronous continuations"]');
      await modeler.click('#bio-properties-panel-assignee');

      await modeler.annotate('#bio-properties-panel-assignee', 'This User Task will be assigned to <em>john</em>', annotationOptions.left);

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/java-process-app/img/modeler-step5.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/java-process-app/loan_approval5.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_large_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[title="General"]');
      await modeler.click('[title="Documentation"]');
      await modeler.click('[title="Job execution"]');
      await modeler.click('[title="External task"]');

      await modeler.annotate('#bio-properties-panel-id', 'Change the process ID', annotationOptions.left);
      await modeler.annotate('#bio-properties-panel-name', 'Set a name', annotationOptions.left);
      await modeler.annotate('#bio-properties-panel-isExecutable', 'Mark the process to be executable', annotationOptions.left);

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/java-process-app/img/modeler-start-form.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/java-process-app/loan_approval6.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="StartEvent_1"]');

      await modeler.click('[title="Forms"]');

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/java-process-app/img/modeler-service-task1.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/java-process-app/loan_approval7.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_large_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[title="General"]');
      await modeler.click('[title="Documentation"]');
      await modeler.click('[title="Job execution"]');
      await modeler.click('[title="External task"]');

      await modeler.annotate(
        '[data-action="create.task"]',
        '1.<b>Make room</b> for accomodating the service task\\n2. <b>Select</b> activity shape and <b>drag</b> into position between\\n<b>Approve Loan</b> and <b>Loan Request Approved</b>.',
        annotationOptions.right
      );

      await modeler.connectTwoElements('.SCREENSHOT__ANNOTATION', '[data-element-id="Activity_024rjkg"]');

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/java-process-app/img/modeler-service-task2.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/java-process-app/loan_approval8.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_large_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="Activity_024rjkg"]');

      await modeler.click('[title="General"]');
      await modeler.click('[title="Documentation"]');
      await modeler.click('[title="Asynchronous continuations"]');

      await modeler.click('[data-action="replace"]');
      await modeler.mouseOver('[data-id="replace-with-service-task"]');

      await modeler.annotate('[class="djs-popup-header"]', '3. <b>Change Activity Type:</b>\\nClick on the <b>Process Request</b> activity and\\nselect the <b>wrench symbol</b>.\\nPick <b>Service Task</b> from the list.', { x: -100, y: 55 });

      await modeler.connectTwoElements('.SCREENSHOT__ANNOTATION', '[data-action="replace"]');

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/java-process-app/img/modeler-service-task3.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/java-process-app/loan_approval9.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_large_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="ServiceTask_0m5ho94"]');

      await modeler.click('[title="General"]');
      await modeler.click('[title="Documentation"]');
      await modeler.click('[title="Implementation"]');
      await modeler.click('[title="Asynchronous continuations"]');
      await modeler.click('#bio-properties-panel-javaClass');

      await modeler.annotate('#bio-properties-panel-javaClass', 'Set the implementation class', annotationOptions.left);

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/java-process-app/img/form-builder-start-form.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/java-process-app/request_loan.form') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_large_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.takeScreenshot(filepath);
    }
  );
};