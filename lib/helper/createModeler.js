const fs = require('node:fs');
const path = require('node:path');

const fkill = require('fkill').default;
const { _electron: electron } = require('playwright-core');

require('dotenv').config();

const {
  addAnnotation,
  connectTwoElements,
  clearAllAnnotations
} = require('./annotations');

const sharp = require('sharp');

const { readManifest } = require('./helper');

const { registerModeler } = require('./screenshotUtil');


class Modeler {
  constructor({
    diagramPaths = [],
    configPath,
    additionalConfig = {},
    settingsPath = path.join(__dirname, '../fixtures/user-data/settings/default_connections.json'),
    additionalSettings = {},
    elementTemplatePaths = [],
    processApplicationPaths = [],
    displayVersion
  } = {}) {
    this._ensureTempDirectory();

    this._tmpUserDataPath = copyUserData(configPath, additionalConfig, settingsPath, additionalSettings);

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
    try {

      // app may be missing if Modeler failed to launch
      await closeApp(this.app);
    } finally {
      delete this.window;

      removeTemporaryFiles(this._tmpFilePaths);

      cleanUpUserData(this._tmpUserDataPath);
    }
  }

  async getElement(selector) {
    await this.window.waitForSelector(selector, { state: 'attached' });
    const element = await this.window.locator(selector).first();
    return element;
  }

  async click(selector, options = {}) {
    await this.window.click(selector, { force: true, ...options });
  }

  /**
   * Click until the expected element shows up.
   *
   * Clicks right after Modeler started may be lost, e.g. on an element
   * that is not ready to be selected yet.
   *
   * @param {string} selector
   * @param {string} expectedSelector
   * @param {{ attempts?: number, timeout?: number }} [options]
   */
  async clickUntil(selector, expectedSelector, { attempts = 5, timeout = 5000 } = {}) {
    for (let attempt = 1; ; attempt++) {
      await this.click(selector);

      try {
        await this.window.waitForSelector(expectedSelector, { state: 'attached', timeout });

        return;
      } catch (error) {
        if (attempt >= attempts) {
          throw error;
        }
      }
    }
  }

  /**
   * Click the problem in the problems view.
   *
   * Clicks the start of the message: the center of the item is
   * the documentation link, and the header button triggers the item
   * handler twice, toggling the properties panel group back closed.
   */
  async clickProblem() {
    await this.click('.linting-tab-item__content', { position: { x: 5, y: 5 } });
  }

  async rightClick(selector) {
    await this.window.click(selector, { button: 'right', force: true });
  }

  async scrollIntoViewIfNeeded(selector) {
    const element = await this.getElement(selector);
    if (!element) {
      return;
    }
    await element.scrollIntoViewIfNeeded();
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

  /**
   * Wait for all running CSS animations on the matched element to finish.
   *
   * @param {String} selector
   */
  async waitForAnimations(selector) {
    const element = await this.getElement(selector);
    await element.evaluate(el => Promise.all(el.getAnimations().map(animation => animation.finished)));
  }

  /**
   * Wait until the element stopped moving and is fully opaque,
   * i.e. enter animations and transitions are over.
   *
   * @param {string} selector
   * @param {{ timeout?: number }} [options]
   */
  async waitForStable(selector, { timeout = 10000 } = {}) {
    const element = await this.getElement(selector);

    const sample = () => element.evaluate(el => {
      const { x, y, width, height } = el.getBoundingClientRect();

      return `${ x },${ y },${ width },${ height },${ globalThis.getComputedStyle(el).opacity }`;
    });

    const deadline = Date.now() + timeout;

    let last, stableSamples = 0;

    while (stableSamples < 4) {
      if (Date.now() > deadline) {
        throw new Error(`Element <${ selector }> not stable after ${ timeout }ms`);
      }

      await this.window.waitForTimeout(100);

      const current = await sample();

      stableSamples = current === last && current.endsWith(',1') ? stableSamples + 1 : 0;

      last = current;
    }
  }

  /**
   * Wait for a success toast to be shown completely.
   *
   * @param {string} title
   */
  async waitForToast(title) {
    await this.waitForStable(`[data-sonner-toast][data-type="success"][data-mounted="true"]:has-text("${ title }")`);
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
 * @returns {Promise<Modeler>}
 */
async function createModeler(config) {
  const modeler = new Modeler(config);

  // allow cleanup if the screenshot task fails or times out
  registerModeler(modeler);

  await modeler.open();

  return modeler;
}

module.exports = createModeler;


// helpers //////////

const CLOSE_TIMEOUT = 10 * 1000;

/**
 * Close the app, kill it if it does not quit in time, e.g. because
 * a child process (opened link) keeps it alive.
 */
async function closeApp(app) {
  if (!app) {
    return;
  }

  let timer;

  const timedOut = new Promise(resolve => {
    timer = setTimeout(() => resolve(true), CLOSE_TIMEOUT);
  });

  const closed = app.close().then(() => false);

  try {
    if (await Promise.race([ closed, timedOut ])) {
      console.log('- Modeler did not quit in time, killing it');

      app.process().kill('SIGKILL');
    }
  } finally {
    clearTimeout(timer);
  }
}

function removeTemporaryFiles(tmpFilePaths = []) {

  // Nothing to clean up
  if (!tmpFilePaths.length) {
    return;
  }

  // Assumes all files share a tmp directory
  const filePath = tmpFilePaths[0];

  const fileDirPath = path.dirname(filePath);

  fs.rmSync(fileDirPath, { recursive: true, force: true });
}

function cleanUpUserData(tmpUserDataPath) {
  fs.rmSync(tmpUserDataPath, { recursive: true, force: true });
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
 * @param {Object} additionalConfig additional configuration options to merge or override config file
 *
 * @returns {string} path to the user directory
 */
function copyUserData(configPath, additionalConfig, settingsPath, additionalSettings) {

  fs.mkdirSync(path.join(__dirname, '../tmp/workspace'), { recursive: true });

  const basePath = fs.mkdtempSync(path.join(__dirname, '../tmp/workspace/user-data-'));
  fs.mkdirSync(path.join(basePath, 'resources'));

  configPath = configPath ? configPath : path.join(__dirname, '../fixtures/user-data/default_config.json');
  const flagsPath = path.join(__dirname, '../fixtures/flags.json');

  const baseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  const config = { ...baseConfig, ...additionalConfig };

  fs.writeFileSync(path.join(basePath, 'config.json'), JSON.stringify(config, null, 2));
  fs.copyFileSync(flagsPath, path.join(basePath, 'resources', 'flags.json'));

  if (settingsPath) {
    const settings = injectEnvSecrets(JSON.parse(fs.readFileSync(settingsPath, 'utf8')));
    fs.writeFileSync(path.join(basePath, 'settings.json'), JSON.stringify({ ...settings, ...additionalSettings }, null, 2));
  }

  return basePath;
}


const SECRET_PREFIX = 'SECRET_';

function injectEnvSecrets(value) {
  if (typeof value === 'string' && value.startsWith(SECRET_PREFIX)) {
    const envKey = value.slice(SECRET_PREFIX.length);
    return Object.prototype.hasOwnProperty.call(process.env, envKey) ? process.env[envKey] : value;
  }
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(injectEnvSecrets);
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([ k, v ]) => [ k, injectEnvSecrets(v) ]));
  }
  return value;
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