const mongoose = require('mongoose');
const Stakeholder =require('./stakeholder');

const Schema = mongoose.Schema;

const projectSchema = new Schema({
  title: String,
  description: String,
  image:String,
  stakeholders:[{type: Schema.Types.ObjectId, ref:'stakeholder',default:[]}],
  user: {type:Schema.Types.ObjectId,ref:'user'},
  currentstep:{type:Number, default:1},
  valueflows:[{type:Schema.Types.ObjectId, ref:'valueflow',default:[]} ]
});



projectSchema.pre('remove', function(next){
  console.log("Enter Pre");
  console.log(this.stakeholders);
  if(this.stakeholders.length >0)
  {
    var all=[];
    this.stakeholders.forEach(function(stakeholder){
      all.push(new Promise(function(res,rej){
          // Stakeholder.remove({_id:stakeholder})
          // .then(()=> {return res()})
          Stakeholder.findOne({_id:stakeholder},function(err,sh){
            if(!err){
              sh.remove()
              .then(()=>{return res()})
              .catch(()=>{return rej()})
            }
          })
      }));
      Promise.all(all)
      .then(()=> next());
    })
  }
  else next();
//   Stakeholder.remove({_id:{$in:this.stakeholders}},{multi:true})
});


const projectmodel = mongoose.model('project', projectSchema);

module.exports = projectmodel;
