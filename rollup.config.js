import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

const banner = `/**
 * ${packageJson.name} v${packageJson.version}
 * ${packageJson.description}
 * @license MIT
 */`;

const baseConfig = {
    input: 'src/index.js',
    external: ['redux'],
    plugins: [
        resolve({
            browser: true
        }),
        commonjs(),
        babel({
            babelHelpers: 'bundled',
            exclude: 'node_modules/**',
            presets: [
                ['@babel/preset-env', { modules: false }]
            ]
        })
    ]
};

// UMD build (development)
const umdDev = {
    ...baseConfig,
    output: {
        file: 'dist/redux-storage.js',
        format: 'umd',
        name: 'ReduxStorage',
        banner,
        globals: {
            redux: 'Redux'
        },
        sourcemap: true
    },
    plugins: [
        ...baseConfig.plugins,
        replace({
            preventAssignment: true,
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    ]
};

// UMD build (production, minified)
const umdProd = {
    ...baseConfig,
    output: {
        file: 'dist/redux-storage.min.js',
        format: 'umd',
        name: 'ReduxStorage',
        banner,
        globals: {
            redux: 'Redux'
        },
        sourcemap: true
    },
    plugins: [
        ...baseConfig.plugins,
        replace({
            preventAssignment: true,
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        terser({
            output: {
                comments: /^!/
            }
        })
    ]
};

export default [umdDev, umdProd];
