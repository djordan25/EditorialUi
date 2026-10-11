import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * CSS modules hash class names only. A rule that starts with a bare element
 * (`tbody tr:hover { … }`) is global: it styles every matching element on the
 * consumer's page, not just this component's. Every top-level rule in a
 * component's module stylesheet must therefore name one of its own classes.
 */
const componentsDir = join(__dirname, '..', 'components');

const moduleFiles = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) return moduleFiles(path);
        return entry.name.endsWith('.module.scss') ? [path] : [];
    });

/** Selectors of rules outside any other rule (inside @media/@supports still counts as top level). */
const topLevelSelectors = (scss: string): string[] => {
    const source = scss.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
    const selectors: string[] = [];
    const stack: ('rule' | 'at' | 'keyframes')[] = [];
    let buffer = '';
    for (const ch of source) {
        if (ch === '{') {
            const head = buffer.trim();
            buffer = '';
            if (head.startsWith('@keyframes')) stack.push('keyframes');
            else if (head.startsWith('@')) stack.push('at');
            else {
                if (stack.every((s) => s === 'at')) selectors.push(head);
                stack.push('rule');
            }
        } else if (ch === '}') {
            stack.pop();
            buffer = '';
        } else if (ch === ';') {
            buffer = '';
        } else {
            buffer += ch;
        }
    }
    return selectors;
};

const isScoped = (selector: string) => selector.includes('.');

describe('component stylesheets', () => {
    it.each(moduleFiles(componentsDir).map((f): [string, string] => [f.slice(componentsDir.length + 1), f]))(
        '%s keeps every rule scoped to its own classes',
        (_name: string, file: string) => {
            const unscoped = topLevelSelectors(readFileSync(file, 'utf8'))
                .flatMap((s) => s.split(','))
                .map((s) => s.trim())
                .filter((s) => s && !isScoped(s));
            expect(unscoped).toEqual([]);
        },
    );
});
