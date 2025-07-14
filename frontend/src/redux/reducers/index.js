import { combineReducers } from 'redux';
import userReducer from './userReducer';
import invitationReducer from './invitationReducer';
import companySettingsReducer from './companySettingsReducer';

export default combineReducers({
  users: userReducer,
  invitations: invitationReducer,
  companySettings: companySettingsReducer
  // Add other reducers here
});
