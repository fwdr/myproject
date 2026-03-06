#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
let build = 0;
try {
  build = parseInt(execSync('git rev-list --count HEAD', { encoding: 'utf8' }).trim(), 10);
} catch (_) {}
const version = {
  version: pkg.version,
  build,
  display: `${pkg.version} (${build})`,
};
fs.writeFileSync(
  path.join(root, 'version.json'),
  JSON.stringify(version, null, 2)
);
