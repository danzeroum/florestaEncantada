import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/core/**/*.js'],
      exclude: ['src/**/*.{test,spec}.js'],
    },
  },
});
