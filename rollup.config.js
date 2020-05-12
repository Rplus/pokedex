import svelte from 'rollup-plugin-svelte';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import autoPreprocess from 'svelte-preprocess';
import livereload from 'rollup-plugin-livereload';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/index.js',
  output: {
    name: 'app',
    format: 'esm',
    sourcemap: true,
    dir: 'public',
  },
  plugins: [
    svelte({
      // enable run-time checks when not in production
      dev: !production,
      preprocess: autoPreprocess({
        postcss: {
          plugins: [
            require('postcss-nested')(),
            require('autoprefixer')(),
          ]
        },
      }),
      // we'll extract any component CSS out into
      // a separate file — better for performance
      css: css => {
        css.write('public/bundle.css');
      }
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    resolve(),
    alias({
      entries: [
        { find: '@c', replacement: './src/components' },
        { find: '@r', replacement: './src/routes' },
        { find: '@d', replacement: './src/data' },
        { find: '@', replacement: './src' },
      ],
    }),
    commonjs(),

    !production && livereload('public'),

    replace({
      'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development')
    }),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser()
  ],

  watch: {
    clearScreen: false
  }
};
