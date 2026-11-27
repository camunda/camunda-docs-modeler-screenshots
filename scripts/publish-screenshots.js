const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');

const repositories = [ 'camunda-docs', 'camunda-docs-static', 'camunda-docs-manual' ];
const pngSignature = Buffer.from('89504e470d0a1a0a', 'hex');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function inventory(root, prefix = '') {
  const result = {};
  assert(!fs.lstatSync(root).isSymbolicLink(), `Symlink in screenshots: ${root}`);

  for (const entry of fs.readdirSync(path.join(root, prefix), { withFileTypes: true })) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;

    assert(!entry.isSymbolicLink(), `Symlink in screenshots: ${relative}`);

    if (entry.isDirectory()) {
      Object.assign(result, inventory(root, relative));
    } else {
      assert(entry.isFile() && relative.endsWith('.png'), `Not a screenshot: ${relative}`);
      const bytes = fs.readFileSync(path.join(root, relative));
      assert(bytes.subarray(0, 8).equals(pngSignature), `Invalid PNG: ${relative}`);
      result[relative] = crypto.createHash('sha256').update(bytes).digest('hex');
    }
  }

  return result;
}

function verifyInventory(actual, expected) {
  assert(expected && Object.keys(expected).length > 0, 'Empty screenshot inventory');
  assert(JSON.stringify(Object.entries(actual).sort()) === JSON.stringify(Object.entries(expected).sort()),
    'Screenshot artifact does not match generation inventory');
}

function planUpdates(files, versions, exists, repository) {
  const updates = [];
  const skipped = [];

  assert(Array.isArray(versions) && versions.every(v => /^\d+\.\d+$/.test(v)), 'Invalid active versions');

  for (const file of files) {
    assert(/^[a-zA-Z0-9_./-]+\.png$/.test(file) &&
      !file.split('/').some(part => !part || part === '.' || part === '..'), `Unsafe screenshot path: ${file}`);
    const prefix = repository === 'camunda-docs' ? 'docs/' :
      repository === 'camunda-docs-static' ? 'get-started/content/' : 'content/';
    assert(file.startsWith(prefix), `Unexpected screenshot location: ${file}`);
    updates.push({ source: file, destination: file });

    if (repository === 'camunda-docs') {
      for (const version of versions) {
        const destination = `versioned_docs/version-${version}/${file.slice(5)}`;
        if (exists(destination)) {
          updates.push({ source: file, destination });
        } else {
          skipped.push(destination);
        }
      }
    }
  }

  return { updates, skipped };
}

function renderBody(template, description) {
  if (!template) {
    return description;
  }

  assert(template.includes('## Description'), 'PR template needs a Description section; adapt publisher before proceeding');
  return template.replace('## Description', `## Description\n\n${description}`);
}

function command(program, args, cwd) {
  return execFileSync(program, args, { cwd, encoding: 'utf8', stdio: [ 'ignore', 'pipe', 'pipe' ] }).trim();
}

function api(endpoint) {
  return JSON.parse(command('gh', [ 'api', endpoint ]));
}

function git(args, cwd) {
  return command('git', [ '-c', 'credential.helper=!gh auth git-credential', ...args ], cwd);
}

function findTemplate(root) {
  const candidates = [];
  for (const directory of [ '', '.github', 'docs' ]) {
    const absolute = path.join(root, directory);
    if (!fs.existsSync(absolute)) {
      continue;
    }

    for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
      if (entry.name.toLowerCase() === 'pull_request_template.md' && entry.isFile()) {
        candidates.push(path.join(absolute, entry.name));
      }
      if (entry.name.toLowerCase() === 'pull_request_template' && entry.isDirectory()) {
        for (const name of fs.readdirSync(path.join(absolute, entry.name))) {
          candidates.push(path.join(absolute, entry.name, name));
        }
      }
    }
  }

  assert(candidates.length <= 1, 'Multiple PR templates; select one explicitly before publishing');
  return candidates.length ? fs.readFileSync(candidates[0], 'utf8') : '';
}

function safeDestination(root, destination) {
  let current = root;
  for (const part of destination.split('/')) {
    current = path.join(current, part);
    assert(!fs.lstatSync(current, { throwIfNoEntry: false })?.isSymbolicLink(), `Symlink in target: ${destination}`);
  }
  return current;
}

function provenance() {
  return {
    repository: process.env.GITHUB_REPOSITORY,
    sha: process.env.GITHUB_SHA,
    run: process.env.GITHUB_RUN_ID,
    attempt: process.env.GITHUB_RUN_ATTEMPT,
    version: process.env.VERSION
  };
}

