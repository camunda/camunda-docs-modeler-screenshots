const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'modeler-version-'));
  t.after(() => fs.rmSync(root, { recursive: true }));
  fs.copyFileSync(path.resolve(__dirname, '../../lib/helper/setupModeler.js'), path.join(root, 'setupModeler.js'));
  fs.writeFileSync(path.join(root, 'helper.js'), `
const fs = require('node:fs');
exports.fetchLatestModelerVersion = async () => {
  if (process.env.FAIL_LATEST) throw new Error('latest lookup failed');
  return '5.51.0';
};
exports.fetchModeler = async (platform, version) =>
  fs.writeFileSync(process.env.RESULT_FILE, JSON.stringify({ platform, version }));
`);
  const env = {
    ...process.env,
    VERSION: '',
    PLATFORM: 'linux',
    RESULT_FILE: path.join(root, 'result.json')
  };
  delete env.FAIL_LATEST;
  return { root, env };
}

function run(context) {
  return spawnSync(process.execPath, [ path.join(context.root, 'setupModeler.js') ], {
    env: context.env,
    encoding: 'utf8'
  });
}

test('uses the pinned version without looking up latest', t => {

  // given
  const context = fixture(t);
  context.env.VERSION = '5.50.0';
  context.env.FAIL_LATEST = 'true';

  // when
  const result = run(context);

  // then
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(fs.readFileSync(context.env.RESULT_FILE)), { platform: 'linux', version: '5.50.0' });
});


test('uses latest when the optional version is empty', t => {

  // given
  const context = fixture(t);

  // when
  const result = run(context);

  // then
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(fs.readFileSync(context.env.RESULT_FILE)), { platform: 'linux', version: '5.51.0' });
});


test('fails generation when the latest-version lookup fails', t => {

  // given
  const context = fixture(t);
  context.env.FAIL_LATEST = 'true';

  // when
  const result = run(context);

  // then
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /latest lookup failed/);
  assert.equal(fs.existsSync(context.env.RESULT_FILE), false);
});
