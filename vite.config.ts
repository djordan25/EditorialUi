import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

// Library build: ESM, per-module output (tree-shakeable), .d.ts emitted, and each
// component's compiled CSS-module styles injected into its own JS chunk so
// consumers need no special loader. React / lucide / Radix stay external.
export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    dts({
      include: ['src'],
      exclude: ['**/*.test.ts', '**/*.test.tsx', '**/*.stories.tsx'],
    }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
    },
    rollupOptions: {
      external: [/^react($|\/)/, /^react-dom($|\/)/, 'lucide-react', /^@radix-ui\//],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        // Strip the ".module" infix from emitted CSS-module files (EdCard.module.css -> EdCard.css). The class
        // names inside are already final/hashed, so a CONSUMER must load them as PLAIN global CSS. Left as
        // ".module.css", a consumer's own Vite re-runs CSS Modules on them — re-hashing the selectors so they no
        // longer match the class names the components apply (the styles silently don't take). libInjectCss injects
        // the per-chunk import using whatever name we emit here, so renaming makes those imports resolve to plain CSS.
        assetFileNames: (assetInfo) => {
          const name = assetInfo.names?.[0] ?? assetInfo.name ?? 'asset';
          if (name.endsWith('.css')) {
            return `assets/${name.replace(/\.module\.css$/, '.css')}`;
          }
          return 'assets/[name][extname]';
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
