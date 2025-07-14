import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Paper,
  TextField,
  styled,
  ThemeProvider,
  createTheme,
  useMediaQuery
} from '@mui/material';
import { motion } from 'framer-motion';
import { Velustro } from "uvcanvas";
import { 
  verifyOtp, 
  resendOtp,
  clearError, 
  setAuthError,
  selectAuthLoading,
  selectAuthError,
  selectVerificationEmail
} from '../../../redux/authSlice';

// Create theme
const theme = createTheme();

// Styled components
const PageWrapper = styled('div')({
  minHeight: '100vh',
  width: '100%',
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
});

const BackgroundCanvas = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 0,
});

const ContentContainer = styled(motion.div)(({ theme }) => ({
  zIndex: 1,
  width: '100%',
  maxWidth: '500px',
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
  },
}));

const VerifyPaper = styled(Paper)(({ theme }) => ({
  padding: '32px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  borderRadius: '15px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(10px)',
  [theme.breakpoints.down('sm')]: {
    padding: '24px 16px',
  },
}));

const OtpInputContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  gap: '8px',
  marginTop: '20px',
  marginBottom: '20px',
});

const OtpInput = styled(TextField)({
  width: '50px',
  '& input': {
    textAlign: 'center',
    fontSize: '1.5rem',
    padding: '8px 0',
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '8px',
    '&.Mui-focused fieldset': {
      borderColor: '#4a90e2',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#4a90e2',
  },
});

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [email, setEmail] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Use Redux selectors
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const verificationEmail = useSelector(selectVerificationEmail);
  
  // Media queries for responsive design
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  // Create refs for OTP inputs
  const inputRefs = useRef([]);
  
  // Initialize refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);
  
  // Get email from URL query params or Redux state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    
    if (emailParam) {
      setEmail(emailParam);
    } else if (verificationEmail) {
      setEmail(verificationEmail);
    } else if (location.state && location.state.email) {
      setEmail(location.state.email);
    } else {
      // Try to get from session storage
      const storedEmail = sessionStorage.getItem('verificationEmail');
      if (storedEmail) {
        setEmail(storedEmail);
      } else {
        console.error('No email provided for verification');
        navigate('/login');
      }
    }
  }, [location, verificationEmail, navigate]);
  
  // Timer for resend button
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0) {
      setResendDisabled(false);
    }
  }, [timeLeft]);
  
  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;
    
    // Update OTP state
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Clear error when user types
    if (error) dispatch(clearError());
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };
  
  // Handle key press in OTP input
  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  
  // Validate OTP
  const validateOtp = () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      dispatch(setAuthError('Please enter a valid 6-digit OTP'));
      return false;
    }
    
    return true;
  };
  
  // Handle verify button click
  const handleVerify = async () => {
    if (!validateOtp()) return;
    
    try {
      const resultAction = await dispatch(verifyOtp({ email, otp: otp.join('') }));
      
      if (verifyOtp.fulfilled.match(resultAction)) {
        // If verification returns a token, redirect to dashboard
        if (resultAction.payload.token) {
          navigate('/Dashboards');
        } else {
          // Otherwise redirect to login
          navigate('/login');
        }
      }
    } catch (err) {
      console.error('OTP verification error:', err);
    }
  };
  
  // Handle resend OTP
  const handleResend = async () => {
    if (!email) {
      dispatch(setAuthError('Email is required for resending OTP'));
      return;
    }
    
    try {
      await dispatch(resendOtp(email));
      
      // Start countdown
      setTimeLeft(60);
      setResendDisabled(true);
    } catch (err) {
      console.error('Resend OTP error:', err);
    }
  };
  
  return (
    <ThemeProvider theme={theme}>
      <PageWrapper>
        <BackgroundCanvas>
          <Velustro />
        </BackgroundCanvas>
        
        <ContentContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <VerifyPaper elevation={3}>
            <Typography 
              variant={isMobile ? "h5" : "h4"} 
              component="h1" 
              gutterBottom
              align="center"
              sx={{ fontWeight: 600 }}
            >
              Verify Your Email
            </Typography>
            
            <Typography 
              variant="body1" 
              align="center" 
              sx={{ 
                mb: 3, 
                color: '#555',
                fontSize: isMobile ? '0.9rem' : '1rem',
                maxWidth: '90%'
              }}
            >
              We've sent a 6-digit verification code to <strong>{email}</strong>. 
              Please enter the code below to verify your email address.
            </Typography>
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  width: '100%', 
                  mb: 3,
                  borderRadius: '8px'
                }}
              >
                {error}
              </Alert>
            )}
            
            <OtpInputContainer>
              {otp.map((digit, index) => (
                <OtpInput
                  key={index}
                  inputRef={(el) => (inputRefs.current[index] = el)}
                  variant="outlined"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  inputProps={{
                    maxLength: 1,
                    inputMode: 'numeric',
                    pattern: '[0-9]*'
                  }}
                  disabled={loading}
                  autoFocus={index === 0}
                  size={isMobile ? "small" : "medium"}
                />
              ))}
            </OtpInputContainer>
            
            <motion.div 
              whileHover={{ scale: loading ? 1 : 1.02 }} 
              whileTap={{ scale: loading ? 1 : 0.98 }}
              style={{ width: '100%' }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleVerify}
                disabled={loading || otp.join('').length !== 6}
                sx={{ 
                  mt: 2, 
                  mb: 2, 
                  width: '100%',
                  py: isMobile ? 1.2 : 1.5,
                  backgroundColor: '#4a90e2',
                  borderRadius: '8px',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  boxShadow: '0 4px 10px rgba(74, 144, 226, 0.3)',
                  '&:hover': {
                    backgroundColor: loading ? '#4a90e2' : '#357abd',
                  },
                  position: 'relative'
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress 
                      size={24} 
                      sx={{ 
                        color: 'white',
                        position: 'absolute',
                        left: 'calc(50% - 12px)',
                        top: 'calc(50% - 12px)'
                      }} 
                    />
                    <span style={{ visibility: 'hidden' }}>Verify Email</span>
                  </>
                ) : 'Verify Email'}
              </Button>
            </motion.div>
            
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 1,
                  color: '#555',
                  fontSize: isMobile ? '0.85rem' : '0.9rem'
                }}
              >
                Didn't receive the code?
              </Typography>
              
              <Button
                variant="text"
                color="primary"
                onClick={handleResend}
                disabled={loading || resendDisabled}
                sx={{ 
                  textTransform: 'none',
                  fontSize: isMobile ? '0.85rem' : '0.9rem',
                  fontWeight: 500
                }}
              >
                {resendDisabled
                  ? `Resend code in ${timeLeft} seconds`
                  : 'Resend verification code'}
              </Button>
            </Box>
            
            <Box sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate('/login')}
                sx={{ 
                  textTransform: 'none',
                  borderRadius: '8px',
                  fontSize: isMobile ? '0.85rem' : '0.9rem',
                  borderColor: '#4a90e2',
                  color: '#4a90e2',
                  '&:hover': {
                    backgroundColor: 'rgba(74, 144, 226, 0.08)',
                    borderColor: '#357abd'
                  }
                }}
              >
                Back to Login
              </Button>
            </Box>
          </VerifyPaper>
        </ContentContainer>
      </PageWrapper>
    </ThemeProvider>
  );
};

export default VerifyOtpPage;
