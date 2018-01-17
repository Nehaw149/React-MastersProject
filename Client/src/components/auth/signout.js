import React,{Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import {browserHistory,hashHistory} from 'react-router';

class Signout extends Component{
  componentWillMount(){
      this.props.signoutUser();
  }
  componentDidMount(){
    setTimeout(function(){hashHistory.push('/');},2000);
  }
  render(){
    return(
      <div> Sorry To See You Go ...</div>
    );
  }
}


export default connect(null, actions)(Signout)
