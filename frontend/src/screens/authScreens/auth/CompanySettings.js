import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';

const CompanySettings = () => {
  const [companyData, setCompanyData] = useState({
    name: '',
    companyCode: '',
    industry: '',
    contactEmail: '',
    contactPhone: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
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
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchCompanyDetails();
  }, []);

  const fetchCompanyDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/company');
      setCompanyData(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch company details. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  const handleLeavePolicyChange = (e) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        leavePolicy: {
          ...prev.settings.leavePolicy,
          [name]: parseInt(value, 10)
        }
      }
    }));
  };

  const handleWorkingHoursChange = (e) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        workingHours: {
          ...prev.settings.workingHours,
          [name]: value
        }
      }
    }));
  };

  const handleWorkingDaysChange = (e) => {
    setCompanyData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        workingDays: e.target.value
      }
    }));
  };

  const saveCompanyDetails = async () => {
    try {
      setError('');
      setSuccess('');
      
      await axios.put('/api/company', {
        name: companyData.name,
        industry: companyData.industry,
        contactEmail: companyData.contactEmail,
        contactPhone: companyData.contactPhone,
        address: companyData.address
      });
      
      setSuccess('Company details updated successfully');
    } catch (error) {
      setError('Failed to update company details. Please try again.');
      console.error(error);
    }
  };

  const saveCompanySettings = async () => {
    try {
      setError('');
      setSuccess('');
      
      await axios.put('/api/company/settings', {
        leavePolicy: companyData.settings.leavePolicy,
        workingHours: companyData.settings.workingHours,
        workingDays: companyData.settings.workingDays
      });
      
      setSuccess('Company settings updated successfully');
    } catch (error) {
      setError('Failed to update company settings. Please try again.');
      console.error(error);
    }
  };

  if (loading) return <Typography>Loading company details...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Company Settings
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <Grid container spacing={3}>
        {/* Company Details */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Company Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  name="name"
                  value={companyData.name}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
              <TextField
                  fullWidth
                  label="Company Code"
                  name="companyCode"
                  value={companyData.companyCode}
                  disabled
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Industry"
                  name="industry"
                  value={companyData.industry}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contact Email"
                  name="contactEmail"
                  value={companyData.contactEmail}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contact Phone"
                  name="contactPhone"
                  value={companyData.contactPhone}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
            </Grid>
            
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Address
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street"
                  name="street"
                  value={companyData.address.street}
                  onChange={handleAddressChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={companyData.address.city}
                  onChange={handleAddressChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="State/Province"
                  name="state"
                  value={companyData.address.state}
                  onChange={handleAddressChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={companyData.address.country}
                  onChange={handleAddressChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Zip/Postal Code"
                  name="zipCode"
                  value={companyData.address.zipCode}
                  onChange={handleAddressChange}
                  margin="normal"
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                onClick={saveCompanyDetails}
              >
                Save Company Details
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Company Settings */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Company Settings
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Leave Policy
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Casual Leave Per Year"
                  name="casualLeavePerYear"
                  type="number"
                  value={companyData.settings.leavePolicy.casualLeavePerYear}
                  onChange={handleLeavePolicyChange}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Sick Leave Per Year"
                  name="sickLeavePerYear"
                  type="number"
                  value={companyData.settings.leavePolicy.sickLeavePerYear}
                  onChange={handleLeavePolicyChange}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Earned Leave Per Year"
                  name="earnedLeavePerYear"
                  type="number"
                  value={companyData.settings.leavePolicy.earnedLeavePerYear}
                  onChange={handleLeavePolicyChange}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
            </Grid>
            
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Working Hours
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Start Time"
                  name="start"
                  type="time"
                  value={companyData.settings.workingHours.start}
                  onChange={handleWorkingHoursChange}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="End Time"
                  name="end"
                  type="time"
                  value={companyData.settings.workingHours.end}
                  onChange={handleWorkingHoursChange}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Working Days
            </Typography>
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Working Days</InputLabel>
              <Select
                multiple
                value={companyData.settings.workingDays}
                onChange={handleWorkingDaysChange}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {daysOfWeek.map((day) => (
                  <MenuItem key={day} value={day}>
                    {day}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                onClick={saveCompanySettings}
              >
                Save Company Settings
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompanySettings;
