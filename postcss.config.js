// postcss.config.js

module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-nesting'),
    require('postcss-preset-env')({
      browsers: 'last 2 versions', // Or your specific browser targets
      stage: 2, // Adjust based on your needs (0-4)
      features: {
        'nesting-rules': true, // Redundant, but good to be explicit
      },
    }),
    require('postcss-calc'),
    require('autoprefixer'),
    require('cssnano'),
    require('postcss-focus-visible'), // Polyfill for better focus outlines
  ],
};