import * as fs from 'fs';
import * as path from 'path';

// Transparent 1x1 PNG pixel
const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const pngBuffer = Buffer.from(base64Png, 'base64');
const publicDir = path.join(process.cwd(), 'public');

fs.mkdirSync(publicDir, { recursive: true });

fs.writeFileSync(path.join(publicDir, 'favicon.ico'), pngBuffer);
fs.writeFileSync(path.join(publicDir, 'icon-192x192.png'), pngBuffer);
fs.writeFileSync(path.join(publicDir, 'icon-512x512.png'), pngBuffer);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), pngBuffer);

// create manifest.json
const manifest = {
  "name": "Data Alchemist",
  "short_name": "Data Alchemist",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0b0e",
  "theme_color": "#D4B070",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
};

fs.writeFileSync(path.join(publicDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

console.log("Icons and manifest created.");
