import { defineConfig } from '@playwright/test';

const BASE_URL = process.env.PW_BASE_URL ?? 'http://localhost:5173';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: BASE_URL,
    // Sem baixar browsers: conectamos ao Chrome existente via CDP.
    // Requer Chrome rodando com --remote-debugging-port=9222.
    launchOptions: { channel: undefined },
  },
});
