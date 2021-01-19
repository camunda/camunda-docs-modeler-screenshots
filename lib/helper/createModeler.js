const fs = require('fs');
const os = require('os');
const path = require('path');

const fkill = require('fkill');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const Application = require('spectron').Application;

const sharp = require('sharp');

const platform = os.platform();

const MODELER_DIST_PATH = '../../camunda-modeler/dist';

const { applicationPaths } = require('./applicationPaths');

const applicationPath = applicationPaths[ platform ];

if (!applicationPath) {
  throw new Error(`Platform ${ platform } not supported`);
}

class Modeler {
  constructor(diagramPaths = [], configPath = undefined) {

    this._tmpUserDataPath = copyUserData(configPath);

    this._tmpDiagramPaths = copyDiagrams(diagramPaths);

    this.app = new Application({
      path: path.join(__dirname, MODELER_DIST_PATH, applicationPath),
      args: [
        ...this._tmpDiagramPaths,
        '--dangerously-enable-node-integration',
        '--disable-remote-interaction'
      ],
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

    await this.app.client.waitUntilWindowLoaded();
  }

  async close() {
    await this.app.stop();

    await killModelerInstances();

    cleanUpDiagrams(this._tmpDiagramPaths);

    cleanUpUserData(this._tmpUserDataPath);
  }

  async click(selector) {
    await this.app.client.click(selector);
  }

  async doubleClick(selector) {
    await this.app.client.doubleClick(selector);
  }

  async keys(keys) {
    await this.app.client.keys(keys);
  }

  async get(selector) {
    return await this.app.client.$(selector);
  }

  async getText(selector) {
    return await this.app.client.getText(selector);
  }

  async mouseOver(selector, xOffset, yOffset) {
    await this.app.client.moveToObject(selector, xOffset, yOffset);
  }

  async takeScreenshot(filename, rect = undefined) {
    const imgBuffer = await this.app.browserWindow.capturePage(rect);

    // Remove transparency and save img
    sharp(imgBuffer)
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .toFile(filename, (err) => { if (err) throw err; });
  }

}

/**
 * Create and return a Camunda Modeler instance.
 *
 * @param {Array<string>} diagramPaths
 *
 * @returns {Object}
 */
async function createModeler(diagramPaths = [], configPath = undefined) {
  await killModelerInstances();

  const modeler = new Modeler(diagramPaths, configPath);

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
