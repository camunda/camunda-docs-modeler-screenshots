const createModeler = require('../helper/createModeler');

const path = require('path');
const { triggerScreenshot } = require('../helper/screenshotUtil');

const annotationOptions = {
  top: { x: 0, y: -50 },
  right: { x: 50, y: 0 },
  bottom: { x: 0, y: 50 },
  left: { x: -50, y: 0 }
};

const CLIENT_ID = process.env.CLIENT_ID || 'p8isUasaaaaaaaaa.uiQOel760fTh2';
const CLIENT_SECRET = process.env.CLIENT_SECRET || '**********************';

const SAAS_CLUSTER_URL = process.env.CLUSTER_URL || 'https://1fajsag1sga.jfk-1.zeebe.camunda.io';
const SAAS_OAUTH_URL = process.env.OAUTH_URL || 'https://login.cloud.camunda.io/oauth/token';
const SAAS_OAUTH_AUDIENCE = process.env.OAUTH_AUDIENCE || 'zeebe.camunda.io';

const SELF_MANAGED_CLUSTER_URL = process.env.SELF_MANAGED_CLUSTER_URL || 'https://zeebe.example.com';
const SELF_MANAGED_BASIC_AUTH_USERNAME = process.env.SELF_MANAGED_BASIC_AUTH_USERNAME || 'demo';
const SELF_MANAGED_BASIC_AUTH_PASSWORD = process.env.SELF_MANAGED_BASIC_AUTH_PASSWORD || 'demo';
const SELF_MANAGED_OAUTH_URL = process.env.SELF_MANAGED_OAUTH_URL || 'https://keycloak.example.com/auth/realms/camunda-platform/protocol/openid-connect/token';
const SELF_MANAGED_OAUTH_AUDIENCE = process.env.SELF_MANAGED_OAUTH_AUDIENCE || 'zeebe-api';

const DEPLOYMENT_BUTTON_SELECTOR = 'button[title="Open file deployment"]';
const START_INSTANCE_BUTTON_SELECTOR = 'button[title="Open start instance"]';

const VARIABLES_INPUT_SELECTOR = '.cm-content';

