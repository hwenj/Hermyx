import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  // ESLint ignores these files to be fixed
  { ignores: ['dist', 'node_modules'] },

  // Anti-error foundation rules
  js.configs.recommended,
  pluginReact.configs.flat.recommended,

  // Customized config
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      prettier: eslintPluginPrettier,
      'react-hooks': pluginReactHooks,
    },
    rules: {
      // Automatic rules for Hooks and Prettier
      ...pluginReactHooks.configs.recommended.rules,
      ...prettierConfig.rules,
      'prettier/prettier': 'error',

      // Rules for moderns JS (ES6+)
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      //'no-console': 'warn',
      'react/prop-types': 'off',

      // Other rules
      'capitalized-comments': ['error', 'always'],
      'react/react-in-jsx-scope': 'off',
    },
  },
];
