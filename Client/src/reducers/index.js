import { combineReducers } from 'redux';
import ProjectsReducer from './projects_reducer';
import StepReducer from './step_reducer';
import {reducer as form} from 'redux-form';
import ProjectReducer from './project_reducer';
import ModalReducer from './modal_reducer';
import AuthReducer from './auth_reducer';
import loadingReducer from './loading_reducer';
import ResultReducer from './result_reducer'

const rootReducer = combineReducers({
  projects: ProjectsReducer,
  steps: StepReducer,
  currentProject:ProjectReducer,
  form,
  editInfo: ModalReducer,
  auth:AuthReducer,
  loadingModal: loadingReducer,
  result: ResultReducer
});


export default rootReducer;
