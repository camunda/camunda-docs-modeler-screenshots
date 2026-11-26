const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');

const root = path.join(__dirname, '../..');

function workflow(name) {
  return yaml.load(fs.readFileSync(path.join(root, '.github/workflows', name), 'utf8'));
}

test('preserves push and manual generation with an optional version', () => {

  // given
  const generation = workflow('CREATE_SCREENSHOTS.yml');

  // when
  const triggers = generation.on;

  // then
  assert.ok(Object.hasOwn(triggers, 'push'));
  assert.equal(triggers.workflow_dispatch.inputs.version.required, false);
  assert.equal(triggers.workflow_call.inputs.version.required, false);
  assert.equal(triggers.workflow_call.inputs.version.type, 'string');
  assert.equal(triggers.workflow_call.inputs.record_provenance.default, false);
  const step = generation.jobs.create_screenshots.steps.find(step => step.name === 'Take Screenshots');
  assert.equal(step.env.VERSION, '${{ inputs.version }}');
  assert.equal(step.run, 'xvfb-run npm run start:ci');
});


test('explicitly passes every required generation secret to the reusable workflow', () => {

  // given
  const generation = workflow('CREATE_SCREENSHOTS.yml');
  const publishing = workflow('PUBLISH_SCREENSHOTS.yml');
  const names = [
    'CAMUNDA_CONSOLE_CLIENT_ID', 'CAMUNDA_CONSOLE_CLIENT_SECRET', 'CAMUNDA_CLUSTER_ID',
    'CLUSTER_URL', 'CLIENT_ID', 'CLIENT_SECRET', 'OAUTH_URL'
  ];

  // when
  const call = publishing.jobs.generate;

  // then
  assert.equal(call.uses, './.github/workflows/CREATE_SCREENSHOTS.yml');
  assert.deepEqual(Object.keys(call.secrets).sort(), names.sort());
  for (const name of names) {
    assert.equal(generation.on.workflow_call.secrets[name].required, true);
    assert.equal(call.secrets[name], `\${{ secrets.${name} }}`);
  }
});


test('pins the resolved version and requests provenance in the generation call', () => {

  // given
  const publishing = workflow('PUBLISH_SCREENSHOTS.yml');

  // when
  const call = publishing.jobs.generate;

  // then
  assert.equal(call.needs, 'resolve-version');
  assert.equal(call.with.version, '${{ needs.resolve-version.outputs.version }}');
  assert.equal(call.with.record_provenance, true);
  assert.equal(publishing.jobs['resolve-version'].outputs.version, '${{ steps.version.outputs.version }}');
});


test('records provenance after generation and before artifact uploads', () => {

  // given
  const generation = workflow('CREATE_SCREENSHOTS.yml');

  // when
  const steps = generation.jobs.create_screenshots.steps;

  // then
  const generate = steps.findIndex(step => step.name === 'Take Screenshots');
  const record = steps.findIndex(step => step.name === 'Record pinned version and artifact inventory');
  const uploads = steps.filter(step => step.uses === 'actions/upload-artifact@v4');
  assert.ok(generate >= 0 && record > generate);
  assert.equal(steps[record].if, '${{ inputs.record_provenance }}');
  assert.equal(steps[record].env.VERSION, '${{ inputs.version }}');
  assert.equal(steps[record].run, 'node scripts/publish-screenshots.js record');
  assert.deepEqual(uploads.map(step => step.with.name).sort(),
    [ 'camunda-docs', 'camunda-docs-manual', 'camunda-docs-static', 'screenshot-provenance' ]);
  assert.ok(uploads.every(step => steps.indexOf(step) > record));
  assert.equal(uploads.at(-1).if, '${{ inputs.record_provenance }}');
  assert.equal(uploads.at(-1).with['if-no-files-found'], 'error');
  assert.ok(steps.every(step => !step['continue-on-error']));
});


test('publishes only after successful version resolution and reusable generation', () => {

  // given
  const publishing = workflow('PUBLISH_SCREENSHOTS.yml');

  // when
  const job = publishing.jobs.publish;

  // then
  assert.deepEqual(job.needs, [ 'resolve-version', 'generate' ]);
  assert.equal(job.if, undefined);
  const download = job.steps.find(step => step.uses === 'actions/download-artifact@v4');
  const prepare = job.steps.find(step => step.id === 'prepare');
  assert.equal(download.with.path, 'generated');
  assert.equal(download.with['run-id'], undefined);
  assert.equal(prepare.env.VERSION, '${{ needs.resolve-version.outputs.version }}');
  assert.ok(job.steps.indexOf(download) < job.steps.indexOf(prepare));
  assert.ok(job.steps.filter(step => step.uses === 'peter-evans/create-pull-request@v7')
    .every(step => job.steps.indexOf(prepare) < job.steps.indexOf(step)));
});


test('publishing remains manual and restricted to the default branch', () => {

  // given
  const publishing = workflow('PUBLISH_SCREENSHOTS.yml');

  // when
  const triggers = publishing.on;

  // then
  assert.deepEqual(Object.keys(triggers), [ 'workflow_dispatch' ]);
  assert.equal(publishing.jobs['resolve-version'].if,
    "github.ref == format('refs/heads/{0}', github.event.repository.default_branch)");
  assert.equal(publishing.concurrency['cancel-in-progress'], false);
});
