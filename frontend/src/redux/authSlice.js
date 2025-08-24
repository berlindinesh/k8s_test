import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../screens/api/auth';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  companyCode: localStorage.getItem('companyCode') || null, // Add this line
  loading: false,
  error: null,
  verificationNeeded: false,
  verificationEmail: '',
  isAuthenticated: !!localStorage.getItem('token')
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('Redux: Attempting login with credentials:', {
        email: credentials.email,
        companyCode: credentials.companyCode,
        passwordProvided: !!credentials.password
      });
      
      const response = await authService.login(credentials);
      
      console.log('Redux: Login response received:', {
        success: response.success,
        userReceived: !!response.user,
        tokenReceived: !!response.token
      });
      
      return response;
    } catch (error) {
      console.error('Redux: Login error:', error);
      
      if (error.response) {
        // Handle verification required case
        if (error.response.status === 403 && error.response.data?.requiresVerification) {
          return rejectWithValue({
            requiresVerification: true,
            email: error.response.data.email || credentials.email,
            message: 'Email not verified. Please verify your email to continue.'
          });
        }
        
        // Return the specific error message from the server
        return rejectWithValue(error.response.data?.message || 
          `Login failed (${error.response.status}): ${error.response.statusText}`);
      } else if (error.request) {
        // The request was made but no response was received
        return rejectWithValue('No response from server. Please check your internet connection.');
      } else {
        // Something happened in setting up the request
        return rejectWithValue(`Error: ${error.message}`);
      }
    }
  }
);


export const registerCompany = createAsyncThunk(
  'auth/register',
  async (registrationData, { rejectWithValue }) => {
    try {
      const response = await authService.registerCompany(registrationData);
      return response;
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.response) {
        return rejectWithValue(err.response.data?.message || 'Registration failed');
      } else {
        return rejectWithValue('Network error. Please try again.');
      }
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    // Clear localStorage first
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('companyCode');
    
    // Return a simple object to indicate success
    return { success: true };
  }
);


export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOtp(email, otp);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
    }
  }
);

export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.resendOtp(email);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to resend OTP');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to process forgot password request');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (resetData, { rejectWithValue }) => {
    try {
      console.log('Resetting password with token and email:', {
        token: resetData.token,
        email: resetData.email,
        companyCode: resetData.companyCode
      });
      
      const response = await authService.resetPassword({
        token: resetData.token,
        email: resetData.email,
        companyCode: resetData.companyCode,
        password: resetData.password
      });
      
      return response;
    } catch (error) {
      console.error('Password reset error:', error);
      
      if (error.response) {
        return rejectWithValue(error.response.data?.message || 
          `Password reset failed (${error.response.status}): ${error.response.statusText}`);
      } else if (error.request) {
        return rejectWithValue('No response from server. Please check your internet connection.');
      } else {
        return rejectWithValue(`Error: ${error.message}`);
      }
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAuthState: (state) => {
      state.loading = false;
      state.error = null;
    },
    setVerificationEmail: (state, action) => {
      state.verificationEmail = action.payload;
    },
    // Renamed from setError to avoid conflicts
    setAuthError: (state, action) => {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.companyCode = action.payload.user?.companyCode || action.meta.arg.companyCode; // Add this line
        state.isAuthenticated = true;
        state.verificationNeeded = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        
        // Check if this is a verification needed error
        if (action.payload && action.payload.requiresVerification) {
          state.verificationNeeded = true;
          state.verificationEmail = action.payload.email;
          state.error = action.payload.message;
        } else {
          state.error = action.payload || 'Login failed';
        }
      })
      
      // Register cases
      .addCase(registerCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerCompany.fulfilled, (state, action) => {
        state.loading = false;
        // If the response includes an email for verification
        if (action.payload.email) {
          state.verificationEmail = action.payload.email;
          state.verificationNeeded = true;
        }
      })
      .addCase(registerCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })
      
      // Logout case
      .addCase(logoutUser.fulfilled, (state) => {
        // Reset the entire state to initial values
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.verificationNeeded = false;
        state.verificationEmail = '';
        state.loading = false;
        state.error = null;
      })
      
      // OTP verification cases
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.verificationNeeded = false;
        // If verification returns user and token, set them
        if (action.payload.token) {
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'OTP verification failed';
      })
      
      // Resend OTP cases
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to resend OTP';
      })
      
      // Forgot password cases
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to process forgot password request';
      })
      
      // Reset password cases
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Password reset failed';
      });
  }
});

export const { clearError, resetAuthState, setVerificationEmail, setAuthError } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectVerificationNeeded = (state) => state.auth.verificationNeeded;
export const selectVerificationEmail = (state) => state.auth.verificationEmail;

// RBAC Selectors
export const selectUserRole = (state) => state.auth.user?.role || null;
export const selectUserPermissions = (state) => state.auth.user?.permissions || [];


export default authSlice.reducer;