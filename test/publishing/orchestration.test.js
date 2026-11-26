const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');

const script = path.resolve(__dirname, '../../scripts/publish-screenshots.js');
const png = Buffer.from('89504e470d0a1a0a00000000', 'hex');
const repositories = {
  'camunda-docs': 'docs/components/modeler/img/example.png',
  'camunda-docs-static': 'get-started/content/quick-start/img/example.png',
  'camunda-docs-manual': 'content/modeler/img/example.png'
};

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'publish-orchestration-'));
  t.after(() => fs.rmSync(root, { recursive: true }));
  const env = {
    ...process.env,
    VERSION: '5.50.0',
    GITHUB_REPOSITORY: 'camunda/camunda-docs-modeler-screenshots',
    GITHUB_SHA: 'source-sha',
    GITHUB_RUN_ID: '123',
    GITHUB_RUN_ATTEMPT: '1',
    GITHUB_SERVER_URL: 'https://github.com',
    GITHUB_OUTPUT: path.join(root, 'output'),
    GITHUB_STEP_SUMMARY: path.join(root, 'summary'),
    GH_TOKEN: 'offline-placeholder'
  };
  fs.mkdirSync(path.join(root, 'lib/tmp'), { recursive: true });
  fs.writeFileSync(path.join(root, 'lib/tmp/manifest.json'), JSON.stringify({ platform: 'linux', version: env.VERSION }));
  for (const [ repo, file ] of Object.entries(repositories)) {
    const filename = path.join(root, repo, file);
    fs.mkdirSync(path.dirname(filename), { recursive: true });
    fs.writeFileSync(filename, png);
  }
  return { root, env };
}

function run(mode, context) {
  return spawnSync(process.execPath, [ script, mode ], {
    cwd: context.root,
    env: context.env,
    encoding: 'utf8'
  });
}

function generated(context) {
  const result = run('record', context);
  assert.equal(result.status, 0, result.stderr);
  fs.mkdirSync(path.join(context.root, 'generated/screenshot-provenance'), { recursive: true });
  fs.renameSync(path.join(context.root, 'screenshot-provenance.json'),
    path.join(context.root, 'generated/screenshot-provenance/screenshot-provenance.json'));
  for (const repo of Object.keys(repositories)) {
    fs.renameSync(path.join(context.root, repo), path.join(context.root, 'generated', repo));
  }
}

function mockRemotes(context) {
  const bin = path.join(context.root, 'bin');
  fs.mkdirSync(bin);
  context.env.PATH = bin;
  fs.writeFileSync(path.join(bin, 'gh'), `#!${process.execPath}
const endpoint = process.argv[3];
if (endpoint.endsWith('/labels/low%20prio')) {
  console.log('{}');
} else {
  const repo = endpoint.split('/').at(-1);
  const branches = { 'camunda-docs': 'main', 'camunda-docs-static': 'master', 'camunda-docs-manual': '7.24' };
  if (!branches[repo]) throw new Error('Unexpected API call: ' + endpoint);
  console.log(JSON.stringify({
    default_branch: repo === 'camunda-docs-manual' && process.env.INVALID_RELEASE ? 'main' : branches[repo],
    permissions: { push: !process.env.DENY_PUSH }
  }));
}
`, { mode: 0o755 });
  fs.writeFileSync(path.join(bin, 'git'), `#!${process.execPath}
const fs = require('node:fs');
const path = require('node:path');
const args = process.argv.slice(2);
if (args[2] !== 'clone') throw new Error('Only clone permitted');
const target = args.at(-1);
fs.mkdirSync(target, { recursive: true });
if (target.endsWith('/camunda-docs')) {
  fs.writeFileSync(path.join(target, 'versions.json'), JSON.stringify(['8.10', '8.9']));
  fs.mkdirSync(path.join(target, '.github'));
  fs.writeFileSync(path.join(target, '.github/pull_request_template.md'), '## Description\\n<!-- context -->\\n## PR Checklist\\n- [ ] Review');
  for (const version of ['8.10', '8.7']) {
    const file = path.join(target, 'versioned_docs/version-' + version + '/components/modeler/img/example.png');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, 'original-' + version);
  }
}
`, { mode: 0o755 });
}

test('records provenance for the installed version and all three repositories', t => {

  // given
  const context = fixture(t);

  // when
  const result = run('record', context);

  // then
  assert.equal(result.status, 0, result.stderr);
  const manifest = JSON.parse(fs.readFileSync(path.join(context.root, 'screenshot-provenance.json')));
  assert.equal(manifest.version, '5.50.0');
  assert.equal(manifest.run, '123');
  assert.equal(manifest.attempt, '1');
  assert.deepEqual(Object.keys(manifest.artifacts), Object.keys(repositories));
});


