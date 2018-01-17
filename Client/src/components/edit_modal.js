import React, {Component}from 'react';
import {connect} from 'react-redux';
import { Button, Header, Icon, Modal,Input } from 'semantic-ui-react';
import * as actions from '../actions';

class EditModal extends Component{
  constructor(props){
    super(props);
    this.state = {
      value:props.value,
      changed:false,
      lastValue:''
    }
  }

  handleInputChange(event){
    this.setState({value:event.target.value});
  }

  handleClose(){
    this.props.modalClose();
  }

  handleUpdateInput(){
    // Call the action Creator in order update the Name of a Stakeholder, a Need Or a Output

    /** If the Value has been changed then send an update request
    */
    if(this.state.value != this.props.editInfo.value){
      //Check What we want to UpdateProject
      switch(this.props.editInfo.type){
        case "Stakeholder":
          this.props.updateStakeholderName({newName:this.state.value, id:this.props.editInfo.id,shIndex:this.props.editInfo.shIndex})
          break;

        case "Need":
          this.props.updateNeedName({newName:this.state.value, id:this.props.editInfo.id,shIndex:this.props.editInfo.shIndex})
          break;

        case "Output":
          this.props.updateOutputName({newName:this.state.value, id:this.props.editInfo.id,shIndex:this.props.editInfo.shIndex})
          break;
      }
    }
    this.props.modalClose();
  }

  render(){

    /**
    This If Statement is to make sure that we set the Value in the State to the props which we get,
    it's actually a solution for a problem. The problem is when we render the input there was no way
    to fill the input with this.props.editInfo.value.
    */
    if(!this.state.changed && this.props.editInfo.value!="")
    {
      this.setState({value:this.props.editInfo.value,changed:true,lastValue:this.props.editInfo.value});
    }
    else if (this.state.changed && this.props.editInfo.value!= this.state.lastValue){
      this.setState({value:this.props.editInfo.value,changed:true,lastValue:this.props.editInfo.value});
    }

    return(
        <Modal open={this.props.editInfo.show} size="small" style={{position: 'relative'}}>
          <Header icon='edit' content={this.props.editInfo.text} />
          <Modal.Content>
            <Input placeholder="Type the name" value={this.state.value} onChange={this.handleInputChange.bind(this)} />

          </Modal.Content>
          <Modal.Actions >
            <Button color='red' onClick={this.handleClose.bind(this)}>
              <Icon name='remove' /> No
            </Button>
            <Button color='green' onClick={this.handleUpdateInput.bind(this)}>
              <Icon name='checkmark' /> Yes
            </Button>
          </Modal.Actions>
        </Modal>
    );
  }
}

function mapStateToProps(state){
  return {editInfo:state.editInfo}
}


export default connect(mapStateToProps,actions)(EditModal);
