import { beforeEach, afterEach } from 'vitest'

// Mock DOM globals for tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// Clean up DOM after each test
afterEach(() => {
  document.body.innerHTML = ''
  document.head.innerHTML = ''
})

// Set up common test utilities
beforeEach(() => {
  // Reset any global state
})