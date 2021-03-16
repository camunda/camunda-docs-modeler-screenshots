const fs = require('fs');
const path = require('path');

const expect = require('chai').expect;

const createModeler = require('../../lib/helper/createModeler');

const TMP_DIR = 'lib/tmp';


describe('CreateModeler initialization', function() {

  this.timeout(5000);

  let modeler;

  afterEach(async () => {
    await modeler.close();

    fs.rmdirSync(TMP_DIR, { recursive: true });
  });


  it('should create a Modeler instance', async () => {

    // when
    modeler = await createModeler();

    // then
    expect(modeler.app.running).to.be.true;
  });


  it('should open a Modeler instance with custom configuration', async () => {

    // given
    const configPath = path.join(__dirname, '../fixtures/user-data/small_width.json');

    // when
    modeler = await createModeler(undefined, configPath);

    // then
    const dimensions = await modeler.app.client.waitUntilWindowLoaded()
      .browserWindow.getBounds();
    expect(dimensions.width).to.equal(99);
  });


  it('should prepare a custom diagram for the Modeler instance', async () => {

    // given
    const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/diagram_1.bpmn') ];

    // when
    modeler = await createModeler(diagramPaths);

    // then
    const tmpDir = fs.readdirSync(TMP_DIR);
    expect(tmpDir.length).equals(2);
  });

});


describe('CreateModeler tearDown', function() {

  this.timeout(5000);


  it('should close a Modeler instance', async () => {

    // when
    const modeler = await createModeler();

    await modeler.close();

    // then
    expect(modeler.app.running).to.be.false;
  });


  it('should clear tmp data when Modeler is closed', async () => {

    // given
    const diagramPaths = [ path.join(__dirname, '../fixtures/bpmn/diagram_1.bpmn') ],
          configPath = path.join(__dirname, '../fixtures/user-data/small_width.json');

    // when
    const modeler = await createModeler(diagramPaths, configPath);

    await modeler.close();

    // then
    const tmpDir = fs.readdirSync(TMP_DIR);
    expect(tmpDir.length).equals(0);
  });

});
