/**
 * Storybook preview decorators for EditorialUI verification.
 *
 * Drop these into .storybook/preview.tsx (merge with anything already there).
 * Two jobs:
 *   1. Theme global toggle — lets the runner request light/dark via
 *      ?globals=theme:dark, and gives humans a toolbar switch.
 *   2. Reduced-motion + neutral background so captures are deterministic.
 *
 * Real pseudo-states (hover/focus/active) are driven by Playwright in the
 * runner — you do NOT need @storybook/addon-pseudo-states for the diff to work.
 * Add that addon only if you also want to eyeball pseudo-states in the
 * Storybook UI during manual review.
 */
import React, { useEffect } from 'react';
import type { Decorator, Preview } from '@storybook/react';

const withTheme: Decorator = (Story, context) => {
    const theme = context.globals.theme ?? 'light';
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        return () => document.documentElement.removeAttribute('data-theme');
    }, [theme]);
    return <Story />;
};

export const globalTypes = {
    theme: {
        description: 'EditorialUI theme',
        defaultValue: 'light',
        toolbar: {
            title: 'Theme',
            icon: 'circlehollow',
            items: [
                { value: 'light', title: 'Light' },
                { value: 'dark', title: 'Dark' },
            ],
        },
    },
};

const preview: Preview = {
    decorators: [withTheme],
    parameters: {
        backgrounds: { disable: true }, // tokens own the bg; keep captures clean
        // The runner sets reducedMotion at the browser level; this mirrors it for
        // anyone viewing stories manually.
        chromatic: { pauseAnimationAtEnd: true },
    },
};

export default preview;
