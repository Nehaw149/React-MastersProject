import React,{Component} from 'react';
import {connect} from 'react-redux';
import Stepper from '../stepper';
import * as actions from '../../actions';
import _ from 'lodash';
import ProjectHeader from '../project_header';

import ReactScrollbar from 'react-scrollbar-js';
import {Grid,Icon ,List,Image,Step,Item,Label,Header,Segment,Accordion,Button,Message,Modal} from 'semantic-ui-react';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import FontIcon from 'material-ui/FontIcon';
import SvgIconFace from 'material-ui/svg-icons/action/face';
import {blue300, indigo900} from 'material-ui/styles/colors';


class Mapping extends Component{

  constructor(props){
    super(props);
    this.state = {
      value:1,
      selectedMainStakeholder:"",
      selectedNeed:"",
      selectedSeconderyStakeholder:"",
      selectNeedAlert:false
    }
    this.renderNeeds = this.renderNeeds.bind(this);
    this.renderStakeholderLeftList = this.renderStakeholderLeftList.bind(this);
    this.handleCreateValueFlow = this.handleCreateValueFlow.bind(this);
    this.handleDeleteValueFlow = this.handleDeleteValueFlow.bind(this);
  }

  renderNeedsSection(){
    if(this.state.selectedMainStakeholder == "")
    return (
      <div>
        <Grid.Row>
        <Header as='h2' color='red'>
          <Icon name='minus square outline' />
          <Header.Content>
            Needs
          </Header.Content>
        </Header>
        <Message info>
        <Message.Header>1.What I Have To Do Now?</Message.Header>
        <p>You Need now To select One by One Stakeholder and then find for each Stakeholder, which stakeholder could fulfill each need of the selected one.</p>
      </Message>
      </Grid.Row>
      </div>
    );
    else{
      return (
            <Grid.Row>
              <Header as='h2' color='red'>
                <Icon name='minus square outline' />
                <Header.Content>
                  Needs
                </Header.Content>
              </Header>
            </Grid.Row>
      );
    }
  }

  renderNeeds(){
    var mainShID = this.state.selectedMainStakeholder;
    if(this.state.selectedMainStakeholder != "")
    {
      var shIndex = _.findIndex(this.props.project.stakeholders,
        function(o){ return o._id == mainShID});
        return (
          <Item.Group divided>
            {this.props.project.stakeholders[shIndex].needs.all.map(this.renderOneNeed.bind(this))}
          </Item.Group>
      );
    }
  }

  handleDeleteValueFlow(id){
    this.props.deleteValueFlow(id);
  }

  renderOneNeed(need){
    const styles = {
              chip: {
                margin: 4,
              },
              wrapper: {
                display: 'flex',
                flexWrap: 'wrap',
              },
            };
    // Get the valueflows of SelectedMainSH
    const MainSHID = this.state.selectedMainStakeholder;
    const shValueFlows = _.filter(this.props.project.valueflows,function(o){
      return o.to == MainSHID
    });
    const needValueFlows = _.filter(shValueFlows, function(o){
      return o.needId == need._id
    })
    let allSH = this.props.project.stakeholders;
    let deleteValueFlow = this.handleDeleteValueFlow;
    return (
      <Segment clearing raised onClick={()=> this.setState({selectedNeed:need._id})}
              color={this.state.selectedNeed==need._id?"red":""}
              style={this.state.selectedNeed==need._id?{backgroundColor:"#ECEFF1"}:{}}
              key={need._id}
              >
            <Item>
              <Item.Content>
                <Icon name='minus square outline' color='red'/>
                <Item.Header as='a' style={{fontWeight:"bold",textTransform:"capitalize"}}>{need.name}</Item.Header>
                <Item.Meta>
                  <span className='cinema'>This need will be fulfilled by:</span>
                </Item.Meta>
                <Item.Description></Item.Description>
                <Item.Extra>
                  <div style={styles.wrapper}>
                  {
                    needValueFlows.map(function(valueflow){
                    var fromSH = _.find(allSH, function(o){
                      return o._id == valueflow.from
                    })
                    return (
                      // <Label as='a' color='teal' image>
                      //     {fromSH.name}
                      //     <Icon name='delete' onClick={()=>deleteValueFlow(valueflow._id)} />
                      // </Label>
                      <Chip
                        onRequestDelete={()=>deleteValueFlow(valueflow._id)}
                        style={styles.chip}
                      >
                        <Avatar color="#444" icon={<SvgIconFace />} />
                        {fromSH.name}
                      </Chip>

                    )
                  })}
                </div>
                </Item.Extra>
              </Item.Content>
            </Item>
        </Segment>
    );
  }

  renderStakeholdersTopList(stakeholder){
    return (
      <Step link active={this.state.selectedMainStakeholder== stakeholder._id?true:false}
            description=''
            onClick={()=> {this.setState({selectedMainStakeholder:stakeholder._id})}}
            >
        <Icon name="spy" color={this.state.selectedMainStakeholder== stakeholder._id?"blue":""} />
        <Step.Content>
          <Step.Title>{stakeholder.name}</Step.Title>
        </Step.Content>
      </Step>
    );
  }

