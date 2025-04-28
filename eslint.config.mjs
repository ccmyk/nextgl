import '@rushstack/eslint-patch/modern-module-resolution';
import next from 'eslint-config-next';
import prettierPlugin from 'eslint-plugin-prettier';
import glslPlugin from 'eslint-plugin-glsl';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  // 1) Next.js defaults
  ...next(),

  // 2) JS/JSX + Prettier
  {
    files: ['**/*.{js,jsx}'],
    plugins: { prettier: prettierPlugin },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { React: 'readonly' }
    },
    linterOptions: { reportUnusedDisableDirectives: true },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types':           'off',
      'prettier/prettier':          'error',
      'import/order': [
        'error',
        { groups: ['builtin','external','internal'], 'newlines-between': 'always' }
      ]
    }
  },

  // 3) GLSL files
  {
    files: ['**/*.glsl'],
    parser: 'eslint-plugin-glsl/parser',
    plugins: { glsl: glslPlugin },
    rules: {
      'glsl/no-undef':       'error',
      'glsl/no-unused-vars': 'error'
    }
  }
];