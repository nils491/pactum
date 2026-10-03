/** scripts/check.mjs – schnelle Prüfung vor jedem Push (auch in GitHub Actions) */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';

let failed = false;
const fail = (m) => { console.error('FEHLER: ' + m); failed = true; };

// 1. Jede JS-Datei muss gültiges JavaScript sein (fängt z. B. HTML in .js-Dateien ab)
for (const dir of ['js', 'data']) {
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js'))) {
    try { execFileSync(process.execPath, ['--check', `${dir}/${f}`], { stdio: 'pipe' }); }
    catch (e) { fail(`${dir}/${f}: ${e.stderr.toString().split('\n').slice(0, 5).join(' ')}`); }
  }
}
try { execFileSync(process.execPath, ['--check', 'worker/src/index.js'], { stdio: 'pipe' }); }
catch (e) { fail('worker/src/index.js: ' + e.stderr.toString().split('\n')[0]); }

// 2. Fragenkatalog vollständig
globalThis.window = globalThis;
const require = createRequire(import.meta.url);
for (const p of [1, 2, 3]) require(`../data/questions_part${p}.js`);
const ids = [1, 2, 3].flatMap(p => (globalThis[`surveyChaptersPart${p}`] || []).flatMap(c => c.items.map(i => i.id)));
if (ids.length !== 505 || new Set(ids).size !== 505) fail(`Fragenkatalog: ${ids.length} Items, ${new Set(ids).size} eindeutig (erwartet 505)`);

// 3. Jede App-Seite bindet das Zugangsmodul (18+/Abo) ein
for (const f of ['index.html', 'analyse.html', 'chat.html', 'protocol.html', 'guide.html', 'session.html']) {
  if (!fs.readFileSync(f, 'utf8').includes('js/tactus_access.js')) fail(`${f} lädt js/tactus_access.js nicht (Jugendschutz!)`);
}

// 4. Keine API-Schlüssel im Code
const keyPattern = /AIza[0-9A-Za-z_-]{30,}|AQ\.[0-9A-Za-z_-]{30,}|sk-ant-[0-9A-Za-z_-]{20,}/;
for (const f of [...fs.readdirSync('.').filter(f => f.endsWith('.html')), ...fs.readdirSync('js').map(f => 'js/' + f)]) {
  if (keyPattern.test(fs.readFileSync(f, 'utf8'))) fail(`${f} enthält offenbar einen API-Schlüssel`);
}

if (failed) process.exit(1);
console.log(`OK: Syntax, 505 Items, Zugangsmodul, keine Schlüssel im Code`);
