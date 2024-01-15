/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. Licensed under a proprietary license.
 * See the License.txt file for more information. You may not use this file
 * except in compliance with the proprietary license.
 */

/* eslint-env node */

const {
  fetchModeler,
  fetchLatestModelerVersion
} = require('./helper');

const platform = process.env.PLATFORM || process.platform;

let version = process.env.VERSION;

async function run() {
  if (!version) {
    console.log('Fetching latest version...');

    version = await fetchLatestModelerVersion();
  }

  console.log(`Fetching Camunda Modeler ${version}...`);

  await fetchModeler(platform, version);

  console.log('Done!');
}

run().catch(err => console.error(err) || process.exit(1));