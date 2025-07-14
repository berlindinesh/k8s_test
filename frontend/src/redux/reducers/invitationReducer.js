import {
  FETCH_INVITATIONS_REQUEST,
  FETCH_INVITATIONS_SUCCESS,
  FETCH_INVITATIONS_FAILURE,
  INVITE_USER_REQUEST,
  INVITE_USER_SUCCESS,
  INVITE_USER_FAILURE,
  RESEND_INVITATION_REQUEST,
  RESEND_INVITATION_SUCCESS,
  RESEND_INVITATION_FAILURE,
  CANCEL_INVITATION_REQUEST,
  CANCEL_INVITATION_SUCCESS,
  CANCEL_INVITATION_FAILURE
} from '../actions/types';

const initialState = {
  invitations: [],
  loading: false,
  error: null,
  inviteLoading: false,
  inviteError: null,
  inviteSuccess: false,
  actionLoading: false,
  actionError: null,
  lastCheck: null // Add this for tracking updates
};

export default function invitationReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_INVITATIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_INVITATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        invitations: action.payload.invitations || action.payload,
        error: null,
        lastCheck: action.payload.lastCheck || new Date().toISOString()
      };
    case FETCH_INVITATIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case INVITE_USER_REQUEST:
      return {
        ...state,
        inviteLoading: true,
        inviteError: null,
        inviteSuccess: false
      };
    case INVITE_USER_SUCCESS:
      return {
        ...state,
        inviteLoading: false,
        inviteError: null,
        inviteSuccess: true
      };
    case INVITE_USER_FAILURE:
      return {
        ...state,
        inviteLoading: false,
        inviteError: action.payload,
        inviteSuccess: false
      };
    case RESEND_INVITATION_REQUEST:
    case CANCEL_INVITATION_REQUEST:
      return {
        ...state,
        actionLoading: true,
        actionError: null
      };
    case RESEND_INVITATION_SUCCESS:
    case CANCEL_INVITATION_SUCCESS:
      return {
        ...state,
        actionLoading: false,
        actionError: null
      };
    case RESEND_INVITATION_FAILURE:
    case CANCEL_INVITATION_FAILURE:
      return {
        ...state,
        actionLoading: false,
        actionError: action.payload
      };
    default:
      return state;
  }
}

// import {
//     FETCH_INVITATIONS_REQUEST,
//     FETCH_INVITATIONS_SUCCESS,
//     FETCH_INVITATIONS_FAILURE,
//     INVITE_USER_REQUEST,
//     INVITE_USER_SUCCESS,
//     INVITE_USER_FAILURE,
//     RESEND_INVITATION_REQUEST,
//     RESEND_INVITATION_SUCCESS,
//     RESEND_INVITATION_FAILURE,
//     CANCEL_INVITATION_REQUEST,
//     CANCEL_INVITATION_SUCCESS,
//     CANCEL_INVITATION_FAILURE
//   } from '../actions/types';
  
//   const initialState = {
//     invitations: [],
//     loading: false,
//     error: null,
//     inviteLoading: false,
//     inviteError: null,
//     inviteSuccess: false,
//     actionLoading: false,
//     actionError: null
//   };
  
//   export default function invitationReducer(state = initialState, action) {
//     switch (action.type) {
//       case FETCH_INVITATIONS_REQUEST:
//         return {
//           ...state,
//           loading: true,
//           error: null
//         };
//       case FETCH_INVITATIONS_SUCCESS:
//         return {
//           ...state,
//           loading: false,
//           invitations: action.payload,
//           error: null
//         };
//       case FETCH_INVITATIONS_FAILURE:
//         return {
//           ...state,
//           loading: false,
//           error: action.payload
//         };
//       case INVITE_USER_REQUEST:
//         return {
//           ...state,
//           inviteLoading: true,
//           inviteError: null,
//           inviteSuccess: false
//         };
//       case INVITE_USER_SUCCESS:
//         return {
//           ...state,
//           inviteLoading: false,
//           inviteError: null,
//           inviteSuccess: true
//         };
//       case INVITE_USER_FAILURE:
//         return {
//           ...state,
//           inviteLoading: false,
//           inviteError: action.payload,
//           inviteSuccess: false
//         };
//       case RESEND_INVITATION_REQUEST:
//       case CANCEL_INVITATION_REQUEST:
//         return {
//           ...state,
//           actionLoading: true,
//           actionError: null
//         };
//       case RESEND_INVITATION_SUCCESS:
//       case CANCEL_INVITATION_SUCCESS:
//         return {
//           ...state,
//           actionLoading: false,
//           actionError: null
//         };
//       case RESEND_INVITATION_FAILURE:
//       case CANCEL_INVITATION_FAILURE:
//         return {
//           ...state,
//           actionLoading: false,
//           actionError: action.payload
//         };
//       default:
//         return state;
//     }
//   }
  