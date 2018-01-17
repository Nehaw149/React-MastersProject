import React, {Component} from 'react';
import Stepper from '../stepper';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import update from 'react-addons-update';
import _ from 'lodash';

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
import { Menu,Dropdown,Icon, Grid,Image, Button,List,Segment,Popup} from 'semantic-ui-react';

class Stakeholders extends Component{

  constructor(props){
    super(props);
    this.state ={
      currentSH:"",
      saving: true,
      selectedStakeholder:null,
      currentNeed:""
    }
    this.showNeeds = this.showNeeds.bind(this);
    //this.selectStakeholder = this.selectStakeholder.bind(this);

  }
  deleteStakeholder(id){
    var info = {
      projectId: this.props.project._id,
      list:[id]
    };
    this.props.deleteStakeholder(info);
  }

  selectStakeholder(id){
    var ind = _.findIndex(this.props.project.stakeholders,function(o){return o._id === id})
    console.log(ind);
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
    return(
      // <div>
      //   <Paper style={{backgroundColor:"#E8EAF6"}} zDepth={2} >
      // <ListItem
      //   rightIconButton={
      //     <IconMenu iconButtonElement={iconButtonElement}>
      //     <MenuItem onClick={()=> console.log(item._id)} >Edit</MenuItem>
      //     <MenuItem onClick={()=> this.deleteStakeholder(item._id)} >Delete</MenuItem>
      //   </IconMenu>
      // }
      //   onClick={()=> {this.selectStakeholder(item._id)}}
      //   primaryText={item.name}
      //   key={item._id}
      // />
      //
      // </Paper>
      // <Divider inset={true} />
      // </div>
      <div>
      <List.Item>
        <List.Content floated='right'>
          <Popup
            trigger={<Button onClick={()=> console.log("Trigger")} icon='trash' />}
            content="Delete This Stakeholder, This could effect the next Steps"
            basic
          />
          <Popup
            trigger={<Button onClick={()=> console.log("Trigger")} icon='edit' />}
            content="Edit the Name Of Stakeholder"
            basic
          />

        </List.Content>
        <Icon name='spy' />
        <List.Content>
          {item.name}
        </List.Content>
      </List.Item>
      </div>
    )
  }

  renderOneNeed(need){
    console.log(need);
    return (
      <Paper style={{backgroundColor:"#E0F2F1"}} zDepth={4} >
      <div>
      <ListItem primaryText={need.name}
      style={{color:'#EF5350'}}
      hoverColor='#C8E6C9' />
      <Divider inset={true} />
      </div>
    </Paper>
    )
  }
  showNeeds(){
    // let ind;
    console.log("Show Needs:");
    if(this.state.selectedStakeholder || this.state.selectedStakeholder == 0)
    {
      let ind = this.state.selectedStakeholder;
      if(this.props.project.stakeholders[ind].needs.all.length > 0)
      {
        return this.props.project.stakeholders[ind].needs.all.map(this.renderOneNeed.bind(this))
      }
      else{
        return (<div>No Needs To Show</div>);
      }
    }
    else {
      return (
        <div>
          Select Stakeholder to Show his Needs
        </div>
      );
    }
  }

  handleChange(event){
    this.setState({currentSH:event.target.value});
  }
  handleNeedChange(event){
    this.setState({currentNeed:event.target.value});
  }

  handleAddNeed(){
    //Call Action Creator with this.state.currentNeed
    var ind = this.state.selectedStakeholder;
    var info = {
      projectId:this.props.project._id,
      stakeholderId:this.props.project.stakeholders[ind]._id,
      need:this.state.currentNeed
    }
    this.props.addNeed(info);
    this.setState({currentNeed:""});

  }

  handleAddStakeholder(){
    var info = {
      projectId:this.props.project._id,
      stakeholder:{name:this.state.currentSH}
    };
    this.props.addStakeholder(info);
    this.setState({currentSH:""});
  }
  render(){
    const myScrollbar = {
      width: 400,
      height: 200,
    };
    return(
      <div>
          <Stepper />
          <div className="row">
            <div className="col-sm-6">
              <input type="text" onChange={this.handleChange.bind(this)} value={this.state.currentSH} />
              <button onClick={()=> this.handleAddStakeholder()} className="btn btn-sm btn-primary"> Add Stakeholder</button>
            </div>
            <div className="col-sm-6">
            </div>
          </div>


          <div className="row">
            <div className="col-sm-6">
              <div>

                <Subheader>All Stakeholders:
                  <Help onMouseUp={()=> console.log('hello')}/>
              </Subheader>
              {/* <Paper zDepth={4} > */}
                <List selection animated divided verticalAlign='middle'>
                  {this.props.project.stakeholders.map(this.showStakeholderElement.bind(this))}
                </List>
              {/* </Paper> */}
              </div>
            </div>

            <div className="col-sm-6">
              {/* <Subheader>Needs :</Subheader>
              <div className="row">
                <input disabled = {this.state.selectedStakeholder!=null ?false:true} type="text" onChange={this.handleNeedChange.bind(this)} value={this.state.currentNeed} />
                <button onClick={()=> this.handleAddNeed()} className="btn btn-sm btn-primary"> Add Stakeholder</button>
              </div>

              <ReactScrollbar style={myScrollbar}>
                <div className="should-have-a-children scroll-me">
                  <List>
                    {this.showNeeds()}
                  </List>
                </div>
              </ReactScrollbar>

              <Subheader>Objectives :</Subheader>
              <div className="row">
                <input type="text" />
                <button className="btn btn-sm btn-primary"> Add Stakeholder</button>
              </div>
              <ReactScrollbar style={myScrollbar}>
                <div className="should-have-a-children scroll-me">
              <List>
                <ListItem primaryText='Objective 1'/>
                <Divider inset={true} />
                <ListItem primaryText='Objective 2'/>
                <Divider inset={true} />
                <ListItem primaryText='Objective 3'/>
                <ListItem primaryText='Objective 3'/>
                <ListItem primaryText='Objective 3'/>
                <ListItem primaryText='Objective 3'/>
                <ListItem primaryText='Objective 3'/>
              </List>
              </div>
            </ReactScrollbar>

              <Subheader>Role :</Subheader>
              <div className="row">
                <div className="col-sm-5">
                <div className="input-group">
                  <input type="text" className="form-control" placeholder="Add a role"/>
                  <span className="input-group-btn">
                    <button className="btn btn-primary" type="button">Go!</button>
                  </span>
                </div>
                </div>
              </div>

              <List>
                <ListItem primaryText='Role 1'/>
              </List> */}

            </div>
          </div>
          <div className="row">
              <div style={{marginTop: 12}}>
                <FlatButton
                  label="Back"
                  disabled={true}
                  // onClick={this.handlePrev}
                  style={{marginRight: 12}}
                />
                <RaisedButton
                  label="Next"
                  primary={true}
                  // onClick={this.handleNext}
                  style={{marginBottom: 12}}
                />
              </div>
          </div>

      </div>
    );
  }
}
function mapStateToProps(state){
  console.log("State In SHs Component:",state);
  return {project: state.currentProject}
}
export default connect(mapStateToProps,actions)(Stakeholders);
