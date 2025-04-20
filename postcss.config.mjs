export default {
  plugins: [
    'postcss-import',
    [
      'postcss-preset-env',
      {
        features: {
          'nesting-rules': true,
          'custom-properties': true
        }
      }
    ]
  ]
};