import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  UPDATE_USER_ROLE_REQUEST,
  UPDATE_USER_ROLE_SUCCESS,
  UPDATE_USER_ROLE_FAILURE,
  UPDATE_USER_STATUS_REQUEST,
  UPDATE_USER_STATUS_SUCCESS,
  UPDATE_USER_STATUS_FAILURE,
  UPDATE_USER_PROFILE_REQUEST,
  UPDATE_USER_PROFILE_SUCCESS,
  UPDATE_USER_PROFILE_FAILURE,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILURE,
  RESET_USER_PASSWORD_REQUEST,
  RESET_USER_PASSWORD_SUCCESS,
  RESET_USER_PASSWORD_FAILURE,
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAILURE
} from '../actions/types';

const initialState = {
  users: [],
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
  deleteLoading: false,
  deleteError: null,
  resetPasswordLoading: false,
  resetPasswordError: null,
  passwordChange: {
    loading: false,
    success: false,
    error: null
  },
  lastUpdated: null
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    // Fetch Users
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload,
        error: null,
        lastUpdated: new Date().toISOString()
      };
    case FETCH_USERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        users: []
      };

    // Update User Role
    case UPDATE_USER_ROLE_REQUEST:
      return {
        ...state,
        updateLoading: true,
        updateError: null
      };
    case UPDATE_USER_ROLE_SUCCESS:
      return {
        ...state,
        updateLoading: false,
        updateError: null,
        // Optionally update the user in the users array
        users: state.users.map(user => 
          user._id === action.payload.user?.id 
            ? { ...user, ...action.payload.user }
            : user
        )
      };
    case UPDATE_USER_ROLE_FAILURE:
      return {
        ...state,
        updateLoading: false,
        updateError: action.payload
      };

    // Update User Status
    case UPDATE_USER_STATUS_REQUEST:
      return {
        ...state,
        updateLoading: true,
        updateError: null
      };
    case UPDATE_USER_STATUS_SUCCESS:
      return {
        ...state,
        updateLoading: false,
        updateError: null,
        users: state.users.map(user => 
          user._id === action.payload.user?.id 
            ? { ...user, ...action.payload.user }
            : user
        )
      };
    case UPDATE_USER_STATUS_FAILURE:
      return {
        ...state,
        updateLoading: false,
        updateError: action.payload
      };

    // Update User Profile
    case UPDATE_USER_PROFILE_REQUEST:
      return {
        ...state,
        updateLoading: true,
        updateError: null
      };
    case UPDATE_USER_PROFILE_SUCCESS:
      return {
        ...state,
        updateLoading: false,
        updateError: null,
        users: state.users.map(user => 
          user._id === action.payload.user?.id 
            ? { ...user, ...action.payload.user }
            : user
        )
      };
    case UPDATE_USER_PROFILE_FAILURE:
      return {
        ...state,
        updateLoading: false,
        updateError: action.payload
      };

    // Delete User
    case DELETE_USER_REQUEST:
      return {
        ...state,
        deleteLoading: true,
        deleteError: null
      };
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        deleteLoading: false,
        deleteError: null,
        users: state.users.filter(user => user._id !== action.payload.userId)
      };
    case DELETE_USER_FAILURE:
      return {
        ...state,
        deleteLoading: false,
        deleteError: action.payload
      };

    // Reset User Password
    case RESET_USER_PASSWORD_REQUEST:
      return {
        ...state,
        resetPasswordLoading: true,
        resetPasswordError: null
      };
    case RESET_USER_PASSWORD_SUCCESS:
      return {
        ...state,
        resetPasswordLoading: false,
        resetPasswordError: null
      };
    case RESET_USER_PASSWORD_FAILURE:
      return {
        ...state,
        resetPasswordLoading: false,
        resetPasswordError: action.payload
      };

    // Change Password
    case CHANGE_PASSWORD_REQUEST:
      return {
        ...state,
        passwordChange: {
          loading: true,
          success: false,
          error: null
        }
      };
    case CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        passwordChange: {
          loading: false,
          success: true,
          error: null
        }
      };
    case CHANGE_PASSWORD_FAILURE:
      return {
        ...state,
        passwordChange: {
          loading: false,
          success: false,
          error: action.payload
        }
      };

    default:
      return state;
  }
}

// import {
//     FETCH_USERS_REQUEST,
//     FETCH_USERS_SUCCESS,
//     FETCH_USERS_FAILURE,
//     UPDATE_USER_ROLE_REQUEST,
//     UPDATE_USER_ROLE_SUCCESS,
//     UPDATE_USER_ROLE_FAILURE,
//     UPDATE_USER_STATUS_REQUEST,
//     UPDATE_USER_STATUS_SUCCESS,
//     UPDATE_USER_STATUS_FAILURE,
//     CHANGE_PASSWORD_REQUEST,
//     CHANGE_PASSWORD_SUCCESS,
//     CHANGE_PASSWORD_FAILURE
//   } from '../actions/types';
  
//   const initialState = {
//     users: [],
//     loading: false,
//     error: null,
//     updateLoading: false,
//     updateError: null,
//     passwordChange: {
//       loading: false,
//       success: false,
//       error: null
//     }
//   };
  
//   export default function userReducer(state = initialState, action) {
//     switch (action.type) {
//       case FETCH_USERS_REQUEST:
//         return {
//           ...state,
//           loading: true,
//           error: null
//         };
//       case FETCH_USERS_SUCCESS:
//         return {
//           ...state,
//           loading: false,
//           users: action.payload,
//           error: null
//         };
//       case FETCH_USERS_FAILURE:
//         return {
//           ...state,
//           loading: false,
//           error: action.payload
//         };
//       case UPDATE_USER_ROLE_REQUEST:
//       case UPDATE_USER_STATUS_REQUEST:
//         return {
//           ...state,
//           updateLoading: true,
//           updateError: null
//         };
//       case UPDATE_USER_ROLE_SUCCESS:
//       case UPDATE_USER_STATUS_SUCCESS:
//         return {
//           ...state,
//           updateLoading: false,
//           updateError: null
//         };
//       case UPDATE_USER_ROLE_FAILURE:
//       case UPDATE_USER_STATUS_FAILURE:
//         return {
//           ...state,
//           updateLoading: false,
//           updateError: action.payload
//         };
//         case CHANGE_PASSWORD_REQUEST:
//           return {
//             ...state,
//             passwordChange: {
//               loading: true,
//               success: false,
//               error: null
//             }
//           };
//         case CHANGE_PASSWORD_SUCCESS:
//           return {
//             ...state,
//             passwordChange: {
//               loading: false,
//               success: true,
//               error: null
//             }
//           };
//         case CHANGE_PASSWORD_FAILURE:
//           return {
//             ...state,
//             passwordChange: {
//               loading: false,
//               success: false,
//               error: action.payload
//             }
//           };
//       default:
//         return state;
//     }
//   }
  