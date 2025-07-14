import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCompanySettings, 
  updateCompanySettings 
} from '../../redux/actions/companySettingsActions';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  FormHelperText,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';

const CompanySettings = () => {
  const dispatch = useDispatch();
  const { settings, loading, error, updateSuccess } = useSelector(state => state.companySettings);
  
  // Local state for form values
  const [formValues, setFormValues] = useState({
    casualLeave: '',
    sickLeave: '',
    earnedLeave: '',
    workingHoursStart: '',
    workingHoursEnd: '',
    workingDays: []
  });
  
  // Alert state
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  
  // Days of the week for selection
  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];
  
  // Fetch company settings on component mount
  useEffect(() => {
    dispatch(fetchCompanySettings())
      .catch(error => {
        console.error('Error fetching company settings:', error);
        showAlert('Failed to load company settings', 'error');
      });
  }, [dispatch]);
  
  // Update local state when settings are loaded from Redux
  useEffect(() => {
    if (settings) {
      setFormValues({
        casualLeave: settings.leavePolicy?.casualLeavePerYear || '',
        sickLeave: settings.leavePolicy?.sickLeavePerYear || '',
        earnedLeave: settings.leavePolicy?.earnedLeavePerYear || '',
        workingHoursStart: settings.workingHours?.start || '',
        workingHoursEnd: settings.workingHours?.end || '',
        workingDays: settings.workingDays || []
      });
    }
  }, [settings]);
  
  // Show alert when update is successful or fails
  useEffect(() => {
    if (updateSuccess) {
      showAlert('Company settings updated successfully', 'success');
    }
  }, [updateSuccess]);
  
  // Show alert when there's an error
  useEffect(() => {
    if (error) {
      showAlert(error, 'error');
    }
  }, [error]);
  
  // Helper function to show alerts
  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setOpenAlert(true);
  };
  
    // Handle form input changes
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues({
          ...formValues,
          [name]: value
        });
      };
      
      // Handle working days selection
      const handleWorkingDaysChange = (event) => {
        setFormValues({
          ...formValues,
          workingDays: event.target.value
        });
      };
      
      // Handle form submission
      const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
          // Prepare data for API
          const settingsData = {
            leavePolicy: {
              casualLeavePerYear: parseInt(formValues.casualLeave),
              sickLeavePerYear: parseInt(formValues.sickLeave),
              earnedLeavePerYear: parseInt(formValues.earnedLeave)
            },
            workingHours: {
              start: formValues.workingHoursStart,
              end: formValues.workingHoursEnd
            },
            workingDays: formValues.workingDays
          };
          
          // Dispatch update action
          await dispatch(updateCompanySettings(settingsData));
        } catch (error) {
          console.error('Error updating company settings:', error);
        }
      };
      
      // Handle alert close
      const handleAlertClose = () => {
        setOpenAlert(false);
      };
      
      return (
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Company Settings
          </Typography>
          
          {/* Alert for success/error messages */}
          <Snackbar 
            open={openAlert} 
            autoHideDuration={6000} 
            onClose={handleAlertClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={handleAlertClose} severity={alertSeverity}>
              {alertMessage}
            </Alert>
          </Snackbar>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader title="Leave Policy" />
                <Divider />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Casual Leave (days per year)"
                        name="casualLeave"
                        type="number"
                        value={formValues.casualLeave}
                        onChange={handleChange}
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Sick Leave (days per year)"
                        name="sickLeave"
                        type="number"
                        value={formValues.sickLeave}
                        onChange={handleChange}
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Earned Leave (days per year)"
                        name="earnedLeave"
                        type="number"
                        value={formValues.earnedLeave}
                        onChange={handleChange}
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              
              <Box sx={{ mt: 3 }}>
                <Card>
                  <CardHeader title="Working Hours" />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Start Time (HH:MM)"
                          name="workingHoursStart"
                          value={formValues.workingHoursStart}
                          onChange={handleChange}
                          placeholder="09:00"
                          inputProps={{
                            pattern: "^([01]?[0-9]|2[0-3]):[0-5][0-9]$"
                          }}
                          helperText="Format: HH:MM (24-hour)"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="End Time (HH:MM)"
                          name="workingHoursEnd"
                          value={formValues.workingHoursEnd}
                          onChange={handleChange}
                          placeholder="18:00"
                          inputProps={{
                            pattern: "^([01]?[0-9]|2[0-3]):[0-5][0-9]$"
                          }}
                          helperText="Format: HH:MM (24-hour)"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Box>
              
              <Box sx={{ mt: 3 }}>
                <Card>
                  <CardHeader title="Working Days" />
                  <Divider />
                  <CardContent>
                    <FormControl fullWidth>
                      <InputLabel id="working-days-label">Working Days</InputLabel>
                      <Select
                        labelId="working-days-label"
                        id="working-days"
                        multiple
                        value={formValues.workingDays}
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
                      <FormHelperText>Select all working days for your company</FormHelperText>
                    </FormControl>
                  </CardContent>
                </Card>
              </Box>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save Settings'}
                </Button>
              </Box>
            </form>
          )}
        </Box>
      );
    };
    
    export default CompanySettings;
    
