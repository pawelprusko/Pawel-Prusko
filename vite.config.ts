import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, type Plugin} from 'vite';
import {generateSitemapXml} from './src/lib/sitemap';

function dynamicSitemapPlugin(): Plugin {
  return {
    name: 'dynamic-sitemap-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';
        if (url === '/sitemap.xml') {
          try {
            const xml = generateSitemapXml();
            res.setHeader('Content-Type', 'application/xml; charset=utf-8');
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.statusCode = 200;
            res.end(xml);
            return;
          } catch (err) {
            console.error('[sitemap] Error generating sitemap dynamically:', err);
            res.statusCode = 500;
            res.end('Error generating sitemap');
            return;
          }
        }
        if (url === '/api/contact' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}');
              console.log('[API Contact Received for hello@pawelprusko.com]:', data);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, message: 'Inquiry received for hello@pawelprusko.com' }));
            } catch {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid payload' }));
            }
          });
          return;
        }
        if (url === '/api/waitlist' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}');
              console.log('[API Waitlist Received]:', data);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, message: 'Added to waitlist' }));
            } catch {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid payload' }));
            }
          });
          return;
        }
        next();
      });
    },
    buildStart() {
      try {
        const xml = generateSitemapXml();
        const publicDir = path.resolve(__dirname, 'public');
        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir, { recursive: true });
        }
        fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf-8');
      } catch (err) {
        console.error('[sitemap] Error generating public/sitemap.xml:', err);
      }
    },
    generateBundle() {
      try {
        const xml = generateSitemapXml();
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: xml,
        });
      } catch (err) {
        console.error('[sitemap] Error generating bundle sitemap.xml:', err);
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), dynamicSitemapPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
