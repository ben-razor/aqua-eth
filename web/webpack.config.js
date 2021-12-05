const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
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
                use: ['raw-loader'],
            },
            {
                test: /\.css$/,
                use: ['style-loader', {
                    loader: 'css-loader',
                    options: {
                        url: false
                    }
                }]
            },
            {
                test: /\.wasm$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[hash:6].[ext]'
                    }
                },
                type: 'javascript/auto'
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                  {
                    loader: 'file-loader',
                    options: {
                      name: '[name].[ext]',
                      outputPath: 'fonts/'
                    }
                  }
                ]
              },
            {
                test: /\.(png|jpg|gif|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                  {
                    loader: 'file-loader',
                    options: {
                      name: '[name].[ext]',
                      outputPath: 'images/'
                    }
                  }
                ]
            }
        ],
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
    },
    plugins: [
        new HTMLWebpackPlugin({
            chunks: ['index'],
            filename: 'index.html',
            template: path.resolve('./src/index.html')
        }),
        new HTMLWebpackPlugin({
            chunks: ['sandbox'],
            filename: 'sandbox.html',
            template: path.resolve('./src/sandbox.html')
        })
    ]
}