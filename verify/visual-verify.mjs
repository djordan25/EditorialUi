#!/usr/bin/env node
/**
 * EditorialUI · visual verification runner
 *
 * Screenshots each Storybook story in isolation, screenshots the matching state
 * in the design spec HTML, and perceptual-diffs the two. Prints a pass/fail
 * table and writes annotated diff PNGs to verify/__diff__/.
 *
 * This is the visual gate the /loop relies on: behaviour is covered by Vitest,
 * looks are covered here, token purity by stylelint.
 *
 * ── Prereqs ───────────────────────────────────────────────────────────────
 *   yarn add -D playwright pixelmatch pngjs
 *   npx playwright install chromium
 *
 *   # Build a static Storybook (fast, deterministic — no dev-server flake):
 *   yarn build-storybook -o storybook-static
 *
 * ── Run ───────────────────────────────────────────────────────────────────
 *   node verify/visual-verify.mjs                 # all components
 *   node verify/visual-verify.mjs EdButton        # one component
 *   node verify/visual-verify.mjs --list-spec button   # print spec cell labels
 *
 * ── Config via env ──────────────────────────────────────────────────────────
 *   STORYBOOK_DIR  static Storybook dir         (default ./storybook-static)
 *   SPEC_DIR       design_system_v2/components   (default resolves the design
 *                  project sibling; OVERRIDE THIS in the real repo — copy the
 *                  three spec HTML files in, or point at a served URL base)
 *
 * Exit code is non-zero if any case fails, so it slots straight into CI / the loop.
 */

import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { createServer } from 'node:http';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, resolve, extname } from 'node:path';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { CASES, DIFF_THRESHOLD, DIM_TOLERANCE_PX } from './story-spec-map.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const STORYBOOK_DIR = process.env.STORYBOOK_DIR
    ? resolve(process.env.STORYBOOK_DIR)
    : join(ROOT, 'storybook-static');

// In THIS design project the spec lives two levels up; in the real apostlerisk
// repo set SPEC_DIR explicitly (copy button.html / icon.html / icon-button.html
// in, or serve them and point a file path at the copies).
const SPEC_DIR = process.env.SPEC_DIR
    ? resolve(process.env.SPEC_DIR)
    : resolve(ROOT, '..', 'design_system_v2', 'components');

const DIFF_DIR = join(__dirname, '__diff__');
const VIEWPORT = { width: 1280, height: 900, deviceScaleFactor: 2 };

const args = process.argv.slice(2);
const listSpec = args.indexOf('--list-spec');
const onlyComponent = args.find((a) => !a.startsWith('--') && CASES[a]);

/* ----------------------------------------------------------------- helpers */

// Storybook's static build loads its stories as ES modules + fetches index.json.
// Over file:// that is flaky (some stories never hydrate → #storybook-root stays
// empty → 30s timeouts). Serving it over http makes story loading deterministic.
let STORY_ORIGIN = null;

const storyUrl = (id, theme) => {
    const base = STORY_ORIGIN
        ? `${STORY_ORIGIN}/iframe.html`
        : pathToFileURL(join(STORYBOOK_DIR, 'iframe.html')).href;
    return `${base}?id=${id}&viewMode=story&globals=${theme === 'dark' ? 'theme:dark' : ''}`;
};

const specUrl = (page) => pathToFileURL(join(SPEC_DIR, `${page}.html`)).href;

const MIME = {
    '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
    '.json': 'application/json', '.css': 'text/css', '.png': 'image/png',
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
    '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff': 'font/woff',
    '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.map': 'application/json',
    '.txt': 'text/plain',
};

