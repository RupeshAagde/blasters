const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const vueloaderConfig = require('./vue.config')
const config = require('./../config')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  mode: config.get('env') === 'production' ? 'production' : 'development',
  devtool: config.get('env') === 'development' ? 'source-map' : 'none',
  output: {
    publicPath: '/public/',
    path: path.resolve(__dirname, '../public/'),
    filename: '[name].[chunkhash].js'
  },
  plugins: [
    new VueLoaderPlugin(),
    new CopyWebpackPlugin({
      patterns: [{ from: 'assets', to: 'assets' }]
    })
  ],
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': path.resolve('src')
    }
  },
  optimization: {
    minimizer: [new CssMinimizerPlugin()],
    splitChunks: {
      chunks: 'async',
      minSize: 30000,

      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 6,
      maxInitialRequests: 4,
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueloaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(jpg|jpeg|gif|png)$/,
        loader: 'file-loader',
        query: {
          name: 'assets/[name].[ext]',
          publicPath: '/'
        }
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
      }
    ]
  }
}
