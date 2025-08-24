import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Grid, 
  Alert,
  CircularProgress 
} from '@mui/material';
import { inviteUser } from '../../redux/actions/invitationActions';

const InviteUserForm = ({ onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const { inviteLoading, inviteError, inviteSuccess } = useSelector(state => state.invitations);
  
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    role: 'employee'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm() || isSubmitting) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Check if we have the required auth data
      const token = localStorage.getItem('token');
      const companyCode = localStorage.getItem('companyCode');
      
      if (!token || !companyCode) {
        setErrors(prev => ({ 
          ...prev, 
          form: 'Authentication information missing. Please log in again.' 
        }));
        return;
      }
      
      console.log('Submitting invitation with auth:', { 
        tokenExists: !!token, 
        companyCode 
      });
      
      await dispatch(inviteUser(formData));
      
      // Reset form after successful submission
      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        role: 'employee'
      });
      
      // Show success message briefly then call onSuccess
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
      }, 1500);
      
    } catch (error) {
      console.error('Error inviting user:', error);
      setErrors(prev => ({ 
        ...prev, 
        form: error.response?.data?.message || 'Failed to send invitation. Please try again.' 
      }));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h6" gutterBottom>
        Invite New User
      </Typography>
      
      {inviteSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          User invitation sent successfully!
        </Alert>
      )}
      
      {(inviteError || errors.form) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {inviteError || errors.form}
        </Alert>
      )}
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
            disabled={inviteLoading || isSubmitting}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            id="middleName"
            label="Middle Name"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
            disabled={inviteLoading || isSubmitting}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
            disabled={inviteLoading || isSubmitting}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            disabled={inviteLoading || isSubmitting}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.role}>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formData.role}
                label="Role"
                onChange={handleChange}
                disabled={inviteLoading || isSubmitting}
              >
                <MenuItem value="employee">Employee</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="hr">HR</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
              {errors.role && (
                <Typography variant="caption" color="error">
                  {errors.role}
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button 
            onClick={onCancel} 
            disabled={inviteLoading || isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={inviteLoading || isSubmitting}
            startIcon={(inviteLoading || isSubmitting) ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {(inviteLoading || isSubmitting) ? 'Sending...' : 'Send Invitation'}
          </Button>
        </Box>
      </Box>
    );
  };
  
  export default InviteUserForm;