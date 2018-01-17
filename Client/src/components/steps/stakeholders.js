import React, {Component} from 'react';
import Stepper from '../stepper';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import update from 'react-addons-update';
import _ from 'lodash';
import EditModal from '../edit_modal';

// import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
// import Avatar from 'material-ui/Avatar';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import {FlatButton, RaisedButton, Badge,Paper} from 'material-ui';
import Help from 'material-ui/svg-icons/action/help'
import ReactScrollbar from 'react-scrollbar-js';
import { Menu,Dropdown,Icon, Grid,Image, Button,List,Segment,Popup,Input,Header,Modal,Message} from 'semantic-ui-react';

class Stakeholders extends Component{

  constructor(props){
    super(props);
    this.state ={
      currentSH:"",
      saving: true,
      selectedStakeholder:null,
      currentNeed:"",
      currentOutput:"",
      modal:false,
      delSH:"",
      edit:{sh:null,need:null,output:null},
      editSh:null
    }
    this.showNeeds = this.showNeeds.bind(this);
    this.showOutput = this.showOutput.bind(this);
    this.drawButtons =this.drawButtons.bind(this);
    this.handleDeleteOutput = this.handleDeleteOutput.bind(this);
    this.handleOpenEditModal = this.handleOpenEditModal.bind(this);
    //this.selectStakeholder = this.selectStakeholder.bind(this);

  }
  deleteStakeholder(){
    this.setState({modal:false});
    var info = {
      projectId: this.props.project._id,
      list:[this.state.delSH]
    };
    this.props.deleteStakeholder(info);
    this.setState({selectedStakeholder:null});
  }
  handleDeleteOutput(outputId){
    var info = {
      shId:this.props.project.stakeholders[this.state.selectedStakeholder]._id,
      outputId,
      shIndex:this.state.selectedStakeholder}
    this.props.deleteOutput(info);
  }
  handleDeleteNeed(needId){
    var info = {
      shId:this.props.project.stakeholders[this.state.selectedStakeholder]._id,
      needId,
      shIndex:this.state.selectedStakeholder
    }
    this.props.deleteNeed(info);
  }
  selectStakeholder(id){
    var ind = _.findIndex(this.props.project.stakeholders,function(o){return o._id === id})
    this.setState({selectedStakeholder:ind});
  }

  showStakeholderElement(item){
    const iconButtonElement = (
      <IconButton
        touch={true}
        tooltip="more"
        tooltipPosition="bottom-left"
      >
        <MoreVertIcon color={grey400} />
      </IconButton>
    );
    let active = false;
    let edit = false;

    if(this.state.selectedStakeholder != null)
    {
      if(this.props.project.stakeholders[this.state.selectedStakeholder]._id == item._id)
        active = true;
    }

    if(this.state.editSh == item._id)
      edit = true;
    return(
        <List.Item style={active?{backgroundColor:"#E0F7FA"}:{}} onClick={()=> this.selectStakeholder(item._id)}>
          <List.Content floated='right'>
            <Popup
              trigger={<Button onClick={()=> this.handleOpenEditModal()} icon='edit' />}
              content="Edit the Name Of Stakeholder"
              basic
            />
            <Popup
              trigger={<Button onClick={()=> this.showModal(item._id)} icon='trash' />}
              content="Delete This Stakeholder, This could effect the next Steps"
              basic
            />
          </List.Content>
          <Image avatar src='http://semantic-ui.com/images/avatar2/small/mark.png' />
          <List.Content>
            {this.hasStakeholderNeedsAndOutputs()}
            {item.name}
          </List.Content>
        </List.Item>

    )
  }

  handleOpenEditModal(){
    this.props.modalShow({show:true,
      text:"Are You Sure you Want To Edit The Name Of Stakeholders",
      value:"Hello World"
    });
  }

  renderOneNeed(need){
    return (
      <List.Item onClick={()=> console.log(need.name)}>
        <List.Content floated='right'>
          <Popup
            trigger={<Button onClick={()=> console.log("Trigger")} icon='edit' />}
            content="Change the Name Of This Need"
            basic
          />
          <Popup
            trigger={<Button onClick={()=> this.handleDeleteNeed(need._id)} icon='trash' />}
            content="Delete This Need, This could effect the next Steps"
            basic
          />
        </List.Content>
        {/* <Image avatar src='http://semantic-ui.com/images/avatar2/small/lena.png' /> */}
        <Icon name="first aid"/>
        <List.Content>
          {need.name}
        </List.Content>
      </List.Item>
    )
  }

  renderOneOutput(output){
    return (
      <List.Item onClick={()=> console.log(output.name)}>
        <List.Content floated='right'>
          <Popup
            trigger={<Button onClick={()=> console.log("Trigger")} icon='edit' />}
            content="Edit the Name Of Output"
            basic
          />
          <Popup
            trigger={<Button onClick={()=> this.handleDeleteOutput(output._id)} icon='trash' />}
            content="Delete This Output, This could effect the next Steps"
            basic
          />
        </List.Content>
        {/* <Image avatar src='http://semantic-ui.com/images/avatar2/small/lena.png' /> */}
        <Icon name="lightbulb"/>
        <List.Content contentEditable>
          {output.name}
        </List.Content>
      </List.Item>
    )
  }

