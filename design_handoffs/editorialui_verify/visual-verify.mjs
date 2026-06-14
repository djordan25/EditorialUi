#!/usr/bin/env node
/**
 * EditorialUI · standalone visual-verification harness
 *
 * ONE package for the whole system. Drop this folder anywhere in the repo,
 * point it at a static Storybook build and the spec HTML, and run. It does NOT
 * need to live inside any handoff bundle, and it replaces the per-bundle verify/
 * copies entirely.
 *
 * Two-tier gate (the design-faithfulness model):
 *   Tier 1 — computed-style diff (HARD, exact, noise-free). Reads getComputedStyle
 *            on the anchor element of BOTH the Storybook story and the matching
 *            spec cell, compares the resolved CSS contract (height, padding,
 *            radius, border, colors, font weight/size, shadow). A wrong token or a
 *            38-vs-36px control fails with a human-readable reason; text position
 *            is irrelevant. THIS is what gates the build.
 *   Tier 2 — alignment-tolerant pixel diff (ADVISORY). Slides one image across a
 *            ±1px 3×3 grid and takes the min diff so sub-pixel text noise cancels;
 *            catches icon/SVG/composition drift the style probe can't see. Writes
 *            diff PNGs and a pixel-% for human review. NEVER fails the build.
 *
 * ── Prereqs ───────────────────────────────────────────────────────────────
 *   npm i            # playwright pixelmatch pngjs  (see package.json)
 *   npx playwright install chromium
 *   # static, deterministic Storybook:
 *   (cd <ClientApp> && yarn build-storybook -o storybook-static)
 *
 * ── Env ───────────────────────────────────────────────────────────────────
 *   STORYBOOK_DIR   static Storybook dir   (REQUIRED, no sane default)
 *   SPEC_DIR        spec components/ dir    (REQUIRED — the editorialui_spec/components folder)
 *
 * ── Run ───────────────────────────────────────────────────────────────────
 *   node visual-verify.mjs                  # every mapped component
 *   node visual-verify.mjs EdButton         # one component
 *   node visual-verify.mjs --list-spec button   # print a spec page's state labels
 *   node visual-verify.mjs --pixel          # also fail on Tier-2 (strict; CI opt-in)
 *
 * Exit code is non-zero if any Tier-1 case fails (or any Tier-2 case fails under
 * --pixel), so it slots into the /loop and CI.
 */

import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { createServer } from 'node:http';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, resolve, extname } from 'node:path';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import {
    CASES, SCAFFOLD, DEFAULT_ANCHOR, STYLE_CONTRACT, CONTENT_DRIVEN,
    PIXEL_ADVISORY_THRESHOLD, ALIGN_TOLERANCE_PX, DIM_TOLERANCE_PX,
} from './component-map.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const STORYBOOK_DIR = process.env.STORYBOOK_DIR && resolve(process.env.STORYBOOK_DIR);
const SPEC_DIR = process.env.SPEC_DIR && resolve(process.env.SPEC_DIR);
const DIFF_DIR = join(__dirname, '__diff__');
const VIEWPORT = { width: 1400, height: 1000, deviceScaleFactor: 2 };

const argv = process.argv.slice(2);
const FAIL_ON_PIXEL = argv.includes('--pixel');
const listIdx = argv.indexOf('--list-spec');
const onlyArg = argv.find((a) => !a.startsWith('--'));

/* --------------------------------------------------- id derivation + scaffold */

const sanitize = (s) => s.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const storyId = (group, comp, exportName) =>
    `${sanitize(`EditorialUI/${group}/${comp}`)}--${sanitize(exportName)}`;

/**
 * Expand SCAFFOLD entries into CASES at load. For each scaffolded component we
 * pull its real story export names + spec labels at runtime (the runner already
 * has a browser + filesystem), pair them by name, and apply DEFAULT_ANCHOR.
 * Components explicitly present in CASES win and are left untouched.
 */
