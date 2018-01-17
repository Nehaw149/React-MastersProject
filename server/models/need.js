const mongoose = require('mongoose');
const Schema = mongoose.Schema ;

const needSchema = new Schema ({
  name:String
});

const needModel = mongoose.model('need',needSchema );

module.exports = needModel;