  renderNeedHeader(){
    return (
      <div>
      <Header as='h2' color='red'>
        <Icon name='minus square outline' />
        <Header.Content>
          Needs
        </Header.Content>
      </Header>
      <div className="row">
        <div className="col-sm-9">
        <Input fluid size='large' icon='users' iconPosition='left' placeholder='I need...in order to provide a service '
          type="text" onChange={this.handleNeedChange.bind(this)} value={this.state.currentNeed}
          />
        </div>

        <div className="col-sm-3">
          <Button color='red' onClick={()=> this.handleAddNeed()} floated='right' icon labelPosition='left' basic size='small'>
            <Icon name='wrench' /> Add Need
          </Button>
        </div>
      </div>
    </div>

    )
  }

  showNeeds(){
    // let ind;
    const myScrollbar = {

      maxHeight: 150,
    };
    if(this.state.selectedStakeholder || this.state.selectedStakeholder == 0)
    {
      let ind = this.state.selectedStakeholder;
      if(this.props.project.stakeholders[ind].needs.all.length > 0)
      {
        return (
          <div>
          {this.renderNeedHeader()}

          <ReactScrollbar style={myScrollbar}>
            <List selection animated divided verticalAlign='middle'>
                {this.props.project.stakeholders[ind].needs.all.map(this.renderOneNeed.bind(this))}
            </List>
        </ReactScrollbar>
        </div>
        );
      }
      else{
        return (
          <div style={{paddingBottom:"5px"}}>
            {this.renderNeedHeader()}
            <Message
              compact
              content='Add the need of this stakeholder to show them here'
              color="yallow"
            />
          </div>
        );
      }
    }
    else {
      return (
        <Message
            info
            icon="info"
            header='What is next?'
            content="Select one stakeholder by Clicking on it to add his Needs,Output and Role"
          />
      );
    }
  }

  showOutput(){
    const myScrollbar = {
      maxHeight: 150
    };
    if(this.state.selectedStakeholder || this.state.selectedStakeholder == 0)
    {
      let ind = this.state.selectedStakeholder;
      if(this.props.project.stakeholders[ind].outputs.all.length > 0)
      {
        return (
          <div>
          {this.renderOutputHeader()}

          <ReactScrollbar style={myScrollbar}>
            <List selection animated divided verticalAlign='middle'>
                {this.props.project.stakeholders[ind].outputs.all.map(this.renderOneOutput.bind(this))}
            </List>
        </ReactScrollbar>
        </div>
        );
      }
      else{
        return (
          <div style={{paddingBottom:"5px"}}>
            {this.renderOutputHeader()}
            <Message
              compact
              content='Add the output(Services) that provided by this stakeholder to show them here'
              color="yallow"
            />
          </div>
        );
      }
    }
  }

  renderOutputHeader(){
    return (
      <div>
      <Header as='h2' color='green'>
        <Icon name='plus square outline' />
        <Header.Content>
          Outputs
        </Header.Content>
      </Header>
      <div className="row">
        <div className="col-sm-9">
        <Input fluid size='large' icon='users' iconPosition='left' placeholder='I provide this service ...'
          type="text" onChange={this.handleOutputChange.bind(this)} value={this.state.currentOutput}
          />
        </div>

        <div className="col-sm-3">
          <Button color='green' onClick={()=> this.handleAddOutput()} floated='right' icon labelPosition='left' basic size='small'>
            <Icon name='external' /> Add Output
          </Button>
        </div>
      </div>
    </div>

    )
  }

  handleChange(event){
    this.setState({currentSH:event.target.value});
  }
  handleNeedChange(event){
    this.setState({currentNeed:event.target.value});
  }

  handleAddNeed(){
    //Call Action Creator with this.state.currentNeed
    if(this.state.currentNeed != ""){
      var ind = this.state.selectedStakeholder;
      var info = {
        projectId:this.props.project._id,
        stakeholderId:this.props.project.stakeholders[ind]._id,
        need:this.state.currentNeed
      }
      this.props.addNeed(info);
      this.setState({currentNeed:""});
    }
  }

  handleOutputChange(event){
    this.setState({currentOutput:event.target.value});
  }

  handleAddOutput(){

    if(this.state.currentOutput != ""){
    var ind = this.state.selectedStakeholder;
    var info = {
      projectId:this.props.project._id,
      stakeholderId:this.props.project.stakeholders[ind]._id,
      output:this.state.currentOutput
    }
    this.props.addOutput(info);
    this.setState({currentOutput:""});
    }
  }

