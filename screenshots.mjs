// Erstellt echte Screenshots der Referenz-Websites nach public/images/ref-<id>.jpg
// Einmalig: npm i -D playwright && npx playwright install chromium
// Dann:     npm run screenshots
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const targets = [
  ['sammelkartenmesse', 'https://schweizer-sammelkartenmesse.ch/'],
  ['landschaftsarchitekt', 'https://interactive-landscap-hz71.bolt.host/'],
  ['shop', 'https://kaleidoscopic-kitten-e2ec36.netlify.app/'],
  ['it-dienstleister', 'https://it-company.bolt.host/'],
  ['cv', 'https://it-professional-port-0nre.bolt.host/'],
];

mkdirSync('public/images', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
for (const [id, url] of targets) {
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: `public/images/ref-${id}.jpg`, type: 'jpeg', quality: 82, clip: { x: 0, y: 0, width: 1440, height: 900 } });
    console.log('ok', id);
  } catch (e) { console.error('fehlgeschlagen', id, e.message); }
}
await browser.close();
