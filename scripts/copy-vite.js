import { copyFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcPath = join(__dirname, '..', 'server', 'vite.ts');
const destPath = join(__dirname, '..', 'dist', 'vite.js');

try {
  copyFileSync(srcPath, destPath);
  console.log('✓ Copied vite.ts to dist/vite.js');
} catch (error) {
  console.error('Failed to copy vite.ts:', error.message);
  process.exit(1);
}