/** Minimal static file server for the Storybook build (no extra deps). */
function startStaticServer(rootDir) {
    const root = resolve(rootDir);
    return new Promise((resolveServer) => {
        const server = createServer((req, res) => {
            let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
            if (urlPath.endsWith('/')) urlPath += 'index.html';
            const filePath = resolve(join(root, urlPath));
            if (!filePath.startsWith(root)) {
                res.writeHead(403);
                res.end('forbidden');
                return;
            }
            try {
                const data = readFileSync(filePath);
                res.writeHead(200, { 'content-type': MIME[extname(filePath).toLowerCase()] || 'application/octet-stream' });
                res.end(data);
            } catch {
                res.writeHead(404);
                res.end('not found');
            }
        });
        server.listen(0, '127.0.0.1', () => {
            const { port } = server.address();
            resolveServer({
                origin: `http://127.0.0.1:${port}`,
                close: () => new Promise((r) => server.close(r)),
            });
        });
    });
}

function toPng(buf) {
    return PNG.sync.read(buf);
}

/** Crop a PNG to w×h from the top-left into a fresh PNG. */
function crop(png, w, h) {
    const out = new PNG({ width: w, height: h });
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const si = (png.width * y + x) << 2;
            const di = (w * y + x) << 2;
            out.data[di] = png.data[si];
            out.data[di + 1] = png.data[si + 1];
            out.data[di + 2] = png.data[si + 2];
            out.data[di + 3] = png.data[si + 3];
        }
    }
    return out;
}

/* --------------------------------------------------------- spec label lister */

async function listSpecLabels(browser, page) {
    const ctx = await browser.newContext({ viewport: VIEWPORT });
    const p = await ctx.newPage();
    await p.goto(specUrl(page), { waitUntil: 'networkidle' });
    const labels = await p.$$eval('.ed-cell__label', (els) => els.map((e) => e.textContent?.trim()));
    await ctx.close();
    console.log(`\nSpec states found in ${page}.html:`);
    for (const l of labels) console.log(`  • ${l}`);
    console.log('\nReconcile these with verify/story-spec-map.mjs.\n');
}

/* -------------------------------------------------------------- capture story */

