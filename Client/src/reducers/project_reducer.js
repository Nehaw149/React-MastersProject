import {GET_PROJECT, UPDATE_PROJECT, CREATE_STAKEHOLDER, CREATE_PROJECT, DELETE_OUTPUT, DELETE_NEED,
        DELETE_STATE, UPDATE_NEED_NAME, UPDATE_STAKEHOLDER_NAME, UPDATE_OUTPUT_NAME, DELETE_VALUE_FLOW,
        UPDATE_VALUEFLOW_VALUE, UPDATE_VALUEFLOW_IMPORTANCE, UPDATE_VALUEFLOW_INTENSITY
      }from '../actions/types';
import _ from 'lodash';
import {REHYDRATE} from 'redux-persist/constants';

export default function(state= null, action){
  switch(action.type){
    case GET_PROJECT:
      return action.payload;

    case UPDATE_PROJECT:
      return {...state, title:action.payload.title,description:action.payload.description}

    case CREATE_STAKEHOLDER:
      return action.payload

    case CREATE_PROJECT:
      return action.payload;

    case DELETE_OUTPUT:
      state.stakeholders[action.payload.shIndex].outputs.all = _.filter(state.stakeholders[action.payload.shIndex].outputs.all, function(o){return o._id != action.payload.outputId });
      return {...state};

    case DELETE_NEED:
        state.stakeholders[action.payload.shIndex].needs.all = _.filter(state.stakeholders[action.payload.shIndex].needs.all, function(o){return o._id != action.payload.needId });
        return {...state};

    case UPDATE_STAKEHOLDER_NAME:
      var ind = _.findIndex(state.stakeholders, function(o){ return o._id == action.payload.id});
      state.stakeholders[ind].name = action.payload.name;
      return {...state};


    case UPDATE_NEED_NAME:
      var ind = _.findIndex(state.stakeholders[parseInt(action.payload.shIndex)].needs.all, function(o){ return o._id == action.payload.id});
      state.stakeholders[parseInt(action.payload.shIndex)].needs.all[ind].name = action.payload.name;
      return {...state}

    case UPDATE_OUTPUT_NAME:
      var ind = _.findIndex(state.stakeholders[parseInt(action.payload.shIndex)].outputs.all, function(o){ return o._id == action.payload.id});
      state.stakeholders[parseInt(action.payload.shIndex)].outputs.all[ind].name = action.payload.name;
      return {...state}

    case DELETE_VALUE_FLOW:
      state.valueflows = _.filter(state.valueflows, function(o){return o._id != action.payload})
      return {...state};

    case UPDATE_VALUEFLOW_IMPORTANCE:
        var ind = _.findIndex(state.valueflows,function(o){return o._id == action.payload.id})
        state.valueflows[ind].importanceEstimation = action.payload.value;
        return {...state}

    case UPDATE_VALUEFLOW_INTENSITY:
        var ind = _.findIndex(state.valueflows,function(o){return o._id == action.payload.id})
        state.valueflows[ind].intensityEstimation = action.payload.value;
        return {...state}

    case UPDATE_VALUEFLOW_VALUE:
        var ind = _.findIndex(state.valueflows,function(o){return o._id == action.payload.id})
        state.valueflows[ind].value = action.payload.value;
        return {...state}

    case DELETE_STATE:
      return null;

  }
  return state;
}
