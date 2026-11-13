/* =======================================
                IMPORTS
  ======================================= */

import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';


/* =======================================
            CONFIGURATION
  ======================================= */

export default [
  globalIgnores(['dist']),
  {
    /**
    * Target files (JavaScript + JSX)
    */
    files: ['**/*.{js,jsx}'],

    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],

    languageOptions: {
      ecmaVersion: 'latest', // For now lets use the latest server
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      /**
      * Disallow unused variables, ignoring constants or uppercase/underscore patterns
      */
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^[A-Z_]',
        },
      ],
    },
  },
];