async function expandScaffold(browser) {
    for (const [comp, meta] of Object.entries(SCAFFOLD)) {
        if (CASES[comp]) continue; // hand-wired already
        const labels = await specLabels(browser, meta.page).catch(() => []);
        const exports = await storyExports(browser, meta.group, comp).catch(() => []);
        const cases = exports.map((ex) => {
            const label = pairLabel(ex, labels);
            return {
                id: storyId(meta.group, comp, ex),
                spec: label
                    ? { page: meta.page, label }
                    : { page: meta.page, selector: '.ed-cell__demo', _todo: ex },
                anchor: DEFAULT_ANCHOR,
                _scaffold: true,
            };
        });
        CASES[comp] = cases.length ? cases : [{
            id: `editorialui-${sanitize(meta.group)}-${sanitize(comp)}--default`,
            spec: { page: meta.page, selector: '.ed-cell__demo' },
            anchor: DEFAULT_ANCHOR, _scaffold: true, _todo: '(no stories found)',
        }];
    }
}

function pairLabel(exportName, labels) {
    if (!labels.length) return null;
    const se = sanitize(exportName);
    return labels.find((l) => sanitize(l) === se)
        ?? labels.find((l) => { const sl = sanitize(l); return sl.includes(se) || se.includes(sl); })
        ?? null;
}

/* ------------------------------------------------------------------ url helpers */

// Storybook's static build loads stories as ES modules + fetches index.json — both
// flaky/blocked over file://. Serve it over http so loading is deterministic.
let STORY_ORIGIN = null;

const storyUrl = (id, theme) => {
    const base = STORY_ORIGIN
        ? `${STORY_ORIGIN}/iframe.html`
        : pathToFileURL(join(STORYBOOK_DIR, 'iframe.html')).href;
    return `${base}?id=${id}&viewMode=story${theme === 'dark' ? '&globals=theme:dark' : ''}`;
};
const specFileUrl = (page) => pathToFileURL(join(SPEC_DIR, `${page}.html`)).href;

const MIME = {
    '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
    '.json': 'application/json', '.css': 'text/css', '.png': 'image/png',
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
    '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff': 'font/woff',
    '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.map': 'application/json', '.txt': 'text/plain',
};
function startStaticServer(rootDir) {
    const root = resolve(rootDir);
    return new Promise((resolveServer) => {
        const server = createServer((req, res) => {
            let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
            if (urlPath.endsWith('/')) urlPath += 'index.html';
            const filePath = resolve(join(root, urlPath));
            if (!filePath.startsWith(root)) { res.writeHead(403); res.end('forbidden'); return; }
            try {
                const data = readFileSync(filePath);
                res.writeHead(200, {
                    'content-type': MIME[extname(filePath).toLowerCase()] || 'application/octet-stream',
                    'access-control-allow-origin': '*',
                });
                res.end(data);
            } catch { res.writeHead(404); res.end('not found'); }
        });
        server.listen(0, '127.0.0.1', () => {
            const { port } = server.address();
            resolveServer({ origin: `http://127.0.0.1:${port}`, close: () => new Promise((r) => server.close(r)) });
        });
    });
}

/* ------------------------------------------------------- spec label + story list */

async function specLabels(browser, page) {
    const ctx = await browser.newContext({ viewport: VIEWPORT });
    const p = await ctx.newPage();
    await p.goto(specFileUrl(page), { waitUntil: 'networkidle' });
    const labels = await p.$$eval('.ed-cell__label', (els) => els.map((e) => e.textContent.trim()));
    await ctx.close();
    return [...new Set(labels)];
}

async function storyExports(browser, group, comp) {
    // Read the Storybook index to find this component's story ids.
    const ctx = await browser.newContext();
    const p = await ctx.newPage();
    let ids = [];
    try {
        const idxUrl = STORY_ORIGIN ? `${STORY_ORIGIN}/index.json` : pathToFileURL(join(STORYBOOK_DIR, 'index.json')).href;
        const json = await p.evaluate(async (u) => (await fetch(u)).json(), idxUrl);
        const prefix = sanitize(`EditorialUI/${group}/${comp}`) + '--';
        ids = Object.values(json.entries || json.stories || {})
            .filter((e) => e.id.startsWith(prefix))
            .map((e) => e.id.slice(prefix.length));
    } catch { /* index.json absent → caller falls back */ }
    await ctx.close();
    return ids;
}

/* ----------------------------------------------------------- computed-style read */

