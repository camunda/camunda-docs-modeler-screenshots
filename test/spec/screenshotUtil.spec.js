const expect = require('chai').expect;

const { registerModeler, triggerScreenshot } = require('../../lib/helper/screenshotUtil');


describe('lib/helper/screenshotUtil - triggerScreenshot', function() {

  let originalTimeout, originalLog;

  beforeEach(function() {
    originalTimeout = process.env.SCREENSHOT_TIMEOUT;
    originalLog = console.log;

    console.log = () => {};
  });

  afterEach(function() {
    console.log = originalLog;

    if (originalTimeout === undefined) {
      delete process.env.SCREENSHOT_TIMEOUT;
    } else {
      process.env.SCREENSHOT_TIMEOUT = originalTimeout;
    }
  });


  it('should close Modeler on success', async function() {

    // given
    const modeler = createFakeModeler();

    // when
    await triggerScreenshot('foo.png', async () => {
      registerModeler(modeler);

      return modeler;
    });

    // then
    expect(modeler.closed).to.equal(1);
  });


  it('should close Modeler on failure', async function() {

    // given
    const modeler = createFakeModeler();

    // when
    const err = await triggerScreenshot('foo.png', async () => {
      registerModeler(modeler);

      throw new Error('foo');
    }).catch(err => err);

    // then
    expect(err.message).to.equal('foo');
    expect(err.failureName).to.equal('foo.png');

    expect(modeler.closed).to.equal(1);
  });


  it('should fail and close Modeler on timeout', async function() {

    // given
    process.env.SCREENSHOT_TIMEOUT = '50';

    const modeler = createFakeModeler();

    // when
    const err = await triggerScreenshot('foo.png', async () => {
      registerModeler(modeler);

      await new Promise(() => {});
    }).catch(err => err);

    // then
    expect(err.message).to.match(/Timed out after 50ms/);

    expect(modeler.closed).to.equal(1);
  });


  it('should fail on timeout if closing Modeler hangs', async function() {

    // given
    process.env.SCREENSHOT_TIMEOUT = '50';

    const modeler = createFakeModeler({ hangOnFirstClose: true });

    // when
    const err = await triggerScreenshot('foo.png', async () => {
      registerModeler(modeler);

      return modeler;
    }).catch(err => err);

    // then
    expect(err.message).to.match(/Timed out after 50ms/);

    expect(modeler.closed).to.equal(2);
  });


  it('should only close Modelers of the failed task', async function() {

    // given
    const failing = createFakeModeler(),
          running = createFakeModeler();

    // when
    await Promise.all([
      triggerScreenshot('failing.png', async () => {
        registerModeler(failing);

        throw new Error('foo');
      }).catch(() => {}),
      triggerScreenshot('running.png', async () => {
        registerModeler(running);

        await new Promise(resolve => setTimeout(resolve, 20));

        return running;
      })
    ]);

    // then
    expect(failing.closed).to.equal(1);
    expect(running.closed).to.equal(1);
  });

});


// helpers //////////

function createFakeModeler({ hangOnFirstClose = false } = {}) {
  return {
    closed: 0,
    async close() {
      this.closed++;

      if (hangOnFirstClose && this.closed === 1) {
        await new Promise(() => {});
      }
    }
  };
}
