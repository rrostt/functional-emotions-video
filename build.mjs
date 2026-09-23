import { cp, mkdir, rm } from 'node:fs/promises';

// A dedicated public directory keeps development files out of the deployed site.
const output = new URL('./dist/', import.meta.url);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const name of ['index.html', 'js', 'assets']) {
  await cp(new URL(name, import.meta.url), new URL(name, output), { recursive: true });
}
console.log('Static site built in dist/');
