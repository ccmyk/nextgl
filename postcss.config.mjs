module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-preset-env': {
      stage: 2,
      features: {
        'nesting-rules': true,
        'custom-properties': true
      }
    },
    // Add 'postcss-mixins': {} if you use mixins in your CSS
  }
}