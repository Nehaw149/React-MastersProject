var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


const VENDOR_LIBS = [
  "faker","lodash","react","react-dom","react-input-range",
  "react-redux","react-router","redux","redux-form","redux-thunk",
  "semantic-ui-react","redux-persist",
  "material-ui","axios","react-scrollbar-js"
];
module.exports = {
  entry: {
    bundle:'./src/index.js',
    vendor: VENDOR_LIBS
  },
  output: {
    // path: path.join(__dirname, '../jira/jira-activity/views/dist'),
    path: path.join(__dirname, 'public/dist'),
    filename: '[name].[chunkhash].js'
  },
  module:{
    rules:[
      {
        use:'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/
      },
      {
        loader:ExtractTextPlugin.extract({loader:'css-loader'}),
        test:/\.css$/
      },
      {
        test:/\.(jpe?g|png|gif|svg)$/,
        use:[
          {
            loader:'url-loader',
            options:{limit:40000}
          },
          'image-webpack-loader'
        ]
      }
    ]
  },
  devServer: {
    historyApiFallback: true
    // contentBase: './',
    // hot: true
  },
  plugins:[
    new webpack.optimize.CommonsChunkPlugin({
      names:['vendor','manifest']
    }),

    new HtmlWebpackPlugin({
      // template:'../jira/jira-activity/views/index.hbs'
      template:'index.html'
    }),

    new ExtractTextPlugin('style.css')
  ]
};
