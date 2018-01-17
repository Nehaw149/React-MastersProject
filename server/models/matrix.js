const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;
const ElementModel = require('./element');

const matrixSchema = new Schema({
  elements:[{type:Schema.Types.ObjectId, ref:'element',default:[]}],
  projectID: {type: Schema.Types.ObjectId,ref:'project'}
});

/**
Before Deleting the Matrix We Have to delete all elements inside it
*/
matrixSchema.pre('remove', function(next){
  if(this.elements.length >0)
  {
    let allPromises =[];

    this.elements.forEach(function(element)
    {
      allPromises.push(new Promise(function(res,rej)
      {
        ElementModel.findOne({_id:element},function(err,foundElement){
          if(!err){
            foundElement.remove()
            .then(()=>{
              return res()
            })
            .catch(()=>{return rej()})
          }
          else {
            return rej();
          }
        })
      }))
    });
    Promise.all(allPromises)
    .then(()=>{
      next();
    });
  }
  else {
    next();
  }
});

const matrixModel = mongoose.model('matrix',matrixSchema);

module.exports = matrixModel;
