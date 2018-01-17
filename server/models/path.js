const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pathSchema = new Schema({
  value:Number,
  cyclecheck:[Number],
  valueflows:[{type:Schema.Types.ObjectId, ref:'valueflow',default:[]}],
});


const pathModel = mongoose.model('path',pathSchema);

module.exports = pathModel;
