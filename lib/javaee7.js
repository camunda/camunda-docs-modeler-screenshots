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

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/javaee7/img/pizza-order-process.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/javaee7/pizza_order1.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/large_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[title="General"]');
      await modeler.click('[title="Documentation"]');
      await modeler.click('[title="Job execution"]');
      await modeler.click('[title="Candidate starter"]');
      await modeler.click('[title="External task"]');
      await modeler.click('[title="History cleanup"]');

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/javaee7/img/pizza-order-process-expression.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/javaee7/pizza_order2.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/large_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="ServiceTask_0lrmoed"]');

      await modeler.click('[title="General"]');
      await modeler.click('[title="Documentation"]');
      await modeler.click('[title="Implementation"]');
      await modeler.click('[title="Asynchronous continuations"]');

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/javaee7/img/pizza-order-process-condition-expression.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/javaee7/pizza_order2.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/large_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="SequenceFlow_10r7cva_label"]');

      await modeler.click('[title="General"]');
      await modeler.click('[title="Documentation"]');
      await modeler.click('[title="Condition"]');

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/javaee7/img/pizza-order-process-start-form.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/javaee7/pizza_order1.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/large_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="StartEvent_1"]');

      await modeler.click('[title="Forms"]');

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/javaee7/img/pizza-order-process-service-task-expression.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/javaee7/pizza_order1.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/large_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="ServiceTask_0lrmoed"]');

      await modeler.click('[title="General"]');
      await modeler.click('[title="Documentation"]');
      await modeler.click('[title="Implementation"]');
      await modeler.click('[title="Asynchronous continuations"]');
      await modeler.click('#bio-properties-panel-expression');

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/javaee7/img/pizza-order-process-task-form.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/javaee7/pizza_order1.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/large_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="UserTask_0b3v36h"]');

      await modeler.click('[title="Forms"]');

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/javaee7/img/pizza-order-process-no.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/javaee7/pizza_order1.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/large_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="SequenceFlow_0md4bjf_label"]');

      await modeler.click('[title="General"]');
      await modeler.click('[title="Documentation"]');
      await modeler.click('[title="Condition"]');

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/javaee7/img/pizza-order-process-prepare-pizza.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/javaee7/pizza_order1.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/large_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="UserTask_19diw18"]');

      await modeler.click('[title="Forms"]');

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/javaee7/img/pizza-order-process-send-rejection-email.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/javaee7/pizza_order1.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/large_with_prop_panel.json');

      modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="ServiceTask_1w32ybd"]');

      await modeler.click('[title="General"]');
      await modeler.click('[title="Documentation"]');
      await modeler.click('[title="Implementation"]');
      await modeler.click('[title="Asynchronous continuations"]');

      await modeler.takeScreenshot(filepath);
    }
  );
};