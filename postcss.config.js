module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-nested': {},
    'postcss-preset-env': {
      stage: 1,
      features: {
        'nesting-rules': true,
        'custom-properties': true,
        'logical-properties-and-values': true,
      },
      autoprefixer: {
        flexbox: 'no-2009',
      },
    },
  },
};
