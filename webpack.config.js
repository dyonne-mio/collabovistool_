'use strict';
const Webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const buildDirectory = path.join(__dirname, 'build');

module.exports = {
  mode: 'development',
  entry: {
    app: './js/main.js'
  },
  output: {
    filename: 'main.js',
    path: buildDirectory,
  },
  devtool: false,
  devServer: {
    contentBase: buildDirectory,
    port: process.env.PORT || 8080
  },

  stats: {
    colors: true,
    reasons: true
  },

  plugins: [
	new HtmlWebpackPlugin({template: 'index.html'}),
    new Webpack.EnvironmentPlugin({
      'NEO4J_URI': 'bolt://localhost:7474',
      'NEO4J_DATABASE': 'collabo',
      'NEO4J_USER': 'collabo',
      'NEO4J_PASSWORD': 'collabo',
      'NEO4J_VERSION': ''
    })
  ],

  resolve: {
    extensions: ['.webpack.js', '.web.js', '.js', '.jsx']
  },

  module: {
    rules: [
      {
        test: /\.css$/, 
        use: [
//          {
//          loader: 'html-loader',
//          options: {
            // THIS will resolve relative URLs to reference from the app/ directory
//            root: path.resolve(__dirname, 'app')
//          }
//          },
		  {
            loader: 'style-loader',
            options: { 
                insert: 'head', // insert style tag inside of <head>
                injectType: 'singletonStyleTag' // this is for wrap all your style in just one style tag
            },
          },
          "css-loader",
        ],
      },
      {
            test: /\.(png|jp(e*)g|svg)$/,  
            use: [{
                loader: 'url-loader',
                options: { 
                    limit: 8000, // Convert images < 8kb to base64 strings
                    name: 'images/[hash]-[name].[ext]'
                } 
            }]
      },
	  {
            test: /\.(woff|woff2|ttf|eot)$/,
			use: [{
                loader: 'file-loader',
                options: { 
                    name: 'webfornts/[name].[ext]!static'
                } 
            }]
            
      },
//	  {
//            loader: 'file-loader',
//            options: {
//              name: '[name].[ext]',
//              outputPath: 'webfonts/'
//            }
//      }
    ]
  },
  
  externals: {
    // require("jquery") is external and available
    //  on the global var jQuery
    "jquery": "jQuery"
  }
};

