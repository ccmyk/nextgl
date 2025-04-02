// eslint.config.mjs

export default {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'next/core-web-vitals',
    'plugin:prettier/recommended',
    'plugin:jsdoc/recommended'
  ],
  plugins: ['prettier', 'jsdoc', 'import'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'prettier/prettier': 'error',
    'import/order': ['error', { 'groups': ['builtin', 'external', 'internal'] }],
    'jsdoc/check-alignment': 'error', 
    'jsdoc/check-indentation': 'error',
    'jsdoc/check-param-names': 'error'
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    node: true,
    es2024: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
};