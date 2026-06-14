import React, { useEffect } from 'react';
import type { Decorator, Preview } from '@storybook/react';

// Load the design fonts so visual diffs reflect real geometry, not fallback fonts.
import '@fontsource/inter-tight/400.css';
import '@fontsource/inter-tight/500.css';
import '@fontsource/inter-tight/600.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';

// Register all --ed-* custom properties globally (light + [data-theme="dark"]).
import '../src/theme/tokens-v2.scss';

// Theme global — lets the visual-verify runner request light/dark via
// ?globals=theme:dark, and gives humans a toolbar switch.
const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals.theme as string) ?? 'light';
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
    backgrounds: { disable: true },
    chromatic: { pauseAnimationAtEnd: true },
  },
};

export default preview;
