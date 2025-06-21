module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks',
    'jsx-a11y',
    '@typescript-eslint',
    'import',
    'react-perf',
  ],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  rules: {
    // Performance Rules
    'performance/no-unused-dependencies': 'error',
    'performance/no-unnecessary-computation': 'warn',
    
    // React Rules
    'react/react-in-jsx-scope': 'off', // Not needed with React 17+
    'react/prop-types': 'off', // Using TypeScript for prop validation
    'react/jsx-no-target-blank': 'error',
    'react/jsx-key': 'error',
    'react/no-array-index-key': 'warn',
    'react/no-unescaped-entities': 'warn',
    'react/self-closing-comp': 'warn',
    'react/jsx-pascal-case': 'warn',
    'react/jsx-no-useless-fragment': 'warn',
    'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],
    
    // React Hooks Rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // TypeScript Rules
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/prefer-const': 'error',
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/ban-ts-comment': 'warn',
    
    // Import Rules
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/no-unresolved': 'error',
    'import/no-unused-modules': 'warn',
    'import/no-duplicates': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'warn',
    
    // Accessibility Rules
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/anchor-has-content': 'error',
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    'jsx-a11y/img-redundant-alt': 'warn',
    
    // General Code Quality Rules
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-unused-vars': 'off', // Using TypeScript version
    'no-var': 'error',
    'prefer-const': 'error',
    'no-multiple-empty-lines': ['warn', { max: 1 }],
    'no-trailing-spaces': 'warn',
    'eol-last': 'warn',
    'comma-dangle': ['warn', 'always-multiline'],
    'quotes': ['warn', 'single', { allowTemplateLiterals: true }],
    'semi': ['warn', 'always'],
    'indent': ['warn', 2, { SwitchCase: 1 }],
    'object-curly-spacing': ['warn', 'always'],
    'array-bracket-spacing': ['warn', 'never'],
    'key-spacing': 'warn',
    'comma-spacing': 'warn',
    'no-multi-spaces': 'warn',
    'space-before-blocks': 'warn',
    'keyword-spacing': 'warn',
    
    // Performance-specific rules for PixelVault
    'no-loop-func': 'error',
    'no-await-in-loop': 'warn',
    'prefer-template': 'warn',
    'no-useless-concat': 'warn',
  },
  overrides: [
    {
      files: ['*.test.{js,ts,jsx,tsx}', '**/__tests__/**/*'],
      env: {
        jest: true,
      },
      rules: {
        // Allow any in tests
        '@typescript-eslint/no-explicit-any': 'off',
        // Allow console in tests
        'no-console': 'off',
      },
    },
    {
      files: ['vite.config.ts', 'gulpfile.js', '*.config.js'],
      env: {
        node: true,
      },
      rules: {
        // Allow require in config files
        '@typescript-eslint/no-var-requires': 'off',
        // Allow console in build scripts
        'no-console': 'off',
      },
    },
    {
      files: ['src/**/*.{ts,tsx}'],
      rules: {
        // Stricter rules for source code
        '@typescript-eslint/no-explicit-any': 'error',
        'no-console': 'error',
      },
    },
  ],
  ignorePatterns: [
    'dist',
    'build',
    'node_modules',
    '*.min.js',
    'coverage',
    '.eslintrc.js',
  ],
};module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks',
    'jsx-a11y',
    '@typescript-eslint',
    'import',
    'performance',
  ],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  rules: {
    // Performance Rules
    'performance/no-unused-dependencies': 'error',
    'performance/no-unnecessary-computation': 'warn',
    
    // React Rules
    'react/react-in-jsx-scope': 'off', // Not needed with React 17+
    'react/prop-types': 'off', // Using TypeScript for prop validation
    'react/jsx-no-target-blank': 'error',
    'react/jsx-key': 'error',
    'react/no-array-index-key': 'warn',
    'react/no-unescaped-entities': 'warn',
    'react/self-closing-comp': 'warn',
    'react/jsx-pascal-case': 'warn',
    'react/jsx-no-useless-fragment': 'warn',
    'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],
    
    // React Hooks Rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // TypeScript Rules
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/prefer-const': 'error',
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/ban-ts-comment': 'warn',
    
    // Import Rules
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/no-unresolved': 'error',
    'import/no-unused-modules': 'warn',
    'import/no-duplicates': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'warn',
    
    // Accessibility Rules
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/anchor-has-content': 'error',
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    'jsx-a11y/img-redundant-alt': 'warn',
    
    // General Code Quality Rules
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-unused-vars': 'off', // Using TypeScript version
    'no-var': 'error',
    'prefer-const': 'error',
    'no-multiple-empty-lines': ['warn', { max: 1 }],
    'no-trailing-spaces': 'warn',
    'eol-last': 'warn',
    'comma-dangle': ['warn', 'always-multiline'],
    'quotes': ['warn', 'single', { allowTemplateLiterals: true }],
    'semi': ['warn', 'always'],
    'indent': ['warn', 2, { SwitchCase: 1 }],
    'object-curly-spacing': ['warn', 'always'],
    'array-bracket-spacing': ['warn', 'never'],
    'key-spacing': 'warn',
    'comma-spacing': 'warn',
    'no-multi-spaces': 'warn',
    'space-before-blocks': 'warn',
    'keyword-spacing': 'warn',
    
    // Performance-specific rules for PixelVault
    'no-loop-func': 'error',
    'no-await-in-loop': 'warn',
    'prefer-template': 'warn',
    'no-useless-concat': 'warn',
  },
  overrides: [
    {
      files: ['*.test.{js,ts,jsx,tsx}', '**/__tests__/**/*'],
      env: {
        jest: true,
      },
      rules: {
        // Allow any in tests
        '@typescript-eslint/no-explicit-any': 'off',
        // Allow console in tests
        'no-console': 'off',
      },
    },
    {
      files: ['vite.config.ts', 'gulpfile.js', '*.config.js'],
      env: {
        node: true,
      },
      rules: {
        // Allow require in config files
        '@typescript-eslint/no-var-requires': 'off',
        // Allow console in build scripts
        'no-console': 'off',
      },
    },
    {
      files: ['src/**/*.{ts,tsx}'],
      rules: {
        // Stricter rules for source code
        '@typescript-eslint/no-explicit-any': 'error',
        'no-console': 'error',
      },
    },
  ],
  ignorePatterns: [
    'dist',
    'build',
    'node_modules',
    '*.min.js',
    'coverage',
    '.eslintrc.js',
  ],
};