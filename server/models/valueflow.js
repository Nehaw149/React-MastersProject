const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const valueflowSchema = new Schema({
  name:String,
  from:{type: Schema.Types.ObjectId,ref:'stakeholder'},
  to:{type:Schema.Types.ObjectId, ref:'stakeholder'},
  value:{type:Number,default:0},
  related:[{type:Schema.Types.ObjectId, ref:'valueflow',default:[]}],
  needId:String,
  importanceEstimation:{type:Number, default:0},
  intensityEstimation:{type:Number, default:0}
});


const valueflowModel = mongoose.model('valueflow',valueflowSchema);

module.exports = valueflowModel;
