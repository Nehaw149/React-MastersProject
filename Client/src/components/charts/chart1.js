import React, {Component} from 'react';
import ReactHighcharts from 'react-highcharts';
import addFunnel from 'highcharts/modules/funnel';
import Highcharts from 'highcharts';
require('highcharts/modules/exporting')(Highcharts);
import _ from 'lodash';
import {Segment,Dimmer,Loader,Image} from 'semantic-ui-react'
import {connect} from 'react-redux';


class Chart extends Component{

  render(){

    var dataArr = [];
    if(this.props.resultData!= null && this.props.resultData != {}){
      console.log("Result Data In Chart ", this.props.resultData)
      let title='';
      switch(this.props.resultData.currentResult){
        case 'result1':
          title = 'Importance Of stakeholders ';
          if(this.props.resultData.from != this.props.resultData.to)
            title += `between ${this.props.resultData.from} and ${this.props.resultData.to}`
          else {
            title += `according to ${this.props.resultData.from}`
          }
        break;

        case 'result2':
          title = 'Importance Of valueflows ';
          if(this.props.resultData.from != this.props.resultData.to)
            title += `between ${this.props.resultData.from} and ${this.props.resultData.to}`
          else {
            title += `according to ${this.props.resultData.from}`
          }
        break;

        case 'result3':
          title = 'Most Important stakeholders in the network'
        break;

        case 'result4':
          title = 'Most Important valueflows in the network'
        break;

        default:
          title ='';
      }
      this.props.resultData.data.forEach(function(ob){
        var keys = Object.keys(ob);
        var temp = [ob.name, ob[keys[1]]];
        dataArr.push(temp);
      });
      var sortedData = _.sortBy(dataArr, function(o){return o[1]})
      sortedData = sortedData.reverse();
      var config = {
        credits: {
            enabled: false
        },
        chart: {
            type: 'column',
            events: {
                    load: function () {
                        var label = this.renderer.label("How do I move this center and under the legend.")
                        .css({
                            width: '450px',
                            color: '#222',
                            fontSize: '16px'
                        })
                        .attr({
                            'stroke': 'silver',
                            'stroke-width': 2,
                            'r': 5,
                            'padding': 10
                        })
                        .add();

                        label.align(Highcharts.extend(label.getBBox(), {
                            align: 'left',
                            x: 0, // offset
                            verticalAlign: 'bottom',
                            y: 70 // offset
                        }), null, 'spacingBox');

                    }},
            height: 600,
            spacingBottom: 150
        },
        title: {
            text: title
        },
        subtitle: {
            text: 'Source: <a href="https://www.agilters.com">HiStake</a>'
        },
        xAxis: {
            type: 'category',
            labels: {
                rotation: -45,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
          min: 0.0,
            max:1.0,
            title: {
                text: 'Importance'
            },
            tickInterval:0.1
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'Importance on scale of one: <b>{point.y:.3f} points</b>'
        },
        series: [{
            name: 'Importance',
            data: sortedData ,
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y:.3f}', // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }]


      }
    return(
      <ReactHighcharts config = {config}></ReactHighcharts>
    );
  }
  else{
    return (
      <Segment>
        {/* <Dimmer active inverted>
          <Loader size='large'>Loading</Loader>
        </Dimmer> */}

        <Image src='http://semantic-ui.com/images/wireframe/paragraph.png' />
      </Segment>
    );
  }
 }
}
function mapStateToProps(state){
  return{ resultData:state.result}
}

export default connect(mapStateToProps)(Chart);