  handleAddStakeholder(){
    if(this.state.currentSH != ""){
    var info = {
      projectId:this.props.project._id,
      stakeholder:{name:this.state.currentSH}
    };
    this.props.addStakeholder(info);
    this.setState({currentSH:""});
  }

  }

  close = () => this.setState({ modal: false });
  showModal =(id) => this.setState({modal:true,delSH:id});

  stepIsCompleted(){
    var finish =true;
    if(this.props.project.stakeholders.length != 0){
      this.props.project.stakeholders.forEach(function(sh){
        if(sh.needs.all.length == 0 || sh.needs.all.length == 0)
          finish= false;
        if(sh.outputs.all.length == 0 || sh.outputs.all.length == 0)
          finish= false;
      })
      return finish;

    }
    else {
      return finish;
    }
  }

  hasStakeholderNeedsAndOutputs(id){
    console.log("Enter new Function");
    var index = _.findIndex(this.props.project.stakeholders,function(o){return o._id == id})
    if(this.props.stakeholders[index].needs.all.length > 0 &&  this.props.stakeholders[index].outputs.all.length>0)
    return (<Icon name='checkmark' color='green' />)
    else {
      return <Icon name='remove' color='red' />
    }
  }

  drawButtons(){
    var finish = true;//this.stepIsCompleted();
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
          <Button.Group>
            <Button>Back</Button>
            <Button.Or />
            <Button disabled positive >Next</Button>
          </Button.Group>
        </div>
      )
    }
  }

  handleNext(){
    var info = {projectId:this.props.project._id, currentStep: 2}
    this.props.updateCurrentStep(info);
  }

  render(){
    const myScrollbar = {
      width: 600,
      maxHeight: 200,
    };
    return(
      <div>

          <Stepper />
          {/* <Grid.Row columns={2}>
            <Grid.Column>
              <Grid.Row> */}


              <div className="row" style={{padding:"15x"}}>
                <Header as='h3' block textAlign='center' color="green">
                  {this.props.project.title}
                </Header>
              </div>
              <div className="row" style={{padding:"15px"}}>
                <div className="col-sm-5" style={{paddingRight:"10px"}}>
                  <div className="row">
                    <div className="col-sm-6">
                      <Header as='h2' >
                        <Icon name='info' />
                        <Header.Content>
                          Stakeholders
                        </Header.Content>
                      </Header>
                        {/* <Popup
                          trigger={<Icon size='small' name='help' circular />}
                          content='Stakeholder are people who maybe are intrested in the project'
                          offset={10}
                          positioning='left center'
                        /> */}
                    </div>
                    <div className="col-sm-2">

                      </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-8">
                    <Input fluid size='large' icon='users' iconPosition='left' placeholder='Add Stakeholder...'
                      type="text" onChange={this.handleChange.bind(this)} value={this.state.currentSH}
                      />
                    </div>

                    {/* <input type="text" onChange={this.handleChange.bind(this)} value={this.state.currentSH} /> */}
                    <div className="col-sm-4">
                    {/* <button onClick={()=> this.handleAddStakeholder()} className="btn btn-sm btn-primary"> Add Stakeholder</button> */}
                      <Button onClick={()=> this.handleAddStakeholder()} floated='right' icon labelPosition='left' primary size='small'>
                        <Icon name='user' /> Add Stakeholder
                      </Button>
                    </div>
                  </div>

                  <div className="row">
                    <List selection animated divided verticalAlign='middle'>
                      {this.props.project.stakeholders.map(this.showStakeholderElement.bind(this))}
                    </List>
                  </div>
                </div>
                <div className="col-sm-2" style={{padding:"5px"}}>

                </div>
                <div className="col-sm-5" >
                    <div className="row" style={{paddingBottom:"5px"}} >
                      {this.showNeeds()}
                    </div>
                    <div className="row" style={{paddingBottom:"5px"}}>
                      {this.showOutput()}
                    </div>
                    <div className="row">
                      show Role
                    </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-5"></div>
                <div className="col-sm-2">
                  {this.drawButtons()}
                </div>
                <div className="col-sm-5">
                  <EditModal value= "name" />
                </div>

              </div>


          {/* <Modal open={this.state.modal} basic size='small' onClose={this.close}>
            <Header icon='archive' content='Delete A Stakeholder' style={{paddingTop:"300px"}} />
            <Modal.Content>
              <p>You are going to delete a Stakeholder, are you Sure?!</p>
            </Modal.Content>
            <Modal.Actions>
              <Button basic color='red' inverted onClick={this.close} >
                <Icon name='remove' /> No
              </Button>
              <Button color='green' inverted onClick={this.deleteStakeholder.bind(this)}>
                <Icon name='checkmark' /> Yes
              </Button>
            </Modal.Actions>
          </Modal> */}

      </div>

    );
  }
}
function mapStateToProps(state){
  return {project: state.currentProject}
}
export default connect(mapStateToProps,actions)(Stakeholders);
