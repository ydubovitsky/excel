const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env) => {

  const isProd = env.production;

  return {
    context: path.resolve(__dirname, 'src'),
    mode: "development",
    entry: './index.js',
    output: {
      filename: 'main.[hash].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    devServer: {
      hot: true,
      liveReload: true,
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      port: 9000,
    },
    resolve: {
      extensions: ['.js'],
      alias: {
        '@': path.resolve(__dirname, "src"),
        '@core': path.resolve(__dirname, "src/core")
      }
    },
    plugins: [
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        template: "./index.html",
        minify: {
          collapseWhitespace: isProd ? true : false,
          removeComments: isProd ? true : false
        }
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "src", "favicon.ico"),
            to: "."
          },
        ],
      }),
    ],
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            // Translates CSS into CommonJS
            "css-loader",
            // Compiles Sass to CSS
            "sass-loader",
          ],
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: "defaults" }]
              ],
              plugins: ['@babel/plugin-proposal-class-properties']
            }
          }
        }
      ],
    },
  }
}