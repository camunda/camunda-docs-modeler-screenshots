/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. Licensed under a proprietary license.
 * See the License.txt file for more information. You may not use this file
 * except in compliance with the proprietary license.
 */

const {
  fetchModeler,
  fetchLatestModelerVersion
} = require('./helper');

async function run() {

  let version = process.env.VERSION;

  if (!version) {
    console.log('Fetching latest version...');

    version = await fetchLatestModelerVersion();

    console.log(`Using version ${version}`);
  }

  const platform = process.env.PLATFORM || process.platform;

  console.log(`Fetching Camunda Modeler ${version} for platform ${platform}...`);

  await fetchModeler(platform, version);

  console.log('Done!');
}

run().catch(err => console.error(err) || process.exit(1));