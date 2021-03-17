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
    'camunda-docs-static/get-started/content/quick-start/img/modeler-new-bpmn-diagram.png',
    async (filepath) => {
      modeler = await createModeler();

      await modeler.click('[title="Create diagram options"]');
      await modeler.mouseOver('.dropdown > .item', 0, 30);

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-docs-static/get-started/content/quick-start/img/modeler-new-bpmn-diagram.png',
    async (filepath) => {
      modeler = await createModeler();

      await modeler.click('[title="Create diagram options"]');
      await modeler.mouseOver('.dropdown > .item', 0, 30);

      await modeler.takeScreenshot(filepath);
    }
  );

  // await modeler.annotate('.dropdown > .item', 'Hello');
};