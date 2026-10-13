/**
 @type {import('xo').FlatXoConfig}
 */
const xoConfig = [
  {
    space: true,
    prettier: true,
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/strict-void-return': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-restricted-types': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-return-array-push': 'off',
      'unicorn/consistent-boolean-name': 'off',
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/no-process-exit': 'off',
      'unicorn/max-nested-calls': 'off',
      'regexp/prefer-named-capture-group': 'off',
      'max-depth': ['error', 6],
      'max-params': ['error', 10],
      'no-await-in-loop': 'off',
      complexity: 'off',
      'n/prefer-global/buffer': 'off',
      'package-json/dependency-version-range': 'off',
      // Xo hardcodes its own Prettier options, which take precedence over .prettierrc.json
      'prettier/prettier': ['error', {}, { usePrettierrc: true }]
    }
  }
];

export default xoConfig;
