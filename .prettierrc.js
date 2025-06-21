module.exports = {
  // Basic formatting options
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'all',
  tabWidth: 2,
  useTabs: false,
  printWidth: 100,
  
  // JSX specific options
  jsxSingleQuote: true,
  jsxBracketSameLine: false,
  
  // Other options
  arrowParens: 'avoid',
  bracketSpacing: true,
  endOfLine: 'lf',
  
  // File-specific overrides
  overrides: [
    {
      files: '*.json',
      options: {
        singleQuote: false,
      },
    },
    {
      files: '*.scss',
      options: {
        singleQuote: false,
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always',
      },
    },
  ],
};module.exports = {
  // Basic formatting options
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'all',
  tabWidth: 2,
  useTabs: false,
  printWidth: 100,
  
  // JSX specific options
  jsxSingleQuote: true,
  jsxBracketSameLine: false,
  
  // Other options
  arrowParens: 'avoid',
  bracketSpacing: true,
  endOfLine: 'lf',
  
  // File-specific overrides
  overrides: [
    {
      files: '*.json',
      options: {
        singleQuote: false,
      },
    },
    {
      files: '*.scss',
      options: {
        singleQuote: false,
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always',
      },
    },
  ],
};