/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. Licensed under a proprietary license.
 * See the License.txt file for more information. You may not use this file
 * except in compliance with the proprietary license.
 */

/* eslint-env node */

const decompress = require('decompress');

const { createWriteStream, existsSync } = require('node:fs');

const fs = require('node:fs/promises');
const path = require('node:path');

const fetch = require('node-fetch');
const assert = require('node:assert');


const applicationInfo = {

  darwin: (version) => {
    return {
      archiveName: `camunda-modeler-${ version }-mac-${process.arch}.zip`,
      extractedName: `camunda-modeler-${ version }-mac-${process.arch}`,
      executableName: 'Camunda Modeler.app/Contents/MacOS/Camunda Modeler'
    };
  },

  win32: (version) => {
    return {
      archiveName: `camunda-modeler-${ version }-win-x64.zip`,
      extractedName: `camunda-modeler-${ version }-win-x64`,
      executableName: 'Camunda Modeler.exe'
    };
  },

  linux: (version) => {
    return {
      archiveName: `camunda-modeler-${ version }-linux-x64.tar.gz`,
      extractedName: `camunda-modeler-${ version }-linux-x64`,
      executableName: `camunda-modeler-${ version }-linux-x64/camunda-modeler`
    };
  }
};

module.exports.applicationInfo = applicationInfo;


function getExecutablePath(platform, version) {

  if (!applicationInfo[ platform ]) {
    throw new Error(`Platform <${ platform }> not supported`);
  }

  const {
    extractedName,
    executableName
  } = applicationInfo[platform](version);

  return path.join(__dirname, '../tmp', extractedName, executableName);
}

module.exports.getExecutablePath = getExecutablePath;

/**
 * @param {String} archiveName
 * @param {String} destination
 *
 * @return {Promise<Void>}
 */
function extractArchive(archiveName, destination) {

  if (existsSync(destination)) {
    console.log(`${ destination } exists, skipping extraction`);

    return;
  }

  return decompress(archiveName, destination);
}

module.exports.extractArchive = extractArchive;

/**
 * @param {String} archiveName
 * @param {String} destination
 *
 * @return {Promise<Void>}
 */
async function downloadFile(url, filePath) {

  if (existsSync(filePath)) {
    console.log(`${ filePath } exists, skipping download`);
    return;
  }

  const res = await fetch(url, {
    follow: 5
  });

  const dirname = path.dirname(filePath);

  await fs.mkdir(dirname, { recursive: true });

  return new Promise((resolve, reject) => {

    const fileStream = createWriteStream(filePath);

    res.body.pipe(fileStream);
    res.body.on('error', reject);
    fileStream.on('finish', resolve);
  });
}

module.exports.downloadFile = downloadFile;


/**
 * Downloads the modeler and unpacks it.
 *
 * @param {string} platform
 * @param {string} version
 *
 * @return { Promise<{ extractedPath, archivePath }> }
 */
async function fetchModeler(platform, version) {

  if (!applicationInfo[ platform ]) {
    throw new Error(`Platform <${ platform }> not supported`);
  }

  const {
    archiveName,
    extractedName
  } = applicationInfo[ platform ](version);

  const archiveUrl = `https://downloads.camunda.cloud/release/camunda-modeler/${version}/${archiveName}`;

  const archivePath = path.join(__dirname, '../tmp', archiveName);
  const extractedPath = path.join(__dirname, '../tmp', extractedName);
  const manifestPath = path.join(__dirname, '../tmp', 'manifest.json');

  const executablePath = getExecutablePath(platform, version);

  // (1) download
  console.log('Fetching %s', archiveUrl);

  await downloadFile(archiveUrl, archivePath);

  // (2) unpack
  console.log('Unpacking to %s', extractedPath);

  await extractArchive(archivePath, extractedPath);

  console.log('Writing manifest to %s', manifestPath);

  await fs.writeFile(manifestPath, JSON.stringify({
    platform,
    version,
    extractedPath,
    executablePath,
    archivePath
  }, null, '  '), 'utf8');

  console.log('Verifying manifest');

  assert.equal(
    (await fs.stat(extractedPath)).isDirectory(),
    true,
    `<${ extractedPath }> is directory`
  );

  assert.equal(
    (await fs.stat(executablePath)).isFile(),
    true,
    `<${ executablePath }> is executable file`
  );

  return {
    extractedPath,
    archivePath
  };
}

module.exports.fetchModeler = fetchModeler;

async function readManifest() {
  const manifestPath = path.join(__dirname, '../tmp', 'manifest.json');

  return JSON.parse(await fs.readFile(manifestPath));
}

module.exports.readManifest = readManifest;

async function fetchLatestModelerVersion() {
  const latestReleaseURL = 'https://api.github.com/repos/camunda/camunda-modeler/releases/latest';

  console.log('Fetching %s', latestReleaseURL);

  const response = await fetch(latestReleaseURL, {
    headers: {
      'User-Agent': 'NodeJS'
    }
  });

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status} when fetching latest release from ${latestReleaseURL}`
    );
  }

  const { tag_name } = await response.json();

  console.log('Found %s', tag_name);

  return tag_name.replace(/^v/, '');
}

module.exports.fetchLatestModelerVersion = fetchLatestModelerVersion;