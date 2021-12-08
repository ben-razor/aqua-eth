
const path = require('path')
const webpack = require('webpack')
const HTMLWebpackPlugin = require('html-webpack-plugin')

let config = {
    mode: 'development',
    entry: {
        'index': '/src/index.js',
        'sandbox': '/src/sandbox.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "[name].js"
    },
    target: 'web',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.tsx?$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        happyPackMode: true,
                    }
                },
            },
            {
                test: /\.txt$/,
                type: 'asset/source'
            },
            {
                test: /\.json$/,
                type: 'asset/source'
            },
            {
                test: /\.css$/,
                use: ['style-loader', {
                    loader: 'css-loader',
                    options: {
                        url: true 
                    }
                }]
            },
            {
                test: /\.wasm$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[hash:6].[ext]',
                        outputPath: 'wasm/'
                    }
                },
                type: 'javascript/auto'
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                type: 'asset/resource',
                generator: { filename: 'fonts/[name][hash][ext]' }
            },
            {
                test: /\.(png|jpg|gif|svg)(\?v=\d+\.\d+\.\d+)?$/,
                type: 'asset/resource',
                generator: { filename: 'images/[name][hash][ext]' }
            }
        ],
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
        fallback: {
            util: require.resolve('util'),
            path: require.resolve('path-browserify'),
            stream: require.resolve('stream-browserify'),
            crypto: require.resolve('crypto-browserify'),
            http: require.resolve('stream-http'),
            https: require.resolve('https-browserify'),
            os: require.resolve("os-browserify/browser"),
            url: require.resolve('url'),
            assert: require.resolve('assert'),
            buffer: require.resolve("buffer")
        }
    },
    plugins: [
        // fix "process is not defined" error:
        // (do "npm install process" before running the build)
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        new HTMLWebpackPlugin({
            chunks: ['index'],
            filename: 'index.html',
            favicon: './src/images/favicon_io/favicon.ico',
            template: path.resolve('./src/index.html')
        }),
        new HTMLWebpackPlugin({
            chunks: ['sandbox'],
            filename: 'sandbox.html',
            favicon: './src/images/favicon_io/favicon.ico',
            template: path.resolve('./src/sandbox.html')
        })
    ]
}

let configFunc = (env, options) => {
    if(options.mode !== 'production') {
        config['devtool'] = 'eval-source-map';
    }

    return config;
}

module.exports = configFunc;