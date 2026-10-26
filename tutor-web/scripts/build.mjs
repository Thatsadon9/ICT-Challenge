import {cpSync, mkdirSync, readdirSync, rmSync, statSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const source = fileURLToPath(new URL('../', import.meta.url));
const output = fileURLToPath(new URL('../../dist/', import.meta.url));
const publicFiles = [
  'index.html', 'styles.css', 'app.js', 'lessons.js', 'assessment.js',
  'challenges.js', 'python-worker.js', 'data', 'assets'
];

// Keep the deployed site independent of local launchers, QA exports, and scripts.
rmSync(output, {recursive: true, force: true});
mkdirSync(output, {recursive: true});
for (const name of publicFiles) {
  cpSync(path.join(source, name), path.join(output, name), {recursive: true});
}

function countFiles(directory) {
  return readdirSync(directory).reduce((total, name) => {
    const item = path.join(directory, name);
    return total + (statSync(item).isDirectory() ? countFiles(item) : 1);
  }, 0);
}
console.log(`Built ${countFiles(output)} static files in ${output}`);
