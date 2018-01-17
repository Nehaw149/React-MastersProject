import React,{Component} from 'react';
import {connect} from 'react-redux';
import { Header, Table, Rating,Modal,Button,Loader } from 'semantic-ui-react';

class Loading extends Component{
  render(){
    return(
      <Modal
        closeOnEscape={false}
        closeOnRootNodeClick={false}
        open={this.props.trigger} basic size='small'>
        <Loader size='massive'>Loading</Loader>
      </Modal>
    );

  }
}

function mapStateToProps(state){
  return {trigger:state.loadingModal}
}

export default connect(mapStateToProps)(Loading);
