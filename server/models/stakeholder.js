const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Need = require('./need');
const Project = require('./project');
const Output = require('./output');

const stakeholderSchema = new Schema({
  name:String,
  needs:{
    lastmodified:Date,
    all:[{type:Schema.Types.ObjectId,ref:'need',default:[]}]
  },
  outputs:{
    lastmodified:Date,
    all:[{type:Schema.Types.ObjectId, ref:'output',default:[]}]
  }
});

stakeholderSchema.statics.UpdateOrAddArray = function(project,cb){

  const stakeholdersList = project.stakeholders;
  let counter = 0,forEachPromises =[], needsPromises=[];
  console.log("Starting: ", stakeholdersList[0].needs.all);

  Project.find({_id:project._id}, function (err, projects){
    var currentProject = projects[0];
    stakeholdersList.forEach(function(stakeholder){
      counter = 0;
      forEachPromises.push( new Promise(function(resolve, reject){

      // If he has an ID then, check if the needs and the outputs are modified
      if(stakeholder._id)
      {

        mongoose.model('stakeholder').find({_id:stakeholder._id}).populate("needs.all").exec(function(err,curStakeholder){
          console.log("Found Stakeholder: ", curStakeholder[0].name);
          //Check if the needs are changed
          if(curStakeholder[0].needs.lastmodified != stakeholder.needs.lastmodified){
            // Delete all needs and add new ones
            needsPromises.push( new Promise(function(res,rej){
              stakeholder.needs.all.forEach(function(need){
                //Check if the need already there
                if(need._id)
                {
                  console.log("Need Found",need.name);
                  Need.findById(need._id,function(err, foundNeed){
                    console.log("The Need is: ", foundNeed.name)
                    if(err)
                      return rej(err)
                      else {
                        foundNeed.name = need.name;
                        foundNeed.save(()=> console.log("The updated need is: ",foundNeed.name))
                        counter ++;
                        return res();
                      }
                  });

                }
                //if the need does not exist, then create new One
                else
                {
                  console.log("Need not Exist:")
                  Need.create({name:need.name}, function(err,newNeed){
                    if(err)
                      return rej(err);
                    else
                    {
                      curStakeholder[0].needs.all.push(newNeed);
                      curStakeholder[0].save(()=> {
                        counter ++;
                      return res();});

                    }
                  });

                }
              });//End Needs ForEach

            }));
            Promise.all(needsPromises)
            .then(()=> {
              console.log("needs Promiese finished");
              curStakeholder[0].needs.lastmodified = new Date();
              curStakeholder[0].save();
              needsPromises=[];
              return resolve();
            })


          }
          //Check if the outputs are changed
          // if(curStakeholder.outputs.lastmodified != stakeholder.outputs.lastmodified){
          //
          // }
        });//End Model.find
      }
      // If he has not an ID then create new one, and create the needs and outputs
      else
      {
        console.log("Dose not Have An ID", stakeholder);
        mongoose.model('stakeholder').create({name:stakeholder.name}, function(err,newStakeholder){
          if(err)
          {
            console.log("ERORR:" , err);
            return reject(err);
          }
          else {
            console.log("Enter else");
            //Create new needs
            if(stakeholder.needs.all)
            {
              var promisses=[];
              console.log("There are needs");
              stakeholder.needs.all.forEach(function(need){
                var newNeed = new Need({name:need.name});
                newStakeholder.needs.all.push(newNeed)
                console.log("New Need:",newNeed);
                console.log("");
                promisses.push(newNeed.save());
                console.log("2");

              });// End Foreach
              Promise.all(promisses).then(()=>{
                newStakeholder.needs.lastmodified = new Date();
                console.log("New StakeHolder Created:",newStakeholder);
                newStakeholder.save();
                if(! currentProject.stakeholders)
                  currentProject.stakeholders =[];
                console.log(currentProject.stakeholders);
                currentProject.stakeholders.push(newStakeholder);
                console.log("4");
                currentProject.save(function (){
                  return resolve();
                });

              })
            }
          }
        })
      }

}))
    });// End For Each SH
    Promise.all(forEachPromises)
    .then(()=> {
      console.log("Finish");
      return cb(currentProject)})
      .catch((err)=> {return cb(null)});

  });

};

stakeholderSchema.pre('remove', function(next){
  // Delete All Needs und Outputs before deleting the Stakeholder
  console.log("Enter Pre: Stakeholder");
  if(this.needs.all.length >0 || this.outputs.all.length > 0)
  {
    var allPromises = [];
    this.needs.all.forEach(function(need){
      allPromises.push(new Promise(function(res,rej){
        Need.remove({_id:need})
        .then(()=> {return res()})
      }));
    });
    this.outputs.all.forEach(function(output){
      allPromises.push(new Promise(function(res,rej){
        Output.remove({_id:output})
        .then(()=> {return res()})
      }));
    });
    Promise.all(allPromises)
    .then(()=> {
      console.log("Enter Promise all");
      next()});
  }
  else {
    next();
  }
});

const stakeholderModel = mongoose.model('stakeholder', stakeholderSchema);

module.exports = stakeholderModel;
