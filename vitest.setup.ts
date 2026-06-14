import '@testing-library/jest-dom/vitest';

// --- jsdom polyfills for Radix UI + @testing-library/user-event ---
// jsdom implements neither pointer capture, scrollIntoView, ResizeObserver, nor
// matchMedia, but Radix primitives (Select, Popover, Tooltip, Tabs, …) call into
// all of them. These no-op shims let the behavior tests run without altering any
// component behavior.

const noop = () => {};

Object.defineProperty(Element.prototype, 'hasPointerCapture', { value: () => false, writable: true });
Object.defineProperty(Element.prototype, 'setPointerCapture', { value: noop, writable: true });
Object.defineProperty(Element.prototype, 'releasePointerCapture', { value: noop, writable: true });
Object.defineProperty(Element.prototype, 'scrollIntoView', { value: noop, writable: true });

if (!('ResizeObserver' in globalThis)) {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
}

if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: noop,
      removeListener: noop,
      addEventListener: noop,
      removeEventListener: noop,
      dispatchEvent: () => false,
    }),
  });
}