async function captureStory(browser, { id, interaction, theme }) {
    const ctx = await browser.newContext({ viewport: VIEWPORT, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    await p.goto(storyUrl(id, theme), { waitUntil: 'networkidle' });
    if (theme === 'dark') {
        await p.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    }
    const root = p.locator('#storybook-root > *').first();
    await root.waitFor({ state: 'visible' });
    // Drive a real pseudo-state on the story side.
    const target = p.locator('#storybook-root button, #storybook-root [role="button"]').first();
    if (interaction === 'hover') await target.hover();
    if (interaction === 'focus') await target.focus();
    if (interaction === 'active') {
        const box = await target.boundingBox();
        if (box) {
            await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
            await p.mouse.down(); // held through capture
        }
    }
    await p.evaluate(() => document.fonts.ready); // web fonts loaded before capture
    await p.waitForTimeout(80); // settle any (reduced) transition
    const buf = await root.screenshot();
    if (interaction === 'active') await p.mouse.up().catch(() => {});
    await ctx.close();
    return toPng(buf);
}

/* --------------------------------------------------------- capture spec state */

async function captureSpec(browser, spec, theme) {
    const ctx = await browser.newContext({ viewport: VIEWPORT, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    await p.goto(specUrl(spec.page), { waitUntil: 'networkidle' });
    if (theme === 'dark') {
        await p.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
        await p.waitForTimeout(50);
    }
    let locator;
    if ('selector' in spec) {
        locator = p.locator(spec.selector).first();
    } else {
        // Find the .ed-cell whose label matches, then screenshot the component
        // element INSIDE its demo (not the .ed-cell__demo flex container, which is
        // a full-width, min-height-140 cell — far larger than the component).
        locator = p
            .locator('.ed-cell', { has: p.locator('.ed-cell__label', { hasText: new RegExp(`^\\s*${escapeRe(spec.label)}\\s*$`, 'i') }) })
            .locator('.ed-cell__demo > *')
            .first();
    }
    await locator.waitFor({ state: 'visible', timeout: 5000 });
    await p.evaluate(() => document.fonts.ready); // web fonts loaded before capture
    const buf = await locator.screenshot();
    await ctx.close();
    return toPng(buf);
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* ------------------------------------------------------------------- compare */

function compare(name, storyPng, specPng) {
    const dimDelta = {
        w: Math.abs(storyPng.width - specPng.width),
        h: Math.abs(storyPng.height - specPng.height),
    };
    if (dimDelta.w > DIM_TOLERANCE_PX || dimDelta.h > DIM_TOLERANCE_PX) {
        return {
            pass: false,
            reason: `dimension mismatch — story ${storyPng.width}×${storyPng.height} vs spec ${specPng.width}×${specPng.height} (geometry drift)`,
            ratio: 1,
        };
    }
    const w = Math.min(storyPng.width, specPng.width);
    const h = Math.min(storyPng.height, specPng.height);
    const a = crop(storyPng, w, h);
    const b = crop(specPng, w, h);
    const diff = new PNG({ width: w, height: h });
    const changed = pixelmatch(a.data, b.data, diff.data, w, h, { threshold: 0.1, includeAA: false });
    const ratio = changed / (w * h);
    mkdirSync(DIFF_DIR, { recursive: true });
    writeFileSync(join(DIFF_DIR, `${name}.diff.png`), PNG.sync.write(diff));
    writeFileSync(join(DIFF_DIR, `${name}.story.png`), PNG.sync.write(a));
    writeFileSync(join(DIFF_DIR, `${name}.spec.png`), PNG.sync.write(b));
    return { pass: ratio <= DIFF_THRESHOLD, reason: `${(ratio * 100).toFixed(2)}% pixels differ`, ratio };
}

/* ---------------------------------------------------------------------- main */

async function main() {
    if (!existsSync(STORYBOOK_DIR)) {
        console.error(`✗ Storybook build not found at ${STORYBOOK_DIR}\n  Run: yarn build-storybook -o storybook-static`);
        process.exit(2);
    }
    const browser = await chromium.launch();

    if (listSpec >= 0) {
        await listSpecLabels(browser, args[listSpec + 1] ?? 'button');
        await browser.close();
        return;
    }

    // Serve the static Storybook over http so story loading is deterministic.
    const sb = await startStaticServer(STORYBOOK_DIR);
    STORY_ORIGIN = sb.origin;

    const components = onlyComponent ? [onlyComponent] : Object.keys(CASES);
    const rows = [];
    let failed = 0;

    for (const comp of components) {
        for (const c of CASES[comp]) {
            const theme = c.theme ?? 'light';
            const tag = `${comp}__${c.id.split('--')[1]}${c.interaction ? `-${c.interaction}` : ''}-${theme}`;
            try {
                const [storyPng, specPng] = await Promise.all([
                    captureStory(browser, c),
                    captureSpec(browser, c.spec, theme),
                ]);
                const r = compare(tag, storyPng, specPng);
                if (!r.pass) failed++;
                rows.push({ tag, pass: r.pass, reason: r.reason });
            } catch (err) {
                failed++;
                rows.push({ tag, pass: false, reason: `capture error: ${err.message}` });
            }
        }
    }

    await browser.close();
    await sb.close();

    // Report
    const pad = Math.max(...rows.map((r) => r.tag.length));
    console.log('\nEditorialUI · visual verification\n' + '─'.repeat(pad + 28));
    for (const r of rows) {
        console.log(`${r.pass ? '✓' : '✗'}  ${r.tag.padEnd(pad)}  ${r.pass ? '' : r.reason}`);
    }
    console.log('─'.repeat(pad + 28));
    console.log(`${rows.length - failed}/${rows.length} passed.  Diffs → verify/__diff__/`);
    if (failed > 0) {
        console.log('\nFor each ✗: open verify/__diff__/<tag>.{story,spec,diff}.png, find the\ndiscrepancy (height / padding / radius / weight / color token / focus offset),\nfix the SCSS, rebuild Storybook, re-run. Do not advance until 0 failures.');
    }
    process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
    console.error(e);
    process.exit(2);
});
