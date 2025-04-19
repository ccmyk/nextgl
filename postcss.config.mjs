import postcss from 'postcss';
import postcssImport from 'postcss-import';
import postcssPresetEnv from 'postcss-preset-env';
import cssnano from 'cssnano';
import postcssNesting from 'postcss-nesting';

const config = {
  plugins: [
    postcssImport(),
    postcssPresetEnv({
      browsers: 'last 2 versions',
      stage: 2,
      features: {
        'nesting-rules': true,
      },
    }),
    postcssNesting(),
    cssnano(),
  ],
};

export default config;