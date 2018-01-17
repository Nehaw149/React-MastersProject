const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;
const PathModel = require('./path');

const elementSchema = new Schema({
  from:{type: Schema.Types.ObjectId,ref:'stakeholder'},
  to:{type:Schema.Types.ObjectId, ref:'stakeholder'},
  paths:[{type:Schema.Types.ObjectId, ref:'path',default:[]}],
});

/**
Before Deleting any Element We Have to delete all Paths inside it
*/
elementSchema.pre('remove', function(next){
  if(this.paths.length >0 && this.paths !=null)
  {
    let allPromises =[];

    this.paths.forEach(function(path)
    {
      allPromises.push(new Promise(function(res,rej)
      {
        PathModel.findOne({_id:path}, function(err, path){
          if(err)
          {
            console.log(err);
            return rej();
          }

          else {
            path.remove()
            .then(()=> {
              return res();
            })
            .catch(()=> {return rej()})
          }
        })
      })
     )
    });
    Promise.all(allPromises)
    .then(()=>{
      next()})
      .catch(()=> next())
  }
  else {
    next();
  }
});

const elementModel = mongoose.model('element',elementSchema);

module.exports = elementModel;
