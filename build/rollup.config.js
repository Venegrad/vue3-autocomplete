// rollup.config.js
import fs from 'fs';
import path from 'path';
import vue from 'rollup-plugin-vue';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import babel from '@rollup/plugin-babel';
import PostCSS from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
import minimist from 'minimist';

const esbrowserslist = fs.readFileSync('./.browserslistrc')
  .toString()
  .split('\n')
  .filter((entry) => entry && entry.substring(0, 2) !== 'ie');

const babelPresetEnvConfig = require('../babel.config')
  .presets.filter((entry) => entry[0] === '@babel/preset-env')[0][1];

const argv = minimist(process.argv.slice(2));

const projectRoot = path.resolve(__dirname, '..');

const baseConfig = {
	input: 'src/entry.js',
	plugins: {
		preVue: [
			alias({
				entries: [
					{
						find: '@',
						replacement: `${path.resolve(projectRoot, 'src')}`,
					},
				],
			}),
		],
		replace: {
			preventAssignment: true,
			'process.env.NODE_ENV': JSON.stringify('production'),
		},
		vue: {},
		postVue: [
			resolve({
				extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
			}),
			// Process only `<style module>` blocks.
			PostCSS({
				modules: {
					generateScopedName: '[local]___[hash:base64:5]',
				},
				include: /&module=.*\.css$/,
			}),
			// Process all `<style>` blocks except `<style module>`.
			PostCSS({ include: /(?<!&module=.*)\.css$/, extract: path.resolve('dist/venAutocomplete.css') }),
			commonjs(),
		],
		babel: {
			exclude: 'node_modules/**',
			extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
			babelHelpers: 'bundled',
		},
	},
};

const external = [
  'vue',
];

const globals = {
  vue: 'Vue',
};

const buildFormats = [];
if (!argv.format || argv.format === 'es') {
  const esConfig = {
    ...baseConfig,
    input: 'src/entry.esm.js',
    external,
    output: {
      file: 'dist/venAutocomplete.esm.js',
      format: 'esm',
      exports: 'named',
    },
    plugins: [
      replace(baseConfig.plugins.replace),
      ...baseConfig.plugins.preVue,
      vue(baseConfig.plugins.vue),
      ...baseConfig.plugins.postVue,
      babel({
        ...baseConfig.plugins.babel,
        presets: [
          [
            '@babel/preset-env',
            {
              ...babelPresetEnvConfig,
              targets: esbrowserslist,
            },
          ],
        ],
      }),
    ],
  };
  buildFormats.push(esConfig);
}

if (!argv.format || argv.format === 'cjs') {
  const umdConfig = {
    ...baseConfig,
    external,
    output: {
      compact: true,
      file: 'dist/venAutocomplete.ssr.js',
      format: 'cjs',
      name: 'venAutocomplete',
      exports: 'auto',
      globals,
    },
    plugins: [
      replace(baseConfig.plugins.replace),
      ...baseConfig.plugins.preVue,
      vue(baseConfig.plugins.vue),
      ...baseConfig.plugins.postVue,
      babel(baseConfig.plugins.babel),
    ],
  };
  buildFormats.push(umdConfig);
}

if (!argv.format || argv.format === 'iife') {
  const unpkgConfig = {
    ...baseConfig,
    external,
    output: {
      compact: true,
      file: 'dist/venAutocomplete.min.js',
      format: 'iife',
      name: 'venAutocomplete',
      exports: 'auto',
      globals,
    },
    plugins: [
      replace(baseConfig.plugins.replace),
      ...baseConfig.plugins.preVue,
      vue(baseConfig.plugins.vue),
      ...baseConfig.plugins.postVue,
      babel(baseConfig.plugins.babel),
      terser(),
    ],
  };
  buildFormats.push(unpkgConfig);
}
// terser({
//   output: {
//     ecma: 5,
//   },
// })


export default buildFormats;
