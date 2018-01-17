import {FETCH_PROJECTS,CREATE_PROJECT,DELETE_PROJECT,DELETE_STATE} from '../actions/types';
import _ from 'lodash';

const Initial_State = {all:[]}
export default function(state =Initial_State, action){
  switch (action.type){
    case FETCH_PROJECTS:
      return {  ...state, all:action.payload.data};
    case CREATE_PROJECT:
      return {...state, currentProject: action.payload}
    case DELETE_PROJECT:
      return {...state, all:_.filter(state.all,function(o){return o._id!= action.payload})}
    case DELETE_STATE:
      return {  ...state, all:null};
  }
  return state
}