module.exports = function startScreenshotBatch(displayVersion) {

  return [

    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/desktop-modeler/img/empty.png',
      async (filepath) => {
        const config = path.join(__dirname, '../fixtures/user-data/quickstart_large_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths: [], configPath: config, displayVersion });

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/desktop-modeler/img/new-diagram.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/diagram1.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/desktop-modeler/img/elements.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/diagram2.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

        await modeler.annotate('.djs-palette-entries', 'Palette of BPMN elements', annotationOptions.right);

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/desktop-modeler/img/element-configuration.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/diagram2.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

        await modeler.click('[data-element-id="serviceTask_1"]');
        await modeler.annotate('.bpmn-icon-screw-wrench', 'Use <b>wrench</b> icon to morph elements', annotationOptions.bottom);

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/desktop-modeler/img/properties-panel.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/diagram2.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

        await modeler.click('[data-element-id="serviceTask_1"]');
        await modeler.annotate('.bio-properties-panel', 'Use the <b>properties panel</b> to configure elements', annotationOptions.left);

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/desktop-modeler/img/deploy-icon.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/diagram2.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

        await modeler.mouseOver(DEPLOYMENT_BUTTON_SELECTOR);

        await modeler.takeScreenshot(filepath,
          {
            left: 0,
            bottom: 0,
            width: 350,
            height: 150
          });
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/desktop-modeler/img/deploy-diagram-camunda-cloud.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/diagram2.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

        await modeler.click(DEPLOYMENT_BUTTON_SELECTOR);
        await modeler.click('label[for="radio-element-camunda-8-saas"]');

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/desktop-modeler/img/deploy-diagram-camunda-cloud-success.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/diagram3.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

        await modeler.click(DEPLOYMENT_BUTTON_SELECTOR);
        await modeler.click('label[for="radio-element-camunda-8-saas"]');
        await modeler.setValue('input[name="endpoint.camundaCloudClusterUrl"]', SAAS_CLUSTER_URL);
        await modeler.setValue('input[name="endpoint.camundaCloudClientId"]', CLIENT_ID);
        await modeler.setValue('input[name="endpoint.camundaCloudClientSecret"]', CLIENT_SECRET);
        await modeler.pause(5000);

        await modeler.click('.section__body button[type="submit"]');

        await modeler.pause(4000);

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/desktop-modeler/img/deploy-diagram-camunda-cloud-remember.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/diagram3.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

        await modeler.click(DEPLOYMENT_BUTTON_SELECTOR);
        await modeler.click('label[for="radio-element-camunda-8-saas"]');
        await modeler.setValue('input[name="endpoint.camundaCloudClusterUrl"]', SAAS_CLUSTER_URL);
        await modeler.setValue('input[name="endpoint.camundaCloudClientId"]', CLIENT_ID);
        await modeler.setValue('input[name="endpoint.camundaCloudClientSecret"]', CLIENT_SECRET);
        await modeler.click('div[role="dialog"] span.toggle-switch__slider');
        await modeler.pause(1000);

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/desktop-modeler/img/start-instance-icon.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/diagram3.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

        await modeler.mouseOver(START_INSTANCE_BUTTON_SELECTOR);

        await modeler.takeScreenshot(filepath,
          {
            left: 0,
            bottom: 0,
            width: 350,
            height: 150
          });
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/desktop-modeler/img/start-instance-step-1.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/diagram3.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

        await modeler.click(START_INSTANCE_BUTTON_SELECTOR);

        await modeler.click('label[for="radio-element-camunda-8-saas"]');

        await modeler.setValue('input[name="endpoint.camundaCloudClusterUrl"]', SAAS_CLUSTER_URL);
        await modeler.setValue('input[name="endpoint.camundaCloudClientId"]', CLIENT_ID);
        await modeler.setValue('input[name="endpoint.camundaCloudClientSecret"]', CLIENT_SECRET);

        await modeler.click('div[role="dialog"] span.toggle-switch__slider');

        await modeler.pause(2000);

        await modeler.takeScreenshot(filepath);

        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/desktop-modeler/img/start-instance-step-2.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/diagram3.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

        await modeler.click(START_INSTANCE_BUTTON_SELECTOR);

        await modeler.click('label[for="radio-element-camunda-8-saas"]');

        await modeler.setValue('input[name="endpoint.camundaCloudClusterUrl"]', SAAS_CLUSTER_URL);
        await modeler.setValue('input[name="endpoint.camundaCloudClientId"]', CLIENT_ID);
        await modeler.setValue('input[name="endpoint.camundaCloudClientSecret"]', CLIENT_SECRET);

        await modeler.click('div[role="dialog"] span.toggle-switch__slider');

        await modeler.pause(2000);

        await modeler.click('.section__body button[type="submit"]');

        await modeler.pause(2000);

        await modeler.setValue(VARIABLES_INPUT_SELECTOR, '{ "myVariable": 1 }');

        await modeler.pause(2000);

        await modeler.takeScreenshot(filepath);

        return modeler;
      }
    ),


    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/desktop-modeler/img/start-instance-successful.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/diagram3.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

        await modeler.click(START_INSTANCE_BUTTON_SELECTOR);

        await modeler.click('label[for="radio-element-camunda-8-saas"]');

        await modeler.setValue('input[name="endpoint.camundaCloudClusterUrl"]', SAAS_CLUSTER_URL);
        await modeler.setValue('input[name="endpoint.camundaCloudClientId"]', CLIENT_ID);
        await modeler.setValue('input[name="endpoint.camundaCloudClientSecret"]', CLIENT_SECRET);

        await modeler.click('div[role="dialog"] span.toggle-switch__slider');

        await modeler.pause(2000);

        await modeler.click('.section__body button[type="submit"]');

        await modeler.pause(2000);

        await modeler.setValue(VARIABLES_INPUT_SELECTOR, '{ "a": 1 }');

        await modeler.click('div.section__body button.btn-primary');

        await modeler.pause(2000);

        await modeler.takeScreenshot(filepath);

        return modeler;
      }
    ),


    // self-managed
    () => triggerScreenshot(
      'camunda-docs/docs/self-managed/components/modeler/desktop-modeler/img/deploy-icon.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/diagram2.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

        await modeler.mouseOver(DEPLOYMENT_BUTTON_SELECTOR);

        await modeler.takeScreenshot(filepath,
          {
            left: 0,
            bottom: 0,
            width: 350,
            height: 150
          });
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/self-managed/components/modeler/desktop-modeler/img/deploy-empty.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/diagram2.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

        await modeler.click(DEPLOYMENT_BUTTON_SELECTOR);
        await modeler.click('label[for="radio-element-camunda-8-self-managed"]');

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/self-managed/components/modeler/desktop-modeler/img/deploy-endpoint.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/diagram3.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

        await modeler.click(DEPLOYMENT_BUTTON_SELECTOR);
        await modeler.click('label[for="radio-element-camunda-8-self-managed"]');
        await modeler.setValue('input[name="endpoint.contactPoint"]', SELF_MANAGED_CLUSTER_URL);

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/self-managed/components/modeler/desktop-modeler/img/deploy-with-basic-auth.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/diagram3.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

        await modeler.click(DEPLOYMENT_BUTTON_SELECTOR);
        await modeler.click('label[for="radio-element-camunda-8-self-managed"]');
        await modeler.click('label[for="radio-element-basic"]');
        await modeler.setValue('input[name="endpoint.contactPoint"]', SELF_MANAGED_CLUSTER_URL);
        await modeler.setValue('input[name="endpoint.basicAuthUsername"]', SELF_MANAGED_BASIC_AUTH_USERNAME);
        await modeler.setValue('input[name="endpoint.basicAuthPassword"]', SELF_MANAGED_BASIC_AUTH_PASSWORD);

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/self-managed/components/modeler/desktop-modeler/img/deploy-with-oauth.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/diagram3.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

        await modeler.click(DEPLOYMENT_BUTTON_SELECTOR);
        await modeler.click('label[for="radio-element-camunda-8-self-managed"]');
        await modeler.click('label[for="radio-element-oauth"]');
        await modeler.setValue('input[name="endpoint.contactPoint"]', SELF_MANAGED_CLUSTER_URL);
        await modeler.setValue('input[name="endpoint.clientId"]', CLIENT_ID);
        await modeler.setValue('input[name="endpoint.clientSecret"]', CLIENT_SECRET);
        await modeler.setValue('input[name="endpoint.oauthURL"]', SELF_MANAGED_OAUTH_URL);
        await modeler.setValue('input[name="endpoint.audience"]', SELF_MANAGED_OAUTH_AUDIENCE);

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/self-managed/components/modeler/desktop-modeler/img/deploy-success.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/diagram3.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

        // we deploy to SaaS here, but treat it like self-managed
        // this way we get a self-managed deploy success notification,
        // not a SaaS one
        await modeler.click(DEPLOYMENT_BUTTON_SELECTOR);
        await modeler.click('label[for="radio-element-camunda-8-self-managed"]');
        await modeler.click('label[for="radio-element-oauth"]');
        await modeler.setValue('input[name="endpoint.contactPoint"]', SAAS_CLUSTER_URL);
        await modeler.setValue('input[name="endpoint.clientId"]', CLIENT_ID);
        await modeler.setValue('input[name="endpoint.clientSecret"]', CLIENT_SECRET);
        await modeler.setValue('input[name="endpoint.oauthURL"]', SAAS_OAUTH_URL);
        await modeler.setValue('input[name="endpoint.audience"]', SAAS_OAUTH_AUDIENCE);
        await modeler.pause(5000);

        await modeler.click('.section__body button[type="submit"]');

        await modeler.pause(4000);

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    // process applications //////////////////////
    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/desktop-modeler/img/process-applications/overlay.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/process-applications/consumer-loan-application.bpmn') ],
              processApplicationPaths = [ path.join(__dirname, '../fixtures/process-applications/.process-application') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, processApplicationPaths, configPath: config, displayVersion });

        await modeler.click('button[title="This file is part of a process application"]');

        await modeler.takeScreenshot(filepath,
          {
            left: 0,
            bottom: 0,
            width: 700,
            height: 500
          });
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/desktop-modeler/img/process-applications/grouping.png',
      async (filepath) => {
        const diagramPaths = [
                path.join(__dirname, '../fixtures/process-applications/credit-score-calculation.dmn'),
                path.join(__dirname, '../fixtures/process-applications/interest-rate-calculation.dmn'),
                path.join(__dirname, '../fixtures/process-applications/consumer-loan-application.bpmn')
              ],
              processApplicationPaths = [ path.join(__dirname, '../fixtures/process-applications/.process-application') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, processApplicationPaths, configPath: config, displayVersion });

        await modeler.takeScreenshot(filepath,
          {
            left: 0,
            top: 0,
            width: 1000,
            height: 300
          });
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/desktop-modeler/img/process-applications/link-resources.png',
      async (filepath) => {
        const diagramPaths = [
                path.join(__dirname, '../fixtures/process-applications/credit-score-calculation.dmn'),
                path.join(__dirname, '../fixtures/process-applications/interest-rate-calculation.dmn'),
                path.join(__dirname, '../fixtures/process-applications/consumer-loan-application.bpmn')
              ],
              processApplicationPaths = [ path.join(__dirname, '../fixtures/process-applications/.process-application') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, processApplicationPaths, configPath: config, displayVersion });

        await modeler.click('.djs-element[data-element-id="Activity_1t3a333"]');
        await modeler.waitForExist('.bio-properties-panel-header-type[title="Business Rule Task"]');

        await modeler.click('.djs-context-pad .entry[data-action="replace"]');

        const element = await modeler.getElement('.djs-popup-search input');

        await element.focus();
        await element.pressSequentially('calc', { delay: 100 });
        await modeler.waitForExist('.djs-popup-results [data-group="decisions"]:first-of-type');

        await modeler.takeScreenshot(filepath,
          {
            left: 0,
            top: 0,
            width: 1000,
            height: 600
          }
        );

        return modeler;
      }
    ),

    // element templates //////////////////////
    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/element-templates/img/overview.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/element-templates/overview.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json'),
              templates = [ path.join(__dirname, '../fixtures/element-templates/rest-connector.json') ];


        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion, elementTemplatePaths: templates });

        await modeler.click('[data-element-id="ServiceTask_1"]');

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/desktop-modeler/element-templates/img/chooser.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/element-templates/chooser.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json'),
              templates = [ path.join(__dirname, '../fixtures/element-templates/all-templates.json') ];


        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion, elementTemplatePaths: templates });

        await modeler.click('[data-element-id="ServiceTask_1"]');

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/desktop-modeler/element-templates/img/modal.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/element-templates/chooser.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json'),
              templates = [ path.join(__dirname, '../fixtures/element-templates/all-templates.json') ];


        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion, elementTemplatePaths: templates });

        await modeler.click('[data-element-id="ServiceTask_1"]');
        await modeler.click('button[title="Select a template"]');

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/desktop-modeler/element-templates/img/unlink-remove.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/element-templates/overview.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json'),
              templates = [ path.join(__dirname, '../fixtures/element-templates/rest-connector.json') ];


        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion, elementTemplatePaths: templates });

        await modeler.click('[data-element-id="ServiceTask_1"]');
        await modeler.click('.bio-properties-panel-applied-template-button > button');

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/desktop-modeler/element-templates/img/update-template.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/element-templates/overview.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json'),
              templates = [
                path.join(__dirname, '../fixtures/element-templates/rest-connector.json'),
                path.join(__dirname, '../fixtures/element-templates/rest-connector-v2.json')
              ];


        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion, elementTemplatePaths: templates });

        await modeler.click('[data-element-id="ServiceTask_1"]');
        await modeler.click('.bio-properties-panel-template-update-available > button');

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/desktop-modeler/element-templates/img/template-not-found.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/element-templates/overview.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json'),
              templates = [ ];


        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion, elementTemplatePaths: templates });

        await modeler.click('[data-element-id="ServiceTask_1"]');
        await modeler.click('.bio-properties-panel-template-not-found > button');

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/element-templates/img/field-dropdown.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/element-templates/overview.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json'),
              templates = [ path.join(__dirname, '../fixtures/element-templates/rest-connector.json') ];


        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion, elementTemplatePaths: templates });

        await modeler.click('[data-element-id="ServiceTask_1"]');
        await modeler.annotate('[data-entry-id="custom-entry-io.camunda.connectors.RestConnector-s1-3"]', 'Dropdown');

        await modeler.takeScreenshot(filepath);

        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/element-templates/img/groups.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/element-templates/overview.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json'),
              templates = [ path.join(__dirname, '../fixtures/element-templates/rest-connector-groups.json') ];


        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion, elementTemplatePaths: templates });

        await modeler.click('[data-element-id="ServiceTask_1"]');

        await modeler.takeScreenshot(filepath);

        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/element-templates/img/icons.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/element-templates/icon.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json'),
              templates = [ path.join(__dirname, '../fixtures/element-templates/all-templates.json') ];


        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion, elementTemplatePaths: templates });

        await modeler.click('[data-element-id="ServiceTask_1"]');

        await modeler.takeScreenshot(filepath);

        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/element-templates/img/entries-visible.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/element-templates/entries-visible.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel_entries_visible.json'),
              templates = [ path.join(__dirname, '../fixtures/element-templates/all-templates.json') ];


        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion, elementTemplatePaths: templates });

        await modeler.click('[data-element-id="ServiceTask_1"]');

        await modeler.takeScreenshot(filepath);

        return modeler;
      }
    )

  ];
};
