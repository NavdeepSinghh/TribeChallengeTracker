const { spawn } = require('child_process');
const path = require('path');

const idleTimeoutMs = Number.parseInt(process.env.BUILD_IDLE_TIMEOUT_MS || '600000', 10);
const buildScript = process.env.REACT_BUILD_SCRIPT_PATH || path.resolve(__dirname, 'run-react-production-build.js');
const preloadScript = path.resolve(__dirname, 'react-build-cra-preload.js');

if (!Number.isFinite(idleTimeoutMs) || idleTimeoutMs <= 0) {
  console.error(`Invalid BUILD_IDLE_TIMEOUT_MS value: ${process.env.BUILD_IDLE_TIMEOUT_MS}`);
  process.exit(1);
}

const child = spawn(process.execPath, ['--require', preloadScript, buildScript], {
  env: process.env,
  stdio: ['ignore', 'pipe', 'pipe'],
});

let finished = false;
let lastOutputAt = Date.now();
let interval;

const finish = (exitCode) => {
  if (finished) return;
  finished = true;
  clearInterval(interval);
  process.exitCode = exitCode;
};

const touch = () => {
  lastOutputAt = Date.now();
};

child.on('error', (error) => {
  console.error(`Failed to start React production build: ${error.message}`);
  finish(1);
});

child.on('exit', (code, signal) => {
  if (signal) {
    console.error(`React production build exited after signal ${signal}.`);
  }
  finish(code === null ? 1 : code);
});

child.stdout.on('data', (chunk) => {
  touch();
  process.stdout.write(chunk);
});

child.stderr.on('data', (chunk) => {
  touch();
  process.stderr.write(chunk);
});

interval = setInterval(() => {
  if (finished) return;
  const idleFor = Date.now() - lastOutputAt;
  if (idleFor < idleTimeoutMs) return;

  finished = true;
  console.error(
    [
      `React production build produced no output for ${idleFor}ms; terminating.`,
      'This usually means react-scripts is hung before webpack/minifier progress.',
      'Confirm no stale react-scripts build processes are running, then rerun under Node 18-22.',
    ].join('\n')
  );
  child.kill('SIGTERM');
  setTimeout(() => {
    child.kill('SIGKILL');
    process.exit(1);
  }, 5000).unref();
  process.exitCode = 1;
  clearInterval(interval);
}, 1000);
