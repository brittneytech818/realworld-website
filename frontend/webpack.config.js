const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  const backendURL = process.env.BACKEND_URL;

  if (!backendURL) {
    throw new Error(`'BACKEND_URL' environment variable is missing`);
  }

  let port;

  if (!isProduction) {
    const frontendURL = process.env.FRONTEND_URL;

    if (!frontendURL) {
      throw new Error(`'FRONTEND_URL' environment variable is missing`);
    }

    port = Number(new URL(frontendURL).port);

    if (!port) {
      throw new Error(`'FRONTEND_PORT' environment variable should include a port`);
    }
  }

  return {
    entry: './src/index.tsx',
    output: {
      path: path.join(__dirname, 'build'),
      filename: isProduction ? '[name].[contenthash].immutable.js' : 'bundle.js',
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          include: path.join(__dirname, 'src'),
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: !isProduction
              }
            }
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]'
          }
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebPackPlugin({
        template: './src/index.ejs',
        favicon: './src/assets/realworld-favicon-20201126.immutable.png',
        inject: false
      }),
      new webpack.EnvironmentPlugin(['BACKEND_URL', 'GITHUB_CLIENT_ID'])
    ],
    ...(isProduction
      ? {
          optimization: {
            // minimize: false
            minimizer: [new TerserPlugin({terserOptions: {keep_classnames: true}})]
          }
        }
      : {
          devtool: 'eval-cheap-module-source-map',
          devServer: {
            contentBase: './build/dev',
            port,
            historyApiFallback: true
          }
        })
  };
};
