process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const fs = require('fs-extra');
const webpack = require('webpack');
const configFactory = require('react-scripts/config/webpack.config');
const paths = require('react-scripts/config/paths');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const { checkBrowsers } = require('react-dev-utils/browsersHelper');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const printBuildError = require('react-dev-utils/printBuildError');

const copyPublicFolder = () => {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: (file) => file !== paths.appHtml,
  });
};

const logPhase = (phase) => {
  console.log(`[build] ${phase}`);
};

const closeCompiler = (compiler, exitCode) => {
  compiler.close(() => {
    process.exit(exitCode);
  });
};

async function main() {
  logPhase('checking required files');
  if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
    process.exit(1);
  }

  logPhase('creating webpack config');
  const config = configFactory('production');

  logPhase('checking browserslist');
  await checkBrowsers(paths.appPath, false);

  logPhase('preparing build folder');
  fs.emptyDirSync(paths.appBuild);
  copyPublicFolder();

  logPhase('creating compiler');
  const compiler = webpack(config);

  logPhase('running webpack');
  const heartbeat = setInterval(() => {
    logPhase('webpack still running');
  }, 30000);

  compiler.run((err, stats) => {
    clearInterval(heartbeat);

    if (err) {
      printBuildError(err);
      closeCompiler(compiler, 1);
      return;
    }

    const messages = formatWebpackMessages(
      stats.toJson({ all: false, warnings: true, errors: true })
    );

    if (messages.errors.length) {
      printBuildError(new Error(messages.errors[0]));
      closeCompiler(compiler, 1);
      return;
    }

    if (messages.warnings.length) {
      console.log('Compiled with warnings.');
      console.log(messages.warnings.join('\n\n'));
    } else {
      console.log('Compiled successfully.');
    }

    closeCompiler(compiler, 0);
  });
  logPhase('webpack run started');
}

main().catch((error) => {
  printBuildError(error);
  process.exit(1);
});
