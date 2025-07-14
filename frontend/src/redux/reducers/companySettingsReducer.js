import {
    FETCH_COMPANY_SETTINGS_REQUEST,
    FETCH_COMPANY_SETTINGS_SUCCESS,
    FETCH_COMPANY_SETTINGS_FAILURE,
    UPDATE_COMPANY_SETTINGS_REQUEST,
    UPDATE_COMPANY_SETTINGS_SUCCESS,
    UPDATE_COMPANY_SETTINGS_FAILURE
  } from '../actions/types';
  
  const initialState = {
    settings: {
      leavePolicy: {
        casualLeavePerYear: 12,
        sickLeavePerYear: 12,
        earnedLeavePerYear: 12
      },
      workingHours: {
        start: '09:00',
        end: '18:00'
      },
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    loading: false,
    error: null,
    updateSuccess: false
  };
  
  const companySettingsReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_COMPANY_SETTINGS_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
          updateSuccess: false
        };
      
      case FETCH_COMPANY_SETTINGS_SUCCESS:
        return {
          ...state,
          settings: action.payload,
          loading: false,
          error: null
        };
      
      case FETCH_COMPANY_SETTINGS_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
      
      case UPDATE_COMPANY_SETTINGS_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
          updateSuccess: false
        };
      
      case UPDATE_COMPANY_SETTINGS_SUCCESS:
        return {
          ...state,
          settings: action.payload,
          loading: false,
          error: null,
          updateSuccess: true
        };
      
      case UPDATE_COMPANY_SETTINGS_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
          updateSuccess: false
        };
      
      default:
        return state;
    }
  };
  
  export default companySettingsReducer;
  