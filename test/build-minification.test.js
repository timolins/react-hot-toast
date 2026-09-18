const { execSync } = require('child_process');
const { readFileSync } = require('fs');
const path = require('path');

describe('build minification', () => {
  it('minifies CSS inside template literals in production output', () => {
    execSync('npm run build', {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe',
    });

    const dist = readFileSync(
      path.join(__dirname, '../dist/index.mjs'),
      'utf8'
    );

    expect(dist).not.toContain('will-change: transform');
    expect(dist).toContain('will-change:transform');
    expect(dist).not.toMatch(/0%\s+\{transform/);
    expect(dist).toMatch(/0%\{transform/);
  });
});
