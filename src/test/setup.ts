import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Mock Firebase to prevent initialization errors in tests
vi.mock('../firebase', () => ({
  db: {},
  auth: {},
  googleProvider: {},
  messaging: {},
  default: {}
}));

// Cleanup after each test
afterEach(() => {
  cleanup();
});
