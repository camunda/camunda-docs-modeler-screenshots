const fs = require('node:fs');
const path = require('node:path');

const fkill = require('fkill');
const { _electron: electron } = require('playwright-core');

require('dotenv').config();

const {
  addAnnotation,
  connectTwoElements,
  clearAllAnnotations
} = require('./annotations');

const sharp = require('sharp');

const { readManifest } = require('./helper');


class Modeler {
  constructor({
    diagramPaths = [],
    configPath,
    elementTemplatePaths = [],
    processApplicationPaths = [],
    displayVersion
  } = {}) {
    this._ensureTempDirectory();

    this._tmpUserDataPath = copyUserData(configPath);

    this._tmpFilePaths = copyTemporaryFiles([
      ...diagramPaths,
      ...processApplicationPaths
    ]);

    this._tmpElementTemplatePaths = copyElementTemplates(elementTemplatePaths, this._tmpUserDataPath);

    this._args = [
      './app/prod.js',
      ...diagramPaths,
      '--dangerously-enable-node-integration',
      '--disable-remote-interaction',
      '--user-data-dir', this._tmpUserDataPath
    ];

    if (displayVersion) {
      this._args.push(`--display-version=${displayVersion}`);
    }
  }

  _ensureTempDirectory() {
    fs.mkdirSync(path.join(__dirname, '../tmp'), { recursive: true });
  }

  async open() {
    const args = this._args;

    const {
      executablePath
    } = await readManifest();

    this.app = await electron.launch({
      executablePath,
      args
    });

    this.window = await this.app.firstWindow();

    await this.getElement('.spinner-border.spinner-border-global.hidden');
  }

  async close() {
    await this.app.close();

    delete this.window;

    removeTemporaryFiles(this._tmpFilePaths);

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
   * @param  {number} [rect.top]
   * @param  {number} [rect.right]
   * @param  {number} [rect.bottom]
   * @param  {number} [rect.left]
   * @param  {number} [rect.width]
   * @param  {number} [rect.height]
   */
  async takeScreenshot(filename, rect = undefined) {
    await this.window.screenshot({ path: filename });

    let img = await sharp(filename),
        metadata = await img.metadata();

    let imgBuffer = await img.toBuffer();

    if (rect) {
      if ('right' in rect) {
        rect.left = metadata.width - rect.width - rect.right;

        delete rect.right;
      }

      if ('bottom' in rect) {
        rect.top = metadata.height - rect.height - rect.bottom;

        delete rect.bottom;
      }

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
 * @returns {Modeler}
 */
async function createModeler(config) {
  const modeler = new Modeler(config);

  await modeler.open();

  return modeler;
}

module.exports = createModeler;


// helpers //////////

function removeTemporaryFiles(tmpFilePaths = []) {

  // Nothing to clean up
  if (!tmpFilePaths.length) {
    return;
  }

  // Assumes all files share a tmp directory
  const filePath = tmpFilePaths[0];

  const fileDirPath = path.dirname(filePath);

  fs.rmSync(fileDirPath, { recursive: true });
}

function cleanUpUserData(tmpUserDataPath) {
  fs.rmSync(tmpUserDataPath, { recursive: true });
}

/**
 * Copy files to a temporary directory.
 *
 * @param {string[]} filePaths
 *
 * @returns {string} path to the file directory
 */
function copyTemporaryFiles(filePaths = []) {
  if (!filePaths.length) {
    return [];
  }

  fs.mkdirSync(path.join(__dirname, '../tmp/workspace'), { recursive: true });

  const basePath = fs.mkdtempSync(path.join(__dirname, '../tmp/workspace/files-'));

  return filePaths.map(filePath => {
    const tmpFilePath = path.join(basePath, path.basename(filePath));

    fs.copyFileSync(filePath, tmpFilePath);

    return tmpFilePath;
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

  fs.mkdirSync(path.join(__dirname, '../tmp/workspace'), { recursive: true });

  const basePath = fs.mkdtempSync(path.join(__dirname, '../tmp/workspace/user-data-'));
  fs.mkdirSync(path.join(basePath, 'resources'));

  configPath = configPath ? configPath : path.join(__dirname, '../fixtures/user-data/default_config.json');
  const flagsPath = path.join(__dirname, '../fixtures/flags.json');

  fs.copyFileSync(configPath, path.join(basePath, 'config.json'));
  fs.copyFileSync(flagsPath, path.join(basePath, 'resources', 'flags.json'));

  return basePath;
}


function copyElementTemplates(elementTemplatePaths = [], pathToUserData) {
  const TEMPLATE_PATH = path.join(`${pathToUserData}/resources/element-templates`);
  return elementTemplatePaths.map(templatePath => {
    fs.mkdirSync(TEMPLATE_PATH, { recursive: true });

    const tmpElementTemplatePath = path.join(TEMPLATE_PATH, path.basename(templatePath));

    fs.copyFileSync(templatePath, tmpElementTemplatePath);

    return tmpElementTemplatePath;
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