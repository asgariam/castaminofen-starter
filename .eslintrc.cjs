module.exports = {
  root: true,
  ignorePatterns: ['node_modules/', 'dist/', '.next/'],
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['apps/api/**/*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./apps/api/tsconfig.json'],
        ecmaVersion: 2022,
        sourceType: 'module'
      },
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            varsIgnorePattern: '^_',
            argsIgnorePattern: '^_',
            ignoreRestSiblings: true
          }
        ],
        '@typescript-eslint/no-explicit-any': 'off',
        'no-console': ['warn', { allow: ['warn', 'error'] }]
      }
    },
    {
      files: ['apps/web/**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./apps/web/tsconfig.json'],
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: { jsx: true }
      },
      extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended'],
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            varsIgnorePattern: '^_',
            argsIgnorePattern: '^_',
            ignoreRestSiblings: true
          }
        ],
        '@typescript-eslint/no-explicit-any': 'off'
      }
    },
    {
      files: ['packages/**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./packages/shared-types/tsconfig.json'],
        ecmaVersion: 2022,
        sourceType: 'module'
      },
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            varsIgnorePattern: '^_',
            argsIgnorePattern: '^_',
            ignoreRestSiblings: true
          }
        ],
        '@typescript-eslint/no-explicit-any': 'off'
      }
    }
  ]
};
