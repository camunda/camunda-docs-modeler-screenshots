const assert = require('node:assert');

const CAMUNDA_CONSOLE_CLIENT_ID = process.env.CAMUNDA_CONSOLE_CLIENT_ID,
      CAMUNDA_CONSOLE_CLIENT_SECRET = process.env.CAMUNDA_CONSOLE_CLIENT_SECRET,
      CAMUNDA_OAUTH_URL = process.env.CAMUNDA_OAUTH_URL || 'https://login.cloud.camunda.io/oauth/token',
      CAMUNDA_CONSOLE_BASE_URL = process.env.CAMUNDA_CONSOLE_BASE_URL || 'https://api.cloud.camunda.io',
      CAMUNDA_CONSOLE_OAUTH_AUDIENCE = process.env.CAMUNDA_CONSOLE_OAUTH_AUDIENCE || 'api.cloud.camunda.io',
      CAMUNDA_CLUSTER_ID = process.env.CAMUNDA_CLUSTER_ID;

const requiredEnv = {
  CAMUNDA_CONSOLE_CLIENT_ID,
  CAMUNDA_CONSOLE_CLIENT_SECRET,
  CAMUNDA_CLUSTER_ID
};

for (const env in requiredEnv) {
  assert(requiredEnv[env], `Required environment variable not set: ${env}`);
}

prepareCluster().catch(err => console.error(err) || process.exit(1));

/**
 * Check cluster status and resume if necessary.
 */
async function prepareCluster() {
  const secret = await getSecret();

  const cluster = await getCluster(secret);

  if (cluster.status.ready === 'Healthy') {
    console.log('Cluster is ready');
    return;
  }

  if (cluster.status.ready !== 'Suspended') {
    throw new Error(`Cluster is in unexpected state: ${cluster.status.ready}`);
  }

  console.log('Cluster is suspended. Resuming...');
  await resumeCluster(secret);

  await whenReady(cluster, secret);

  console.log('Cluster is ready');
}

/**
 * Authenticate with Camunda to obtain token.
 * @returns {Promise<string>}
 */
async function getSecret() {
  const body = Object.entries({
    client_id: CAMUNDA_CONSOLE_CLIENT_ID,
    client_secret: CAMUNDA_CONSOLE_CLIENT_SECRET,
    audience: CAMUNDA_CONSOLE_OAUTH_AUDIENCE,
    grant_type: 'client_credentials'
  }).map(([ key, value ]) => `${key}=${encodeURIComponent(value)}`).join('&');

  const response = await fetch(CAMUNDA_OAUTH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  });

  if (response.status !== 200) {
    throw new Error(`Failed to fetch secret: ${response.status}`);
  }

  const { access_token: accessToken } = await response.json();

  return accessToken;
}

/**
 * Fetch cluster information.
 * https://console.cloud.camunda.io/customer-api/openapi/docs/#/default/GetCluster
 */
async function getCluster(secret) {
  const response = await fetch(`${CAMUNDA_CONSOLE_BASE_URL}/clusters/${CAMUNDA_CLUSTER_ID}`, {
    headers: {
      Authorization: `Bearer ${secret}`
    }
  });

  if (response.status !== 200) {
    throw new Error(`Failed to fetch cluster: ${response.status}`);
  }

  return await response.json();
}

/**
 * Wake suspended cluster.
 * https://console.cloud.camunda.io/customer-api/openapi/docs/#/default/Wake
 */
async function resumeCluster(secret) {
  const response = await fetch(`${CAMUNDA_CONSOLE_BASE_URL}/clusters/${CAMUNDA_CLUSTER_ID}/wake`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${secret}`
    }
  });

  if (response.status !== 204) {
    throw new Error(`Failed to resume cluster: ${response.status}`);
  }
}

/**
 * Wait for cluster to be healthy.
 */
async function whenReady(cluster, secret) {
  let attempts = 0;

  while (cluster.status.ready !== 'Healthy' && attempts < 30) {
    await new Promise(resolve => setTimeout(resolve, 10000));

    cluster = await getCluster(secret);

    console.log('Checking cluster status (attempt %d): %s', attempts, cluster.status.ready);
    attempts++;
  }

  if (cluster.status.ready !== 'Healthy') {
    throw new Error('Cluster did not become ready');
  }
}
