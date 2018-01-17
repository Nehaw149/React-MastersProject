const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const outputSchema = new Schema({
  name:String
});

const outputModel = mongoose.model('output', outputSchema);

module.exports = outputModel;
