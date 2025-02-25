export default {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'next/core-web-vitals',
    'plugin:prettier/recommended', // Ensure Prettier is integrated
  ],
  rules: {
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react/prop-types': 'off', // Disable prop-types if using TypeScript
    'prettier/prettier': 'error', // Enforce Prettier rules
  },
  settings: {
    react: {
      version: 'detect', // Automatically detect the React version
    },
  },
  env: {
    browser: true,
    node: true,
    es2024: true, // Use the latest ECMAScript version
  },
  parserOptions: {
    ecmaVersion: 'latest', // Use the latest supported version
    sourceType: 'module', // Use ES modules
    ecmaFeatures: {
      jsx: true, // Enable JSX
    },
  },
};
