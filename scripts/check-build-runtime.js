function getBuildRuntimeError(nodeVersion) {
  const major = Number.parseInt(nodeVersion.split('.')[0], 10);

  if (Number.isNaN(major)) {
    return `Unable to determine Node.js version: ${nodeVersion}`;
  }

  if (major < 18 || major >= 23) {
    return [
      `Unsupported Node.js version for the React production build: ${nodeVersion}.`,
      'This project uses react-scripts 5, whose production webpack config can hang before output on newer Node runtimes.',
      'Use an LTS Node release from 18.x through 22.x for npm run build, cap sync, and release checks.',
    ].join('\n');
  }

  return '';
}

if (require.main === module) {
  const error = getBuildRuntimeError(process.versions.node);
  if (error) {
    console.error(error);
    process.exit(1);
  }
}

module.exports = { getBuildRuntimeError };
