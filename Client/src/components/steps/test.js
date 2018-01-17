import React, {Component} from 'react';
import Stepper from '../stepper';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import update from 'react-addons-update';
import _ from 'lodash';
import EditModal from '../edit_modal';
import ProjectHeader from '../project_header';

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
  componentDidUpdate(){
    if(! this.stepIsCompleted()){
      var info = {projectId:this.props.project._id, currentStep: 1}
      this.props.updateCurrentStep(info);
    }

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
        <List.Item key={item._id} style={active?{backgroundColor:"#E0F7FA"}:{}} onClick={()=> this.selectStakeholder(item._id)}>
          <List.Content floated='right'>
            <Popup
              trigger={<Button onClick={()=> this.handleOpenEditModal(item.name, "Stakeholder", item._id)} icon='edit' />}
              content="Edit"
              inverted
            />
            <Popup
              trigger={<Button onClick={()=> this.showModal(item._id)} icon='trash' />}
              content="Delete"
              inverted
            />
          </List.Content>
          <Image avatar src='http://semantic-ui.com/images/avatar2/small/mark.png' />
          <List.Content>
            {this.hasStakeholderNeedsAndOutputs(item._id)}
            {item.name}
          </List.Content>
        </List.Item>

    )
  }

  handleOpenEditModal(name,type,Id){
    var text="";
    switch(type){
      case "Stakeholder":
        text = "Are you sure you want to edit the name of this Stakeholder?"
        break;
      case "Need":
        text = "Are you sure you want to edit the name of this Need?"
        break;
      case "Output":
        text = "Are you sure you want to edit the name of this Output?"
        break;
    }
    this.props.modalShow(
      {show:true,
      text:text,
      value:name,
      type,
      id:Id,
      shIndex:this.state.selectedStakeholder
    }
  );
  }

  renderOneNeed(need){
    return (
      <List.Item key={need._id}>
        <List.Content floated='right'>
          <Popup
            trigger={<Button onClick={()=> this.handleOpenEditModal(need.name, "Need", need._id)} icon='edit' />}
            content="Edit"
            inverted
          />
          <Popup
            trigger={<Button onClick={()=> this.handleDeleteNeed(need._id)} icon='trash' />}
            content="Delete"
            inverted
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
      <List.Item key={output._id}>
        <List.Content floated='right'>
          <Popup
            trigger={<Button onClick={()=> this.handleOpenEditModal(output.name, "Output", output._id)} icon='edit' />}
            content="Edit"
            inverted
          />
          <Popup
            trigger={<Button onClick={()=> this.handleDeleteOutput(output._id)} icon='trash' />}
            content="Delete"
            inverted
          />
        </List.Content>
        {/* <Image avatar src='http://semantic-ui.com/images/avatar2/small/lena.png' /> */}
        <Icon name="lightbulb"/>
        <List.Content>
          {output.name}
        </List.Content>
      </List.Item>
    )
  }

  renderNeedHeader(){
    return (
      <div>
        <Grid.Row>
          <Header as='h2' color='red'>
            <Icon name='minus square outline' />
            <Header.Content>
              Needs
            </Header.Content>
          </Header>
        </Grid.Row>
      <Grid style={{paddingTop:"5px"}}>
        <Grid.Row>
          <Grid.Column width={10}>
            <Input fluid size='large' icon='users' iconPosition='left' placeholder='I need...in order to provide a service '
              type="text" onChange={this.handleNeedChange.bind(this)} value={this.state.currentNeed}
              onKeyPress={(e)=> e.key == 'Enter'?this.handleAddNeed(): ''}
              />
          </Grid.Column>

          <Grid.Column width={6}>
            <Button color='red' onClick={()=> this.handleAddNeed()} floated='right' icon labelPosition='left' basic size='small'>
              <Icon name='wrench' /> Add Need
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
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
          <Segment>
          {this.renderNeedHeader()}
          <Grid.Row style={{paddingTop:"10px"}}>
            <ReactScrollbar style={myScrollbar}>
                <List selection animated divided verticalAlign='middle'>
                    {this.props.project.stakeholders[ind].needs.all.map(this.renderOneNeed.bind(this))}
                </List>
          </ReactScrollbar>
        </Grid.Row>
      </Segment>
        );
      }
      else{
        return (
          // <div style={{paddingBottom:"5px"}}>
          //   {this.renderNeedHeader()}
          //   <Message
          //     compact
          //     content='Add the need of this stakeholder to show them here'
          //     color="yallow"
          //   />
          // </div>
          <Segment>
            <Grid.Row style={{paddingTop:"10px"}}>
              {this.renderNeedHeader()}
              <Message
                compact
                content='Add the need of this stakeholder to show them here'
                color="yallow"
              />
            </Grid.Row>
          </Segment>
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
          <Segment>
          {this.renderOutputHeader()}
          <Grid.Row style={{paddingTop:"10px"}}>
            <ReactScrollbar style={myScrollbar}>
              <List selection animated divided verticalAlign='middle'>
                  {this.props.project.stakeholders[ind].outputs.all.map(this.renderOneOutput.bind(this))}
              </List>
            </ReactScrollbar>
          </Grid.Row>
        </Segment>
        );
      }
      else{
        return (
          // <div style={{paddingBottom:"5px"}}>
          //   {this.renderOutputHeader()}
          //   <Message
          //     compact
          //     content='Add the output(Services) that provided by this stakeholder to show them here'
          //     color="yallow"
          //   />
          // </div>
          <Segment>
            <Grid.Row >
              {this.renderOutputHeader()}
              <Message
                compact
                content='Add the output(Services) that provided by this stakeholder to show them here'
                color="yallow"
              />
            </Grid.Row>
          </Segment>
        );
      }
    }
  }

  renderOutputHeader(){
    return (
      <div>
        <Grid.Row>
          <Header as='h2' color='green'>
            <Icon name='plus square outline' />
            <Header.Content>
              Outputs
            </Header.Content>
          </Header>
        </Grid.Row>
        <Grid style={{paddingTop:"5px"}}>
          <Grid.Row>
            <Grid.Column width={10}>
              <Input fluid size='large' icon='users' iconPosition='left' placeholder='I provide this service ...'
                type="text" onChange={this.handleOutputChange.bind(this)} value={this.state.currentOutput}
                onKeyPress={(e)=> e.key == 'Enter'?this.handleAddOutput(): ''}
                />
            </Grid.Column>

            <Grid.Column width={6}>
              <Button color='green' onClick={()=> this.handleAddOutput()} floated='right' icon labelPosition='left' basic size='small'>
                <Icon name='external' /> Add Output
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
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
    if(this.state.currentNeed != "" && this.state.currentNeed !=null){
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

    if(this.state.currentOutput != "" && this.state.currentOutput !=null){
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

  stepIsCompleted()
  {
    // CHeck If the Step is Complete in order To activate the Next Button
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
      return false;
    }
  }

  hasStakeholderNeedsAndOutputs(id){
    var index = _.findIndex(this.props.project.stakeholders,function(o){return o._id == id})
    if(this.props.project.stakeholders[index].needs.all.length > 0 &&  this.props.project.stakeholders[index].outputs.all.length>0)
    return (
      <Popup trigger={<Icon name='checkmark' color='green' />}
        content='Needs and Outputs are listed for this Stakeholder'
        inverted
        />
    )
    else {
      return (
        <Popup trigger={<Icon name='remove' color='red' />}
        content='You have to list at least one need and one output'
        inverted
        />

      )
    }
  }

  drawButtons(){
    var finish = this.stepIsCompleted();
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
        <Popup trigger={<Button.Group>
          <Button>Back</Button>
          <Button.Or />
          <Button disabled positive >Next</Button>
        </Button.Group>}
         content={"Please fill Needs and Outputs for all Stakeholders to go on the next step."}
         position='bottom right'
         inverted
         />
      )
    }
  }

  handleNext(){
    var info = {projectId:this.props.project._id, currentStep: 2}
    this.props.updateCurrentStep(info);
  }

  render(){
    const myScrollbar = {
      // width: 600,
      // minHeight:10,
      maxHeight: 420
    };
    return(
      <div>

          {/* <Grid.Row columns={2}>
            <Grid.Column>
              <Grid.Row> */}

              <Grid container>
                <ProjectHeader title={this.props.project.title} />
                <Stepper />
              {/* <Grid.Row centered>
                <Grid.Column width={12}>
                <Header as='h3' block textAlign='center' color="green">
                  {this.props.project.title}
                </Header>
                </Grid.Column>
              </Grid.Row> */}



              <Grid.Row>
                <Grid.Column width={8}>
                  <Segment>
                  <Grid.Row style={{paddingBottom:'5px'}}>
                    <Header as='h2' color='grey'>
                      <Icon name='spy' />
                      <Header.Content>
                        Stakeholders
                      </Header.Content>
                    </Header>
                  </Grid.Row>

                  <Grid>
                    <Grid.Column width={10}>
                      <Input fluid size='large' icon='users' iconPosition='left' placeholder='Add Stakeholder...'
                        type="text" onChange={this.handleChange.bind(this)} value={this.state.currentSH}
                        onKeyPress={(e)=> e.key == 'Enter'?this.handleAddStakeholder(): ''}
                        />
                    </Grid.Column>
                    <Grid.Column width={6}>
                      <Button onClick={()=> this.handleAddStakeholder()} floated='right' icon labelPosition='left' primary size='medium'>
                        <Icon name='user' /> Add Stakeholder
                      </Button>
                    </Grid.Column>
                  </Grid>

                  <Grid.Row style={{paddingTop:"10px"}}>
                    <ReactScrollbar style={myScrollbar}>
                      <List selection animated divided verticalAlign='middle'>
                        {this.props.project.stakeholders.map(this.showStakeholderElement.bind(this))}
                      </List>
                    </ReactScrollbar>
                  </Grid.Row>
                  </Segment>
                </Grid.Column>


                <Grid.Column width={8}>
                  <Grid.Row>

                    {this.showNeeds()}

                  </Grid.Row>
                  <Grid.Row>

                    {this.showOutput()}

                  </Grid.Row>

                </Grid.Column>
              </Grid.Row>

              <Grid.Row centered>
                <Grid.Column width={4}>
                  {this.drawButtons()}
                </Grid.Column>
              </Grid.Row>


          <Modal open={this.state.modal} basic size='small' onClose={this.close}>
            <Header icon='archive' content='Delete A Stakeholder'/>
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
          </Modal>
          <EditModal value={this.state.selectedStakeholder} />
</Grid>

      </div>

    );
  }
}
function mapStateToProps(state){
  return {project: state.currentProject}
}
export default connect(mapStateToProps,actions)(Stakeholders);
