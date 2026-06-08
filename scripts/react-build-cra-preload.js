const Module = require('module');

const originalLoad = Module._load;

class NoopWebpackPlugin {
  apply() {}
}

Module._load = function load(request, parent, isMain) {
  if (request === 'react-dev-utils/browsersHelper') {
    return {
      checkBrowsers: () => Promise.resolve([]),
      defaultBrowsers: {
        production: ['>0.2%', 'not dead', 'not op_mini all'],
        development: [
          'last 1 chrome version',
          'last 1 firefox version',
          'last 1 safari version',
        ],
      },
    };
  }

  if (request === 'react-dev-utils/FileSizeReporter') {
    return {
      measureFileSizesBeforeBuild: () => Promise.resolve({ root: '', sizes: {} }),
      printFileSizesAfterBuild: () => {},
    };
  }

  if (request === 'workbox-webpack-plugin') {
    return {
      GenerateSW: NoopWebpackPlugin,
      InjectManifest: NoopWebpackPlugin,
    };
  }

  if (
    request === 'eslint-webpack-plugin' ||
    request === 'react-dev-utils/ForkTsCheckerWebpackPlugin' ||
    request === 'react-dev-utils/ForkTsCheckerWarningWebpackPlugin'
  ) {
    return NoopWebpackPlugin;
  }

  return originalLoad.apply(this, arguments);
};
