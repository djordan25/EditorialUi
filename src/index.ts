// editorial-ui · package entry
//
// Components carry their own styles (CSS-module styles are injected at build
// time). The global design tokens live in `editorial-ui/tokens.css` — import it
// once at your app root to register the `--ed-*` custom properties:
//
//   import 'editorial-ui/tokens.css';
//   import { EdButton } from 'editorial-ui';

export * from './components/EditorialUI';
export * from './theme/tokens-v2';