  renderOneSH(sh){
    const styles = {
              chip: {
                margin: 4,
              },
              wrapper: {
                display: 'flex',
                flexWrap: 'wrap',
              },
            };
    const selectedNeedId = this.state.selectedNeed;
    const selectedMainStakeholderId = this.state.selectedMainStakeholder;
    let showAddButton = false;
    const needRelatedStakeholder = _.filter(this.props.project.valueflows,function(o){
        return (o.from == sh._id && o.to == selectedMainStakeholderId && o.needId == selectedNeedId )
    });
    if(needRelatedStakeholder.length == 0)
      showAddButton=true;

    return (

        <Accordion styled exclusive>
       <Accordion.Title style={{fontWeight:"bold",textTransform:"capitalize"}}>
           <Icon name='dropdown' />
           <Icon name='spy' />
            {sh.name}
         </Accordion.Title>
         <Accordion.Content>
           <p>This Stakeholder Provides These Services</p>

           <br/>
           <div style={styles.wrapper}>
             {sh.outputs.all.map(function(output){
               return (
                //  <Label as='a' color='teal'>
                //     {output.name}
                // </Label>
                  <Chip backgroundColor={blue300} style = {styles.chip}>
                    <Avatar size={20} color={blue300} backgroundColor={indigo900}>
                      OP
                    </Avatar>
                    {output.name}
                  </Chip>
                )
                })
              }
            </div>
            <Button disabled={showAddButton? false: true} basic color="green" onClick={()=> this.handleCreateValueFlow(sh._id)} >Fulfill the need</Button>

         </Accordion.Content>
       </Accordion>


    );
  }
  renderStakeholderLeftList(){
    if(this.state.selectedMainStakeholder != "" && this.state.selectedNeed!="")
    {
      var id = this.state.selectedMainStakeholder;
      var stakeholdersList = _.filter(this.props.project.stakeholders,
            function(o){ return o._id != id});
       return (
         <Segment>
         {stakeholdersList.map(this.renderOneSH.bind(this))}
       </Segment>)
    }
  }

  handleCreateValueFlow(shID){
    console.log("slected need",this.state.selectedNeed);


    const mainShID = this.state.selectedMainStakeholder;
    const toSh = _.find(this.props.project.stakeholders,function(o){return o._id == mainShID});
    const fromSh = _.find(this.props.project.stakeholders,function(o){return o._id == shID});
    const selectedNeedId = this.state.selectedNeed;
    const selectedNeed = _.find(toSh.needs.all,function(o){return o._id ==selectedNeedId})
    if(!selectedNeed)
    {
      this.setState({selectNeedAlert:true});
    }
    else {
      var info= {
        projectId:this.props.project._id,
        from:shID,
        to:this.state.selectedMainStakeholder,
        name:selectedNeed.name + ' from '+ fromSh.name + ' to ' + toSh.name,
        needId:selectedNeedId
      }
      this.props.createValueflow(info);
    }
}

  drawButtons(){
    var finish = true;
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
    var info = {projectId:this.props.project._id, currentStep: 3}
    this.props.updateCurrentStep(info);
  }

  renderSHlist(stakeholder){
    return (
      <List.Item key={stakeholder._id} as='a' onClick={()=> {this.setState({selectedMainStakeholder:stakeholder._id})}}>
        <Icon name="spy" color={this.state.selectedMainStakeholder== stakeholder._id?"blue":""} />
          <List.Content>
            {stakeholder.name}
          </List.Content>
      </List.Item>
    );
  }

  renderShHeader(){
    return (
        <Grid.Row style={{paddingBottom:'5px'}}>
        <Header as='h2' color='grey'>
          <Icon name='spy' />
          <Header.Content>
            Stakeholder
          </Header.Content>
        </Header>
      </Grid.Row>
    );
  }

  render(){

    const myScrollbar = {

      maxWidth:900,
      maxHeight:500
    }
    return(
      <div>
        {/* <Stepper /> */}
        <Grid container>
          <ProjectHeader title={this.props.project.title} />
          <Stepper />
        {/* <Grid.Row  centered>
          <Grid.Column style={{overflowX:"scroll"}} width={12}>
            <Step.Group>
              {this.props.project.stakeholders.map(this.renderStakeholdersTopList.bind(this))}
           </Step.Group>

         </Grid.Column>
        </Grid.Row> */}

        <Grid.Row>
          <Grid.Column width={4}>
            {this.renderShHeader()}
            <ReactScrollbar style={myScrollbar}>
              <Segment>
                <List selection verticalAlign='middle' divided size='large'>
                  {this.props.project.stakeholders.map(this.renderSHlist.bind(this))}
                </List>
              </Segment>
            </ReactScrollbar>
          </Grid.Column>
          <Grid.Column width={6}>
            {/* Render Needs Section */}
            {this.renderNeedsSection()}
            <Grid.Row>
              {this.renderNeeds()}
            </Grid.Row>
          </Grid.Column>
          <Grid.Column width={6}>
            {/* Show Stakeholder Header */}
            <Grid.Row>
              <Header as='h2' style={{color:'#81C784'}}>
                <Icon name='spy' />
                <Header.Content>
                  Stakeholders
                </Header.Content>
              </Header>
              </Grid.Row>
            <Grid.Row style={{paddingTop:"10px",paddingBottom:"10px"}}>
              <Message info>
                <Message.Header>2. What are These Stakeholders?</Message.Header>
                <p>After Selecting One Stakeholder from the leftside list, you have to find the stakeholders who could help
                  in fulfilling the need of the selected stakeholder. Click on each need in the left side to show the list Here
                </p>
              </Message>
              </Grid.Row>
            {/* show a List of Stakeholders */}
            <Grid.Row>
              {this.renderStakeholderLeftList()}
              </Grid.Row>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row centered>
          <Grid.Column width={4}>
            {this.drawButtons()}
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Modal open={this.state.selectNeedAlert}>
        <Header icon='archive' content='Select a need'/>
        <Modal.Content>
          <p>Before trying to do this actions you should select a need</p>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' inverted onClick={()=>this.setState({selectNeedAlert:false})}>
            <Icon name='checkmark' /> Got it
          </Button>
        </Modal.Actions>
      </Modal>
      </div>
    );
  }
}
function mapStateToProps(state){
  return {project: state.currentProject}
}

export default connect(mapStateToProps,actions)(Mapping);
