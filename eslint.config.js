import tseslint from 'typescript-eslint';

// Minimal, intentionally narrow: the one rule the design handoff requires is that
// EditorialUI source never imports `react-icons` (lucide-react, behind EdIcon, is
// the only sanctioned icon family).
export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'storybook-static/**',
      'design_handoffs/**',
      'verify/**',
      'node_modules/**',
    ],
  },
  {
    files: ['src/components/EditorialUI/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
    },
    // Register the plugin namespace so inline `eslint-disable
    // @typescript-eslint/...` directives in the source resolve (the rules
    // themselves stay off — this config only enforces the icon-import ban).
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react-icons',
              message: 'EditorialUI uses lucide-react. Import EdIcon instead.',
            },
          ],
          patterns: [
            {
              group: ['react-icons/*'],
              message: 'EditorialUI uses lucide-react. Import EdIcon instead.',
            },
          ],
        },
      ],
    },
  },
);
