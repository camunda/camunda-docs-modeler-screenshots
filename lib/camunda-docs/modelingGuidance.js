const createModeler = require('../helper/createModeler');

const path = require('path');


const { triggerScreenshot } = require('../helper/screenshotUtil');
const { CAMUNDA_DOCS_VERSIONS } = require('../config/versions');

/**
 * Generate modeling guidance screenshots for a specific documentation version.
 * @param {string} versionPath - The path prefix for the documentation version (e.g., 'docs' or 'versioned_docs/version-8.7')
 * @param {string} c8EngineVersion - The Camunda 8 engine version to display (e.g., '8.7', '8.9 (alpha)')
 * @returns {Array} Array of screenshot tasks
 */
function generateScreenshotsForVersion(versionPath, c8EngineVersion) {

  return [

    () => triggerScreenshot(`camunda-docs/${versionPath}/components/modeler/reference/modeling-guidance/rules/img/called-element/wrong.png`, async (filepath) => {
      const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/modeling-guidance/called-element/wrong.bpmn') ],
            config = path.join(__dirname, '../fixtures/user-data/small_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, c8EngineVersion });

      await modeler.click('[data-element-id="CallActivity_1"]');

      await modeler.click('[title="Toggle problems view"]');

      await modeler.click('.linting-tab-item');

      await modeler.takeScreenshot(filepath);

      return modeler;
    }),

    () => triggerScreenshot(`camunda-docs/${versionPath}/components/modeler/reference/modeling-guidance/rules/img/called-element/right.png`, async (filepath) => {
      const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/modeling-guidance/called-element/right.bpmn') ],
            config = path.join(__dirname, '../fixtures/user-data/small_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, c8EngineVersion });

      await modeler.click('[data-element-id="CallActivity_1"]');

      await modeler.click('[title="Toggle problems view"]');

      await modeler.click('.bio-properties-panel-group-header-title >> "Called element"');

      await modeler.takeScreenshot(filepath);

      return modeler;
    }),

    () => triggerScreenshot(`camunda-docs/${versionPath}/components/modeler/reference/modeling-guidance/rules/img/element-type/wrong.png`, async (filepath) => {
      const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/modeling-guidance/element-type/wrong.bpmn') ],
            config = path.join(__dirname, '../fixtures/user-data/small_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, c8EngineVersion });

      await modeler.click('[data-element-id="Task_1"]');

      await modeler.click('[title="Toggle problems view"]');

      await modeler.takeScreenshot(filepath);

      return modeler;
    }),

    () => triggerScreenshot(`camunda-docs/${versionPath}/components/modeler/reference/modeling-guidance/rules/img/element-type/right.png`, async (filepath) => {
      const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/modeling-guidance/element-type/right.bpmn') ],
            config = path.join(__dirname, '../fixtures/user-data/small_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, c8EngineVersion });

      await modeler.click('[data-element-id="Task_1"]');

      await modeler.click('[title="Toggle problems view"]');

      await modeler.takeScreenshot(filepath);

      return modeler;
    }),

    () => triggerScreenshot(`camunda-docs/${versionPath}/components/modeler/reference/modeling-guidance/rules/img/error-reference/wrong-no-error-reference.png`, async (filepath) => {
      const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/modeling-guidance/error-reference/wrong-no-error-reference.bpmn') ],
            config = path.join(__dirname, '../fixtures/user-data/small_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, c8EngineVersion });

      await modeler.click('[data-element-id="ErrorBoundaryEvent_1"]');

      await modeler.click('[title="Toggle problems view"]');

      await modeler.click('.linting-tab-item');

      await modeler.takeScreenshot(filepath);

      return modeler;
    }),

    () => triggerScreenshot(`camunda-docs/${versionPath}/components/modeler/reference/modeling-guidance/rules/img/error-reference/wrong-no-error-code.png`, async (filepath) => {
      const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/modeling-guidance/error-reference/wrong-no-error-code.bpmn') ],
            config = path.join(__dirname, '../fixtures/user-data/small_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, c8EngineVersion });

      await modeler.click('[data-element-id="ErrorBoundaryEvent_1"]');

      await modeler.click('[title="Toggle problems view"]');

      await modeler.click('.linting-tab-item');

      await modeler.takeScreenshot(filepath);

      return modeler;
    }),

    () => triggerScreenshot(`camunda-docs/${versionPath}/components/modeler/reference/modeling-guidance/rules/img/error-reference/right.png`, async (filepath) => {
      const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/modeling-guidance/error-reference/right.bpmn') ],
            config = path.join(__dirname, '../fixtures/user-data/small_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, c8EngineVersion });

      await modeler.click('[data-element-id="ErrorBoundaryEvent_1"]');

      await modeler.click('[title="Toggle problems view"]');

      await modeler.click('.bio-properties-panel-group-header-title >> "Error"');

      await modeler.takeScreenshot(filepath);

      return modeler;
    }),

    () => triggerScreenshot(`camunda-docs/${versionPath}/components/modeler/reference/modeling-guidance/rules/img/escalation-reference/wrong-no-escalation-reference.png`, async (filepath) => {
      const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/modeling-guidance/escalation-reference/wrong-no-escalation-reference.bpmn') ],
            config = path.join(__dirname, '../fixtures/user-data/small_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, c8EngineVersion });

      await modeler.click('[data-element-id="EscalationEndEvent_1"]');

      await modeler.click('[title="Toggle problems view"]');

      await modeler.click('.linting-tab-item');

      await modeler.takeScreenshot(filepath);

      return modeler;
    }),

    () => triggerScreenshot(`camunda-docs/${versionPath}/components/modeler/reference/modeling-guidance/rules/img/escalation-reference/wrong-no-escalation-code.png`, async (filepath) => {
      const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/modeling-guidance/escalation-reference/wrong-no-escalation-code.bpmn') ],
            config = path.join(__dirname, '../fixtures/user-data/small_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, c8EngineVersion });

      await modeler.click('[data-element-id="EscalationEndEvent_1"]');

      await modeler.click('[title="Toggle problems view"]');

      await modeler.click('.linting-tab-item');

      await modeler.takeScreenshot(filepath);

      return modeler;
    }),

    () => triggerScreenshot(`camunda-docs/${versionPath}/components/modeler/reference/modeling-guidance/rules/img/escalation-reference/right.png`, async (filepath) => {
      const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/modeling-guidance/escalation-reference/right.bpmn') ],
            config = path.join(__dirname, '../fixtures/user-data/small_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, c8EngineVersion });

      await modeler.click('[data-element-id="EscalationEndEvent_1"]');

      await modeler.click('[title="Toggle problems view"]');

      await modeler.click('.bio-properties-panel-group-header-title >> "Escalation"');

      await modeler.takeScreenshot(filepath);

      return modeler;
    }),

    () => triggerScreenshot(`camunda-docs/${versionPath}/components/modeler/reference/modeling-guidance/rules/img/feel/wrong.png`, async (filepath) => {
      const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/modeling-guidance/feel/wrong.bpmn') ],
            config = path.join(__dirname, '../fixtures/user-data/small_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, c8EngineVersion });

      await modeler.click('[data-element-id="ServiceTask_1"]');

      await modeler.click('[title="Toggle problems view"]');

      await modeler.click('.linting-tab-item');

      await modeler.takeScreenshot(filepath);

      return modeler;
    }),

    () => triggerScreenshot(`camunda-docs/${versionPath}/components/modeler/reference/modeling-guidance/rules/img/feel/right.png`, async (filepath) => {
      const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/modeling-guidance/feel/right.bpmn') ],
            config = path.join(__dirname, '../fixtures/user-data/small_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, c8EngineVersion });

      await modeler.click('[data-element-id="ServiceTask_1"]');

      await modeler.click('[title="Toggle problems view"]');

      await modeler.click('.bio-properties-panel-group-header-title >> "Task definition"');

      await modeler.takeScreenshot(filepath);

      return modeler;
    }),

    () => triggerScreenshot(`camunda-docs/${versionPath}/components/modeler/reference/modeling-guidance/rules/img/message-reference/wrong-no-message-reference.png`, async (filepath) => {
      const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/modeling-guidance/message-reference/wrong-no-message-reference.bpmn') ],
            config = path.join(__dirname, '../fixtures/user-data/small_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, c8EngineVersion });

      await modeler.click('[data-element-id="MessageBoundaryEvent_1"]');

      await modeler.click('[title="Toggle problems view"]');

      await modeler.click('.linting-tab-item');

      await modeler.takeScreenshot(filepath);

      return modeler;
    }),

    () => triggerScreenshot(`camunda-docs/${versionPath}/components/modeler/reference/modeling-guidance/rules/img/message-reference/right.png`, async (filepath) => {
      const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/modeling-guidance/message-reference/right.bpmn') ],
            config = path.join(__dirname, '../fixtures/user-data/small_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, c8EngineVersion });

      await modeler.click('[data-element-id="MessageBoundaryEvent_1"]');

      await modeler.click('[title="Toggle problems view"]');

      await modeler.click('.bio-properties-panel-group-header-title >> "Message"');

      await modeler.takeScreenshot(filepath);

      return modeler;
    }),

    () => triggerScreenshot(`camunda-docs/${versionPath}/components/modeler/reference/modeling-guidance/rules/img/no-loop/wrong.png`, async (filepath) => {
      const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/modeling-guidance/no-loop/wrong.bpmn') ],
            config = path.join(__dirname, '../fixtures/user-data/small_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, c8EngineVersion });

      await modeler.click('[title="Toggle problems view"]');

      await modeler.click('.linting-tab-item');

      await modeler.takeScreenshot(filepath);

      return modeler;
    }),

    () => triggerScreenshot(`camunda-docs/${versionPath}/components/modeler/reference/modeling-guidance/rules/img/no-loop/right.png`, async (filepath) => {
      const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/modeling-guidance/no-loop/right.bpmn') ],
            config = path.join(__dirname, '../fixtures/user-data/small_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, c8EngineVersion });

      await modeler.click('[title="Toggle problems view"]');

      await modeler.takeScreenshot(filepath);

      return modeler;
    })
  ];

}

/**
 * Main export function that generates screenshots for documentation versions.
 *
 * By default, generates screenshots ONLY for the latest version to keep CI fast.
 * To generate for a specific version, use --c8-engine-version flag.
 * To generate for ALL versions, set GENERATE_ALL_VERSIONS=true environment variable.
 *
 * @param {string} c8EngineVersion - Optional engine version to use for latest docs
 */
module.exports = function startScreenshotBatch(c8EngineVersion) {

  // If GENERATE_ALL_VERSIONS is set, generate for all configured versions
  if (process.env.GENERATE_ALL_VERSIONS === 'true') {
    const tasks = [];
    for (const versionConfig of CAMUNDA_DOCS_VERSIONS) {
      const versionTasks = generateScreenshotsForVersion(versionConfig.path, versionConfig.c8EngineVersion);
      tasks.push(...versionTasks);
    }
    return tasks;
  }

  // Otherwise, generate only for the latest version (default behavior for fast CI)
  const latestVersion = CAMUNDA_DOCS_VERSIONS.find(v => v.isLatest);
  const engineVersion = c8EngineVersion || latestVersion.c8EngineVersion;
  return generateScreenshotsForVersion(latestVersion.path, engineVersion);
};