async function readAnchorStyle(page, rootSel, anchorSel) {
    return page.evaluate(({ rootSel, anchorSel, props }) => {
        const root = document.querySelector(rootSel);
        if (!root) return { __err: `root not found: ${rootSel}` };
        const el = anchorSel === ':scope > *'
            ? root.firstElementChild
            : root.querySelector(anchorSel);
        if (!el) return { __err: `anchor not found: ${anchorSel}` };
        const cs = getComputedStyle(el);
        const out = {};
        for (const prop of props) out[prop] = cs.getPropertyValue(prop).trim();
        const r = el.getBoundingClientRect();
        out.__w = Math.round(r.width); out.__h = Math.round(r.height);
        return out;
    }, { rootSel, anchorSel, props: STYLE_CONTRACT });
}

function diffStyles(storyStyle, specStyle, opts = {}) {
    if (storyStyle.__err) return [{ prop: 'anchor(story)', story: storyStyle.__err, spec: '—' }];
    if (specStyle.__err) return [{ prop: 'anchor(spec)', story: '—', spec: specStyle.__err }];
    const diffs = [];
    // Geometry. For content-driven containers (cards, lists, empty states,
    // tables, drawers) the anchor's OUTER box is sized by its children, so the
    // story's example content vs the spec cell's example content makes height/
    // width differ even when the design is faithful. Skip the box geometry for
    // those and rely on the fixed design tokens below (padding, border, radius,
    // colors, font, shadow) — which are what the spec actually pins. For fixed-
    // size controls (buttons, inputs, switches) geometry stays a hard check.
    // WIDTH is content/layout-driven almost everywhere (a button sized by its label,
    // a field by its container) — never a hard check. HEIGHT is the control-height
    // contract for fixed-size controls; CONTENT_DRIVEN containers skip it too.
    if (!opts.contentDriven) {
        if (Math.abs(storyStyle.__h - specStyle.__h) > DIM_TOLERANCE_PX)
            diffs.push({ prop: 'height', story: storyStyle.__h + 'px', spec: specStyle.__h + 'px' });
    }
    // height/min-height are content-determined for content-driven anchors — drop
    // them from the property comparison too (still checked via the rect above for
    // fixed-size controls).
    const skip = opts.contentDriven ? new Set(['height', 'min-height']) : new Set();
    for (const prop of STYLE_CONTRACT) {
        if (skip.has(prop) || geometryDup(prop)) continue;
        const a = normalize(storyStyle[prop]);
        const b = normalize(specStyle[prop]);
        if (a !== b) diffs.push({ prop, story: storyStyle[prop], spec: specStyle[prop] });
    }
    return diffs;
}

// Height/min-height already covered by the rect check; avoid double-reporting.
const geometryDup = (p) => p === 'height' || p === 'min-height';
// Normalize whitespace + 'px' rounding so 6px vs 6.0001px don't trip.
function normalize(v) {
    if (v == null) return '';
    return v.replace(/(\d+\.\d+)px/g, (_, n) => Math.round(parseFloat(n)) + 'px').replace(/\s+/g, ' ').trim();
}

/* ---------------------------------------------------------------- capture */

