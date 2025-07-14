import { loginUser, logoutUser } from './authSlice';

// Middleware to handle authentication side effects
export const authMiddleware = store => next => action => {
  // Execute the action first to ensure state is updated
  const result = next(action);
  
  // Handle successful login
  if (loginUser.fulfilled.match(action)) {
    console.log('Auth middleware: Login successful, storing token');
    // Store token and user data in localStorage
    if (action.payload && action.payload.token) {
      localStorage.setItem('token', action.payload.token);
      
      if (action.payload.user) {
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('userId', action.payload.user._id || action.payload.user.id);
      }
      
      if (action.meta && action.meta.arg && action.meta.arg.companyCode) {
        localStorage.setItem('companyCode', action.meta.arg.companyCode.toUpperCase());
      }
    }
  }
  
  // We don't need to handle logout here since it's already handled in the thunk
  
  return result;
};

