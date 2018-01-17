import React, {Component} from 'react';
import {connect} from 'react-redux';
import ReactHighcharts from 'react-highcharts';
import addFunnel from 'highcharts/modules/funnel';
import Highcharts from 'highcharts';
require('highcharts/modules/exporting')(Highcharts);
import {Grid, Icon, Image,Card} from 'semantic-ui-react';
import Stepper from '../stepper';
import Header from '../project_header';
import ChartImage1 from '../../../public/img/chart1.png'
import ChartImage2 from '../../../public/img/chart2.png'
import ChartImage3 from '../../../public/img/chart3.png'
import ChartImage4 from '../../../public/img/chart4.png'
import ChartImage5 from '../../../public/img/chart5.png'
import ChartImage6 from '../../../public/img/chart6.png'
import Chart from '../charts/chart1';
import * as actions from '../../actions';
import {browserHistory,hashHistory} from 'react-router';
import Loader from '../loading';

class Results extends Component{

  constructor(props){
    super(props);
    this.state ={selectedResult:0}
    this.selectResult = this.selectResult.bind(this);
    this.renderResult = this.renderResult.bind(this);
  }

  selectResult(num){
    this.setState({selectedResult:num});
    //this.props.getResult3(this.props.project._id);
    let fromName = this.props.project.stakeholders[0].name;
    let toName = this.props.project.stakeholders[0].name;
    let resultName ='';
    switch(num){
      case 1:
      resultName = 'result1'
      break;

      case 2:
      resultName = 'result2'
      break;

      case 3:
      resultName = 'result3'
      break;

      case 4:
      resultName = 'result4'
      break;

      case 5:
      resultName = 'result5'
      break;

      case 6:
      resultName = 'result6'
      break;
    }
    var info ={resultNumber:resultName,
              fromName:fromName,
              toName:toName,
              fromId:this.props.project.stakeholders[0]._id,
              toId:this.props.project.stakeholders[0]._id,
              projectId:this.props.project._id};
    this.props.showLoader();
    this.props.getResult(info);
    //hashHistory.push(`/home/results/resultd/${'result3'}`);

  }

  renderResult(){
    if(this.state.selectedResult == 1){
      return (
        <Chart data={this.props.result} />
      );
    }
    else{
      return(<div></div>)
    }

  }
  renderResultsCards(){
    return(
      <div>
        <Card.Group className='link' >
          <Card color={this.state.selectedResult==1?'green':''}  onClick={()=> this.selectResult(1)} key={'result1'}>
            <Image src={ChartImage1} />
            <Card.Content>
              <Card.Header>
                Result 1
              </Card.Header>
              <Card.Description>
                Get important stakeholders according to the specific stakeholder
              </Card.Description>
            </Card.Content>
          </Card>


            <Card color={this.state.selectedResult==2?'red':''} onClick={()=> this.selectResult(2)} key={'result2'}>
              <Image src={ChartImage2} />
              <Card.Content>
                <Card.Header>
                  Result 2
                </Card.Header>
                <Card.Description>
                  Get important Valueflows according to the specific stakeholder
                </Card.Description>
              </Card.Content>
            </Card>


              <Card color={this.state.selectedResult==3?'red':''} onClick={()=> this.selectResult(3)} key={'result3'}>
                <Image src={ChartImage3} />
                <Card.Content>
                  <Card.Header>
                    Result 3
                  </Card.Header>
                  <Card.Description>
                    Get important stakeholders according to the network
                  </Card.Description>
                </Card.Content>
              </Card>

              <Card color={this.state.selectedResult==4?'red':''} onClick={()=> this.selectResult(4)} key={'result4'}>
                <Image src={ChartImage4} />
                <Card.Content>
                  <Card.Header>
                    Result 4
                  </Card.Header>
                  <Card.Description>
                    Get important valueflows according to the network
                  </Card.Description>
                </Card.Content>
              </Card>

              <Card color={this.state.selectedResult==5?'red':''}  onClick={()=> this.selectResult(5)} key={'result5'}>
                <Image src={ChartImage5} />
                <Card.Content>
                  <Card.Header>
                    Result 5
                  </Card.Header>
                  <Card.Description>
                    Get critical paths in the network
                  </Card.Description>
                </Card.Content>
              </Card>

              <Card color={this.state.selectedResult==5?'red':''}  onClick={()=> this.selectResult(6)} key={'result6'}>
                <Image src={ChartImage6} />
                <Card.Content>
                  <Card.Header>
                    Result 6
                  </Card.Header>
                  <Card.Description>
                    Get critical paths between two stakeholders
                  </Card.Description>
                </Card.Content>
              </Card>


            </Card.Group>
            </div>
        );
  }

  render(){
        return(
          <div>
            <Grid container centered columns={3}>
              <Header title={this.props.project.title}/>
              <Stepper />
              <Grid.Row columns={3} centered style={{paddingLeft:'100px'}}>
                <Grid.Column width={16}>
                  {this.renderResultsCards()}
                </Grid.Column>
              </Grid.Row>
            </Grid>

            {/* <Grid padded>
              <Header title={this.props.project.title}/>
              <Stepper />
              <Grid.Row columns={2} centered>
                <Grid.Column width={3}>
                  {this.renderResultsCards()}
                </Grid.Column>
                <Grid.Column width={13}>

                </Grid.Column>
              </Grid.Row>

            </Grid> */}
            <Loader />

          </div>
        );
  }
}

function mapStateToProps(state){
  return {project:state.currentProject, result:state.result}
}

export default connect(mapStateToProps,actions)(Results);
