/**
 * scripts/build.mjs – baut die veröffentlichungsfertige App nach dist/
 * - Tailwind-CSS lokal erzeugen (kein CDN im Browser)
 * - Schriften selbst hosten (keine Google-Fonts-Verbindung, DSGVO)
 * - Cache-Busting per Versions-Parameter, Service Worker für Offline-Betrieb
 * - Sicherheits-Header (_headers)
 * - Bricht ab, wenn in Rechtstexten noch [BITTE …]-Platzhalter stehen
 *   (lokal überspringbar mit ALLOW_PLACEHOLDERS=1)
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dist = path.join(root, 'dist');
const rel = (...p) => path.join(root, ...p);

// 1. dist leeren (Ordner selbst behalten, damit "wrangler dev" weiterläuft)
fs.mkdirSync(dist, { recursive: true });
for (const entry of fs.readdirSync(dist)) fs.rmSync(path.join(dist, entry), { recursive: true, force: true });

// 2. Quelldateien kopieren
const htmlFiles = fs.readdirSync(root).filter(f => f.endsWith('.html'));
for (const f of htmlFiles) fs.copyFileSync(rel(f), path.join(dist, f));
for (const dir of ['js', 'data', 'assets']) fs.cpSync(rel(dir), path.join(dist, dir), { recursive: true });
fs.copyFileSync(rel('apple-touch-icon.png'), path.join(dist, 'apple-touch-icon.png'));

// 3. Tailwind-CSS erzeugen
execFileSync(process.execPath, [
  rel('node_modules/tailwindcss/lib/cli.js'),
  '-c', rel('tailwind.config.js'),
  '-i', rel('src/tailwind.css'),
  '-o', path.join(dist, 'assets/app.css'),
  '--minify'
], { cwd: root, stdio: ['ignore', 'ignore', 'inherit'] });

// 4. Schriften selbst hosten (nur lateinische Zeichensätze, woff2)
const fonts = [
  { pkg: 'cormorant-garamond', weights: [400, 600, 700], italic: [400, 600] },
  { pkg: 'jetbrains-mono', weights: [400, 500, 600, 700], italic: [] },
  { pkg: 'plus-jakarta-sans', weights: [300, 400, 500, 600, 700, 800], italic: [] }
];
const fontDir = path.join(dist, 'assets/fonts');
fs.mkdirSync(fontDir, { recursive: true });
let fontCss = '/* Selbst gehostete Schriften (SIL Open Font License) */\n';
for (const font of fonts) {
  const base = rel('node_modules/@fontsource', font.pkg);
  const variants = font.weights.map(w => `${w}`).concat(font.italic.map(w => `${w}-italic`));
  for (const variant of variants) {
    for (const subset of ['latin-ext', 'latin']) {
      const cssFile = path.join(base, `${subset}-${variant}.css`);
      if (!fs.existsSync(cssFile)) continue;
      let css = fs.readFileSync(cssFile, 'utf8');
      css = css.replace(/url\(\.\/files\/([^)]+)\)\s*format\('woff'\),?\s*/g, '');
      css = css.replace(/,\s*;/g, ';');
      css = css.replace(/url\(\.\/files\/([^)]+\.woff2)\)/g, (m, file) => {
        fs.copyFileSync(path.join(base, 'files', file), path.join(fontDir, file));
        return `url(fonts/${file})`;
      });
      fontCss += css + '\n';
    }
  }
}
fs.writeFileSync(path.join(dist, 'assets/fonts.css'), fontCss);

// 5. Versionskennung aus dem Inhalt
const hash = createHash('sha256');
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
  const full = path.join(dir, e.name);
  return e.isDirectory() ? walk(full) : [full];
});
const allFiles = walk(dist).sort();
for (const f of allFiles) hash.update(fs.readFileSync(f));
const version = hash.digest('hex').slice(0, 10);

function removeTailwindConfig(html) {
  let start;
  while ((start = html.indexOf('tailwind.config')) !== -1) {
    const open = html.indexOf('{', start);
    let depth = 0, i = open;
    for (; i < html.length; i++) {
      if (html[i] === '{') depth++;
      else if (html[i] === '}' && --depth === 0) break;
    }
    let end = i + 1;
    if (html[end] === ';') end++;
    html = html.slice(0, start) + html.slice(end);
  }
  return html;
}

