const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const wrapperPath = path.resolve(__dirname, '../../scripts/run-react-build-with-timeout.js');

const writeFixtureScript = (dir, fileName, source) => {
  const filePath = path.join(dir, fileName);
  fs.writeFileSync(filePath, source);
  return filePath;
};

const runWrapper = ({ fixtureScript, timeoutMs = '2000' }) => {
  const env = {
    ...process.env,
    BUILD_IDLE_TIMEOUT_MS: timeoutMs,
    REACT_BUILD_SCRIPT_PATH: fixtureScript,
  };
  return execFileSync(process.execPath, [wrapperPath], {
    encoding: 'utf8',
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
};

describe('React build timeout wrapper', () => {
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tribe-build-wrapper-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { force: true, recursive: true });
  });

  it('passes through output and exits when the child build exits normally', () => {
    const fixtureScript = writeFixtureScript(
      tempDir,
      'successful-build.js',
      "console.log('fake build complete');\n"
    );

    expect(runWrapper({ fixtureScript })).toContain('fake build complete');
  });

  it('fails before launching the child build when the idle timeout is invalid', () => {
    const fixtureScript = writeFixtureScript(
      tempDir,
      'should-not-run.js',
      "console.log('child should not run');\n"
    );

    expect(() => runWrapper({ fixtureScript, timeoutMs: '0' })).toThrow(/Invalid BUILD_IDLE_TIMEOUT_MS value: 0/);
  });

  it('terminates a silent child build after the configured idle timeout', () => {
    const fixtureScript = writeFixtureScript(
      tempDir,
      'silent-build.js',
      'setInterval(() => {}, 1000);\n'
    );

    expect(() => runWrapper({ fixtureScript, timeoutMs: '50' })).toThrow(/React production build produced no output/);
  });
});
