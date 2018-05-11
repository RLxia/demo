import path from 'path';
import webpack from 'webpack';
import WebpackMd5Hash from 'webpack-md5-hash';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');

export default {
    entry: {
        app: path.resolve(__dirname, 'src/app/app'),
        //vendor: path.resolve(__dirname, 'src/vendor')
        vendor: ['angular', 'angular-messages', 'angular-resource', 'angular-sanitize', 
                'angular-toastr', 'angular-ui-router',
                'angular-ui-bootstrap', 'ng-file-upload'],
        vendor2: ['bootstrap', 'lodash']
    },
    devtool: 'source-map', // 根据情况修改参数
    output: {
        path: path.resolve(__dirname, 'build'),
        //publicPath: '/', //路径前缀
        filename: 'js/[name].[hash:8].js',
        chunkFilename: 'js/[name].[hash:8].js'
        // chunkFilename: "js/[name].[chunkhash].js"
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
                            //注意：设置true导致bootstrap样式失效
                          //modules: true // 设置css模块化,详情参考https://github.com/css-modules/css-modules
                        }
                    }, {
                        loader: 'sass-loader'
                    }, {
                        loader: 'postcss-loader',
                        // 在这里进行配置，也可以在postcss.config.js中进行配置，详情参考https://github.com/postcss/postcss-loader
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
            {
                test: /\.(jpg|png|gif|ico)$/,
                use: 'url-loader?limit=8192&name=[path][name].[ext]&outputPath=images/&publicPath=../images/'
            },
            {
                test: /\.(svg|woff2|ttf|woff|eot)$/,
                use: 'file-loader?name=[name].[ext]&outputPath=fonts/&publicPath=../fonts/'  //输出目录 加载地址
            }

        ]
    },
    plugins: [
        //Minify js
        // new webpack.optimize.UglifyJsPlugin({
        //     sourceMap: true,
        //     compress: { warnings: true }
        // }),
        //generate html
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            inject: true,
            favicon: 'src/dr-favicon.ico',
            hash: true
        }),
        // contenthash 只针对内容hash
        new ExtractTextPlugin('css/[name].[contenthash:8].css'),
        //Minify css
        // new OptimizeCssAssetsPlugin({
        //     cssProcessorOptions: {discardComments: {removeAll: true}}
        // }),
        
        
        //new WebpackMd5Hash(),
        //new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'js/vendor.bundle.js' }),
        // new webpack.optimize.CommonsChunkPlugin({
        //       names: ['vendor2', 'vendor'],
        //       // minChunks: function(module, count) {
        //       //   // any required modules inside node_modules are extracted to vendor
        //       //   return (
        //       //     module.resource &&
        //       //     /\.js|\.css$/.test(module.resource) &&
        //       //     module.resource.indexOf(
        //       //       path.join(__dirname, 'node_modules')
        //       //     ) != -1
        //       //   )
        //       // }
        // }),
        // new webpack.optimize.CommonsChunkPlugin({
        //       name: 'manifest',
        //       chunks: ['vendor2', 'vendor']
        // }),
        new webpack.optimize.CommonsChunkPlugin({
          // 注意加载顺序：如果vendor/vendor2有依赖顺序，要和加载顺序相反
          names: ["vendor2", "vendor"],
          filename: 'js/[name].js',
          minChunks: function(module, count) {
            // return module.context && module.context.indexOf('node_modules') !== -1;
            // any required modules inside node_modules are extracted to vendor
            return (
              module.resource &&
              /\.js|\.css$/.test(module.resource) &&
              module.resource.indexOf(
                path.join(__dirname, 'node_modules')
              ) != -1
            )
          }
        }),
        new webpack.BannerPlugin("Copyright pengyuan inc."),
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery'
        }),
        new webpack.HotModuleReplacementPlugin(), // 热加载插件
        new webpack.DefinePlugin({
            IsDebug: false,
            APIENDPOINT: JSON.stringify('http://localhost'),//服务器IP
            __DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV == 'dev') || 'false'))
        })
    ]
};
