const { spawn } = require('node:child_process');

const subprocess = spawn('node', ['./scripts/server.js'], {
  detached: true,
  stdio: 'ignore'
});

subprocess.unref();