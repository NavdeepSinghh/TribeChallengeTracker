const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const wrapperPath = path.resolve(__dirname, "run-react-build-with-timeout.js");

function writeFixtureScript(dir, fileName, source) {
  const filePath = path.join(dir, fileName);
  fs.writeFileSync(filePath, source);
  return filePath;
}

function runWrapper({ fixtureScript, timeoutMs = "2000" }) {
  return execFileSync(process.execPath, [wrapperPath], {
    encoding: "utf8",
    env: {
      ...process.env,
      BUILD_IDLE_TIMEOUT_MS: timeoutMs,
      REACT_BUILD_SCRIPT_PATH: fixtureScript,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertThrowsMatching(fn, pattern, message) {
  try {
    fn();
  } catch (error) {
    const output = `${error.stdout || ""}\n${error.stderr || ""}\n${error.message || ""}`;
    assert(pattern.test(output), message);
    return;
  }

  throw new Error(message);
}

function verifyReactBuildTimeout() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "tribe-build-wrapper-"));

  try {
    const successfulBuild = writeFixtureScript(
      tempDir,
      "successful-build.js",
      "console.log('fake build complete');\n"
    );
    assert(
      runWrapper({ fixtureScript: successfulBuild }).includes("fake build complete"),
      "React build wrapper must pass through child build output."
    );

    const invalidTimeoutBuild = writeFixtureScript(
      tempDir,
      "should-not-run.js",
      "console.log('child should not run');\n"
    );
    assertThrowsMatching(
      () => runWrapper({ fixtureScript: invalidTimeoutBuild, timeoutMs: "0" }),
      /Invalid BUILD_IDLE_TIMEOUT_MS value: 0/,
      "React build wrapper must reject invalid idle timeout configuration."
    );

    const silentBuild = writeFixtureScript(
      tempDir,
      "silent-build.js",
      "setInterval(() => {}, 1000);\n"
    );
    assertThrowsMatching(
      () => runWrapper({ fixtureScript: silentBuild, timeoutMs: "50" }),
      /React production build produced no output/,
      "React build wrapper must terminate silent child builds."
    );
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true });
  }

  return true;
}

if (require.main === module) {
  try {
    verifyReactBuildTimeout();
    console.log("React build timeout verification passed.");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = { verifyReactBuildTimeout };
