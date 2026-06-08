const { getBuildRuntimeError } = require('../../scripts/check-build-runtime');

describe('build runtime guard', () => {
  it('allows supported LTS Node versions for React production builds', () => {
    ['18.20.8', '20.20.2', '22.16.0'].forEach((version) => {
      expect(getBuildRuntimeError(version)).toBe('');
    });
  });

  it('blocks unsupported old and newer Node versions with release guidance', () => {
    expect(getBuildRuntimeError('17.9.1')).toContain('Unsupported Node.js version');
    expect(getBuildRuntimeError('23.0.0')).toContain('Use an LTS Node release from 18.x through 22.x');
    expect(getBuildRuntimeError('24.7.0')).toContain('react-scripts 5');
  });

  it('reports unparsable Node versions', () => {
    expect(getBuildRuntimeError('not-a-version')).toBe('Unable to determine Node.js version: not-a-version');
  });
});
