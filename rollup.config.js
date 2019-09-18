import resolve from 'rollup-plugin-node-resolve'
import external from 'rollup-plugin-peer-deps-external'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import html from 'rollup-plugin-bundle-html'
import serve from 'rollup-plugin-serve'
import babel from 'rollup-plugin-babel'
import minify from 'rollup-plugin-babel-minify'

const pkg = require('./package.json');

const serveRollup = () => {
    if (process.env.NODE_ENV === 'dev') {
        return serve({
            open: true,
            verbose: true,
            contentBase: 'dist',
            host: 'dev-globo.com',
            port: 3000,
        })
    }
};

export default {
    input: 'src/index.tsx',
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
    watch: {
        include: 'src/**',
    },

    plugins: [
        external(),
        resolve({
            extensions: [
                '.js',
                '.jsx',
                '.ts',
                '.tsx',
            ]
        }),
        typescript({
            typescript: require('typescript')
        }),
        commonjs(),
        babel({
            extensions: [
                '.js',
                '.jsx',
                '.ts',
                '.tsx',
            ]
        }),
        minify(),
        html({
            template: 'src/public/index.html',
            dest: 'public/',
            inject: 'head',
            externals: [
                {
                    type: 'js',
                    file: 'public/bundle/es/main.js',
                    pos: 'before',
                },
            ]
        }),
        serve({
            open: true,
            verbose: true,
            contentBase: 'public',
            host: 'dev-globo.com',
            port: 3000,
        }),
    ]
}