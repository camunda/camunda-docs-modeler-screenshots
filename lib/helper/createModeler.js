const fs = require('fs');
const os = require('os');
const path = require('path');

const fkill = require('fkill');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const Application = require('spectron').Application;

const {
  addAnnotation,
  connectTwoElements,
  clearAllAnnotations
} = require('./annotations');

const sharp = require('sharp');

const platform = os.platform();

const MODELER_DIST_PATH = '../../camunda-modeler/dist';

const { applicationPaths } = require('./applicationPaths');

const applicationPath = applicationPaths[ platform ];

if (!applicationPath) {
  throw new Error(`Platform ${ platform } not supported`);
}

class Modeler {
  constructor({
    diagramPaths = [],
    configPath,
    displayVersion
  } = {}) {

    this._tmpUserDataPath = copyUserData(configPath);

    this._tmpDiagramPaths = copyDiagrams(diagramPaths);

    const args = [
      ...this._tmpDiagramPaths,
      '--dangerously-enable-node-integration',
      '--disable-remote-interaction'
    ];
    if (displayVersion) {
      args.push(`--display-version=${displayVersion}`);
    }

    this.app = new Application({
      path: path.join(__dirname, MODELER_DIST_PATH, applicationPath),
      args,
      chromeDriverArgs: [
        `--user-data-dir=${ this._tmpUserDataPath }`
      ],
      webdriverOptions: {
        deprecationWarnings: false
      }
    });
  }

  async open() {
    await this.app.start();

    await this.getElement('.spinner-border.spinner-border-global.hidden');
  }

  async close() {
    await this.app.stop();

    await killModelerInstances();

    cleanUpDiagrams(this._tmpDiagramPaths);

    cleanUpUserData(this._tmpUserDataPath);
  }

  async getElement(selector) {
    const element = await this.app.client.$(selector);
    return element;
  }

  async click(selector) {
    const element = await this.getElement(selector);
    await element.click();
  }

  async rightClick(selector) {
    const element = await this.getElement(selector);
    await element.click({ button: 'right' });
  }

  async doubleClick(selector) {
    const element = await this.getElement(selector);
    await element.doubleClick();
  }

  async keys(keys) {
    await this.app.client.keys(keys);
  }

  async setValue(selector, value) {
    const element = await this.getElement(selector);
    await element.setValue(value);
  }

  async pause(ms) {
    await this.app.client.pause(ms);
  }

  async waitForExist(selector) {
    const element = await this.getElement(selector);
    await element.waitForExist;
  }

  async mouseOver(selector, xOffset = 0, yOffset = 0) {
    const element = await this.getElement(selector);

    await element.moveTo({ xOffset, yOffset });
  }

  async executeJavaScript(script) {
    await this.app.client.execute(script);
  }

  async annotate(selector, text, options) {
    await this.executeJavaScript(addAnnotation.toString() +
        `; addAnnotation('${selector}', '${text}', ${JSON.stringify(options)});`);
  }

  async connectTwoElements(selector1, selector2) {
    await this.executeJavaScript(connectTwoElements.toString() +
        `; connectTwoElements('${selector1}', '${selector2}');`);
  }

  async clearAnnotation() {
    this.executeJavaScript(clearAllAnnotations.toString() + '; clearAllAnnotations();');
  }

  /**
   *
   * @param  {String} filename
   * @param  {Object} [rect] = undefined
   * @param  {Object} [rect.left]
   * @param  {Object} [rect.top]
   * @param  {Object} [rect.width]
   * @param  {Object} [rect.height]
   */
  async takeScreenshot(filename, rect = undefined) {
    await this.app.client.saveScreenshot(filename);

    let imgBuffer = await sharp(filename)
      .toBuffer();

    if (rect) {
      imgBuffer = await sharp(imgBuffer)
        .extract(rect)
        .toBuffer();
    }

    await sharp(imgBuffer)
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .toFile(filename);
  }

}

/**
 * Create and return a Camunda Modeler instance.
 *
 * @param {Object} config
 * @param {Array<string>?} [config.diagramPath]
 * @param {string?} [config.configPath]
 * @param {string?} [config.displayVersion]
 *
 * @returns {Object}
 */
async function createModeler(config) {
  await killModelerInstances();

  const modeler = new Modeler(config);

  await modeler.open();

  return modeler;
}

module.exports = createModeler;


// helpers //////////

function cleanUpDiagrams(tmpDiagramPaths = []) {
  tmpDiagramPaths.forEach(tmpDiagramPath => {
    fs.unlinkSync(tmpDiagramPath);
  });
}

function cleanUpUserData(tmpUserDataPath) {
  rimraf.sync(tmpUserDataPath);
}

/**
 * Prepare custom diagram(s) to be opened when the Modeler is opened
 *
 * @param {Array<string>} diagramsPath path to diagram(s)
 *
 * @returns {string} path to the diagram directory
 */
function copyDiagrams(diagramPaths = []) {
  return diagramPaths.map(diagramPath => {
    mkdirp.sync(path.join(__dirname, '../tmp'));

    const tmpDiagramPath = path.join(__dirname, '../tmp', path.basename(diagramPath));

    fs.copyFileSync(diagramPath, tmpDiagramPath);

    return tmpDiagramPath;
  });
}

/**
 * Setup the config.json file to create custom userData
 *
 * @param {string} configPath path to config.json. A default config will be provided if undefined
 *
 * @returns {string} path to the user directory
 */
function copyUserData(configPath) {
  configPath = configPath ? configPath : path.join(__dirname, '../fixtures/user-data/default_config.json');

  const tmpUserDataConfigPath = path.join(__dirname, '../tmp/user-data/config.json');

  mkdirp.sync(path.join(__dirname, '../tmp/user-data'));

  fs.copyFileSync(configPath, tmpUserDataConfigPath);

  return path.dirname(tmpUserDataConfigPath);
}

async function killModelerInstances() {
  try {
    await fkill('Camunda Modeler', { silent: true });
  } catch (err) {
    console.error(err);
  }
}
