const createModeler = require('./helper/createModeler');

const path = require('path');
const { triggerScreenshot } = require('./helper/screenshotUtil');

const annotationOptions = {
  top: { x: 0, y: -50 },
  right: { x: 50, y: 0 },
  bottom: { x: 0, y: 50 },
  left: { x: -50, y: 0 }
};

const CLUSTER_URL = process.env.CLUSTER_URL || 'addMe';
const CLIENT_ID = process.env.CLIENT_ID || 'addMe';
const CLIENT_SECRET = process.env.CLIENT_SECRET || 'addMe';
const OAUTH_URL = process.env.OAUTH_URL || 'https://login.cloud.camunda.io/oauth/token';

module.exports = async function startScreenshotBatch(displayVersion) {

  const promises =[];

  promises.push(triggerScreenshot(
    'camunda-platform-docs/docs/components/modeler/desktop-modeler/img/empty.png',
    async (filepath) => {
      const config = path.join(__dirname, './fixtures/user-data/quickstart_large_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths: [], configPath: config, displayVersion });

      await modeler.takeScreenshot(filepath);
      return modeler;
    }
  ));

  promises.push(triggerScreenshot(
    'camunda-platform-docs/docs/components/modeler/desktop-modeler/img/new-diagram.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/cloud-reference/diagram1.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

      await modeler.takeScreenshot(filepath);
      return modeler;
    }
  ));

  promises.push(triggerScreenshot(
    'camunda-platform-docs/docs/components/modeler/desktop-modeler/img/elements.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/cloud-reference/diagram2.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

      await modeler.annotate('.djs-palette-entries', 'Palette of BPMN elements', annotationOptions.right);

      await modeler.takeScreenshot(filepath);
      return modeler;
    }
  ));

  promises.push(triggerScreenshot(
    'camunda-platform-docs/docs/components/modeler/desktop-modeler/img/element-configuration.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/cloud-reference/diagram2.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

      await modeler.click('[data-element-id="serviceTask_1"]');
      await modeler.annotate('.bpmn-icon-screw-wrench', 'Use <b>wrench</b> icon to morph elements', annotationOptions.bottom);

      await modeler.takeScreenshot(filepath);
      return modeler;
    }
  ));

  promises.push(triggerScreenshot(
    'camunda-platform-docs/docs/components/modeler/desktop-modeler/img/properties-panel.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/cloud-reference/diagram2.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

      await modeler.click('[data-element-id="serviceTask_1"]');
      await modeler.annotate('.bio-properties-panel', 'Use the <b>properties panel</b> to configure elements', annotationOptions.left);

      await modeler.takeScreenshot(filepath);
      return modeler;
    }
  ));

  promises.push(triggerScreenshot(
    'camunda-platform-docs/docs/components/modeler/desktop-modeler/img/deploy-icon.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/cloud-reference/diagram2.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

      await modeler.mouseOver('button[title="Deploy current diagram"]');

      await modeler.takeScreenshot(filepath,
        {
          left: 0,
          top: 525,
          width: 350,
          height: 150
        });
      return modeler;
    }
  ));

  promises.push(triggerScreenshot(
    'camunda-platform-docs/docs/components/modeler/desktop-modeler/img/deploy-diagram-camunda-cloud.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/cloud-reference/diagram2.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

      await modeler.click('button[title="Deploy current diagram"]');
      await modeler.click('label[for="radio-element-camunda-platform-8-saas"]');

      await modeler.takeScreenshot(filepath);
      return modeler;
    }
  ));

  promises.push(triggerScreenshot(
    'camunda-platform-docs/docs/components/modeler/desktop-modeler/img/deploy-diagram-camunda-cloud-success.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/cloud-reference/diagram3.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

      await modeler.click('button[title="Deploy current diagram"]');
      await modeler.click('label[for="radio-element-camunda-platform-8-saas"]');
      await modeler.setValue('input[name="endpoint.camundaCloudClusterUrl"]', CLUSTER_URL);
      await modeler.setValue('input[name="endpoint.camundaCloudClientId"]', CLIENT_ID);
      await modeler.setValue('input[name="endpoint.camundaCloudClientSecret"]', CLIENT_SECRET);
      await modeler.pause(5000);

      await modeler.click('.section__body button[type="submit"]');

      await modeler.pause(4000);

      await modeler.takeScreenshot(filepath);
      return modeler;
    }
  ));

  promises.push(triggerScreenshot(
    'camunda-platform-docs/docs/components/modeler/desktop-modeler/img/deploy-diagram-camunda-cloud-remember.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/cloud-reference/diagram3.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

      await modeler.click('button[title="Deploy current diagram"]');
      await modeler.click('label[for="radio-element-camunda-platform-8-saas"]');
      await modeler.setValue('input[name="endpoint.camundaCloudClusterUrl"]', CLUSTER_URL);
      await modeler.setValue('input[name="endpoint.camundaCloudClientId"]', CLIENT_ID);
      await modeler.setValue('input[name="endpoint.camundaCloudClientSecret"]', CLIENT_SECRET);
      await modeler.click('div[role="dialog"] span.toggle-switch__slider');
      await modeler.pause(1000);

      await modeler.takeScreenshot(filepath);
      return modeler;
    }
  ));

  promises.push(triggerScreenshot(
    'camunda-platform-docs/docs/components/modeler/desktop-modeler/img/start-instance-icon.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/cloud-reference/diagram3.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

      await modeler.mouseOver('button[title="Start current diagram"]');

      await modeler.takeScreenshot(filepath,
        {
          left: 0,
          top: 525,
          width: 350,
          height: 150
        });
      return modeler;
    }
  ));

  promises.push(triggerScreenshot(
    'camunda-platform-docs/docs/components/modeler/desktop-modeler/img/start-instance-successful.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/cloud-reference/diagram3.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

      // (1) deloy
      await modeler.click('button[title="Deploy current diagram"]');
      await modeler.click('label[for="radio-element-camunda-platform-8-saas"]');
      await modeler.setValue('input[name="endpoint.camundaCloudClusterUrl"]', CLUSTER_URL);
      await modeler.setValue('input[name="endpoint.camundaCloudClientId"]', CLIENT_ID);
      await modeler.setValue('input[name="endpoint.camundaCloudClientSecret"]', CLIENT_SECRET);
      await modeler.click('div[role="dialog"] span.toggle-switch__slider');
      await modeler.pause(5000);
      await modeler.click('.section__body button[type="submit"]');

      // (1.1) wait long so that the success notification disappears
      await modeler.pause(10000);

      // (2) start
      await modeler.click('button[title="Start current diagram"]');
      await modeler.click('div.section__body button.btn-primary');
      await modeler.pause(2000);

      await modeler.takeScreenshot(filepath);
      return modeler;
    }
  ));


  // self-managed
  promises.push(triggerScreenshot(
    'camunda-platform-docs/docs/self-managed/modeler/desktop-modeler/img/deploy-icon.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/cloud-reference/diagram2.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

      await modeler.mouseOver('button[title="Deploy current diagram"]');

      await modeler.takeScreenshot(filepath,
        {
          left: 0,
          top: 525,
          width: 350,
          height: 150
        });
      return modeler;
    }
  ));

  promises.push(triggerScreenshot(
    'camunda-platform-docs/docs/self-managed/modeler/desktop-modeler/img/deploy-empty.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/cloud-reference/diagram2.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

      await modeler.click('button[title="Deploy current diagram"]');
      await modeler.click('label[for="radio-element-camunda-platform-8-self-managed"]');

      await modeler.takeScreenshot(filepath);
      return modeler;
    }
  ));

  promises.push(triggerScreenshot(
    'camunda-platform-docs/docs/self-managed/modeler/desktop-modeler/img/deploy-endpoint.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/cloud-reference/diagram3.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

      await modeler.click('button[title="Deploy current diagram"]');
      await modeler.click('label[for="radio-element-camunda-platform-8-self-managed"]');
      await modeler.setValue('input[name="endpoint.contactPoint"]', `https://${CLUSTER_URL}`);

      await modeler.takeScreenshot(filepath);
      return modeler;
    }
  ));

  promises.push(triggerScreenshot(
    'camunda-platform-docs/docs/self-managed/modeler/desktop-modeler/img/deploy-with-oauth.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/cloud-reference/diagram3.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

      await modeler.click('button[title="Deploy current diagram"]');
      await modeler.click('label[for="radio-element-camunda-platform-8-self-managed"]');
      await modeler.click('label[for="radio-element-oauth"]');
      await modeler.setValue('input[name="endpoint.contactPoint"]', `https://${CLUSTER_URL.split(':')[0]}`);
      await modeler.setValue('input[name="endpoint.clientId"]', CLIENT_ID);
      await modeler.setValue('input[name="endpoint.clientSecret"]', CLIENT_SECRET);
      await modeler.setValue('input[name="endpoint.oauthURL"]', OAUTH_URL);
      await modeler.setValue('input[name="endpoint.audience"]', CLUSTER_URL.split(':')[0]);

      await modeler.takeScreenshot(filepath);
      return modeler;
    }
  ));

  promises.push(triggerScreenshot(
    'camunda-platform-docs/docs/self-managed/modeler/desktop-modeler/img/deploy-success.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/cloud-reference/diagram3.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json');

      const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

      await modeler.click('button[title="Deploy current diagram"]');
      await modeler.click('label[for="radio-element-camunda-platform-8-self-managed"]');
      await modeler.click('label[for="radio-element-oauth"]');
      await modeler.setValue('input[name="endpoint.contactPoint"]', `https://${CLUSTER_URL}`);
      await modeler.setValue('input[name="endpoint.clientId"]', CLIENT_ID);
      await modeler.setValue('input[name="endpoint.clientSecret"]', CLIENT_SECRET);
      await modeler.setValue('input[name="endpoint.oauthURL"]', OAUTH_URL);
      await modeler.setValue('input[name="endpoint.audience"]', CLUSTER_URL.split(':')[0]);
      await modeler.pause(5000);

      await modeler.click('.section__body button[type="submit"]');

      await modeler.pause(4000);

      await modeler.takeScreenshot(filepath);
      return modeler;
    }
  ));


  // element templates //////////////////////
  promises.push(triggerScreenshot(
    'camunda-platform-docs/docs/components/modeler/desktop-modeler/element-templates/img/overview.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/cloud-reference/element-templates/overview.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json'),
            templates = [path.join(__dirname, './fixtures/element-templates/rest-connector.json')];


      const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion, elementTemplatePaths: templates });

      await modeler.click('[data-element-id="ServiceTask_1"]');

      await modeler.takeScreenshot(filepath);
      return modeler;
    }
  ));


  promises.push(triggerScreenshot(
    'camunda-platform-docs/docs/components/modeler/desktop-modeler/element-templates/img/chooser.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/cloud-reference/element-templates/chooser.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json'),
            templates = [path.join(__dirname, './fixtures/element-templates/all-templates.json')];


      const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion, elementTemplatePaths: templates });

      await modeler.click('[data-element-id="ServiceTask_1"]');

      await modeler.takeScreenshot(filepath);
      return modeler;
    }
  ));

  promises.push(triggerScreenshot(
    'camunda-platform-docs/docs/components/modeler/desktop-modeler/element-templates/img/modal.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/cloud-reference/element-templates/chooser.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json'),
            templates = [path.join(__dirname, './fixtures/element-templates/all-templates.json')];


      const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion, elementTemplatePaths: templates });

      await modeler.click('[data-element-id="ServiceTask_1"]');
      await modeler.click('button[title="Select a template"]');

      await modeler.takeScreenshot(filepath);
      return modeler;
    }
  ));

  promises.push(triggerScreenshot(
    'camunda-platform-docs/docs/components/modeler/desktop-modeler/element-templates/img/unlink-remove.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/cloud-reference/element-templates/overview.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json'),
            templates = [path.join(__dirname, './fixtures/element-templates/rest-connector.json')];


      const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion, elementTemplatePaths: templates });

      await modeler.click('[data-element-id="ServiceTask_1"]');
      await modeler.click('.bio-properties-panel-applied-template-button > button');

      await modeler.takeScreenshot(filepath);
      return modeler;
    }
  ));

  promises.push(triggerScreenshot(
    'camunda-platform-docs/docs/components/modeler/desktop-modeler/element-templates/img/update-template.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/cloud-reference/element-templates/overview.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json'),
            templates = [
              path.join(__dirname, './fixtures/element-templates/rest-connector.json'),
              path.join(__dirname, './fixtures/element-templates/rest-connector-v2.json')
            ];


      const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion, elementTemplatePaths: templates });

      await modeler.click('[data-element-id="ServiceTask_1"]');
      await modeler.click('.bio-properties-panel-template-update-available > button');

      await modeler.takeScreenshot(filepath);
      return modeler;
    }
  ));

  promises.push(triggerScreenshot(
    'camunda-platform-docs/docs/components/modeler/desktop-modeler/element-templates/img/template-not-found.png',
    async (filepath) => {
      const diagramPaths = [ path.join(__dirname, './fixtures/bpmn/cloud-reference/element-templates/overview.bpmn') ],
            config = path.join(__dirname, './fixtures/user-data/quickstart_with_prop_panel.json'),
            templates = [ ];


      const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion, elementTemplatePaths: templates });

      await modeler.click('[data-element-id="ServiceTask_1"]');
      await modeler.click('.bio-properties-panel-template-not-found > button');

      await modeler.takeScreenshot(filepath);
      return modeler;
    }
  ));

  return await Promise.all(promises);
};
