import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default {
    entry: {
        app: path.resolve(__dirname, 'src/app/app'),
        vendor: ['angular', 'angular-messages', 'angular-resource', 'angular-sanitize', 'angular-toastr', 'angular-ui-router',
                 'angular-ui-bootstrap', 'ng-file-upload', 'bootstrap', 'lodash']
    },
    devtool: 'source-map', // 打包时生成一个sourcemap文件，并在末尾添加//# souceURL，注释JS引擎原始文件位置
    output: {
        //文件打包后的输出目录，需要绝对路径，可使用 node.js path 模块 path.resolve([from...],to)
        path: path.resolve(__dirname, 'build'),
        //最后转换为 html 引入的模块的 url 的前半部分，开发时 设置为 ‘/’ 就可以了，生产环境下要设置为产品上线时的地址 ‘http://xxx.xx’
        //publicPath: '/dist/',
        //指定每个输出文件的文件名格式，如果配置了多个入口文件，或者拆分了模块，可以通过 [name]、[hash]或者[chunkhash] 替换相应的文件名。
        filename: '[name].[hash:8].js',   //filename: '[name].[hash].js'
        //非入口模块 chunk 的文件名, 路径相对于 output.path 目录。同理，可以用 [id]、[name]、[hash]、[chunkhash]，作为输出文件名设置
        chunkFilename: '[name].[hash:8].js'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel-loader'] //babel会调用babelrc
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                loader: 'html-loader'
            },
            {
                test: /\.(css|scss)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader', 
                    use: [{
                        loader: 'css-loader',
                        options: {
                    
                        }
                    }, {
                        loader: 'sass-loader'
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            plugins: function() {
                                return [
                                    require('autoprefixer')
                                ];
                            }
                        }
                    }
                ]})
            }, 
            //文件小于8K个字节时，将文件编码并返回DataURL
            {
                test: /\.(jpg|png|gif|ico)$/,
                use: 'url-loader?limit=8192&name=[path][name].[ext]&outputPath=images/&publicPath=../images/' //path会生成对应目录
            },
            {
                test: /\.(svg|woff2|ttf|woff|eot)$/,
                use: 'file-loader?name=[name].[ext]&outputPath=fonts/&publicPath=../fonts/'  //输出目录 加载地址
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, "build"),
        disableHostCheck: true,
        compress: false,
        open: false,
        stats: 'errors-only'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            favicon: 'src/dr-favicon.ico',
            inject: true
        }),
        new ExtractTextPlugin('css/[name].[contenthash:8].css'),
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery'
        }),
        new webpack.HotModuleReplacementPlugin(), // 热加载插件
        new webpack.DefinePlugin({
            IsDebug: true,
            APIENDPOINT: JSON.stringify("http://localhost:3333"),//服务器IP
            __DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV == 'dev') || 'false'))
        })
    ]
};
