import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EdAppBar, EdAppBarNav, EdAppBarNavItem, EdAppBarNavMenu } from './EdAppBar';

describe('EdAppBar', () => {
    it('renders the brand, version, navigation and the right-hand slot', () => {
        render(
            <EdAppBar
                brand="Cerynto"
                version="v0.51"
                nav={
                    <EdAppBarNav aria-label="Main">
                        <EdAppBarNavItem href="/models" active>Models</EdAppBarNavItem>
                        <EdAppBarNavItem href="/runs">Runs</EdAppBarNavItem>
                    </EdAppBarNav>
                }
                end={<span>all systems nominal</span>}
            />,
        );
        expect(screen.getByRole('banner')).toHaveTextContent('Cerynto');
        expect(screen.getByText('v0.51')).toBeInTheDocument();
        const nav = screen.getByRole('navigation', { name: 'Main' });
        expect(nav).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Models' })).toHaveAttribute('aria-current', 'page');
        expect(screen.getByRole('link', { name: 'Runs' })).not.toHaveAttribute('aria-current');
        expect(screen.getByText('all systems nominal')).toBeInTheDocument();
    });

    it('renders a router link in place of its own anchor with asChild', () => {
        render(
            <EdAppBarNavItem asChild active>
                <a href="/x" data-router="yes">Reports</a>
            </EdAppBarNavItem>,
        );
        const link = screen.getByRole('link', { name: 'Reports' });
        expect(link).toHaveAttribute('data-router', 'yes');
        expect(link).toHaveAttribute('aria-current', 'page');
    });

    it('opens a menu from a nav item', async () => {
        const user = userEvent.setup();
        const onSelect = vi.fn();
        render(
            <EdAppBarNavMenu
                label="Governance"
                items={[{ id: 'settings', label: 'Settings', onSelect }]}
            />,
        );
        await user.click(screen.getByRole('button', { name: /governance/i }));
        await user.click(await screen.findByRole('menuitem', { name: 'Settings' }));
        expect(onSelect).toHaveBeenCalled();
    });
});

/*
 * jsdom does not resolve the theme's custom properties, so contrast is computed
 * from the source: the colour tokens the stylesheet names, resolved per theme
 * from tokens-v2.scss, converted to sRGB and run through the WCAG formula.
 */
describe('EdAppBar version chip contrast', () => {
    const read = (...parts: string[]) => readFileSync(join(__dirname, ...parts), 'utf8');
    const stylesheet = read('EdAppBar.module.scss');
    const tokenSource = read('..', '..', '..', 'theme', 'tokens-v2.scss')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s*\/\/.*$/gm, '');

    const themeTokens = (theme: 'light' | 'dark') => {
        const tokens = new Map<string, string>();
        for (const [, selector, body] of tokenSource.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
            const isDark = selector.includes(`[data-theme='dark']`);
            if (theme === 'light' ? isDark : !isDark) continue;
            if (theme === 'light' && !selector.includes(':root')) continue;
            for (const [, name, value] of body.matchAll(/(--ed-[\w-]+)\s*:\s*([^;]+);/g)) tokens.set(name, value.trim());
        }
        return tokens;
    };
    const light = themeTokens('light');
    const dark = new Map([...light, ...themeTokens('dark')]);

    /** The `var(--…)` a rule assigns to a property, e.g. `.version` → `color`. */
    const ruleVar = (selector: string, property: string) => {
        const body = stylesheet.match(new RegExp(`\\${selector}\\s*\\{([^}]*)\\}`))?.[1] ?? '';
        const name = body.match(new RegExp(`(?:^|[\\s;])${property}\\s*:\\s*var\\((--ed-[\\w-]+)\\)`))?.[1];
        if (!name) throw new Error(`${selector} sets no ${property} token`);
        return name;
    };

    const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    /** Linear-light sRGB of a token value: #rrggbb or oklch(L% C H). */
    const linearRgb = (value: string): number[] => {
        const hex = value.match(/^#([0-9a-f]{6})$/i);
        if (hex) return [0, 2, 4].map((i) => toLinear(parseInt(hex[1].slice(i, i + 2), 16) / 255));
        const ok = value.match(/^oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)\s*\)$/);
        if (!ok) throw new Error(`unsupported colour ${value}`);
        const L = Number(ok[1]) / 100;
        const h = (Number(ok[3]) * Math.PI) / 180;
        const a = Number(ok[2]) * Math.cos(h);
        const b = Number(ok[2]) * Math.sin(h);
        const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
        const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
        const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
        const clamp = (x: number) => Math.min(1, Math.max(0, x));
        return [
            clamp(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
            clamp(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
            clamp(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
        ];
    };
    const luminance = (value: string) => {
        const [r, g, b] = linearRgb(value);
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const contrast = (fg: string, bg: string) => {
        const [hi, lo] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
        return (hi + 0.05) / (lo + 0.05);
    };

    it('checks its arithmetic against known pairs', () => {
        expect(contrast('#000000', '#ffffff')).toBeCloseTo(21, 5);
        expect(contrast('#767676', '#ffffff')).toBeCloseTo(4.54, 2);
        // Faint text on white: the failure this suite guards against.
        expect(contrast(light.get('--ed-color-text-faint')!, '#ffffff')).toBeLessThan(4.5);
    });

    it.each([
        ['light', light],
        ['dark', dark],
    ])('version text reaches 4.5:1 on the bar in the %s theme', (_theme, tokens) => {
        const fg = tokens.get(ruleVar('.version', 'color'))!;
        const bg = tokens.get(ruleVar('.root', 'background'))!;
        expect(contrast(fg, bg)).toBeGreaterThanOrEqual(4.5);
    });
});
