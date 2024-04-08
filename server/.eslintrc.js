module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier'
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        'prettier/prettier': ['error'],
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        "@typescript-eslint/no-empty-function": "off",
        'indent': ['error', 4, {
            'SwitchCase': 1
        }],
        'linebreak-style': ['error', 'unix'],
        // 'quotes': ['error', 'double'],
        'semi': ['error', 'always'],
        'curly': ['error', 'all'],
        'nonblock-statement-body-position': ['error', 'below'],
        'comma-dangle': ['error', 'never'],
        'eol-last': ['error', 'always'],
        '@typescript-eslint/naming-convention': [
            'error',
            {
                'selector': 'default',
                'format': ['camelCase']
            },
            {
                'selector': 'variable',
                'format': ['camelCase', 'UPPER_CASE']
            },
            {
                'selector': 'typeLike',
                'format': ['PascalCase']
            },
            {
                'selector': 'enumMember',
                'format': ['UPPER_CASE']
            },
            {
                selector: 'import',
                format: [],
            },
            {
                // To force _ for unused parameters
                'selector': 'parameter',
                'format': null,
                'modifiers': ['unused'],
                'custom': {
                    'regex': '^_',
                    'match': true
                }
            },
            {
                'selector': 'classProperty',
                'modifiers': ['static'],
                'format': ['camelCase', 'PascalCase']
            },
            {
                'selector': 'classProperty',
                'modifiers': ['static', 'private'],
                'format': ['camelCase'],
                'leadingUnderscore': 'require'
            },
            {
                'selector': 'memberLike',
                'modifiers': ['private'],
                'format': ['camelCase'],
                'leadingUnderscore': 'require'
            },
            {
                'selector': 'memberLike',
                'modifiers': ['protected'],
                'format': ['camelCase'],
                'leadingUnderscore': 'require'
            },
            {
                // This rule is only to allow Mongo _id field
                'selector': ['property'],
                'modifiers': ['public'],
                'format': ['camelCase'],
                'leadingUnderscore': 'allow',
                'filter': {
                    'regex': '^_id$',
                    'match': true
                }
            },
            {
                // This rule is only to allow Mongo _id field
                'selector': ['property'],
                'modifiers': ['public'],
                'format': ['camelCase'],
                'leadingUnderscore': 'forbid',
                'filter': {
                    'regex': '(?!_id)',
                    'match': true
                }
            }
        ]
    },
};
