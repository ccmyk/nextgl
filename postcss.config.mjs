import postcssImport from 'postcss-import';
import postcssMixins from 'postcss-mixins';
import postcssPresetEnv from 'postcss-preset-env';
import postcssNested from 'postcss-nested';
import cssnano from 'cssnano';

export default {
  plugins: {
    'postcss-import': {},
    'postcss-mixins': {},
    'postcss-preset-env': {
      stage: 0,
    },
  },
};
