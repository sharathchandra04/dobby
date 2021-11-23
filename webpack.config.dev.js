const path = require('path');

const HtmlWebPackPlugin = require("html-webpack-plugin");
const htmlPlugin = new HtmlWebPackPlugin({
  template: "./public/index.html",
  filename: "./index.html"
});

const Dotenv = require('dotenv-webpack');

const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx",
  output: {
    path: path.join(__dirname, 'dist/dev'),
    filename: "[name].js",
    publicPath: '/'
  },
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'public/images'),
    },
    hot: true,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000'
      }
    },
    compress: true,
    port: 9000,

    historyApiFallback: true
  },
  plugins: [
    htmlPlugin,
    new CopyWebpackPlugin({
      patterns: [
        { 
          from: path.resolve(__dirname, 'public/images'),
          to: 'images'
        }
      ]
    }),
    new Dotenv({
      path: path.join(__dirname, `./server/config/.env.development`), // load this now instead of the ones in '.env'
      safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
      allowEmptyValues: true, // allow empty variables (e.g. `FOO=`) (treat it as empty string, rather than missing)
      systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
      silent: true, // hide any errors
      defaults: false // load '.env.defaults' as the default values if empty.
    })

  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            retainLines: true
          }
        }
      },
      {
        test: /\.tsx?$/,
        // use: 'ts-loader',
        use: {
          loader: "ts-loader",
          options: {
          }
        },
        exclude: /node_modules/,
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};