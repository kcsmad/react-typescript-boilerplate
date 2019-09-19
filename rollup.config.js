import resolve from 'rollup-plugin-node-resolve'
import external from 'rollup-plugin-peer-deps-external'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import multiEntry from 'rollup-plugin-multi-entry'
import html from 'rollup-plugin-bundle-html'
import serve from 'rollup-plugin-serve'
import liveReload from 'rollup-plugin-livereload'
import babel from 'rollup-plugin-babel'
import minify from 'rollup-plugin-babel-minify'

const pkg = require('./package.json');

export default {
    input: [
        '@babel/polyfill',
        'core-js',
        'src/index.tsx',
    ],
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            sourcemap: true
        },
        {
            file: pkg.module,
            format: 'es',
            sourcemap: true,
        }
    ],
    external: [
        ...Object.keys(pkg.dependencies || {})
    ],
    plugins: [
        multiEntry(),
        external(),
        typescript({
            typescript: require('typescript')
        }),
        resolve({
            browser: true,
            extensions: [ '.ts', '.tsx' ]
        }),
        // {
        //     transform(code) {
        //         console.log(code);
        //         if (code.match(/\/\*\* @device \*\//g)) {
        //
        //         }
        //     }
        // },
        commonjs({
            includes: ["node_modules/**"]
        }),
        babel({
            babelrc: false,
            extensions: [
                '.js',
                '.jsx',
                '.ts',
                '.tsx',
            ],
            presets: [
                [
                    "@babel/env",
                    { modules: false }
                ],
                "@babel/preset-react"
            ],
            runtimeHelpers: true,
            externalHelpers: true,
            exclude: 'node_modules/**',
            plugins: [
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-transform-classes',
                '@babel/plugin-transform-object-assign',
                [ '@babel/plugin-transform-arrow-functions', { spec: true } ]
            ]
        }),
        // minify(),
        html({
            template: 'src/public/index.html',
            dest: 'public/',
            inject: 'head',
            externals: []
        }),
        serve({
            open: true,
            verbose: true,
            contentBase: 'public',
            host: 'localhost',
            port: 3000,
        }),
        liveReload({
            watch: 'public',
        }),
    ]
}