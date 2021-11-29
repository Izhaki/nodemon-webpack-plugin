module.exports = {
  pkgRoot: '.',
  branches: ['master'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/npm',
    [
      '@semantic-release/exec',
      {
        prepareCmd:
          'npx replace-json-property package.json version ${nextRelease.version}', // eslint-disable-line no-template-curly-in-string
      },
    ],
    '@semantic-release/changelog',
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'CHANGELOG.md'],
        message:
          'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}', // eslint-disable-line no-template-curly-in-string
      },
    ],
    '@semantic-release/github',
  ],
};