// 6. HTML umschreiben: CDN/Google Fonts raus, lokale Styles rein, Cache-Busting, Service Worker
const swSnippet = `<script>if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) { navigator.serviceWorker.register('sw.js').catch(function(){}); }</script>`;
for (const f of htmlFiles) {
  const file = path.join(dist, f);
  let html = fs.readFileSync(file, 'utf8');
  const isApp = html.includes('cdn.tailwindcss.com');
  html = html.replace(/\s*<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>/g, '');
  html = html.replace(/\s*<link rel="preconnect" href="https:\/\/fonts\.(googleapis|gstatic)\.com"[^>]*>/g, '');
  html = html.replace(/\s*<link href="https:\/\/fonts\.googleapis\.com\/[^"]*" rel="stylesheet">/g, '');
  // Inline-Konfiguration des CDN-Tailwind entfernen (per Klammerzählung bis zur passenden "}")
  html = removeTailwindConfig(html);
  if (isApp) {
    html = html.replace('</title>', '</title>\n  <link rel="stylesheet" href="assets/fonts.css">\n  <link rel="stylesheet" href="assets/app.css">');
  }
  html = html.replace(/(src|href)="((?:js|data|assets)\/[^"?#]+\.(?:js|css))"/g, `$1="$2?v=${version}"`);
  html = html.replace('</body>', `  ${swSnippet}\n</body>`);
  if (!html.includes('rel="icon"')) html = html.replace('</title>', '</title>\n  <link rel="icon" type="image/png" href="assets/apple-touch-icon.png">');
  fs.writeFileSync(file, html);
}

// 7. Service Worker
const precache = ['./'].concat(walk(dist).map(f => path.relative(dist, f).split(path.sep).join('/'))
  .filter(p => !p.endsWith('.map') && p !== 'sw.js' && p !== '_headers'));
const sw = `/* TACTUS Service Worker · Version ${version} (automatisch erzeugt) */
const CACHE = 'tactus-${version}';
const PRECACHE = ${JSON.stringify(precache)};
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin || url.pathname.startsWith('/api/')) return;
  if (req.mode === 'navigate') {
    // Seiten: zuerst Netz (Updates sofort), offline aus dem Cache
    event.respondWith(fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy));
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match('./'))));
    return;
  }
  // Dateien mit Versions-Parameter: Cache zuerst
  event.respondWith(caches.match(req, { ignoreSearch: true }).then((cached) => cached || fetch(req)));
});
`;
fs.writeFileSync(path.join(dist, 'sw.js'), sw);

// 8. Sicherheits-Header
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://sdk.scdn.co",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data: blob: https://i.scdn.co",
  "media-src 'self' data: blob:",
  "connect-src 'self' https://generativelanguage.googleapis.com https://api.anthropic.com https://api.openai.com https://api.spotify.com wss://dealer.spotify.com",
  "frame-src https://sdk.scdn.co https://open.spotify.com",
  "worker-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'"
].join('; ');
fs.writeFileSync(path.join(dist, '_headers'), `/*
  Content-Security-Policy: ${csp}
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  X-Frame-Options: DENY
  Permissions-Policy: camera=(self), microphone=(self), geolocation=(), payment=()
  X-Robots-Tag: noindex, nofollow
  Rating: RTA-5042-1996-1400-1577-RTA

/sw.js
  Cache-Control: no-cache
`);

// 9. Platzhalter-Prüfung
const placeholders = htmlFiles.filter(f => fs.readFileSync(path.join(dist, f), 'utf8').includes('[BITTE'));
if (placeholders.length) {
  const msg = `Noch auszufüllende [BITTE …]-Platzhalter in: ${placeholders.join(', ')}`;
  if (process.env.ALLOW_PLACEHOLDERS === '1') console.warn('WARNUNG: ' + msg);
  else { console.error('ABBRUCH: ' + msg + '\n(Für lokale Tests: ALLOW_PLACEHOLDERS=1 npm run build)'); process.exit(1); }
}

console.log(`Build ${version}: ${allFiles.length} Dateien in dist/`);
