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
    'camunda-cloud-documentation/docs/components/modeler/desktop-modeler/img/empty.png',
    async (filepath) => {
      const config = path.join(__dirname, './fixtures/user-data/quickstart_large_with_prop_panel.json');

      modeler = await createModeler([], config);

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-cloud-documentation/docs/components/modeler/desktop-modeler/img/new-diagram.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/cloud-reference/diagram1.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      modeler = await createModeler(diagramPaths, config);

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-cloud-documentation/docs/components/modeler/desktop-modeler/img/elements.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/cloud-reference/diagram2.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      modeler = await createModeler(diagramPaths, config);

      await modeler.annotate('.djs-palette-entries', 'Palette of BPMN elements', annotationOptions.right);

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-cloud-documentation/docs/components/modeler/desktop-modeler/img/element-configuration.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/cloud-reference/diagram2.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      modeler = await createModeler(diagramPaths, config);

      await modeler.click('[data-element-id="serviceTask_1"]');
      await modeler.annotate('.bpmn-icon-screw-wrench', 'Use <b>wrench</b> icon to morph elements', annotationOptions.bottom);

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-cloud-documentation/docs/components/modeler/desktop-modeler/img/properties-panel.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/cloud-reference/diagram2.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      modeler = await createModeler(diagramPaths, config);

      await modeler.click('[data-element-id="serviceTask_1"]');
      await modeler.annotate('.bio-properties-panel', 'Use the <b>properties panel</b> to configure elements', annotationOptions.left);

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-cloud-documentation/docs/components/modeler/desktop-modeler/img/deploy-icon.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/cloud-reference/diagram2.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      modeler = await createModeler(diagramPaths, config);

      await modeler.mouseOver('button[title="Deploy current diagram"]');

      await modeler.takeScreenshot(filepath,
        {
          left: 0,
          top: 525,
          width: 350,
          height: 150
        });
    }
  );

  await triggerScreenshot(
    'camunda-cloud-documentation/docs/components/modeler/desktop-modeler/img/deploy-diagram-camunda-cloud.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/cloud-reference/diagram2.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      modeler = await createModeler(diagramPaths, config);

      await modeler.click('button[title="Deploy current diagram"]');
      await modeler.click('label[for="radio-element-camunda-cloud-saas"]');

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-cloud-documentation/docs/components/modeler/desktop-modeler/img/deploy-diagram-camunda-cloud-success.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/cloud-reference/diagram3.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      modeler = await createModeler(diagramPaths, config);

      await modeler.click('button[title="Deploy current diagram"]');
      await modeler.click('label[for="radio-element-camunda-cloud-saas"]');
      await modeler.setValue('input[name="endpoint.camundaCloudClusterUrl"]', '261a858f-c834-490c-bbe3-bfee50f8e3b1.bru-2.zeebe.camunda.io:443');
      await modeler.setValue('input[name="endpoint.camundaCloudClientId"]', 'lnoOT98Vb~KiePCiywBecaswM84X9zSQ');
      await modeler.setValue('input[name="endpoint.camundaCloudClientSecret"]', 'LLPt37DE~hO.aE7m5k9zuDCe3GnFaV62xISjigC-k6zycGkoup591xYEJcLWKo-l');
      await modeler.pause(5000);

      await modeler.click('.section__body button[type="submit"]');

      await modeler.pause(4000);

      await modeler.takeScreenshot(filepath);
    }
  );

  await triggerScreenshot(
    'camunda-cloud-documentation/docs/components/modeler/desktop-modeler/img/start-instance-icon.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/cloud-reference/diagram3.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      modeler = await createModeler(diagramPaths, config);

      await modeler.mouseOver('button[title="Start Current Diagram"]');

      await modeler.takeScreenshot(filepath,
        {
          left: 0,
          top: 525,
          width: 350,
          height: 150
        });
    }
  );

};
