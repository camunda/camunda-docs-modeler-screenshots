const fs = require('fs');
const path = require('path');

const expect = require('chai').expect;

const createModeler = require('../../lib/helper/createModeler');

const WORKSPACE_DIR = 'lib/tmp/workspace';


describe('lib/helper/createModeler - initialization', function() {

  this.timeout(5000);

  let modeler;

  afterEach(async function() {
    await modeler.close();

    fs.rmSync(WORKSPACE_DIR, { recursive: true });
  });


  it('should create a Modeler instance', async function() {

    // when
    modeler = await createModeler();

    // then
    expect(modeler.window).to.exist;
  });


  it('should prepare a custom diagram for the Modeler instance', async function() {

    // given
    const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/diagram_1.bpmn') ];

    // when
    modeler = await createModeler({ diagramPaths });

    // then
    const tmpDir = fs.readdirSync(WORKSPACE_DIR);
    expect(tmpDir.length).equals(2);
  });


  it('should open a Modeler instance with custom configuration', async function() {

    // given
    const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/diagram_1.bpmn') ],
          configPath = path.join(__dirname, '../fixtures/user-data/large_with_prop_panel.json');

    // when
    modeler = await createModeler({ diagramPaths, configPath });

    // then
    const propPanelContainer = await modeler.getElement('.properties-container');
    const propPanelSize = await propPanelContainer.boundingBox();

    expect(propPanelSize.width).to.be.closeTo(420, 1);
  });


  it('should open a Modeler instance with custom displayVersion', async function() {

    // given
    const displayVersion = 'foobar';

    // when
    modeler = await createModeler({ displayVersion });

    // then
    const versionButton = await modeler.getElement('button[title="Toggle version info"]');
    const versionButtonText = await versionButton.innerText();

    expect(versionButtonText).to.equal(displayVersion);
  });


  it('should create flags.json in the correct location', async function() {

    // when
    modeler = await createModeler();

    // then
    const userDataDir = getUserDataDir();

    expect(fs.existsSync(path.resolve(userDataDir, 'resources', 'flags.json'))).to.be.true;
  });


  it('should create config.json in the correct location', async function() {

    // when
    modeler = await createModeler();

    // then
    const userDataDir = getUserDataDir();

    expect(fs.existsSync(path.resolve(userDataDir, 'config.json'))).to.be.true;
  });
});


describe('lib/helper/createModeler - teardown', function() {

  this.timeout(5000);


  it('should close a Modeler instance', async function() {

    // when
    const modeler = await createModeler();

    await modeler.close();

    // then
    expect(modeler.window).to.not.exist;
  });


  it('should clear tmp data when Modeler is closed', async function() {

    // given
    const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/diagram_1.bpmn') ],
          configPath = path.join(__dirname, '../fixtures/user-data/small_width.json');

    // when
    const modeler = await createModeler({ diagramPaths, configPath });

    await modeler.close();

    // then
    const tmpDir = fs.readdirSync(WORKSPACE_DIR);
    expect(tmpDir.length).equals(0);
  });

});

// helper
function getUserDataDir() {
  const workspaceDirs = fs.readdirSync(WORKSPACE_DIR);

  return path.resolve(WORKSPACE_DIR, workspaceDirs.find(dir => dir.startsWith('user-data-')));
}
