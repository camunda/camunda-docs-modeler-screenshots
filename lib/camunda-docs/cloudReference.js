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

const SELF_MANAGED_CLUSTER_URL = process.env.SELF_MANAGED_CLUSTER_URL || 'https://zeebe.example.com';
const SELF_MANAGED_BASIC_AUTH_USERNAME = process.env.SELF_MANAGED_BASIC_AUTH_USERNAME || 'demo';
const SELF_MANAGED_BASIC_AUTH_PASSWORD = process.env.SELF_MANAGED_BASIC_AUTH_PASSWORD || 'demo';
const SELF_MANAGED_OAUTH_URL = process.env.SELF_MANAGED_OAUTH_URL || 'https://keycloak.example.com/auth/realms/camunda-platform/protocol/openid-connect/token';
const SELF_MANAGED_OAUTH_AUDIENCE = process.env.SELF_MANAGED_OAUTH_AUDIENCE || 'zeebe-api';

const CONNECTION_SELECTOR_BUTTON_SELECTOR = 'button[title="Configure Camunda 8 connection"]';
const CONNECTION_MANAGER_BUTTON_SELECTOR = 'a:text("Manage connections")';
const DEPLOYMENT_BUTTON_SELECTOR = 'button[title="Open file deployment"]';
const START_INSTANCE_BUTTON_SELECTOR = 'button[title="Open start instance"]';
const TASK_TESTING_BUTTON_SELECTOR = 'button[title="Toggle test view"]';

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
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop+var_panel.json');

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
      'camunda-docs/docs/components/modeler/desktop-modeler/img/connection-selector-offline.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

        await modeler.mouseOver(CONNECTION_SELECTOR_BUTTON_SELECTOR);

        await modeler.takeScreenshot(filepath,
          {
            left: 0,
            bottom: 0,
            width: 400,
            height: 200
          });
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/desktop-modeler/img/connection-selector-offline-open.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

        await modeler.click(CONNECTION_SELECTOR_BUTTON_SELECTOR);

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/desktop-modeler/img/connection-manager-add.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

        await modeler.click(CONNECTION_SELECTOR_BUTTON_SELECTOR);
        await modeler.click(CONNECTION_MANAGER_BUTTON_SELECTOR);
        await modeler.scrollIntoViewIfNeeded('button:text("Add connection")');

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/desktop-modeler/img/connection-manager-new-connection-loading.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

        await modeler.click(CONNECTION_SELECTOR_BUTTON_SELECTOR);
        await modeler.click(CONNECTION_MANAGER_BUTTON_SELECTOR);

        await modeler.click('button:text("Add connection")');

        await modeler.setValue('input[name="connectionManagerPlugin.c8connections[2].camundaCloudClusterUrl"]', SAAS_CLUSTER_URL);
        await modeler.setValue('input[name="connectionManagerPlugin.c8connections[2].camundaCloudClientId"]', CLIENT_ID);
        await modeler.setValue('input[name="connectionManagerPlugin.c8connections[2].camundaCloudClientSecret"]', CLIENT_SECRET);

        await modeler.scrollIntoViewIfNeeded('input[name="connectionManagerPlugin.c8connections[2].camundaCloudClientSecret"]');

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    ()=> triggerScreenshot(
      'camunda-docs/docs/components/modeler/desktop-modeler/img/connection-manager-new-connection-error.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

        await modeler.click(CONNECTION_SELECTOR_BUTTON_SELECTOR);
        await modeler.click(CONNECTION_MANAGER_BUTTON_SELECTOR);

        await modeler.click('button:text("Add connection")');

        await modeler.setValue('input[name="connectionManagerPlugin.c8connections[2].camundaCloudClusterUrl"]', SAAS_CLUSTER_URL + 'invalid');
        await modeler.setValue('input[name="connectionManagerPlugin.c8connections[2].camundaCloudClientId"]', CLIENT_ID);
        await modeler.setValue('input[name="connectionManagerPlugin.c8connections[2].camundaCloudClientSecret"]', CLIENT_SECRET);

        await modeler.click('label[for="radio-element-connectionManagerPlugin.c8connections[2].targetType-camunda-8-saas"]');

        await modeler.getElement('.status-icon.error');

        await modeler.scrollIntoViewIfNeeded('input[name="connectionManagerPlugin.c8connections[2].camundaCloudClientSecret"]');

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/desktop-modeler/img/connection-manager-new-connection-success.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

        await modeler.click(CONNECTION_SELECTOR_BUTTON_SELECTOR);
        await modeler.click(CONNECTION_MANAGER_BUTTON_SELECTOR);
        await modeler.click('button:text("Add connection")');

        await modeler.setValue('input[name="connectionManagerPlugin.c8connections[2].camundaCloudClusterUrl"]', SAAS_CLUSTER_URL);
        await modeler.setValue('input[name="connectionManagerPlugin.c8connections[2].camundaCloudClientId"]', CLIENT_ID);
        await modeler.setValue('input[name="connectionManagerPlugin.c8connections[2].camundaCloudClientSecret"]', CLIENT_SECRET);

        await modeler.click('label[for="radio-element-connectionManagerPlugin.c8connections[2].targetType-camunda-8-saas"]');

        await modeler.getElement('span:text("Connected")');

        await modeler.scrollIntoViewIfNeeded('input[name="connectionManagerPlugin.c8connections[2].camundaCloudClientSecret"]');

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/desktop-modeler/img/connection-selector-dev-connection.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json'),
              settingsPath = path.join(__dirname, '../fixtures/user-data/settings/default_connections.json'),
              additionalConfig = {
                files:{
                  [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn')]:{
                    'connection-manager':{
                      connectionId: 'saas-1'
                    }
                  }
                }
              };

        const modeler = await createModeler({ diagramPaths, configPath: config, additionalConfig, displayVersion, settingsPath });

        await modeler.click(CONNECTION_SELECTOR_BUTTON_SELECTOR);

        await modeler.getElement('.status-icon.success');

        await modeler.takeScreenshot(filepath,
          {
            left: 0,
            bottom: 0,
            width: 500,
            height: 250
          });
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/desktop-modeler/img/deploy-icon.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json'),
              settingsPath = path.join(__dirname, '../fixtures/user-data/settings/default_connections.json'),
              additionalConfig = {
                files:{
                  [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn')]:{
                    'connection-manager':{
                      connectionId: 'saas-1'
                    }
                  }
                }
              };

        const modeler = await createModeler({ diagramPaths, configPath: config, additionalConfig, displayVersion, settingsPath });

        await modeler.mouseOver(DEPLOYMENT_BUTTON_SELECTOR);

        await modeler.getElement('.status-icon.success');

        await modeler.takeScreenshot(filepath,
          {
            left: 0,
            bottom: 0,
            width: 500,
            height: 250
          });
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/desktop-modeler/img/deploy-diagram.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json'),
              settingsPath = path.join(__dirname, '../fixtures/user-data/settings/default_connections.json'),
              additionalConfig = {
                files:{
                  [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn')]:{
                    'connection-manager':{
                      connectionId: 'saas-1'
                    }
                  }
                }
              };

        const modeler = await createModeler({ diagramPaths, configPath: config, additionalConfig, displayVersion, settingsPath });

        await modeler.getElement('.status-icon.success');

        await modeler.click(DEPLOYMENT_BUTTON_SELECTOR);

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/desktop-modeler/img/deploy-diagram-success.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json'),
              settingsPath = path.join(__dirname, '../fixtures/user-data/settings/default_connections.json'),
              additionalConfig = {
                files:{
                  [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn')]:{
                    'connection-manager':{
                      connectionId: 'saas-1'
                    }
                  }
                }
              };

        const modeler = await createModeler({ diagramPaths, configPath: config, additionalConfig, displayVersion, settingsPath });

        await modeler.getElement('.status-icon.success');

        await modeler.click(DEPLOYMENT_BUTTON_SELECTOR);

        await modeler.click('.section__body button[type="submit"]');

        await modeler.getElement('h3:text("Process definition deployed")');

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/desktop-modeler/img/start-instance-icon.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/diagram3.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json'),
              settingsPath = path.join(__dirname, '../fixtures/user-data/settings/default_connections.json'),
              additionalConfig = {
                files:{
                  [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/diagram3.bpmn')]:{
                    'connection-manager':{
                      connectionId: 'saas-1'
                    }
                  }
                }
              };
        const modeler = await createModeler({ diagramPaths, configPath: config, additionalConfig, displayVersion, settingsPath });

        await modeler.getElement('.status-icon.success');

        await modeler.mouseOver(START_INSTANCE_BUTTON_SELECTOR);

        await modeler.takeScreenshot(filepath,
          {
            left: 0,
            bottom: 0,
            width: 500,
            height: 150
          });
        return modeler;
      }
    ),

    ()=> triggerScreenshot(
      'camunda-docs/docs/components/modeler/desktop-modeler/img/start-instance.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json'),
              settingsPath = path.join(__dirname, '../fixtures/user-data/settings/default_connections.json'),
              additionalConfig = {
                files:{
                  [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn')]:{
                    'connection-manager':{
                      connectionId: 'saas-1'
                    }
                  }
                }
              };
        const modeler = await createModeler({ diagramPaths, configPath: config, additionalConfig, displayVersion, settingsPath });

        await modeler.getElement('.status-icon.success');

        await modeler.click(START_INSTANCE_BUTTON_SELECTOR);

        await modeler.setValue(VARIABLES_INPUT_SELECTOR, '{\n  "myVariable": 1\n}');

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/components/modeler/desktop-modeler/img/start-instance-successful.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json'),
              settingsPath = path.join(__dirname, '../fixtures/user-data/settings/default_connections.json'),
              additionalConfig = {
                files:{
                  [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn')]:{
                    'connection-manager':{
                      connectionId: 'saas-1'
                    }
                  }
                }
              };
        const modeler = await createModeler({ diagramPaths, configPath: config, additionalConfig, displayVersion, settingsPath });

        await modeler.getElement('.status-icon.success');

        await modeler.click(START_INSTANCE_BUTTON_SELECTOR);

        await modeler.click('.section__body button[type="submit"]');

        await modeler.getElement('h3:text("Process instance started")');

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
        await modeler.waitForExist('.side-panel-header__type >> "Business Rule Task"');

        await modeler.click('.djs-context-pad .entry[data-action="replace"]');

        const element = await modeler.getElement('.djs-popup-search input');

        await element.focus();
        await element.pressSequentially('calc', { delay: 100 });
        await modeler.waitForExist('.djs-popup-results');

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
    ),

    {
      skip: () => triggerScreenshot(
        'camunda-docs/docs/components/modeler/desktop-modeler/img/task-testing/testing-tab.png',
        async (filepath) => {
          const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/task-testing.bpmn') ];
          const configPath = path.join(__dirname, '../fixtures/user-data/bottom_panel.json');

          const modeler = await createModeler({ diagramPaths, configPath, displayVersion });

          await modeler.click(DEPLOYMENT_BUTTON_SELECTOR);
          await modeler.click('label[for="radio-element-endpoint.targetType-camunda-8-saas"]');
          await modeler.setValue('input[name="endpoint.camundaCloudClusterUrl"]', SAAS_CLUSTER_URL);
          await modeler.setValue('input[name="endpoint.camundaCloudClientId"]', CLIENT_ID);
          await modeler.setValue('input[name="endpoint.camundaCloudClientSecret"]', CLIENT_SECRET);
          await modeler.click('.toggle-switch__switcher:has(input[name="endpoint.rememberCredentials"])');

          await modeler.click('[data-element-id="square"]');
          await modeler.click(TASK_TESTING_BUTTON_SELECTOR);

          // TODO(@jarekdanielak): Temporary workaround to trigger task testing connection check
          await modeler.click('button[data-testid="test-task-btn"]');
          await modeler.click(DEPLOYMENT_BUTTON_SELECTOR);

          await modeler.waitForExist('.output__status-icon--ready');

          await modeler.takeScreenshot(filepath);

          return modeler;
        }
      )
    },

    {
      skip: () => triggerScreenshot(
        'camunda-docs/docs/components/modeler/desktop-modeler/img/task-testing/testing-success.png',
        async (filepath) => {
          const diagramPath = path.join(__dirname, '../fixtures/bpmn/cloud-reference/task-testing.bpmn');
          const configPath = path.join(__dirname, '../fixtures/user-data/bottom_panel.json');
          const additionalConfig = {
            files: {
              [diagramPath]: {
                taskTesting: {
                  input: {
                    square: JSON.stringify({ n: 4 }, null, 2)
                  },
                  output: {
                    square: {
                      success: true,
                      variables: {
                        n: 4,
                        squared: 16
                      }
                    }
                  },
                }
              }
            }
          };

          const modeler = await createModeler({ diagramPaths: [ diagramPath ], configPath, additionalConfig, displayVersion });

          await modeler.click(DEPLOYMENT_BUTTON_SELECTOR);
          await modeler.setValue('input[name="endpoint.camundaCloudClusterUrl"]', SAAS_CLUSTER_URL);
          await modeler.setValue('input[name="endpoint.camundaCloudClientId"]', CLIENT_ID);
          await modeler.setValue('input[name="endpoint.camundaCloudClientSecret"]', CLIENT_SECRET);
          await modeler.click('.toggle-switch__switcher:has(input[name="endpoint.rememberCredentials"])');

          await modeler.click('[data-element-id="square"]');
          await modeler.click(TASK_TESTING_BUTTON_SELECTOR);

          // TODO(@jarekdanielak): Temporary workaround to trigger task testing connection check
          await modeler.click('button[data-testid="test-task-btn"]');
          await modeler.click(DEPLOYMENT_BUTTON_SELECTOR);

          await modeler.waitForExist('.output__status-icon--success');

          await modeler.takeScreenshot(filepath);

          return modeler;
        }
      )
    },

    {
      skip: () => triggerScreenshot(
        'camunda-docs/docs/components/modeler/desktop-modeler/img/task-testing/testing-incident.png',
        async (filepath) => {
          const diagramPath = path.join(__dirname, '../fixtures/bpmn/cloud-reference/task-testing.bpmn');
          const configPath = path.join(__dirname, '../fixtures/user-data/bottom_panel.json');
          const additionalConfig = {
            files: {
              [diagramPath]: {
                taskTesting: {
                  input: {
                    square: JSON.stringify({ n: 4 }, null, 2)
                  },
                  output: {
                    square: {
                      success: false,
                      incident: {
                        processDefinitionId: 'Process_13hw8pf',
                        errorType: 'IO_MAPPING_ERROR',
                        errorMessage: 'failed to evaluate expression "{ foo: bar }": no variable found for name "bar"',
                        elementId: 'square',
                        creationTime: '2025-10-17T14:06:55.382Z',
                        state: 'ACTIVE',
                        tenantId: '<default>',
                        incidentKey: '6755399444623594',
                        processDefinitionKey: '2251799817254638',
                        processInstanceKey: '6755399444623585',
                        elementInstanceKey: '6755399444623587',
                        jobKey: '6755399444623591'
                      },
                      variables: {
                        n: 4,
                        squared: 16
                      }
                    }
                  },
                }
              }
            }
          };

          const modeler = await createModeler({ diagramPaths: [ diagramPath ], configPath, additionalConfig, displayVersion });

          await modeler.click(DEPLOYMENT_BUTTON_SELECTOR);
          await modeler.setValue('input[name="endpoint.camundaCloudClusterUrl"]', SAAS_CLUSTER_URL);
          await modeler.setValue('input[name="endpoint.camundaCloudClientId"]', CLIENT_ID);
          await modeler.setValue('input[name="endpoint.camundaCloudClientSecret"]', CLIENT_SECRET);
          await modeler.click('.toggle-switch__switcher:has(input[name="endpoint.rememberCredentials"])');

          await modeler.click('[data-element-id="square"]');
          await modeler.click(TASK_TESTING_BUTTON_SELECTOR);

          // TODO(@jarekdanielak): Temporary workaround to trigger task testing connection check
          await modeler.click('button[data-testid="test-task-btn"]');
          await modeler.click(DEPLOYMENT_BUTTON_SELECTOR);

          await modeler.waitForExist('.output__body:has(.code__editor)');

          await modeler.takeScreenshot(filepath);

          return modeler;
        }
      ),
    },

    // self-managed screenshots

    ()=> triggerScreenshot(
      'camunda-docs/docs/self-managed/components/modeler/desktop-modeler/img/connection-selector-offline.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

        await modeler.mouseOver(CONNECTION_SELECTOR_BUTTON_SELECTOR);

        await modeler.takeScreenshot(filepath,
          {
            left: 0,
            bottom: 0,
            width: 500,
            height: 250
          });
        return modeler;
      }
    ),

    ()=> triggerScreenshot(
      'camunda-docs/docs/self-managed/components/modeler/desktop-modeler/img/connection-selector-offline-open.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

        await modeler.click(CONNECTION_SELECTOR_BUTTON_SELECTOR);

        await modeler.takeScreenshot(filepath,
          {
            left: 0,
            bottom: 0,
            width: 500,
            height: 250
          });
        return modeler;
      }
    ),



    ()=> triggerScreenshot(
      'camunda-docs/docs/self-managed/components/modeler/desktop-modeler/img/connection-manager-add.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

        await modeler.click(CONNECTION_SELECTOR_BUTTON_SELECTOR);
        await modeler.click(CONNECTION_MANAGER_BUTTON_SELECTOR);

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    ()=> triggerScreenshot(
      'camunda-docs/docs/self-managed/components/modeler/desktop-modeler/img/connection-selector-new-connection.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

        await modeler.click(CONNECTION_SELECTOR_BUTTON_SELECTOR);
        await modeler.click(CONNECTION_MANAGER_BUTTON_SELECTOR);
        await modeler.click('button:text("Add connection")');

        await modeler.setValue('input[name="connectionManagerPlugin.c8connections[2].name"]', 'New Connection');
        await modeler.click('label[for="radio-element-connectionManagerPlugin.c8connections[2].targetType-camunda-8-self-managed"]');
        await modeler.click('label[for="radio-element-connectionManagerPlugin.c8connections[2].authType-oauth"]');
        await modeler.setValue('input[name="connectionManagerPlugin.c8connections[2].contactPoint"]', SELF_MANAGED_CLUSTER_URL);
        await modeler.setValue('input[name="connectionManagerPlugin.c8connections[2].clientId"]', CLIENT_ID);
        await modeler.setValue('input[name="connectionManagerPlugin.c8connections[2].clientSecret"]', CLIENT_SECRET);
        await modeler.setValue('input[name="connectionManagerPlugin.c8connections[2].oauthURL"]', SELF_MANAGED_OAUTH_URL);
        await modeler.setValue('input[name="connectionManagerPlugin.c8connections[2].audience"]', SELF_MANAGED_OAUTH_AUDIENCE);

        await modeler.click('button:text("Done")');
        await modeler.pause(500);

        await modeler.click(CONNECTION_SELECTOR_BUTTON_SELECTOR);

        await modeler.takeScreenshot(filepath,
          {
            left: 0,
            bottom: 0,
            width: 400,
            height: 300
          });
        return modeler;
      }
    ),

    ()=> triggerScreenshot(
      'camunda-docs/docs/self-managed/components/modeler/desktop-modeler/img/connection-with-sm.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

        await modeler.click(CONNECTION_SELECTOR_BUTTON_SELECTOR);
        await modeler.click(CONNECTION_MANAGER_BUTTON_SELECTOR);
        await modeler.click('button:text("Add connection")');

        await modeler.click('label[for="radio-element-connectionManagerPlugin.c8connections[2].targetType-camunda-8-self-managed"]');

        await modeler.scrollIntoViewIfNeeded('label[for="radio-element-connectionManagerPlugin.c8connections[2].targetType-camunda-8-self-managed"]');

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    ()=> triggerScreenshot(
      'camunda-docs/docs/self-managed/components/modeler/desktop-modeler/img/connection-with-basic-auth.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

        await modeler.click(CONNECTION_SELECTOR_BUTTON_SELECTOR);
        await modeler.click(CONNECTION_MANAGER_BUTTON_SELECTOR);
        await modeler.click('button:text("Add connection")');

        await modeler.click('label[for="radio-element-connectionManagerPlugin.c8connections[2].targetType-camunda-8-self-managed"]');
        await modeler.click('label[for="radio-element-connectionManagerPlugin.c8connections[2].authType-basic"]');

        await modeler.setValue('input[name="connectionManagerPlugin.c8connections[2].contactPoint"]', SELF_MANAGED_CLUSTER_URL);
        await modeler.setValue('input[name="connectionManagerPlugin.c8connections[2].basicAuthUsername"]', SELF_MANAGED_BASIC_AUTH_USERNAME);
        await modeler.setValue('input[name="connectionManagerPlugin.c8connections[2].basicAuthPassword"]', SELF_MANAGED_BASIC_AUTH_PASSWORD);

        await modeler.scrollIntoViewIfNeeded('input[name="connectionManagerPlugin.c8connections[2].basicAuthPassword"]');

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    ()=> triggerScreenshot(
      'camunda-docs/docs/self-managed/components/modeler/desktop-modeler/img/connection-with-endpoint.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

        await modeler.click(CONNECTION_SELECTOR_BUTTON_SELECTOR);
        await modeler.click(CONNECTION_MANAGER_BUTTON_SELECTOR);
        await modeler.click('button:text("Add connection")');

        await modeler.click('label[for="radio-element-connectionManagerPlugin.c8connections[2].targetType-camunda-8-self-managed"]');

        await modeler.setValue('input[name="connectionManagerPlugin.c8connections[2].contactPoint"]', SELF_MANAGED_CLUSTER_URL);

        await modeler.scrollIntoViewIfNeeded('input[name="connectionManagerPlugin.c8connections[2].contactPoint"]');

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    ()=> triggerScreenshot(
      'camunda-docs/docs/self-managed/components/modeler/desktop-modeler/img/connection-with-oauth.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json');

        const modeler = await createModeler({ diagramPaths, configPath: config, displayVersion });

        await modeler.click(CONNECTION_SELECTOR_BUTTON_SELECTOR);
        await modeler.click(CONNECTION_MANAGER_BUTTON_SELECTOR);
        await modeler.click('button:text("Add connection")');

        await modeler.click('label[for="radio-element-connectionManagerPlugin.c8connections[2].targetType-camunda-8-self-managed"]');
        await modeler.click('label[for="radio-element-connectionManagerPlugin.c8connections[2].authType-oauth"]');

        await modeler.setValue('input[name="connectionManagerPlugin.c8connections[2].clientId"]', CLIENT_ID);
        await modeler.setValue('input[name="connectionManagerPlugin.c8connections[2].clientSecret"]', CLIENT_SECRET);
        await modeler.setValue('input[name="connectionManagerPlugin.c8connections[2].oauthURL"]', SELF_MANAGED_OAUTH_URL);
        await modeler.setValue('input[name="connectionManagerPlugin.c8connections[2].audience"]', SELF_MANAGED_OAUTH_AUDIENCE);

        await modeler.scrollIntoViewIfNeeded('input[name="connectionManagerPlugin.c8connections[2].scope"]');

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/self-managed/components/modeler/desktop-modeler/img/deploy-selection.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json'),
              settingsPath = path.join(__dirname, '../fixtures/user-data/settings/default_connections.json'),
              additionalConfig = {
                files:{
                  [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn')]:{
                    'connection-manager':{
                      connectionId: 'saas-1'
                    }
                  }
                }
              };

        const modeler = await createModeler({ diagramPaths, configPath: config, additionalConfig, displayVersion, settingsPath });

        await modeler.click(CONNECTION_SELECTOR_BUTTON_SELECTOR);

        await modeler.getElement('.status-icon.success');

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/self-managed/components/modeler/desktop-modeler/img/deploy-icon.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json'),
              settingsPath = path.join(__dirname, '../fixtures/user-data/settings/default_connections.json'),
              additionalConfig = {
                files:{
                  [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn')]:{
                    'connection-manager':{
                      connectionId: 'saas-1'
                    }
                  }
                }
              };

        const modeler = await createModeler({ diagramPaths, configPath: config, additionalConfig, displayVersion, settingsPath });

        await modeler.mouseOver(DEPLOYMENT_BUTTON_SELECTOR);

        await modeler.getElement('.status-icon.success');

        await modeler.takeScreenshot(filepath,
          {
            left: 0,
            bottom: 0,
            width: 500,
            height: 200
          });
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/self-managed/components/modeler/desktop-modeler/img/deploy-diagram.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json'),
              settingsPath = path.join(__dirname, '../fixtures/user-data/settings/default_connections.json'),
              additionalConfig = {
                files:{
                  [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn')]:{
                    'connection-manager':{
                      connectionId: 'saas-1'
                    }
                  }
                }
              };

        const modeler = await createModeler({ diagramPaths, configPath: config, additionalConfig, displayVersion, settingsPath });

        await modeler.getElement('.status-icon.success');

        await modeler.click(DEPLOYMENT_BUTTON_SELECTOR);

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    ),

    () => triggerScreenshot(
      'camunda-docs/docs/self-managed/components/modeler/desktop-modeler/img/deploy-success.png',
      async (filepath) => {
        const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn') ],
              config = path.join(__dirname, '../fixtures/user-data/quickstart_with_prop_panel.json'),
              settingsPath = path.join(__dirname, '../fixtures/user-data/settings/default_connections.json'),
              additionalConfig = {
                files:{
                  [ path.join(__dirname, '../fixtures/bpmn/cloud-reference/quickstart.bpmn')]:{
                    'connection-manager':{
                      connectionId: 'saas-1'
                    }
                  }
                }
              };

        const modeler = await createModeler({ diagramPaths, configPath: config, additionalConfig, displayVersion, settingsPath });

        await modeler.getElement('.status-icon.success');

        await modeler.click(DEPLOYMENT_BUTTON_SELECTOR);

        await modeler.click('.section__body button[type="submit"]');

        await modeler.getElement('h3:text("Process definition deployed")');

        await modeler.takeScreenshot(filepath);
        return modeler;
      }
    )
  ];
};
