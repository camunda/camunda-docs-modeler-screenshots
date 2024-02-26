const createModeler = require('./helper/createModeler');

const path = require('path');


const { triggerScreenshot } = require('./helper/screenshotUtil');

module.exports = function startScreenshotBatch() {

  return [

    () => triggerScreenshot('camunda-docs/docs/components/modeler/reference/modeling-guidance/rules/img/called-element/wrong.png', async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/modeling-guidance/called-element/wrong.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/small_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="CallActivity_1"]');

      await modeler.click('[title="Toggle problems view"]');

      await modeler.click('.linting-tab-item');

      await modeler.takeScreenshot(filepath);

      return modeler;
    }),

    () => triggerScreenshot('camunda-docs/docs/components/modeler/reference/modeling-guidance/rules/img/called-element/right.png', async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/modeling-guidance/called-element/right.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/small_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="CallActivity_1"]');

      await modeler.click('[title="Toggle problems view"]');

      await modeler.click('[title="Called element"]');

      await modeler.takeScreenshot(filepath);

      return modeler;
    }),

    () => triggerScreenshot('camunda-docs/docs/components/modeler/reference/modeling-guidance/rules/img/element-type/wrong.png', async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/modeling-guidance/element-type/wrong.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/small_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="Task_1"]');

      await modeler.click('[title="Toggle problems view"]');

      await modeler.takeScreenshot(filepath);

      return modeler;
    }),

    () => triggerScreenshot('camunda-docs/docs/components/modeler/reference/modeling-guidance/rules/img/element-type/right.png', async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/modeling-guidance/element-type/right.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/small_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="Task_1"]');

      await modeler.click('[title="Toggle problems view"]');

      await modeler.takeScreenshot(filepath);

      return modeler;
    }),

    () => triggerScreenshot('camunda-docs/docs/components/modeler/reference/modeling-guidance/rules/img/error-reference/wrong-no-error-reference.png', async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/modeling-guidance/error-reference/wrong-no-error-reference.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/small_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="ErrorBoundaryEvent_1"]');

      await modeler.click('[title="Toggle problems view"]');

      await modeler.click('.linting-tab-item');

      await modeler.takeScreenshot(filepath);

      return modeler;
    }),

    () => triggerScreenshot('camunda-docs/docs/components/modeler/reference/modeling-guidance/rules/img/error-reference/wrong-no-error-code.png', async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/modeling-guidance/error-reference/wrong-no-error-code.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/small_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="ErrorBoundaryEvent_1"]');

      await modeler.click('[title="Toggle problems view"]');

      await modeler.click('.linting-tab-item');

      await modeler.takeScreenshot(filepath);

      return modeler;
    }),

    () => triggerScreenshot('camunda-docs/docs/components/modeler/reference/modeling-guidance/rules/img/error-reference/right.png', async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/modeling-guidance/error-reference/right.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/small_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="ErrorBoundaryEvent_1"]');

      await modeler.click('[title="Toggle problems view"]');

      await modeler.click('[title="Error"]');

      await modeler.takeScreenshot(filepath);

      return modeler;
    }),

    () => triggerScreenshot('camunda-docs/docs/components/modeler/reference/modeling-guidance/rules/img/escalation-reference/wrong-no-escalation-reference.png', async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/modeling-guidance/escalation-reference/wrong-no-escalation-reference.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/small_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="EscalationEndEvent_1"]');

      await modeler.click('[title="Toggle problems view"]');

      await modeler.click('.linting-tab-item');

      await modeler.takeScreenshot(filepath);

      return modeler;
    }),

    () => triggerScreenshot('camunda-docs/docs/components/modeler/reference/modeling-guidance/rules/img/escalation-reference/wrong-no-escalation-code.png', async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/modeling-guidance/escalation-reference/wrong-no-escalation-code.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/small_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="EscalationEndEvent_1"]');

      await modeler.click('[title="Toggle problems view"]');

      await modeler.click('.linting-tab-item');

      await modeler.takeScreenshot(filepath);

      return modeler;
    }),

    () => triggerScreenshot('camunda-docs/docs/components/modeler/reference/modeling-guidance/rules/img/escalation-reference/right.png', async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/modeling-guidance/escalation-reference/right.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/small_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="EscalationEndEvent_1"]');

      await modeler.click('[title="Toggle problems view"]');

      await modeler.click('[title="Escalation"]');

      await modeler.takeScreenshot(filepath);

      return modeler;
    }),

    () => triggerScreenshot('camunda-docs/docs/components/modeler/reference/modeling-guidance/rules/img/feel/wrong.png', async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/modeling-guidance/feel/wrong.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/small_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="ServiceTask_1"]');

      await modeler.click('[title="Toggle problems view"]');

      await modeler.click('.linting-tab-item');

      await modeler.takeScreenshot(filepath);

      return modeler;
    }),

    () => triggerScreenshot('camunda-docs/docs/components/modeler/reference/modeling-guidance/rules/img/feel/right.png', async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/modeling-guidance/feel/right.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/small_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="ServiceTask_1"]');

      await modeler.click('[title="Toggle problems view"]');

      await modeler.click('[title="Task definition"]');

      await modeler.takeScreenshot(filepath);

      return modeler;
    }),

    () => triggerScreenshot('camunda-docs/docs/components/modeler/reference/modeling-guidance/rules/img/message-reference/wrong-no-message-reference.png', async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/modeling-guidance/message-reference/wrong-no-message-reference.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/small_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="MessageBoundaryEvent_1"]');

      await modeler.click('[title="Toggle problems view"]');

      await modeler.click('.linting-tab-item');

      await modeler.takeScreenshot(filepath);

      return modeler;
    }),

    () => triggerScreenshot('camunda-docs/docs/components/modeler/reference/modeling-guidance/rules/img/message-reference/right.png', async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/modeling-guidance/message-reference/right.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/small_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[data-element-id="MessageBoundaryEvent_1"]');

      await modeler.click('[title="Toggle problems view"]');

      await modeler.click('[title="Message"]');

      await modeler.takeScreenshot(filepath);

      return modeler;
    }),

    () => triggerScreenshot('camunda-docs/docs/components/modeler/reference/modeling-guidance/rules/img/history-time-to-live/info.png', async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/modeling-guidance/history-time-to-live/info.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/small_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config });

      await modeler.click('[title="Toggle problems view"]');

      await modeler.click('.linting-tab-item');

      await modeler.takeScreenshot(filepath);

      return modeler;
    })
  ];

};