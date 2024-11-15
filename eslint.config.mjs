import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
    { files: ['**/*.{mjs,cjs,ts}'] },
    { languageOptions: { globals: globals.browser } },
    {
        rules: {
            indent: ['error', 4],
            'linebreak-style': ['error', 'unix'],
            quotes: ['error', 'single'],
            semi: ['error', 'always'],
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    
];
