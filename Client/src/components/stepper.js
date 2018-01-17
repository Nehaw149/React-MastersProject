import React,{Component} from 'react';
import {Link, browserHistory,hashHistory} from 'react-router';
import ReduxForm from 'redux-form';
import {connect} from 'react-redux';
import * as actions from '../actions';
import { Step,Stepper,StepLabel,StepButton} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ArrowForwardIcon from 'material-ui/svg-icons/navigation/arrow-forward';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Grid} from 'semantic-ui-react';
import '../../public/style/style.css';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

//To Do:
//1- connect between the current Step and the previous finished steps

class MyStepper extends Component{

  handleClick(step){
    console.log(step);
    switch(step){
      case 'first':
        this.props.selectedStep(0);
        hashHistory.push('/home/newproject');
        break;

      case 'second':
        this.props.selectedStep(1);
        hashHistory.push('/home/stakeholders');
        break;
      case "third":
        this.props.selectedStep(2);
        hashHistory.push('/home/mapping');
        break;
      case "fourth":
        this.props.selectedStep(3);
        hashHistory.push('/home/importance');
        break;
      case "fifth":
        this.props.selectedStep(4);
        hashHistory.push('/home/results');
        break;
      default:
        console.log('default');
    }
  }
  // const stepStyle = {
  //   border:'2px double',
  //   backgroundColor:'#fff',
  //   borderRadius: '5px 20px 5px'
  // };
  //
  // const currentStepStyle = {
  //   border:'2px double blue',
  //   backgroundColor:'#fff',
  //   borderRadius: '5px 20px 5px'
  // };

  render(){
    const stepStyle = {
      border:'2px double',
      backgroundColor:'#fff',
      borderRadius: '5px 20px 5px'
    };

    const currentStepStyle = {
      border:'2px double red',
      backgroundColor:'#fff',
      borderRadius: '5px 20px 5px'
    };
    return(
      // <div className="row" style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
      <Grid.Row centered>
        <Grid.Column width={16}>
        <Stepper linear={true} activeStep={this.props.currentStep} connector={<ArrowForwardIcon />} >
          <Step style={this.props.activeStep==0?currentStepStyle:stepStyle}>
            <StepButton completed={this.props.step1 === true}  onTouchTap={()=> this.handleClick('first')}>Project Information</StepButton>
          </Step>
          <Step style={this.props.activeStep==1?currentStepStyle:stepStyle}>
            <StepButton  completed={this.props.step2 === true} onTouchTap={()=> this.handleClick('second')} style={{textColor: '#ffd699'}} >
                Define Stakeholders
            </StepButton>
          </Step>
          <Step style={this.props.activeStep==2?currentStepStyle:stepStyle}>
            <StepButton  completed={this.props.step3 === true} onTouchTap={()=> this.handleClick('third')} > Map Needs with Outputs</StepButton>
          </Step>
          <Step style={this.props.activeStep==3?currentStepStyle:stepStyle}>
            <StepButton onTouchTap={()=> this.handleClick('fourth')}>Importance Estimation</StepButton>
          </Step>
          {/* <Step>
            <StepButton onTouchTap={()=> this.handleClick(3)}>Logical Connection</StepButton>
          </Step> */}
          <Step style={this.props.activeStep==4?currentStepStyle:stepStyle}>
            <StepButton completed={this.props.step5 === true} onTouchTap={()=> this.handleClick('fifth')}>Get Results</StepButton>
          </Step>
        </Stepper>
      {/* </div> */}
      </Grid.Column>
      </Grid.Row>

    );
  }
}

function mapStateToProps(state){
  return {currentStep: state.steps.currentStep, step1:state.steps.step1,step2:state.steps.step2,step3:state.steps.step3,activeStep:state.steps.selectedStep}
}

export default connect(mapStateToProps,actions)(MyStepper);
