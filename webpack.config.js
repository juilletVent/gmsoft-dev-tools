const path = require('path')
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    popup: './extension/popup',
    background: './extension/background',
    content: './extension/content',
    enableHookXHR: './extension/inject/enableHookXHR',
    disableHookXHR: './extension/inject/disableHookXHR',
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        test: /.ts$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-typescript']
          },
        }
      }
    ],
  },
  resolve: {
    extensions: [".js", ".ts"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'public' },
      ],
    }),
    new CleanWebpackPlugin(),
  ],
}