test('rejects a different installed Modeler version', t => {

  // given
  const context = fixture(t);
  context.env.VERSION = '5.51.0';

  // when
  const result = run('record', context);

  // then
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /version\/platform mismatch/);
});


test('rejects a missing repository before recording success', t => {

  // given
  const context = fixture(t);
  fs.rmSync(path.join(context.root, 'camunda-docs-manual'), { recursive: true });

  // when
  const result = run('record', context);

  // then
  assert.notEqual(result.status, 0);
  assert.equal(fs.existsSync(path.join(context.root, 'screenshot-provenance.json')), false);
});


for (const key of [ 'GITHUB_REPOSITORY', 'GITHUB_SHA', 'GITHUB_RUN_ID', 'GITHUB_RUN_ATTEMPT', 'VERSION' ]) {
  test(`rejects mismatched ${key} without network access`, t => {

    // given
    const context = fixture(t);
    generated(context);
    context.env[key] = key === 'VERSION' ? '5.51.0' : 'different';
    context.env.PATH = '';

    // when
    const result = run('prepare', context);

    // then
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /provenance mismatch/);
    assert.equal(fs.existsSync(path.join(context.root, 'targets')), false);
  });
}


test('rejects partial artifacts before cloning any target', t => {

  // given
  const context = fixture(t);
  generated(context);
  context.env.PATH = '';
  fs.unlinkSync(path.join(context.root, 'generated/camunda-docs-manual', repositories['camunda-docs-manual']));

  // when
  const result = run('prepare', context);

  // then
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /does not match/);
  assert.equal(fs.existsSync(path.join(context.root, 'targets')), false);
});


test('requires a cross-repository publishing credential', t => {

  // given
  const context = fixture(t);
  generated(context);
  delete context.env.GH_TOKEN;
  context.env.PATH = '';

  // when
  const result = run('prepare', context);

  // then
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Set DOCS_PUBLISH_TOKEN/);
  assert.equal(fs.existsSync(path.join(context.root, 'targets')), false);
});


test('fails preparation when the token cannot push', t => {

  // given
  const context = fixture(t);
  generated(context);
  mockRemotes(context);
  context.env.DENY_PUSH = 'true';

  // when
  const result = run('prepare', context);

  // then
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /cannot push to/);
  assert.equal(fs.existsSync(context.env.GITHUB_OUTPUT), false);
});


test('does not silently switch manual publishing away from a release branch', t => {

  // given
  const context = fixture(t);
  generated(context);
  mockRemotes(context);
  context.env.INVALID_RELEASE = 'true';

  // when
  const result = run('prepare', context);

  // then
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Manual default is not a release branch/);
  assert.equal(fs.existsSync(context.env.GITHUB_OUTPUT), false);
});


test('prepares all targets offline with runtime defaults, skips and preserved template', t => {

  // given
  const context = fixture(t);
  generated(context);
  mockRemotes(context);

  // when
  const result = run('prepare', context);

  // then
  assert.equal(result.status, 0, result.stderr);
  assert.match(fs.readFileSync(context.env.GITHUB_OUTPUT, 'utf8'),
    /bases={"camunda-docs":"main","camunda-docs-static":"master","camunda-docs-manual":"7.24"}/);
  for (const [ repo, file ] of Object.entries(repositories)) {
    assert.deepEqual(fs.readFileSync(path.join(context.root, 'targets', repo, file)), png);
  }
  const target = path.join(context.root, 'targets/camunda-docs');
  assert.deepEqual(fs.readFileSync(path.join(target, 'versioned_docs/version-8.10/components/modeler/img/example.png')), png);
  assert.equal(fs.readFileSync(path.join(target, 'versioned_docs/version-8.7/components/modeler/img/example.png'), 'utf8'), 'original-8.7');
  assert.equal(fs.existsSync(path.join(target, 'versioned_docs/version-8.9/components/modeler/img/example.png')), false);
  const body = fs.readFileSync(path.join(context.root, 'publishing-bodies/camunda-docs.md'), 'utf8');
  assert.match(body, /versioned_docs\/version-8.9/);
  assert.match(body, /## PR Checklist\n- \[ \] Review/);
  assert.match(body, /<!-- context -->/);
  assert.match(body, /actions\/runs\/123/);
});
