// Typed accessor for EditorialUI tokens declared in tokens-v2.scss.
//
// Two helpers:
//   - cssVar(name)  → "var(--ed-color-brand)" — for inline styles / styled
//                     contexts. Prefer this; CSS-side resolution honors theme
//                     switching for free.
//   - token(name)   → "oklch(38% 0.09 245)" — reads the live computed value.
//                     Use only where CSS variables aren't accepted: SVG fill,
//                     chart libs, Monaco theming.

export type EdColorToken =
    | 'color-brand' | 'color-brand-hover' | 'color-brand-pressed' | 'color-brand-contrast' | 'color-brand-bg' | 'color-brand-bg-strong'
    | 'color-accent' | 'color-accent-hover' | 'color-accent-contrast'
    | 'color-surface-0' | 'color-surface-1' | 'color-surface-2' | 'color-surface-3' | 'color-surface-4'
    | 'color-surface-input' | 'color-surface-overlay' | 'color-surface-inverse'
    | 'color-text-primary' | 'color-text-secondary' | 'color-text-muted' | 'color-text-faint' | 'color-text-disabled' | 'color-text-inverse' | 'color-text-link' | 'color-text-on-solid'
    | 'color-hairline' | 'color-hairline-strong' | 'color-hairline-bold' | 'color-border-focus'
    | 'color-status-success' | 'color-status-success-bg'
    | 'color-status-warning' | 'color-status-warning-bg'
    | 'color-status-danger'  | 'color-status-danger-bg'
    | 'color-status-info'    | 'color-status-info-bg'
    | 'color-status-neutral' | 'color-status-neutral-bg'
    | 'color-severity-low' | 'color-severity-medium' | 'color-severity-high' | 'color-severity-mra' | 'color-severity-mria'
    | 'color-lifecycle-configured' | 'color-lifecycle-queued' | 'color-lifecycle-in-progress'
    | 'color-lifecycle-completed' | 'color-lifecycle-errored' | 'color-lifecycle-canceled'
    | 'color-button-bg-primary' | 'color-button-bg-primary-hover' | 'color-button-bg-primary-pressed'
    | 'color-focus-ring' | 'color-row-hover' | 'color-row-selected' | 'color-row-superseded';

export type EdSpaceToken =
    | 'space-0' | 'space-1' | 'space-2' | 'space-3' | 'space-4' | 'space-5'
    | 'space-6' | 'space-7' | 'space-8' | 'space-10' | 'space-12' | 'space-16'
    | 'space-20' | 'space-24';

export type EdRadiusToken = 'radius-none' | 'radius-sm' | 'radius-md' | 'radius-lg' | 'radius-xl' | 'radius-pill';

export type EdElevationToken = 'elevation-0' | 'elevation-1' | 'elevation-2' | 'elevation-3' | 'elevation-4';

export type EdFontSizeToken =
    | 'font-size-2xs' | 'font-size-xs' | 'font-size-sm' | 'font-size-md'
    | 'font-size-lg' | 'font-size-xl' | 'font-size-2xl' | 'font-size-3xl'
    | 'font-size-display' | 'font-size-display-lg';

export type EdMotionToken = 'transition-fast' | 'transition-base' | 'transition-slow' | 'transition-spring';

export type EdZIndexToken =
    | 'z-dropdown' | 'z-popover' | 'z-overlay' | 'z-drawer'
    | 'z-modal' | 'z-tooltip' | 'z-command-palette' | 'z-toast';

export type EdControlHeightToken = 'control-h-sm' | 'control-h-md' | 'control-h-lg' | 'control-h-xl';

export type EdToken =
    | EdColorToken | EdSpaceToken | EdRadiusToken | EdElevationToken
    | EdFontSizeToken | EdMotionToken | EdZIndexToken | EdControlHeightToken;

/** Reference a token in inline styles. Resolves through CSS, so theme switching is free. */
export const cssVar = (name: EdToken): string => `var(--ed-${name})`;

/** Read the resolved value of a token. Use only where CSS variables aren't accepted. */
export const token = (name: EdToken): string => {
    if (typeof document === 'undefined') return '';
    return getComputedStyle(document.documentElement)
        .getPropertyValue(`--ed-${name}`)
        .trim();
};

export type EdThemeMode = 'light' | 'dark';

/** Reads the current theme from the document. Light is the default. */
export const getEditorialThemeMode = (): EdThemeMode => {
    if (typeof document === 'undefined') return 'light';
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
};
