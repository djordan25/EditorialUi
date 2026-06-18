/**
 * One-command release: verify → bump → commit → tag → push → GitHub release.
 *
 *   npm run release:patch          # 0.1.1 → 0.1.2
 *   npm run release:minor          # 0.1.1 → 0.2.0
 *   npm run release:major          # 0.1.1 → 1.0.0
 *   npm run release:patch -- --dry-run   # show the plan + run preconditions, change nothing
 *
 * Cross-platform (pure Node — no bash). Cuts from `master` only, requires a clean
 * tree in sync with origin, and runs the full gate + build before tagging so a tag
 * is always installable. SemVer: patch = fixes, minor = new components/props, major
 * = breaking changes.
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';

const REPO = 'djordan25/EditorialUi';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const type = args.find((a) => a === 'patch' || a === 'minor' || a === 'major');
if (!type) {
    console.error('Usage: npm run release:patch | release:minor | release:major   [-- --dry-run]');
    process.exit(1);
}

const run = (cmd) => execSync(cmd, { stdio: 'inherit', cwd: root });
const cap = (cmd) => execSync(cmd, { encoding: 'utf8', cwd: root }).trim();
const die = (m) => { console.error('\n✗ ' + m); process.exit(1); };
const version = () => JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version;
const bump = (v, t) => {
    const [a, b, c] = v.split('.').map(Number);
    return t === 'major' ? `${a + 1}.0.0` : t === 'minor' ? `${a}.${b + 1}.0` : `${a}.${b}.${c + 1}`;
};

/* ---- Preconditions (always enforced, even in --dry-run) ---- */
const branch = cap('git rev-parse --abbrev-ref HEAD');
if (branch !== 'master') die(`Releases must be cut from master (you are on "${branch}").`);
if (cap('git status --porcelain')) die('Working tree has uncommitted changes — commit, stash, or discard first.');
run('git fetch origin --tags --quiet');
if (cap('git rev-list HEAD..origin/master --count') !== '0') die('Local master is behind origin/master — `git pull` first.');
try { execSync('gh auth status', { stdio: 'ignore' }); } catch { die('GitHub CLI is not authenticated — run `gh auth login`.'); }

const current = version();
const next = bump(current, type);
const tag = `v${next}`;
const prevTag = cap('git describe --tags --abbrev=0');

console.log(`\nRelease plan:  ${current} → ${next}   (tag ${tag}, previous ${prevTag})${dryRun ? '   [DRY RUN]' : ''}`);

if (dryRun) {
    console.log('\nDry run — would now: verify (typecheck/lint/stylelint/test/build), bump package.json,');
    console.log(`commit "release: ${tag}", tag, push, and create the GitHub release. Nothing changed.`);
    process.exit(0);
}

/* ---- Gate: a tag must be installable ---- */
console.log('\n▶ Verifying: typecheck, lint, stylelint, tests, build…');
run('npm run typecheck');
run('npm run lint');
run('npm run lint:css');
run('npm run test');
run('npm run build');

/* ---- Bump + commit + annotated tag ---- */
run(`npm version ${type} --no-git-tag-version`);
run(`git commit -am "release: ${tag}"`);
run(`git tag -a ${tag} -m "${tag}"`);
run('git push --follow-tags');

/* ---- GitHub release: install header + auto-generated changelog ---- */
let changelog;
try {
    const body = JSON.parse(
        cap(`gh api repos/${REPO}/releases/generate-notes -f tag_name=${tag} -f previous_tag_name=${prevTag}`),
    ).body;
    changelog = body || `**Full changelog:** https://github.com/${REPO}/compare/${prevTag}...${tag}`;
} catch {
    changelog = `**Full changelog:** https://github.com/${REPO}/compare/${prevTag}...${tag}`;
}
const notes = `## Install / upgrade\n\`\`\`bash\nnpm install github:${REPO}#${tag}\n\`\`\`\n\n${changelog}`;
const notesFile = join(tmpdir(), `eui-release-${next}.md`);
writeFileSync(notesFile, notes);
try {
    run(`gh release create ${tag} --title "${tag}" --latest --notes-file "${notesFile}"`);
} finally {
    rmSync(notesFile, { force: true });
}

console.log(`\n✓ Released ${tag} → https://github.com/${REPO}/releases/tag/${tag}`);
console.log(`  Install: npm install github:${REPO}#${tag}`);
