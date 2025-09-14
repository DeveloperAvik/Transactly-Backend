// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.strict,
    tseslint.configs.stylistic,
    {
        files: ['**/*.ts'],
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.json'],
            },
        },
        rules: {
            'no-console': 'warn',
            'no-unused-vars': 'warn', // Use TypeScript's version
            '@typescript-eslint/no-unused-vars': 'warn',
            'prefer-const': 'warn',
            'no-var': 'error',
            'arrow-body-style': ['warn', 'as-needed'],
            'object-shorthand': ['warn', 'always'],
            'prefer-arrow-callback': 'warn',
            'no-duplicate-imports': 'error',

            // TypeScript specific rules
            'no-empty-function': 'off',
            '@typescript-eslint/no-empty-function': 'warn',
            'no-use-before-define': 'off',
            '@typescript-eslint/no-use-before-define': 'error',
            'no-shadow': 'off',
            '@typescript-eslint/no-shadow': 'error',
            'no-undef': 'off', // TypeScript handles this
            'no-dupe-class-members': 'off',
            '@typescript-eslint/no-dupe-class-members': 'error',
            'no-redeclare': 'off',
            '@typescript-eslint/no-redeclare': 'error',
            'no-implied-eval': 'off',
            '@typescript-eslint/no-implied-eval': 'error',
            'no-invalid-this': 'off',
            '@typescript-eslint/no-invalid-this': 'error',

            // Magic numbers
            'no-magic-numbers': 'off',
            '@typescript-eslint/no-magic-numbers': [
                'warn',
                {
                    ignore: [-1, 0, 1, 2],
                    ignoreArrayIndexes: true,
                    ignoreDefaultValues: true,
                    ignoreEnums: true,
                    ignoreNumericLiteralTypes: true,
                    ignoreReadonlyClassProperties: true,
                    ignoreTypeIndexes: true,
                    detectObjects: false,
                },
            ],

            // Type safety
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-non-null-assertion': 'warn',
            '@typescript-eslint/no-empty-interface': 'warn',
            '@typescript-eslint/no-array-constructor': 'error',
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/no-misused-promises': 'error',
            '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
            '@typescript-eslint/no-unsafe-assignment': 'warn',
            '@typescript-eslint/no-unsafe-member-access': 'warn',
            '@typescript-eslint/no-unsafe-return': 'warn',
            '@typescript-eslint/strict-boolean-expressions': 'warn',
            '@typescript-eslint/no-unnecessary-condition': 'warn',

            // Imports
            '@typescript-eslint/no-require-imports': 'error',
            '@typescript-eslint/no-var-requires': 'error',

            // Type definitions
            '@typescript-eslint/typedef': [
                'warn',
                {
                    arrowParameter: false,
                    variableDeclaration: false,
                    memberVariableDeclaration: false,
                    objectDestructuring: false,
                    arrayDestructuring: false,
                    parameter: true
                },
            ],

            // Method binding
            'no-unbound-method': 'off',
            '@typescript-eslint/no-unbound-method': 'error',
        },
    }
);