import {SHOW_LOADER,HIDE_LOADER} from '../actions/types';
export default function(state=false,action){
  switch(action.type){
    case SHOW_LOADER:
      return true;
    case HIDE_LOADER:
      return false;
  }
  return state;
}
