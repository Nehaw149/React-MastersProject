const express = require('express');
const path= require('path');

const app = express();

// Make This folder available for everyone who asks fo a file in it
app.use(express.static('public/dist'));
app.use(express.static('public/style/'));
app.use(express.static('public/img/'));

if(process.env.NODE_ENV !== 'production'){
  const WebpackMiddleware = require('webpack-dev-middleware');
  const Webpack = require('webpack');
  const WebpackConfig = require('./webpack.config.js');

  app.use(WebpackMiddleware(Webpack(WebpackConfig)));
}
else {

  // It's very important to make the React Router work correctly
  app.get('*', (req,res)=>{
    res.sendFile(path.join(__dirname, 'public/dist/index.html'));
  });
}

app.listen(process.env.PORT || 3050, ()=> console.log('Server Started on port 3050'));
