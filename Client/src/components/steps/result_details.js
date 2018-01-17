import React,{Component} from 'react';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router';
import ReactHighcharts from 'react-highcharts';
import addFunnel from 'highcharts/modules/funnel';
import Highcharts from 'highcharts';
require('highcharts/modules/exporting')(Highcharts);
import Chart from '../charts/chart1';
import * as actions from '../../actions';
import MyHeader from '../project_header';
import Loader from '../loading.js';
import {Grid,Label, Segment,Icon, Image,Card,Menu,Header,Dropdown,Button,Message,Step} from 'semantic-ui-react';
import _ from 'lodash';


class ResultDetails extends Component{
  constructor(props){
    super(props);
    this.state ={activeItem:props.params.num,from:this.props.project.stakeholders[0]._id,to:this.props.project.stakeholders[0]._id};
    this.renderResult=this.renderResult.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);

  }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
    let fromName='', toName='';
    fromName = this.getStakeholderName(this.state.from);
    toName = this.getStakeholderName(this.state.to);
    var info ={resultNumber:name,
              fromName:fromName,
              toName:toName,
              fromId:this.state.from,
              toId:this.state.to,
              projectId:this.props.project._id};
    this.props.showLoader();
    this.props.getResult(info);
  }

  handleSelectDropdown(direction,data){
    switch(direction){
      case 'from':
        this.setState({from:data.value});
        break;
      case 'to':
        this.setState({to:data.value})
        break;
    }
  }
  handleShowButton(){
    let fromName='', toName='';
    fromName = this.getStakeholderName(this.state.from);
    toName = this.getStakeholderName(this.state.to);
    var info ={resultNumber:this.state.activeItem,fromName:fromName, toName:toName, fromId:this.state.from,toId:this.state.to,projectId:this.props.project._id};
    this.props.showLoader();
    this.props.getResult(info);
  }

  renderSelectChoices(){
    let myoptions=[];
    this.props.project.stakeholders.forEach(function(sh){
      let temp = {
        key:sh._id,
        text: sh.name,
        value:sh._id,
        content:sh.name
      }
      myoptions.push(temp);
    })

    if(this.state.activeItem === 'result1' || this.state.activeItem === 'result2' || this.state.activeItem === 'result6' )
    {
      return(

        <Segment raised stacked style={{padding:'20px'}}>
          <Grid>
            <Grid.Row>
              <Grid.Column width={6}>
               <Header as='h4'>
                 <Icon name='user outline' />
                 <Header.Content>
                   From
                   {' '}
                   <Dropdown inline header='Select a Stakeholder'
                             options={myoptions}
                             defaultValue={myoptions[0].value}
                            onChange={(event, data)=> this.handleSelectDropdown('from', data)}/>
                 </Header.Content>
               </Header>
             </Grid.Column>
             <Grid.Column width={6}>
               <Header as='h4'>
                 <Icon name='user' />
                 <Header.Content>
                   To
                   {' '}
                   <Dropdown inline header='Select a Stakeholder'
                             options={myoptions}
                             defaultValue={myoptions[0].value}
                             onChange={(event, data)=> this.handleSelectDropdown('to', data)}/>
                 </Header.Content>
               </Header>
             </Grid.Column>
             <Grid.Column width={4}>
                <Button primary size='small' onClick={()=> this.handleShowButton()}>Show Result</Button>
             </Grid.Column>
         </Grid.Row>
         </Grid>
        </Segment>
      );
    }
    else{
      return <div></div>
    }

  }

  getStakeholderName(id){
    var index = _.findIndex(this.props.project.stakeholders,function(o){return o._id ===id});
    return this.props.project.stakeholders[index].name;
  }

  renderResult(){
    if(this.state.activeItem == 'result5' || this.state.activeItem == 'result6' )
      return this.renderPaths()
    else {
      return (<Chart />);
    }

  }


  renderPageHeader(){
    return(
      <Grid.Row centered>
        <Header as='h2' icon textAlign='center' color='red'>
          <Icon name='bar chart' circular />
          <Header.Content>
            Result
          </Header.Content>
        </Header>
      </Grid.Row>
    );
  }

  renderRsultsBarMenu(){
    const { activeItem } = this.state;
    return(
      <Menu widths={6}  inverted>
        <Menu.Item
          name='result1'
          active={activeItem === 'result1'}
          onClick={this.handleItemClick}
          content='Important Stakeholders for specific stakeholder'
          color='teal'
        />


        <Menu.Item
          name='result2'
          active={activeItem === 'result2'}
          onClick={this.handleItemClick}
          content='Important valueflows for one stakeholder'
          color='teal'
        />

        <Menu.Item
          name='result3'
          active={activeItem === 'result3'}
          onClick={this.handleItemClick}
          content='Important Stakeholders in the network'
          color='teal'
        />

        <Menu.Item
          name='result4'
          active={activeItem === 'result4'}
          onClick={this.handleItemClick}
          content='Important Valueflows in the network'
          color='teal'
        />

        <Menu.Item
          name='result5'
          active={activeItem === 'result5'}
          onClick={this.handleItemClick}
          content='Critical Paths of the network'
          color='teal'
        />

        <Menu.Item
          name='result6'
          active={activeItem === 'result6'}
          onClick={this.handleItemClick}
          content='Critical Paths between 2 Stakeholders'
          color='teal'
        />
      </Menu>
    );
  }

  renderInfoSection(){
    switch(this.state.activeItem){
      case 'result1':
        return(
          <Message info icon>
            <Icon name='announcement' />
            <Message.Content>
              <Message.Header>The important stakeholders could be indicated as follow:</Message.Header>
              <Message.List>
                <Message.Item>From one stakeholder's point of view, by select the same stakeholder in 'from' and 'to'.</Message.Item>
                <Message.Item>In a relationship Between two different stakeholders </Message.Item>
              </Message.List>
            </Message.Content>
          </Message>
        );

      case 'result2':
      return(
        <Message icon info>
          <Icon name='announcement' />
          <Message.Content>
            <Message.Header>Most Important Needs Fulfillment for one stakeholder</Message.Header>
            <Message.List>
            <Message.Item>See the most important needs, that need to be fullfillment according to one selected stakeholder</Message.Item>
          </Message.List>
          </Message.Content>
        </Message>
      );

      case 'result3':
      return(
        <Message icon info list>
          <Icon name='announcement' />
          <Message.Content>
            <Message.Header>Most Important stakeholders of the Network</Message.Header>
            <Message.List>
            <Message.Item>See the most important stakeholders in the wohle network</Message.Item>
          </Message.List>
          </Message.Content>
        </Message>
      );

      case 'result4':
      return(
        <Message compact icon info>
          <Icon name='announcement' />
          <Message.Content>
            <Message.Header>Most Important Needs Fulfillment in the wohle network</Message.Header>
            <Message.List>
            <Message.Item>See the most important needs, that need to be fullfillment according to the wohle network</Message.Item>
          </Message.List>
          </Message.Content>
        </Message>
      );

      case 'result5':
      return(
        <Message compact icon info>
          <Icon name='announcement' />
          <Message.Content>
            <Message.Header>Valueflows Critical Paths in the network</Message.Header>
            <Message.List>
            <Message.Item>You will see here the most five critical paths in the network which you have to take care about it</Message.Item>
          </Message.List>
          </Message.Content>
        </Message>
      );

      case 'result6':
      return(
        <Message compact icon info>
          <Icon name='announcement' />
          <Message.Content>
            <Message.Header>Valueflows Critical Paths of the network</Message.Header>
            <Message.List>
            <Message.Item>You will see here the most 5 critical paths between two selected stakeholders</Message.Item>
          </Message.List>
          </Message.Content>
        </Message>
      );

    }

  }
  renderOnePathsGroup(valueflows){
    if(valueflows){
    let steps =[];
    valueflows.forEach(function(valueFlow,index,array){
      let valueflowName = valueFlow.name.substring(0,valueFlow.name.indexOf('from'));
      if(!valueflowName){
        valueflowName = valueFlow.name.substring(0,valueFlow.name.indexOf('form'))
      }
      if(index != array.length-1){
        let item = { title: valueFlow.from, description: valueflowName,active:true, color:'red' }
        steps.push(item);
      }
      else {
        var item1 = { title: valueFlow.from, description: valueflowName ,active:true }
        steps.push(item1);
        var item2 = { title: valueFlow.to, description: '',active:true }
        steps.push(item2)
      }
    })
    return steps;
}
  }

  renderGroup(group){
    return(

      <Grid.Row centered style={{paddingBottom:'15px'}}>
      <Step.Group stackable='tablet' items={this.renderOnePathsGroup(group.valueflows)} size='tiny'>
         {/* {group.valueflows.map(this.renderOnePathsGroup.bind(this))} */}
     </Step.Group>
     </Grid.Row>
    )
  }

  renderPaths(){
    var sortedData = _.sortBy(this.props.result.data, function(o){return o.value});

    let takenElements =0;
    if(sortedData.length >5)
      takenElements = 5
    else {
      takenElements = sortedData.length;
    }
    let cuttedArray = _.take(sortedData,takenElements);
    let renderOnePathsGroup = this.renderOnePathsGroup;
    return cuttedArray.map(this.renderGroup.bind(this));
  }

  render(){
    return(
      <div>

      <Grid container>
        {this.renderPageHeader()}
        <Grid.Row>
          <Button content='Go back' icon='left arrow' labelPosition='left' onClick={()=> hashHistory.push("/home/results")} color='grey' />
        </Grid.Row>
        <Grid.Row>
          {this.renderRsultsBarMenu()}
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column width={6}>
            {this.renderInfoSection()}
          </Grid.Column>
          <Grid.Column width={10}>
            {this.renderSelectChoices()}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            {/* <Chart /> */}
                {this.renderResult()}
          </Grid.Column>
        </Grid.Row>
        <Loader />
      </Grid>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {project:state.currentProject, result:state.result}
}

export default connect(mapStateToProps,actions)(ResultDetails);
