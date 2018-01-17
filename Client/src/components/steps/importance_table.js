import React,{Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import { Grid,Header, Table, Rating,Modal,Button,Icon,Popup } from 'semantic-ui-react';
import _ from 'lodash';
import Stepper from '../stepper';
import ProjectHeader from '../project_header';
import ReactScrollbar from 'react-scrollbar-js';

class ImportanceTabel extends Component{
  constructor(props){
    super(props);
    this.renderMainRow =this.renderMainRow.bind(this);
    this.handleRating = this.handleRating.bind(this);
    this.stepIsFinished = this.stepIsFinished.bind(this);
    this.state = {valueFlowsValues:[]};

  }
  componentWillMount(){
    let arr =[];
    var getChoiceValueImportance = this.getChoiceValueImportance;
    var getChoiceValueIntensity = this.getChoiceValueIntensity;

    this.props.project.valueflows.map(function(v){
      arr.push({id:v._id,importance:getChoiceValueImportance(v.importanceEstimation)||0,intensity:getChoiceValueIntensity(v.intensityEstimation)||0,value:v.value||0})
    })
    this.setState({valueFlowsValues:arr});
  }
  // This Function Return the value of the selected choice for the question,
  //We Use the returned value to calculate the value of the valueFlow
  getChoiceValueIntensity(num){
    switch(num){
      case 1:
        return 0.11;
      case 2:
        return 0.22;
      case 3:
        return 0.33;
      case 4:
        return 0.66;
      case 5:
        return 0.98;
    }
  }

  getChoiceValueImportance(num){
    switch(num){
      case 1:
        return 0.11;
      case 2:
        return 0.33;
      case 3:
        return 0.55;
      case 4:
        return 0.78;
      case 5:
        return 0.98;
    }
  }


  renderMainRow(item){
    //this.showItem(item);
    // debugger;
    //  return item.valueflows.map(this.showItem.bind(this));
    let i=-1;
    let to = _.find(this.props.project.stakeholders,function(s){return s._id == item.to});
    let handleRating = this.handleRating;
    let stakeholders = this.props.project.stakeholders;
    let intensityRatingContent = (<p>1. I would be satisfied by its presence, but I would not regret its absence<br/>
      2. I would be satisfied by its presence, and I would somewhat regret its absence<br/>
      3. I would be satisfied by its presence, and I would regret its absence<br/>
      4. Its presence is necessary, and I would regret its absence<br/>
      5. Its presence is absolutely essential, and I would regret its absence</p>);

    let importanceRatingContent = (<p>1. Not important – I do not need this source to fulfill this need<br/>
        2. Somewhat important – It is acceptable that this source fulfills this need<br/>
        3. Important – It is preferable that this source fulfills this need<br/>
        4. Very important – It is strongly desirable that this source fulfills this need<br/>
        5. Extremely important – It is indispensible that this source fulfills this need</p>);

    return item.valueflows.map(function(o){
      //console.log(o);
      let valueflowName  ='';
      valueflowName = o.name.substring(0,o.name.indexOf('from'));
      if(!valueflowName){
        valueflowName = o.name.substring(0,o.name.indexOf('form'))
      }
      let from = _.find(stakeholders,function(s){return s._id == o.from});
      i++;
      if(i==0){
        return (
          <Table.Row>
            <Table.Cell textAlign='center' rowSpan={item.valueflows.length} >{to.name}</Table.Cell>
            <Table.Cell textAlign='center'>{valueflowName}</Table.Cell>
            <Table.Cell textAlign='center'>{from.name}</Table.Cell>
            <Table.Cell textAlign='center'>
              <Popup
                trigger={<Rating icon='star'  maxRating={5} defaultRating={o.intensityEstimation||0} onRate={(e,data)=>handleRating(e,data,o._id,'intensity','importance') } />}
                content={intensityRatingContent}
                inverted
                position='right'
                />
            </Table.Cell>
            <Table.Cell textAlign='center'>
              <Popup
                trigger={<Rating icon='star'  maxRating={5} defaultRating={o.importanceEstimation||0} onRate={(e,data)=>handleRating(e,data,o._id,'importance','intensity') } />}
                content={importanceRatingContent}
                inverted
                position='right'
                />
            </Table.Cell>
          </Table.Row>
        );
      }
      else
      {

        return (
          <Table.Row>
            <Table.Cell textAlign='center'>{valueflowName}</Table.Cell>
            <Table.Cell textAlign='center'>{from.name}</Table.Cell>
            <Table.Cell textAlign='center'>
              <Popup
                trigger={<Rating icon='star'  maxRating={5} defaultRating={o.intensityEstimation||0} onRate={(e,data)=>handleRating(e,data,o._id,'intensity','importance') } />}
                content={intensityRatingContent}
                inverted
                position='bottom right'
                />
            </Table.Cell>
            <Table.Cell textAlign='center'>
              <Popup
                trigger={<Rating icon='star'  maxRating={5} defaultRating={o.importanceEstimation||0} onRate={(e,data)=>handleRating(e,data,o._id,'importance','intensity') } />}
                content={importanceRatingContent}
                inverted
                position='bottom right'
                />
            </Table.Cell>
          </Table.Row>
        );
      }

    })
   }


   handleRating(e,data,id,attr1,attr2) {
     //- Get the value of data.rating from getChoiceValue
    var choiceValue=0;
    if(attr1 === 'intensity'){
       choiceValue = this.getChoiceValueIntensity(data.rating);
       console.log('intensity if:',choiceValue );
    }
    else {
          choiceValue = this.getChoiceValueImportance(data.rating);
          console.log('Importance if:',choiceValue );
    }
     var info={id:id,value:data.rating};
     //- try to find the element of this valueFlow from state.valueFlowsValues
     if(this.state.valueFlowsValues.length !=0)
     {
       var currentValueFlow = _.find(this.state.valueFlowsValues, function(o){return o.id == id})
       if (currentValueFlow)
       {
         currentValueFlow[attr1] = choiceValue;
         this.props.updateValueflow(attr1,info);
         //check of we have the value from the second question and calculate the value of value flow
         if(currentValueFlow[attr2]!=0)
         {
           currentValueFlow.value = currentValueFlow.intensity * currentValueFlow.importance;
           console.log("currentValueFlow After Multiplying: ",currentValueFlow);
           currentValueFlow.value = currentValueFlow.value.toFixed(2);
           console.log("After Fixing: currentValueFlow: ",currentValueFlow);
           //Call the API to update it in database
           this.props.updateValueflow('value',{id:id,value:currentValueFlow.value})
         }
       }
     }
   }
   stepIsFinished(){
     let finish = true;
     this.state.valueFlowsValues.forEach(function(vf){
       //console.log(vf);
       if(vf.value ==0)
        finish =  false;
     })
     return finish;
   }

   handleNext(){
     var info = {projectId:this.props.project._id, currentStep: 4}
     this.props.updateCurrentStep(info);
     this.props.createMatrix(this.props.project._id);
   }

   drawButtons(){
     var finish = this.stepIsFinished();
     //console.log("FINISH: ",finish)
     if(finish){
       return (
         <div>
           <Button.Group>
             <Button>Back</Button>
             <Button.Or />
             <Button active positive onClick={()=> this.handleNext()}>Next</Button>
           </Button.Group>
         </div>
       )
     }
     else{
       return (
         <div>
           <Popup trigger={<Button.Group>
             <Button>Back</Button>
             <Button.Or />
             <Button disabled positive >Next</Button>
           </Button.Group>}
            content={"You should estimate all fields before going to next Step"}
            position='bottom right'
            />

         </div>
       )
     }
   }

  render(){
    let groupedValueFlows = _.groupBy(this.props.project.valueflows,function(o){ return o.to});
    let items =[];
    Object.keys(groupedValueFlows).forEach(function(key){
      var item = {to:key,valueflows:groupedValueFlows[key]}

      items.push(item);
    });
    const myScrollbar = {

      maxHeight: 475,
    };

    return(
      <Grid container>
        <ProjectHeader title={this.props.project.title} />
        <Stepper />
        <Grid.Row centered>
          <Grid.Column  width={16}>
            <ReactScrollbar style={myScrollbar}>
              <Table selectable celled structured color='green'>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell textAlign='center' width={2} singleLine>To</Table.HeaderCell>
                    <Table.HeaderCell textAlign='center' width={3}>Value Flows</Table.HeaderCell>
                    <Table.HeaderCell textAlign='center' width={3}>From</Table.HeaderCell>
                    <Popup trigger={<Table.HeaderCell textAlign='center' width={4}>Intensity of Need</Table.HeaderCell>}
                     content='How would you characterize the presence/absence of fulfillment of this need?'/>
                     <Popup trigger={<Table.HeaderCell textAlign='center' width={4}>Importance of Source</Table.HeaderCell>}
                      content="If this need were to be fulfilled, how important would this source be in fulfilling the need?"/>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {items.map(this.renderMainRow.bind(this))}
                </Table.Body>
              </Table>
            </ReactScrollbar>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered>
          <Grid.Column width={4}>
            {this.drawButtons()}
          </Grid.Column>
        </Grid.Row>
      </Grid>


    );
  }
}

function mapStateToProps(state){
  return {project: state.currentProject}
}
export default connect(mapStateToProps,actions)(ImportanceTabel);
