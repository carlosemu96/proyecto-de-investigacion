/**
 * Headless UI smoke-test for the Grupo NE maintenance dashboard.
 * Run from the project root: node test-app.mjs
 */
import puppeteer from 'puppeteer';

const BASE = 'http://localhost:4200';
const ROUTES = [
  { path: '/dashboard',   label: 'Dashboard' },
  { path: '/vehicles',    label: 'Vehicles' },
  { path: '/maintenance', label: 'Maintenance' },
  { path: '/spare-parts', label: 'Spare-Parts' },
  { path: '/alerts',      label: 'Alerts' },
  { path: '/analytics',   label: 'Analytics' },
  { path: '/reports',     label: 'Reports' },
];

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  executablePath: '/usr/bin/google-chrome'
});

const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });

// --- Login ---
console.log('→ Logging in...');
await page.goto(`${BASE}/auth/login`, { waitUntil: 'networkidle0' });
await page.type('input[type="email"]', 'admin@grupone.com');
await page.type('input[type="password"]', 'password123');
await page.click('button[type="submit"]');
await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 8000 });
console.log('✓ Login successful — now at:', page.url());

// --- Screenshot each route ---
for (const { path, label } of ROUTES) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  const out = `/tmp/screen-${label}.png`;
  await page.screenshot({ path: out, fullPage: false });
  console.log(`✓ ${label} → ${out}`);
}

await browser.close();
console.log('\nAll screenshots taken.');
