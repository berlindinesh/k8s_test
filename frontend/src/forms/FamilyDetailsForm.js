import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  MenuItem, 
  Paper, 
  Typography, 
  Select, 
  FormControl, 
  InputLabel, 
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Grid,
  Card,
  CardContent,
  IconButton,
  Box,
  FormHelperText
} from '@mui/material';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from "../api/axiosInstance";
import { toast } from 'react-toastify';

const FamilyDetailsForm = ({ nextStep, prevStep, handleFormDataChange, savedFamilyDetails, employeeId, savedData }) => {
  // Helper function to convert to sentence case
  const toSentenceCase = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const defaultInitialValues = {
    familyDetails: [
      { 
        name: '', 
        relation: '', 
        dob: '', 
        dependent: '', 
        employed: '', 
        sameCompany: '', 
        empCode: '', 
        department: '' 
      }
    ]
  };

  // Handle different data structures - savedData might be array or object
  const familyArray = Array.isArray(savedData) ? savedData : 
                     (Array.isArray(savedFamilyDetails) ? savedFamilyDetails : 
                     (Array.isArray(savedData?.familyDetails) ? savedData.familyDetails : 
                     defaultInitialValues.familyDetails));

  const initialValues = {
    familyDetails: familyArray
  };
  
  console.log('FamilyDetailsForm initialValues:', initialValues);

  const validationSchema = Yup.object({
    familyDetails: Yup.array().of(
      Yup.object().shape({
        name: Yup.string()
          .matches(/^[A-Za-z\s]+$/, 'Name should only contain alphabets')
          .required('Family member name is required'),
        relation: Yup.string().required('Relation is required'),
        dob: Yup.date()
          .required('Date of birth is required')
          .max(new Date(), 'Date cannot be in the future'),
        dependent: Yup.string().required('Dependent status is required'),
        employed: Yup.string().required('Employment status is required'),
        sameCompany: Yup.string().required('Same company status is required'),
        
        // Conditional validation for employee code and department
        empCode: Yup.string().when('sameCompany', {
          is: 'yes',
          then: () => Yup.string()
            .matches(/^[A-Za-z0-9]+$/, 'Employee code should contain only letters and numbers')
            .required('Employee code is required when working in same company'),
          otherwise: () => Yup.string()
        }),
        department: Yup.string().when('sameCompany', {
          is: 'yes',
          then: () => Yup.string()
            .matches(/^[A-Za-z\s]+$/, 'Department should only contain alphabets')
            .required('Department is required when working in same company'),
          otherwise: () => Yup.string()
        })
      })
    ).min(1, 'At least one family member is required')
  });

  // Custom field component with validation
  const CustomTextField = ({ field, form, label, type = "text", ...props }) => {
    const handleChange = (e) => {
      let value = e.target.value;
      
      // Handle name and department fields - only alphabets with sentence case
      if (field.name.includes('name') || field.name.includes('department')) {
        value = value.replace(/[^A-Za-z\s]/g, '');
        value = toSentenceCase(value);
      }
      
      // Handle employee code - alphanumeric only, uppercase
      if (field.name.includes('empCode')) {
        value = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
      }
      
      // Update the field value
      form.setFieldValue(field.name, value);
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
      <TextField
        {...field}
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
    );
  };

  const handleSubmit = async (values) => {
    try {
      console.log('Form values being submitted:', values);

      const response = await api.post('employees/family-details', {
        employeeId: employeeId,
        familyDetails: values.familyDetails
      });

      if (response.data.success) {
        toast.success('Family details saved successfully');
        nextStep();
      }
    } catch (error) {
      console.error('Error saving family details:', error);
      toast.error(error.response?.data?.error || 'Failed to save family details');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom color="primary">
        Family Information
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
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
            <FieldArray name="familyDetails">
              {({ remove, push }) => (
                <div>
                  {values.familyDetails.map((member, index) => (
                    <Card key={index} sx={{ mb: 3, backgroundColor: '#f8f9fa' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6" color="primary">
                            Family Member {index + 1}
                          </Typography>
                          {values.familyDetails.length > 1 && (
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
                          {/* Family Member Name */}
                          <Grid item xs={12} sm={6}>
                            <Field
                              name={`familyDetails.${index}.name`}
                              component={CustomTextField}
                              label="Family Member Name*"
                            />
                          </Grid>

                          {/* Relation */}
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                              <InputLabel>Relation*</InputLabel>
                              <Field name={`familyDetails.${index}.relation`}>
                                {({ field, form }) => (
                                  <Select
                                    {...field}
                                    label="Relation"
                                    error={Boolean(errors.familyDetails?.[index]?.relation && (touched.familyDetails?.[index]?.relation || values.familyDetails[index].relation))}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                      }
                                    }}
                                  >
                                    <MenuItem value="">Select Relation</MenuItem>
                                    <MenuItem value="father">Father</MenuItem>
                                    <MenuItem value="mother">Mother</MenuItem>
                                    <MenuItem value="brother">Brother</MenuItem>
                                    <MenuItem value="sister">Sister</MenuItem>
                                    <MenuItem value="husband">Husband</MenuItem>    
                                    <MenuItem value="wife">Wife</MenuItem>
                                    <MenuItem value="son">Son</MenuItem>
                                    <MenuItem value="daughter">Daughter</MenuItem>
                                  </Select>
                                )}
                              </Field>
                              {errors.familyDetails?.[index]?.relation && (touched.familyDetails?.[index]?.relation || values.familyDetails[index].relation) && (
                                <FormHelperText error>{errors.familyDetails[index].relation}</FormHelperText>
                              )}
                            </FormControl>
                          </Grid>

                          {/* Date of Birth */}
                          <Grid item xs={12} sm={6}>
                            <Field
                              name={`familyDetails.${index}.dob`}
                              component={CustomTextField}
                              label="Date of Birth*"
                              type="date"
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>

                          {/* Dependent Status */}
                          <Grid item xs={12} sm={6}>
                            <FormControl component="fieldset" size="small">
                              <FormLabel component="legend">Dependent*</FormLabel>
                              <Field name={`familyDetails.${index}.dependent`}>
                                {({ field }) => (
                                  <RadioGroup
                                    {...field}
                                    row
                                  >
                                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="no" control={<Radio />} label="No" />
                                  </RadioGroup>
                                )}
                              </Field>
                              {errors.familyDetails?.[index]?.dependent && (touched.familyDetails?.[index]?.dependent || values.familyDetails[index].dependent) && (
                                <FormHelperText error>{errors.familyDetails[index].dependent}</FormHelperText>
                              )}
                            </FormControl>
                          </Grid>

                          {/* Employment Status */}
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                              <InputLabel>Employment Status*</InputLabel>
                              <Field name={`familyDetails.${index}.employed`}>
                                {({ field }) => (
                                  <Select
                                    {...field}
                                    label="Employment Status"
                                    error={Boolean(errors.familyDetails?.[index]?.employed && (touched.familyDetails?.[index]?.employed || values.familyDetails[index].employed))}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                      }
                                    }}
                                  >
                                    <MenuItem value="">Select Status</MenuItem>
                                    <MenuItem value="employed">Employed</MenuItem>
                                    <MenuItem value="unemployed">Unemployed</MenuItem>
                                  </Select>
                                )}
                              </Field>
                              {errors.familyDetails?.[index]?.employed && (touched.familyDetails?.[index]?.employed || values.familyDetails[index].employed) && (
                                <FormHelperText error>{errors.familyDetails[index].employed}</FormHelperText>
                              )}
                            </FormControl>
                          </Grid>

                          {/* Working in Same Company */}
                          <Grid item xs={12} sm={6}>
                            <FormControl component="fieldset" size="small">
                              <FormLabel component="legend">Working in Same Company*</FormLabel>
                              <Field name={`familyDetails.${index}.sameCompany`}>
                                {({ field, form }) => (
                                  <RadioGroup
                                    {...field}
                                    row
                                    onChange={(e) => {
                                      form.setFieldValue(`familyDetails.${index}.sameCompany`, e.target.value);
                                      // Clear employee code and department if "no" is selected
                                      if (e.target.value === 'no') {
                                        form.setFieldValue(`familyDetails.${index}.empCode`, '');
                                        form.setFieldValue(`familyDetails.${index}.department`, '');
                                      }
                                    }}
                                  >
                                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="no" control={<Radio />} label="No" />
                                  </RadioGroup>
                                )}
                              </Field>
                              {errors.familyDetails?.[index]?.sameCompany && (touched.familyDetails?.[index]?.sameCompany || values.familyDetails[index].sameCompany) && (
                                <FormHelperText error>{errors.familyDetails[index].sameCompany}</FormHelperText>
                              )}
                            </FormControl>
                          </Grid>

                          {/* Employee Code (only if working in same company) */}
                          {values.familyDetails[index].sameCompany === 'yes' && (
                            <>
                              <Grid item xs={12} sm={6}>
                                <Field
                                  name={`familyDetails.${index}.empCode`}
                                  component={CustomTextField}
                                  label="Employee Code*"
                                  placeholder="Enter employee code"
                                />
                              </Grid>

                              {/* Department (only if working in same company) */}
                              <Grid item xs={12} sm={6}>
                                <Field
                                  name={`familyDetails.${index}.department`}
                                  component={CustomTextField}
                                  label="Department*"
                                  placeholder="Enter department name"
                                />
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Add Family Member Button */}
                  <Button
                    type="button"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => push({
                      name: '', 
                      relation: '', 
                      dob: '', 
                      dependent: '', 
                      employed: '', 
                      sameCompany: '', 
                      empCode: '', 
                      department: ''
                    })}
                    sx={{ mb: 3 }}
                  >
                    Add Family Member
                  </Button>
                </div>
              )}
            </FieldArray>

            {/* Submit Buttons */}
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
                disabled={!isValid}
                sx={{ order: { xs: 1, sm: 2 } }}
              >
                Next
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default FamilyDetailsForm;
