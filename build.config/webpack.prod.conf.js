var path = require('path')
var config = require('../config')
var utils = require('./utils')
var webpack = require('webpack')
var merge = require('webpack-merge')
var fs = require('fs')
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var WebpackOnBuildPlugin = require('on-build-webpack')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

var argv = require('minimist')(process.argv.slice(2))

// var carModel = (argv.model) ? argv.model : config.model

var env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : config.build.env
var iconPath = config.build.orientation === 'landscape' ? './icon/' : './icon/portrait/'

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: false
    }),
    // extract css into its own file

    // new ExtractTextPlugin(utils.assetsPath('css/[name].[contenthash].css')),
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new CopyWebpackPlugin([
      { from: './package.json', flatten: true },
      { from: './config/config.xml', flatten:true },
      { from: iconPath + '*.png', flatten:true },
      { from: iconPath + '*.jpg', flatten:true },
      { from: iconPath + './icon/*.jpg', flatten:true }
    ]),
    new HtmlWebpackPlugin({
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : config.build.index,
      template: 'index.html',
      title: config.widget.env.appName,
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // new WebpackOnBuildPlugin((stats) => { // build 완료 후 hook
    //   var htmlFile = './build/index.html'
    //   var script = '<link rel=\'stylesheet\' href=\'../resources/index.css\'></link>'
    //   var indexHtml = fs.readFileSync(htmlFile).toString()
    //   var position = indexHtml.indexOf('<link')
    //   var newScript = [indexHtml.slice(0,position), script,indexHtml.slice(position)].join('')

    //   fs.open(htmlFile, 'w', (err, fd) => {
    //     if(err) throw err
    //     var buf = new Buffer(newScript)
    //     fs.writeSync(fd, buf, 0, buf.length, null, function(err, written, buffer) {
    //       if(err) throw err
    //       console.log(err, written, buffer)
    //       fs.close(fd, function() {
    //         console.log('Done')
    //       })
    //     })
    //   })
    // })
  ]
})

if (config.build.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

module.exports = webpackConfig
