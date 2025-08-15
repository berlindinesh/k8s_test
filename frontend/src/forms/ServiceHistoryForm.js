import React, { useState } from 'react';
import { 
  Button, 
  Paper, 
  Typography, 
  FormControl, 
  Radio, 
  RadioGroup, 
  FormControlLabel,
  FormLabel,
  Grid,
  Card,
  CardContent,
  Box,
  IconButton,
  FormHelperText,
  TextField
} from '@mui/material';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from "../api/axiosInstance";
import { toast } from 'react-toastify';

const ServiceHistoryForm = ({ nextStep, prevStep, savedServiceHistory, employeeId, savedData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to convert to sentence case
  const toSentenceCase = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const defaultInitialValues = {
    hasPreviousExperience: 'no',
    serviceHistory: [
      {
        organization: '',
        dateOfJoining: '',
        lastWorkingDay: '',
        totalExperience: '',
        department: ''
      }
    ]
  };

  // Handle different data structures for savedData
  const serviceArray = Array.isArray(savedData?.serviceHistory) ? savedData.serviceHistory :
                      (Array.isArray(savedServiceHistory?.serviceHistory) ? savedServiceHistory.serviceHistory :
                      defaultInitialValues.serviceHistory);

  const initialValues = {
    hasPreviousExperience: savedData?.hasPreviousExperience || savedServiceHistory?.hasPreviousExperience || 'no',
    serviceHistory: serviceArray
  };
  
  console.log('ServiceHistoryForm initialValues:', initialValues);

  const validationSchema = Yup.object().shape({
    hasPreviousExperience: Yup.string().required('Please select if you have previous work experience'),
    
    // Conditional validation for service history
    serviceHistory: Yup.array().when('hasPreviousExperience', {
      is: 'yes',
      then: () => Yup.array().of(
        Yup.object().shape({
          organization: Yup.string()
            .matches(/^[A-Za-z0-9\s]+$/, 'Organization name should only contain alphabets and numbers')
            .required('Organization name is required'),
          dateOfJoining: Yup.date()
            .required('Date of joining is required')
            .max(new Date(), 'Date of joining cannot be in the future'),
          lastWorkingDay: Yup.date()
            .required('Last working day is required')
            .min(Yup.ref('dateOfJoining'), 'Last working day must be after date of joining')
            .max(new Date(), 'Last working day cannot be in the future'),
          department: Yup.string()
            .matches(/^[A-Za-z\s]+$/, 'Department should only contain alphabets')
            .required('Department is required')
        })
      ).min(1, 'At least one service history record is required'),
      otherwise: () => Yup.array()
    })
  });

  // Custom field component with validation
  const CustomTextField = ({ field, form, label, type = "text", ...props }) => {
    const handleChange = (e) => {
      let value = e.target.value;
      
      // Handle organization field - alphabets and numbers with sentence case
      if (field.name.includes('organization')) {
        value = value.replace(/[^A-Za-z0-9\s]/g, '');
        value = toSentenceCase(value);
      }
      
      // Handle department field - only alphabets with sentence case
      if (field.name.includes('department')) {
        value = value.replace(/[^A-Za-z\s]/g, '');
        value = toSentenceCase(value);
      }
      
      // Update the field value
      form.setFieldValue(field.name, value);
      
      // Calculate total experience if both dates are available
      if (field.name.includes('dateOfJoining') || field.name.includes('lastWorkingDay')) {
        const fieldPath = field.name.split('.');
        const index = fieldPath[1];
        const currentValues = form.values.serviceHistory[index];
        
        let joiningDate, lastWorkingDate;
        
        if (field.name.includes('dateOfJoining')) {
          joiningDate = new Date(value);
          lastWorkingDate = new Date(currentValues.lastWorkingDay);
        } else {
          joiningDate = new Date(currentValues.dateOfJoining);
          lastWorkingDate = new Date(value);
        }
        
        if (joiningDate && lastWorkingDate && !isNaN(joiningDate) && !isNaN(lastWorkingDate) && lastWorkingDate > joiningDate) {
          const diffTime = lastWorkingDate - joiningDate;
          const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
          const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
          const diffDays = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
          
          form.setFieldValue(
            `serviceHistory.${index}.totalExperience`,
            `${diffYears} years ${diffMonths} months ${diffDays} days`
          );
        }
      }
    };

    // Get nested error for array fields
    const fieldPath = field.name.split('.');
    let fieldError = form.errors;
    let fieldValue = form.values;
    
    for (const path of fieldPath) {
      fieldError = fieldError?.[path];
      fieldValue = fieldValue?.[path];
    }

    const hasError = fieldError && (form.touched[field.name] || fieldValue);

    return (
      <Field
        name={field.name}
        render={({ field: fieldProps }) => (
          <TextField
            {...fieldProps}
            {...props}
            label={label}
            type={type}
            onChange={handleChange}
            error={hasError}
            helperText={hasError ? fieldError : ""}
            fullWidth
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              }
            }}
          />
        )}
      />
    );
  };

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      console.log('Form values being submitted:', values);

      const response = await api.post('employees/service-history', {
        employeeId: employeeId,
        hasServiceHistory: values.hasPreviousExperience === 'yes',
        serviceHistory: values.hasPreviousExperience === 'yes' ? values.serviceHistory : []
      });

      if (response.data.success) {
        toast.success('Service history saved successfully');
        nextStep();
      }
    } catch (error) {
      console.error('Error saving service history:', error);
      toast.error(error.response?.data?.error || 'Failed to save service history');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom color="primary">
        Employee Service History
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validate={(values) => {
          // This will trigger validation on every change for immediate error display
          try {
            validationSchema.validateSync(values, { abortEarly: false });
          } catch (err) {
            const errors = {};
            err.inner.forEach((error) => {
              if (error.path) {
                errors[error.path] = error.message;
              }
            });
            return errors;
          }
        }}
      >
        {({ values, errors, touched, setFieldValue, isValid }) => (
          <Form>
            <Grid container spacing={3}>
              
              {/* Previous Experience Question */}
              <Grid item xs={12}>
                <FormControl component="fieldset" error={errors.hasPreviousExperience && (touched.hasPreviousExperience || values.hasPreviousExperience)}>
                  <FormLabel component="legend" sx={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
                    Do you have previous work experience?*
                  </FormLabel>
                  <Field name="hasPreviousExperience">
                    {({ field }) => (
                      <RadioGroup
                        {...field}
                        row
                        sx={{ mt: 1 }}
                        onChange={(e) => {
                          setFieldValue('hasPreviousExperience', e.target.value);
                          // Reset service history when switching to "no"
                          if (e.target.value === 'no') {
                            setFieldValue('serviceHistory', []);
                          } else {
                            setFieldValue('serviceHistory', initialValues.serviceHistory);
                          }
                        }}
                      >
                        <FormControlLabel 
                          value="yes" 
                          control={<Radio />} 
                          label="Yes" 
                          sx={{ mr: 4 }}
                        />
                        <FormControlLabel 
                          value="no" 
                          control={<Radio />} 
                          label="No" 
                        />
                      </RadioGroup>
                    )}
                  </Field>
                  {errors.hasPreviousExperience && (touched.hasPreviousExperience || values.hasPreviousExperience) && (
                    <FormHelperText>{errors.hasPreviousExperience}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Service History Details (only if "yes" is selected) */}
              {values.hasPreviousExperience === 'yes' && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 3 }}>
                    Service History Details
                  </Typography>
                  
                  <FieldArray name="serviceHistory">
                    {({ remove, push }) => (
                      <div>
                        {values.serviceHistory.map((service, index) => (
                          <Card key={index} sx={{ mb: 3, backgroundColor: '#f8f9fa' }}>
                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
                                  Previous Organization {index + 1}*
                                </Typography>
                                {values.serviceHistory.length > 1 && (
                                  <IconButton 
                                    onClick={() => remove(index)}
                                    color="error"
                                    size="small"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                )}
                              </Box>

                              <Grid container spacing={2}>
                                {/* Organization Name */}
                                <Grid item xs={12} sm={6}>
                                  <CustomTextField
                                    field={{ name: `serviceHistory.${index}.organization` }}
                                    form={{ setFieldValue, values, errors, touched }}
                                    label="Organization Name*"
                                  />
                                </Grid>

                                {/* Department */}
                                <Grid item xs={12} sm={6}>
                                  <CustomTextField
                                    field={{ name: `serviceHistory.${index}.department` }}
                                    form={{ setFieldValue, values, errors, touched }}
                                    label="Department*"
                                  />
                                </Grid>

                                {/* Date of Joining */}
                                <Grid item xs={12} sm={4}>
                                  <CustomTextField
                                    field={{ name: `serviceHistory.${index}.dateOfJoining` }}
                                    form={{ setFieldValue, values, errors, touched }}
                                    label="Date of Joining*"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                  />
                                </Grid>

                                {/* Last Working Day */}
                                <Grid item xs={12} sm={4}>
                                  <CustomTextField
                                    field={{ name: `serviceHistory.${index}.lastWorkingDay` }}
                                    form={{ setFieldValue, values, errors, touched }}
                                    label="Last Working Day*"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                  />
                                </Grid>

                                {/* Total Experience (Auto-calculated) */}
                                <Grid item xs={12} sm={4}>
                                  <Field
                                    name={`serviceHistory.${index}.totalExperience`}
                                    render={({ field }) => (
                                      <TextField
                                        {...field}
                                        label="Total Experience"
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                          '& .MuiOutlinedInput-root': {
                                            borderRadius: '8px',
                                            backgroundColor: '#f5f5f5',
                                          }
                                        }}
                                      />
                                    )}
                                  />
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        ))}
                        
                        {/* Add Service Entry Button */}
                        <Button
                          type="button"
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={() => push({
                            organization: '',
                            dateOfJoining: '',
                            lastWorkingDay: '',
                            totalExperience: '',
                            department: ''
                          })}
                          sx={{ mb: 3 }}
                        >
                          Add Previous Organization
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                </Grid>
              )}

              {/* No Previous Experience Message */}
              {values.hasPreviousExperience === 'no' && (
                <Grid item xs={12}>
                  <Card sx={{ backgroundColor: '#e8f5e8', textAlign: 'center', py: 4 }}>
                    <CardContent>
                      <Typography variant="h6" color="success.main" gutterBottom>
                        No Previous Work Experience
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        You have indicated that you do not have any previous work experience.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Submit Buttons */}
              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mt: 3,
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2
                }}>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={prevStep}
                    sx={{ order: { xs: 2, sm: 1 } }}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    disabled={!isValid || isSubmitting}
                    sx={{ order: { xs: 1, sm: 2 } }}
                  >
                    {isSubmitting ? 'Saving...' : 'Next'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default ServiceHistoryForm;
