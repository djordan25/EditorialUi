import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    // Process CSS modules so `styles.foo` resolves to a real (non-scoped) class
    // name in tests that assert on classes (e.g. EdIcon size/color).
    css: { modules: { classNameStrategy: 'non-scoped' } },
  },
});