async function loadStory(browser, { id, interaction, theme }) {
    const ctx = await browser.newContext({ viewport: VIEWPORT, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    await p.goto(storyUrl(id, theme), { waitUntil: 'networkidle' });
    if (theme === 'dark') await p.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    const root = p.locator('#storybook-root, #root').first();
    await root.waitFor({ state: 'visible' });
    const target = p.locator('#storybook-root button, #storybook-root [role="button"], #storybook-root a').first();
    if (interaction === 'hover') await target.hover().catch(() => {});
    if (interaction === 'focus') await target.focus().catch(() => {});
    if (interaction === 'active') {
        const box = await target.boundingBox().catch(() => null);
        if (box) { await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await p.mouse.down(); }
    }
    await p.waitForTimeout(90);
    return { ctx, p, rootSel: (await p.$('#storybook-root')) ? '#storybook-root' : '#root' };
}

async function loadSpec(browser, spec, theme) {
    const ctx = await browser.newContext({ viewport: VIEWPORT, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    await p.goto(specFileUrl(spec.page), { waitUntil: 'networkidle' });
    if (theme === 'dark') { await p.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark')); await p.waitForTimeout(60); }
    let demoSel;
    if ('selector' in spec) {
        demoSel = spec.selector;
    } else {
        // Resolve the demo cell for this label, tag it so we have a stable selector.
        const ok = await p.evaluate((label) => {
            const cells = [...document.querySelectorAll('.ed-cell')];
            const cell = cells.find((c) => {
                const l = c.querySelector('.ed-cell__label');
                return l && l.textContent.trim().toLowerCase() === label.toLowerCase();
            });
            const demo = cell && cell.querySelector('.ed-cell__demo');
            if (demo) { demo.setAttribute('data-verify-demo', '1'); return true; }
            return false;
        }, spec.label);
        if (!ok) return { ctx, p, demoSel: null };
        demoSel = '[data-verify-demo="1"]';
    }
    await p.locator(demoSel).first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    return { ctx, p, demoSel };
}

/* ----------------------------------------------------------- pixel (advisory) */

function readPng(buf) { return PNG.sync.read(buf); }
function cropPng(png, w, h) {
    const out = new PNG({ width: w, height: h });
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const si = (png.width * y + x) << 2, di = (w * y + x) << 2;
        out.data[di] = png.data[si]; out.data[di+1] = png.data[si+1];
        out.data[di+2] = png.data[si+2]; out.data[di+3] = png.data[si+3];
    }
    return out;
}
function shift(png, dx, dy) {
    const out = new PNG({ width: png.width, height: png.height });
    for (let y = 0; y < png.height; y++) for (let x = 0; x < png.width; x++) {
        const sx = Math.min(png.width - 1, Math.max(0, x - dx));
        const sy = Math.min(png.height - 1, Math.max(0, y - dy));
        const si = (png.width * sy + sx) << 2, di = (png.width * y + x) << 2;
        out.data[di] = png.data[si]; out.data[di+1] = png.data[si+1];
        out.data[di+2] = png.data[si+2]; out.data[di+3] = png.data[si+3];
    }
    return out;
}
function alignTolerantDiff(tag, storyPng, specPng) {
    const w = Math.min(storyPng.width, specPng.width), h = Math.min(storyPng.height, specPng.height);
    if (!w || !h) return { ratio: 1, diffPng: null };
    const a = cropPng(storyPng, w, h), b = cropPng(specPng, w, h);
    let best = Infinity, bestDiff = null;
    const t = ALIGN_TOLERANCE_PX;
    for (let dy = -t; dy <= t; dy++) for (let dx = -t; dx <= t; dx++) {
        const shifted = (dx || dy) ? shift(b, dx, dy) : b;
        const diff = new PNG({ width: w, height: h });
        const changed = pixelmatch(a.data, shifted.data, diff.data, w, h, { threshold: 0.1, includeAA: true });
        if (changed < best) { best = changed; bestDiff = diff; }
    }
    mkdirSync(DIFF_DIR, { recursive: true });
    writeFileSync(join(DIFF_DIR, `${tag}.story.png`), PNG.sync.write(a));
    writeFileSync(join(DIFF_DIR, `${tag}.spec.png`), PNG.sync.write(b));
    if (bestDiff) writeFileSync(join(DIFF_DIR, `${tag}.diff.png`), PNG.sync.write(bestDiff));
    return { ratio: best / (w * h), diffPng: bestDiff };
}

/* ---------------------------------------------------------------------- main */

async function main() {
    if (listIdx < 0) {
        if (!STORYBOOK_DIR || !existsSync(STORYBOOK_DIR)) fatal(`STORYBOOK_DIR missing/not found.\n  export STORYBOOK_DIR=/abs/path/to/storybook-static`);
        if (!SPEC_DIR || !existsSync(SPEC_DIR)) fatal(`SPEC_DIR missing/not found.\n  export SPEC_DIR=/abs/path/to/editorialui_spec/components`);
    } else if (!SPEC_DIR) {
        fatal(`--list-spec needs SPEC_DIR.\n  export SPEC_DIR=/abs/path/to/editorialui_spec/components`);
    }

    const browser = await chromium.launch();

    if (listIdx >= 0) {
        const page = argv[listIdx + 1] || 'button';
        const labels = await specLabels(browser, page);
        console.log(`\nSpec states in ${page}.html:`);
        labels.forEach((l) => console.log('  • ' + l));
        console.log('\nReconcile these with component-map.mjs.\n');
        await browser.close();
        return;
    }

    // Serve the static Storybook over http so story loading + index.json fetch are reliable.
    const sb = await startStaticServer(STORYBOOK_DIR);
    STORY_ORIGIN = sb.origin;

    await expandScaffold(browser);

    const components = onlyArg && CASES[onlyArg] ? [onlyArg] : Object.keys(CASES);
    const rows = [];
    let hardFails = 0;

    for (const comp of components) {
        for (const c of CASES[comp]) {
            const theme = c.theme ?? 'light';
            const anchor = c.anchor ?? DEFAULT_ANCHOR;
            const tag = `${comp}__${c.id.split('--')[1] || 'x'}${c.interaction ? '-' + c.interaction : ''}-${theme}`;
            const story = await loadStory(browser, c).catch((e) => ({ err: e }));
            const spec = await loadSpec(browser, c.spec, theme).catch((e) => ({ err: e }));
            try {
                if (story.err) throw new Error('story load: ' + story.err.message);
                if (spec.err) throw new Error('spec load: ' + spec.err.message);
                if (!spec.demoSel) throw new Error(`spec state not found (${c.spec.label ? 'label: ' + c.spec.label : c.spec.selector})`);

                // Tier 1 — computed-style (hard). Content-driven containers skip
                // outer-box geometry (sized by example content, not the design).
                const contentDriven = c.contentDriven ?? CONTENT_DRIVEN.has(comp);
                const storyStyle = await readAnchorStyle(story.p, story.rootSel, anchor.story);
                const specStyle = await readAnchorStyle(spec.p, spec.demoSel, anchor.spec);
                const styleDiffs = diffStyles(storyStyle, specStyle, { contentDriven });

                // Tier 2 — pixel (advisory)
                const storyShot = readPng(await story.p.locator(story.rootSel).first().screenshot());
                const specShot = readPng(await spec.p.locator(spec.demoSel).first().screenshot());
                const px = alignTolerantDiff(tag, storyShot, specShot);

                const todo = c.spec._todo || c._todo;
                const hard = styleDiffs.length > 0;
                const pixelFlag = px.ratio > PIXEL_ADVISORY_THRESHOLD;
                const failed = hard || (FAIL_ON_PIXEL && pixelFlag);
                if (failed) hardFails++;
                rows.push({ tag, hard, styleDiffs, pixel: px.ratio, pixelFlag, scaffold: !!c._scaffold, todo, failed });
            } catch (err) {
                hardFails++;
                rows.push({ tag, hard: true, styleDiffs: [{ prop: 'ERROR', story: err.message, spec: '' }], pixel: 1, pixelFlag: true, failed: true });
            } finally {
                await story.ctx?.close?.();
                await spec.ctx?.close?.();
            }
        }
    }

    await browser.close();
    await sb.close();
    report(rows);
    process.exit(hardFails > 0 ? 1 : 0);
}

function report(rows) {
    const pad = Math.max(10, ...rows.map((r) => r.tag.length));
    console.log('\nEditorialUI · visual verification  (Tier 1 = computed-style, hard · Tier 2 = pixel, advisory)');
    console.log('─'.repeat(pad + 40));
    for (const r of rows) {
        const mark = r.failed ? '✗' : '✓';
        const px = `${(r.pixel * 100).toFixed(1)}%${r.pixelFlag ? '⚠' : ' '}`;
        const flags = [r.contentDriven ? 'content-driven(geo skipped)' : '', r.scaffold ? 'scaffold' : '', r.todo ? `TODO:pair ${r.todo}` : ''].filter(Boolean).join(' ');
        console.log(`${mark}  ${r.tag.padEnd(pad)}  px ${px}  ${flags}`);
        for (const d of r.styleDiffs) console.log(`     · ${d.prop}: story=${d.story}  spec=${d.spec}`);
    }
    console.log('─'.repeat(pad + 40));
    const fails = rows.filter((r) => r.failed).length;
    console.log(`${rows.length - fails}/${rows.length} passed (Tier 1).  Diffs → __diff__/`);
    console.log(`px% = align-tolerant pixel diff (advisory${FAIL_ON_PIXEL ? ', failing under --pixel' : ''}); ⚠ = over ${PIXEL_ADVISORY_THRESHOLD * 100}% — eyeball the diff PNG.`);
    if (fails > 0) console.log(`\nEach ✗ lists the exact CSS props that differ. Fix the .module.scss token/value,\nrebuild Storybook, re-run. 'scaffold'/'TODO:pair' = reconcile the map first via --list-spec.`);
}

const fatal = (m) => { console.error('✗ ' + m); process.exit(2); };
main().catch((e) => { console.error(e); process.exit(2); });
