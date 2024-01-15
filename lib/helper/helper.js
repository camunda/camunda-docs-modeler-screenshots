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
const os = require('node:os');
const path = require('node:path');

const fetch = require('node-fetch');


const applicationInfo = {

  // not officially supported (yet)
  darwin: null,

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
 * @param {string} platform
 *
 * @return { Promise<{ extractedPath, archivePath, applicationPath, pluginsPath }> }
 */
async function fetchModeler(platform, version) {

  if (!applicationInfo[ platform ]) {
    throw new Error(`Platform <${ platform }> not supported`);
  }

  const {
    archiveName,
    extractedName,
  } = applicationInfo[ platform ](version);

  const archiveUrl = `https://downloads.camunda.cloud/release/camunda-modeler/${version}/${archiveName}`;

  const archivePath = path.join(__dirname, '../tmp', archiveName);
  const extractedPath = path.join(__dirname, '../tmp', extractedName);

  // (1) download
  console.log('Fetching %s', archiveUrl);

  await downloadFile(archiveUrl, archivePath);

  // (2) unpack
  console.log('Unpacking to %s', extractedPath);

  await extractArchive(archivePath, extractedPath);

  return {
    extractedPath,
    archivePath
  };
}

module.exports.fetchModeler = fetchModeler;

async function fetchLatestModelerVersion() {
  const url = new URL('update-check', 'https://camunda-modeler-updates.camunda.com');

  url.searchParams.append('editorID', 'camunda-docs-modeler-screenshots');
  url.searchParams.append('newerThan', 'v0.0.0');
  url.searchParams.append('modelerVersion', 'v0.0.0');
  url.searchParams.append('os', os.platform);
  url.searchParams.append('osVersion', os.version);
  url.searchParams.append('productName', 'Camunda Modeler');
  url.searchParams.append('stagedRollout', false);

  const response = await fetch(url.href);

  const { update = {} } = await response.json();

  const { latestVersion = null } = update;

  return latestVersion.replace(/^v/, '');
}

module.exports.fetchLatestModelerVersion = fetchLatestModelerVersion;