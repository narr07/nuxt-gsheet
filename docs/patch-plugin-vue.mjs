import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const findPnpmDirs = () => {
  return [
    path.join(__dirname, 'node_modules/.pnpm'),
    path.join(__dirname, '../node_modules/.pnpm')
  ].filter(fs.existsSync);
};

const patchAll = () => {
  const pnpmDirs = findPnpmDirs();
  let patchedCount = 0;

  for (const pnpmDir of pnpmDirs) {
    const folders = fs.readdirSync(pnpmDir);
    for (const folder of folders) {
      if (folder.includes('@vitejs+plugin-vue')) {
        const indexMjs = path.join(pnpmDir, folder, 'node_modules/@vitejs/plugin-vue/dist/index.mjs');
        if (fs.existsSync(indexMjs)) {
          let code = fs.readFileSync(indexMjs, 'utf-8');
          if (code.includes('if (transformWithOxc) {')) {
            code = code.replace(/if\s*\(\s*transformWithOxc\s*\)\s*\{/g, 'if (false) { // PATCHED TO AVOID CLOUDFLARE BUG\n');
            fs.writeFileSync(indexMjs, code);
            console.log(`[Patch] Successfully patched: ${indexMjs}`);
            patchedCount++;
          }
        }
      }
    }
  }

  if (patchedCount === 0) {
    console.log('[Patch] Could not find any @vitejs/plugin-vue to patch, or already patched.');
  } else {
    console.log(`[Patch] Patched ${patchedCount} instances of @vitejs/plugin-vue.`);
  }
};

patchAll();
