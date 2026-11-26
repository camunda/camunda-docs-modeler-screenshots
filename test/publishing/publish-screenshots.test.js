const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { inventory, verifyInventory, planUpdates, renderBody, safeDestination } = require('../../scripts/publish-screenshots');

test('updates Next and existing active version paths, never archives', () => {

  // given
  const file = 'docs/components/modeler/img/example.png';
  const existing = new Set([
    'versioned_docs/version-8.10/components/modeler/img/example.png',
    'versioned_docs/version-8.7/components/modeler/img/example.png'
  ]);

  // when
  const result = planUpdates([ file ], [ '8.10', '8.9' ], file => existing.has(file), 'camunda-docs');

  // then
  assert.deepEqual(result, {
    updates: [
      { source: file, destination: file },
      { source: file, destination: 'versioned_docs/version-8.10/components/modeler/img/example.png' }
    ],
    skipped: [ 'versioned_docs/version-8.9/components/modeler/img/example.png' ]
  });
});


test('keeps Camunda 7 generated paths unchanged', () => {

  // given
  const file = 'content/modeler/img/example.png';

  // when
  const result = planUpdates([ file ], [], () => false, 'camunda-docs-manual');

  // then
  assert.deepEqual(result, { updates: [ { source: file, destination: file } ], skipped: [] });
});


test('keeps static generated paths unchanged', () => {

  // given
  const file = 'get-started/content/quick-start/img/example.png';

  // when
  const result = planUpdates([ file ], [], () => false, 'camunda-docs-static');

  // then
  assert.deepEqual(result.updates, [ { source: file, destination: file } ]);
});


for (const file of [ '../secret.png', 'docs/../secret.png', 'docs/x.md', 'static/x.png', 'docs\\x.png' ]) {
  test(`rejects unsafe or out-of-scope generated path ${file}`, () => {

    // given
    const files = [ file ];

    // when
    const execute = () => planUpdates(files, [], () => true, 'camunda-docs');

    // then
    assert.throws(execute, /Unsafe|Unexpected/);
  });
}


test('rejects invalid active versions', () => {

  // given
  const versions = [ '../archive' ];

  // when
  const execute = () => planUpdates([], versions, () => true, 'camunda-docs');

  // then
  assert.throws(execute, /Invalid active versions/);
});


for (const actual of [ {}, { 'a.png': 'changed' }, { 'a.png': 'hash', 'extra.png': 'hash' } ]) {
  test(`rejects incomplete or changed artifact inventory ${JSON.stringify(actual)}`, () => {

    // given
    const expected = { 'a.png': 'hash' };

    // when
    const execute = () => verifyInventory(actual, expected);

    // then
    assert.throws(execute, /does not match/);
  });
}


test('accepts the exact complete inventory regardless of key order', () => {

  // given
  const actual = { 'b.png': 'two', 'a.png': 'one' };

  // when
  const execute = () => verifyInventory(actual, { 'a.png': 'one', 'b.png': 'two' });

  // then
  assert.doesNotThrow(execute);
});


test('rejects an empty generation', () => {

  // given
  const actual = {};

  // when
  const execute = () => verifyInventory(actual, {});

  // then
  assert.throws(execute, /Empty/);
});


test('preserves every PR template section, comment and checklist', () => {

  // given
  const template = '<!-- instructions -->\n## Description\n<!-- describe -->\n## Checklist\n- [ ] Review';

  // when
  const body = renderBody(template, 'Generated screenshots.');

  // then
  assert.equal(body, template.replace('## Description', '## Description\n\nGenerated screenshots.'));
});


test('supports repositories without PR templates', () => {

  // given
  const description = 'Generated screenshots.';

  // when
  const body = renderBody('', description);

  // then
  assert.equal(body, description);
});


test('fails closed when a template format changes', () => {

  // given
  const template = '## Summary\n- [ ] Review';

  // when
  const execute = () => renderBody(template, 'Generated screenshots.');

  // then
  assert.throws(execute, /Description section/);
});


test('hashes nested PNG screenshots', t => {

  // given
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'screenshots-'));
  t.after(() => fs.rmSync(root, { recursive: true }));
  fs.mkdirSync(path.join(root, 'docs'));
  fs.writeFileSync(path.join(root, 'docs/example.png'), Buffer.from('89504e470d0a1a0a00000000', 'hex'));

  // when
  const result = inventory(root);

  // then
  assert.match(result['docs/example.png'], /^[a-f0-9]{64}$/);
});


test('rejects non-PNG bytes', t => {

  // given
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'screenshots-'));
  t.after(() => fs.rmSync(root, { recursive: true }));
  fs.writeFileSync(path.join(root, 'example.png'), 'not a PNG');

  // when
  const execute = () => inventory(root);

  // then
  assert.throws(execute, /Invalid PNG/);
});


test('rejects non-image artifact contents', t => {

  // given
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'screenshots-'));
  t.after(() => fs.rmSync(root, { recursive: true }));
  fs.writeFileSync(path.join(root, 'README.md'), 'not a screenshot');

  // when
  const execute = () => inventory(root);

  // then
  assert.throws(execute, /Not a screenshot/);
});


test('rejects artifact symlinks', t => {

  // given
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'screenshots-'));
  t.after(() => fs.rmSync(root, { recursive: true }));
  fs.symlinkSync('missing.png', path.join(root, 'example.png'));

  // when
  const execute = () => inventory(root);

  // then
  assert.throws(execute, /Symlink/);
});


test('rejects symlinked destination directories', t => {

  // given
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'screenshots-'));
  t.after(() => fs.rmSync(root, { recursive: true }));
  fs.symlinkSync(os.tmpdir(), path.join(root, 'docs'));

  // when
  const execute = () => safeDestination(root, 'docs/example.png');

  // then
  assert.throws(execute, /Symlink/);
});


test('rejects dangling destination symlinks', t => {

  // given
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'screenshots-'));
  t.after(() => fs.rmSync(root, { recursive: true }));
  fs.symlinkSync('missing.png', path.join(root, 'example.png'));

  // when
  const execute = () => safeDestination(root, 'example.png');

  // then
  assert.throws(execute, /Symlink/);
});
