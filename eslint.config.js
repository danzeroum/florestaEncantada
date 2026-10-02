import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**', 'playwright-report/**', 'test-results/**'],
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
      'comma-dangle': ['error', 'always-multiline'],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': ['error'],
      eqeqeq: ['error', 'smart'],
      'prefer-const': ['error'],
      'no-var': ['error'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  prettier,
];