function record() {
  const metadata = provenance();
  const manifest = JSON.parse(fs.readFileSync('lib/tmp/manifest.json', 'utf8'));
  assert(manifest.version === metadata.version && manifest.platform === 'linux', 'Modeler version/platform mismatch');
  const artifacts = Object.fromEntries(repositories.map(repo => {
    const files = inventory(repo);
    assert(Object.keys(files).length > 0, `No screenshots for ${repo}`);
    return [ repo, files ];
  }));
  fs.writeFileSync('screenshot-provenance.json', JSON.stringify({ ...metadata, artifacts }, null, 2));
}

function prepare() {
  assert(process.env.GH_TOKEN, 'Set DOCS_PUBLISH_TOKEN in the screenshot-publishing environment');
  const metadata = provenance();
  assert(/^\d+\.\d+\.\d+$/.test(metadata.version), 'Expected stable Modeler version');
  const recorded = JSON.parse(fs.readFileSync('generated/screenshot-provenance/screenshot-provenance.json', 'utf8'));
  for (const [ key, value ] of Object.entries(metadata)) {
    assert(value && value === recorded[key], `Generation provenance mismatch: ${key}`);
  }

  // Validate every artifact before accessing any target repository.
  for (const repo of repositories) {
    verifyInventory(inventory(`generated/${repo}`), recorded.artifacts[repo]);
  }

  fs.mkdirSync('targets');
  fs.mkdirSync('publishing-bodies');
  const bases = {};
  const summary = [];
  for (const repo of repositories) {
    const fullName = `camunda/${repo}`;
    const info = api(`repos/${fullName}`);
    assert(info.permissions?.push, `Publishing token cannot push to ${fullName}`);
    if (repo === 'camunda-docs') {
      api(`repos/${fullName}/labels/low%20prio`);
    }
    const base = repo === 'camunda-docs-manual' ? 'master' : info.default_branch;
    bases[repo] = base;
    const target = `targets/${repo}`;
    git([ 'clone', '--depth=1', '--branch', base, `https://github.com/${fullName}.git`, target ]);
    const versions = repo === 'camunda-docs' ? JSON.parse(fs.readFileSync(`${target}/versions.json`, 'utf8')) : [];
    assert(repo !== 'camunda-docs' || versions.length > 0, 'No active documentation versions');
    const files = Object.keys(recorded.artifacts[repo]);
    const { updates, skipped } = planUpdates(files, versions,
      file => fs.existsSync(safeDestination(target, file)), repo);

    for (const { source, destination } of updates) {
      const output = safeDestination(target, destination);
      fs.mkdirSync(path.dirname(output), { recursive: true });
      fs.copyFileSync(`generated/${repo}/${source}`, output);
    }

    const runUrl = `${process.env.GITHUB_SERVER_URL}/${metadata.repository}/actions/runs/${metadata.run}`;
    const description = [
      `Draft - generated Desktop Modeler ${metadata.version} screenshots; manual visual review required.`,
      '',
      `Source: [generation run](${runUrl}) (attempt ${metadata.attempt}), commit \`${metadata.sha}\`.`,
      `Target: \`${base}\`. Only generated PNGs are changed; no pages, archived versions or release branches are backported automatically.`,
      repo === 'camunda-docs' ? `Updates Next (\`docs/\`) and existing corresponding paths in active versions: ${versions.join(', ')}. This backport policy follows https://github.com/camunda/camunda-docs/issues/10641.` : '',
      '',
      'Review whether the latest Modeler UI applies to each documentation version before merging. No docs build or visual approval is implied by generation.',
      '',
      `Skipped missing versioned paths (${skipped.length}):`,
      ...skipped.map(file => `- \`${file}\``)
    ].join('\n');
    const template = findTemplate(target);
    assert(repo !== 'camunda-docs' || template, 'Missing camunda-docs PR template');
    const body = renderBody(template, description);
    assert(body.length <= 65536, 'PR body exceeds GitHub limit; shorten skip report before publishing');
    fs.writeFileSync(`publishing-bodies/${repo}.md`, body);
    summary.push(`### ${fullName}\n\nBase: \`${base}\`; ${updates.length} screenshot paths prepared.\n\n${description}`);
  }

  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary.join('\n\n'));
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `bases=${JSON.stringify(bases)}\n`);
}

module.exports = { inventory, verifyInventory, planUpdates, renderBody, safeDestination };

if (require.main === module) {
  try {
    assert([ 'record', 'prepare' ].includes(process.argv[2]), 'Use record or prepare');
    if (process.argv[2] === 'record') {
      record();
    } else {
      prepare();
    }
  } catch (error) {
    console.error(error.message);
    if (error.stderr) {
      console.error(String(error.stderr));
    }
    process.exitCode = 1;
  }
}
