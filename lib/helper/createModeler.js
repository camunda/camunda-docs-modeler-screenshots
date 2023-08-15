const fs = require('fs');
const os = require('os');
const path = require('path');

const fkill = require('fkill');
const rimraf = require('rimraf');
const { _electron: electron } = require('playwright');
const crypto = require('crypto');

const {
  addAnnotation,
  connectTwoElements,
  clearAllAnnotations
} = require('./annotations');

const sharp = require('sharp');

const platform = os.platform();

const { applicationPaths } = require('./applicationPaths');

const applicationPath = applicationPaths[ platform ];

if (!applicationPath) {
  throw new Error(`Platform ${ platform } not supported`);
}

class Modeler {
  constructor({
    diagramPaths = [],
    configPath,
    elementTemplatePaths=[],
    displayVersion
  } = {}) {

    this._tmpUserDataPath = copyUserData(configPath);

    this._tmpDiagramPaths = copyDiagrams(diagramPaths);

    this._tmpElementTemplatePaths = copyElementTemplates(elementTemplatePaths, this._tmpUserDataPath);

    const args = [
      './app/prod.js',
      ...this._tmpDiagramPaths,
      '--dangerously-enable-node-integration',
      '--disable-remote-interaction',
      '--user-data-dir', this._tmpUserDataPath
    ];
    if (displayVersion) {
      args.push(`--display-version=${displayVersion}`);
    }

    this.app = electron.launch({
      cwd: './camunda-modeler',
      executablePath: './node_modules/.bin/electron',
      args
    });
  }

  async open() {
    this.app = await this.app;

    this.window = await this.app.firstWindow();

    await this.getElement('.spinner-border.spinner-border-global.hidden');
  }

  async close() {
    await this.app.close();

    delete this.window;

    cleanUpDiagrams(this._tmpDiagramPaths);

    cleanUpUserData(this._tmpUserDataPath);
  }

  async getElement(selector) {
    await this.window.waitForSelector(selector);
    const element = await this.window.locator(selector).first();
    return element;
  }

  async click(selector) {
    await this.window.click(selector, { force: true });
  }

  async rightClick(selector) {
    await this.window.click(selector, { button: 'right', force: true });

  }

  async doubleClick(selector) {
    const element = await this.getElement(selector);
    await element.dblclick();
  }

  async keys(keys) {
    await this.window.keyboard.press(keys);
  }

  async setValue(selector, value) {
    const element = await this.getElement(selector);
    await element.fill(value);
  }

  async pause(ms) {
    const promise = new Promise(resolve => setTimeout(resolve, ms));
    await promise;
  }

  async waitForExist(selector) {
    const element = await this.getElement(selector);
    await element.waitForExist;
  }

  async mouseOver(selector, xOffset = 0, yOffset = 0) {
    const element = await this.getElement(selector);

    await element.hover();
  }

  async executeJavaScript(script) {
    await this.window.evaluate(script);
  }

  async annotate(selector, text, options) {
    await this.getElement(selector);

    const script = '(' + addAnnotation.toString() +
    `)('${selector}', '${text}', ${JSON.stringify(options)})`;

    await this.executeJavaScript(script);
  }

  async connectTwoElements(selector1, selector2) {

    const script = '(' + connectTwoElements.toString() +
    `)('${selector1}', '${selector2}')`;

    await this.executeJavaScript(script);
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
    await this.window.screenshot({ path: filename });

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
  const uuid = crypto.randomUUID();

  const baseTmpPath = path.join(__dirname, '../tmp/diagrams', uuid);
  fs.mkdirSync(baseTmpPath, { recursive: true });

  return diagramPaths.map(diagramPath => {
    fs.mkdirSync(path.join(__dirname, '../tmp'), { recursive: true });

    const tmpDiagramPath = path.join(baseTmpPath, path.basename(diagramPath));

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
  const uuid = crypto.randomUUID();
  const basePath = path.join(__dirname, `../tmp/${uuid}/user-data`);

  configPath = configPath ? configPath : path.join(__dirname, '../fixtures/user-data/default_config.json');
  const flagsPath = path.join(__dirname, '../fixtures/flags.json');

  fs.mkdirSync(path.join(basePath), { recursive: true });

  fs.copyFileSync(configPath, path.join(basePath, 'config.json'));
  fs.copyFileSync(flagsPath, path.join(basePath, 'flags.json'));


  return basePath;
}


function copyElementTemplates(elementTemplatePaths = [], pathToUserData) {
  const TEMPLATE_PATH = path.join(`${pathToUserData}/resources/element-templates`);
  return elementTemplatePaths.map(templatePath => {
    fs.mkdirSync(TEMPLATE_PATH, { recursive: true });

    const tmpDiagramPath = path.join(TEMPLATE_PATH, path.basename(templatePath));

    fs.copyFileSync(templatePath, tmpDiagramPath);

    return tmpDiagramPath;
  });
}

async function killModelerInstances() {
  try {
    await fkill('Camunda Modeler', { silent: true });
  } catch (err) {
    console.error(err);
  }
}

module.exports.killModelerInstances = killModelerInstances;