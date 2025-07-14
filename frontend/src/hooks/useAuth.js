import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  loginUser, 
  logoutUser, 
  setVerificationEmail,
  setAuthError,
  clearError,
  selectUser,
  selectAuthLoading,
  selectAuthError,
  selectVerificationNeeded,
  selectVerificationEmail
} from '../redux/authSlice';

export const useAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get state from Redux
  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const verificationNeeded = useSelector(selectVerificationNeeded);
  const verificationEmail = useSelector(selectVerificationEmail);

  const login = useCallback(async (credentials) => {
    try {
      console.log('Attempting login with credentials:', {
        email: credentials.email,
        companyCode: credentials.companyCode,
        passwordProvided: !!credentials.password
      });
      
      const resultAction = await dispatch(loginUser(credentials));
      
      console.log('Login response received:', {
        success: loginUser.fulfilled.match(resultAction),
        payload: resultAction.payload
      });
      
      if (loginUser.fulfilled.match(resultAction)) {
        // Clear any pending login data
        sessionStorage.removeItem('pendingLogin');
        
        // Let the component handle navigation
        return resultAction.payload;
      }
      
      return resultAction.payload;
    } catch (error) {
      console.error('Login error in useAuth hook:', error);
      throw error;
    }
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch(logoutUser());
    navigate('/login');
  }, [dispatch, navigate]);
  
  const verifyEmail = useCallback((email) => {
    dispatch(setVerificationEmail(email));
    navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
  }, [dispatch, navigate]);
  
  const setError = useCallback((message) => {
    dispatch(setAuthError(message));
  }, [dispatch]);
  
  const resetLoadingState = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);
  
  return {
    user,
    loading,
    error,
    verificationNeeded,
    verificationEmail,
    login,
    logout,
    verifyEmail,
    setError,
    resetLoadingState
  };
};

