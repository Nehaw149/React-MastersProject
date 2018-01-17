import {GET_RESULT_1,GET_RESULT_2,GET_RESULT_3,GET_RESULT_4,GET_RESULT_5,GET_RESULT_6} from '../actions/types';


export default function(state={}, action){
  switch(action.type){
    case GET_RESULT_1:
      return {...state,data:action.payload.data,from:action.payload.from,to:action.payload.to,currentResult:action.payload.currentResult}
    // case GET_RESULT_2:
    //   return {...state,result2:action.payload}
    // case GET_RESULT_3:
    //   return {...state,result3:action.payload}
    // case GET_RESULT_4:
    //   return {...state,result4:action.payload}
    // case GET_RESULT_5:
    //   return {...state,result5:action.payload}
    // case GET_RESULT_6:
    //   return {...state,result6:action.payload}
  }
  return state;
}
