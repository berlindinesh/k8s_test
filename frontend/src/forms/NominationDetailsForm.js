import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Grid, 
  Typography, 
  Container, 
  Box,
  Paper, 
  IconButton, 
  Alert, 
  MenuItem, 
  FormControlLabel,
  Checkbox, 
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Card,
  CardContent
} from '@mui/material';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { PersonAdd, Add, Delete } from '@mui/icons-material';
import api from "../api/axiosInstance";
import { toast } from 'react-toastify';
import pincodeSearch from "india-pincode-search";

// Helper function to convert to sentence case (defined outside component)
const toSentenceCase = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const NominationDetailsForm = ({ onComplete, prevStep, employeeId, savedData }) => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [totalPercentage, setTotalPercentage] = useState(0);
  const [employeeAddress, setEmployeeAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);



  // Pincode auto-fetch function
  const fetchAddressFromPincode = (pincode, setFieldValue, index) => {
    if (pincode && pincode.length === 6) {
      try {
        const results = pincodeSearch.search(pincode);
        
        if (results && results.length > 0) {
          const pincodeInfo = results[0];
          console.log("Pincode API response:", pincodeInfo);
          
          const city = toSentenceCase(pincodeInfo.district || "");
          const state = toSentenceCase(pincodeInfo.state || "");
          const country = "India";
          
          // Set values for the specific nominee
          setFieldValue(`nominees.${index}.city`, city);
          setFieldValue(`nominees.${index}.state`, state);
          
          toast.success(`Auto-filled: City: ${city}, State: ${state}`);
        } else {
          toast.error("Invalid pincode. Please check and try again.");
        }
      } catch (error) {
        console.error("Error fetching address from pincode:", error);
        toast.error("Failed to fetch address details from pincode");
      }
    }
  };

  useEffect(() => {
    const fetchEmployeeData = async () => {
      const storedEmployeeId = localStorage.getItem('Emp_ID') || employeeId;
      
      if (!storedEmployeeId) {
        console.log('No employee ID available, skipping data fetch');
        return;
      }
      
      try {
        console.log('Fetching employee data for ID:', storedEmployeeId);
        const response = await api.get(`employees/get-employee/${storedEmployeeId}`);
        
        if (response.data.success && response.data.data) {
          const { familyDetails, addressDetails } = response.data.data;
          
          if (familyDetails) {
            setFamilyMembers(familyDetails);
          }
          
          if (addressDetails && addressDetails.presentAddress) {
            setEmployeeAddress(addressDetails.presentAddress);
          }
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
        toast.error('Failed to fetch employee data');
      }
    };
    fetchEmployeeData();
  }, [employeeId]);

  const defaultInitialValues = {
    nominees: [
      {
        name: '',
        relation: '',
        nominationPercentage: 0,
        presentAddress: '',
        city: '',
        district: '',
        state: '',
        pinCode: '',
        phoneNumber: '',
        sameAsEmployeeAddress: false
      }
    ]
  };

  // Handle different data structures for savedData
  const nomineesArray = Array.isArray(savedData?.nominees) ? savedData.nominees : 
                       (Array.isArray(savedData) ? savedData : 
                       defaultInitialValues.nominees);

  const initialValues = {
    nominees: nomineesArray
  };
  
  console.log('NominationDetailsForm initialValues:', initialValues);

  const validationSchema = Yup.object().shape({
    nominees: Yup.array().of(
      Yup.object().shape({
        name: Yup.string()
          .matches(/^[A-Za-z\s]+$/, 'Name should only contain alphabets')
          .required('Nominee name is required'),
        relation: Yup.string().required('Relation is required'),
        nominationPercentage: Yup.number()
          .required('Nomination percentage is required')
          .min(1, 'Percentage must be greater than 0')
          .max(100, 'Percentage cannot exceed 100'),
        presentAddress: Yup.string().required('Address is required'),
        city: Yup.string()
          .matches(/^[A-Za-z\s]+$/, 'City should only contain alphabets')
          .required('City is required'),
        district: Yup.string()
          .matches(/^[A-Za-z\s]+$/, 'District should only contain alphabets')
          .required('District is required'),
        state: Yup.string()
          .matches(/^[A-Za-z\s]+$/, 'State should only contain alphabets')
          .required('State is required'),
        pinCode: Yup.string()
          .matches(/^[0-9]{6}$/, 'PIN code must be exactly 6 digits')
          .required('PIN code is required'),
        phoneNumber: Yup.string()
          .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
          .required('Phone number is required')
      })
    ).min(1, 'At least one nominee is required')
  });

  // Custom field component with validation
  const CustomTextField = ({ field, form, label, type = "text", ...props }) => {
    const handleChange = (e) => {
      let value = e.target.value;
      
      // Handle name, city, district, state fields - only alphabets with sentence case
      if (field.name.includes('name') || field.name.includes('city') || 
          field.name.includes('district') || field.name.includes('state')) {
        value = value.replace(/[^A-Za-z\s]/g, '');
        value = toSentenceCase(value);
      }
      
      // Handle phone number - only numeric, max 10 digits
      if (field.name.includes('phoneNumber')) {
        value = value.replace(/[^0-9]/g, '').slice(0, 10);
      }
      
      // Handle PIN code - only numeric, max 6 digits
      if (field.name.includes('pinCode')) {
        value = value.replace(/[^0-9]/g, '').slice(0, 6);
      }
      
      // Handle nomination percentage - numeric only, max 100
      if (field.name.includes('nominationPercentage')) {
        value = value.replace(/[^0-9]/g, '');
        if (parseInt(value) > 100) value = '100';
        
        // Calculate total percentage
        const fieldPath = field.name.split('.');
        const index = parseInt(fieldPath[1]);
        const newTotal = form.values.nominees.reduce((sum, nominee, i) => 
          sum + (i === index ? Number(value) : Number(nominee.nominationPercentage)), 0);
        setTotalPercentage(newTotal);
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

  const handleAddressCheckbox = (setFieldValue, index, checked) => {
    if (checked && employeeAddress) {
      setFieldValue(`nominees.${index}.presentAddress`, employeeAddress.address || '');
      setFieldValue(`nominees.${index}.city`, employeeAddress.city || '');
      setFieldValue(`nominees.${index}.district`, employeeAddress.district || '');
      setFieldValue(`nominees.${index}.state`, employeeAddress.state || '');
      setFieldValue(`nominees.${index}.pinCode`, employeeAddress.pinCode || '');
    } else if (!checked) {
      // Clear address fields when unchecked
      setFieldValue(`nominees.${index}.presentAddress`, '');
      setFieldValue(`nominees.${index}.city`, '');
      setFieldValue(`nominees.${index}.district`, '');
      setFieldValue(`nominees.${index}.state`, '');
      setFieldValue(`nominees.${index}.pinCode`, '');
    }
  };

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      
      if (totalPercentage !== 100) {
        toast.error('Total nomination percentage must be exactly 100%');
        return;
      }

      console.log('Form values being submitted:', values);

      const response = await api.post('employees/nomination-details', {
        employeeId: employeeId,
        nominationDetails: values.nominees
      });

      if (response.data.success) {
        toast.success('Nomination details saved successfully');
        onComplete();
      }
    } catch (error) {
      console.error('Error saving nomination details:', error);
      toast.error(error.response?.data?.error || 'Failed to save nomination details');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom align="center" color="primary" sx={{ mb: 4 }}>
          <PersonAdd sx={{ mr: 2, verticalAlign: 'middle' }} />
          Nomination Details
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
              <FieldArray name="nominees">
                {({ push, remove }) => (
                  <div>
                    {values.nominees.map((nominee, index) => (
                      <Card key={index} sx={{ mb: 3, backgroundColor: '#f8f9fa' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" color="primary">
                              Nominee {index + 1}
                            </Typography>
                            {values.nominees.length > 1 && (
                              <IconButton 
                                onClick={() => remove(index)}
                                color="error"
                                size="small"
                              >
                                <Delete />
                              </IconButton>
                            )}
                          </Box>

                          <Grid container spacing={3}>
                            {/* Nominee Selection from Family Members */}
                            <Grid item xs={12} sm={6}>
                              <FormControl fullWidth size="small">
                                <InputLabel>Select Family Member*</InputLabel>
                                <Field name={`nominees.${index}.name`}>
                                  {({ field, form }) => (
                                    <Select
                                      {...field}
                                      label="Select Family Member"
                                      error={errors.nominees?.[index]?.name && (touched.nominees?.[index]?.name || values.nominees[index].name)}
                                      onChange={(e) => {
                                        const selectedMember = familyMembers.find(m => m.name === e.target.value);
                                        if (selectedMember) {
                                          form.setFieldValue(`nominees.${index}.name`, selectedMember.name);
                                          form.setFieldValue(`nominees.${index}.relation`, selectedMember.relation);
                                        }
                                      }}
                                      sx={{
                                        '& .MuiOutlinedInput-root': {
                                          borderRadius: '8px',
                                        }
                                      }}
                                    >
                                      <MenuItem value="">Select Family Member</MenuItem>
                                      {familyMembers.map((member) => (
                                        <MenuItem key={member.name} value={member.name}>
                                          {member.name} ({member.relation})
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  )}
                                </Field>
                                {errors.nominees?.[index]?.name && (touched.nominees?.[index]?.name || values.nominees[index].name) && (
                                  <FormHelperText error>{errors.nominees[index].name}</FormHelperText>
                                )}
                              </FormControl>
                            </Grid>

                            {/* Nomination Percentage */}
                            <Grid item xs={12} sm={6}>
                              <Field
                                name={`nominees.${index}.nominationPercentage`}
                                component={CustomTextField}
                                label="Nomination Percentage*"
                                type="number"
                                placeholder="Enter percentage (1-100)"
                                index={index}
                                setTotalPercentage={setTotalPercentage}
                              />
                            </Grid>

                            {/* Same as Employee Address Checkbox */}
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={nominee.sameAsEmployeeAddress}
                                    onChange={(e) => {
                                      setFieldValue(`nominees.${index}.sameAsEmployeeAddress`, e.target.checked);
                                      handleAddressCheckbox(setFieldValue, index, e.target.checked);
                                    }}
                                  />
                                }
                                label="Same as Employee Address"
                              />
                            </Grid>

                            {/* Address Fields */}
                            <Grid item xs={12}>
                              <Field
                                name={`nominees.${index}.presentAddress`}
                                component={CustomTextField}
                                label="Address*"
                                multiline
                                rows={3}
                                disabled={nominee.sameAsEmployeeAddress}
                              />
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                              <Field
                                name={`nominees.${index}.city`}
                                component={CustomTextField}
                                label="City*"
                                disabled={nominee.sameAsEmployeeAddress}
                              />
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                              <Field
                                name={`nominees.${index}.district`}
                                component={CustomTextField}
                                label="District*"
                                disabled={nominee.sameAsEmployeeAddress}
                              />
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                              <Field
                                name={`nominees.${index}.state`}
                                component={CustomTextField}
                                label="State*"
                                disabled={nominee.sameAsEmployeeAddress}
                              />
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                              <Field
                                name={`nominees.${index}.pinCode`}
                                component={CustomTextField}
                                label="PIN Code* (6 digits)"
                                placeholder="Enter 6-digit PIN"
                                disabled={nominee.sameAsEmployeeAddress}
                                index={index}
                              />
                            </Grid>

                            {/* Phone Number */}
                            <Grid item xs={12} sm={6}>
                              <Field
                                name={`nominees.${index}.phoneNumber`}
                                component={CustomTextField}
                                label="Phone Number* (10 digits)"
                                placeholder="Enter 10-digit phone number"
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    ))}

                    {/* Total Percentage Display and Add Button */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      my: 3,
                      p: 2,
                      backgroundColor: totalPercentage === 100 ? '#e8f5e8' : '#fff3e0',
                      borderRadius: 2
                    }}>
                      <Typography 
                        variant="h6" 
                        color={totalPercentage === 100 ? "success.main" : "warning.main"}
                        sx={{ fontWeight: 'bold' }}
                      >
                        Total Nomination: {totalPercentage}%
                        {totalPercentage === 100 && " ✓"}
                        {totalPercentage > 100 && " (Exceeds 100%)"}
                      </Typography>
                      
                      <Button
                        type="button"
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={() => push({
                          name: '',
                          relation: '',
                          nominationPercentage: '',
                          presentAddress: '',
                          city: '',
                          district: '',
                          state: '',
                          pinCode: '',
                          phoneNumber: '',
                          sameAsEmployeeAddress: false
                        })}
                        disabled={totalPercentage >= 100}
                        sx={{
                          borderRadius: '8px',
                        }}
                      >
                        Add Nominee
                      </Button>
                    </Box>

                    {/* Validation Alerts */}
                    {totalPercentage > 100 && (
                      <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                        Total nomination percentage cannot exceed 100%. Please adjust the percentages.
                      </Alert>
                    )}
                    
                    {totalPercentage < 100 && totalPercentage > 0 && (
                      <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
                        Total nomination percentage must be exactly 100%. Current total: {totalPercentage}%
                      </Alert>
                    )}

                    {/* Submit Buttons */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      mt: 4,
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: 2
                    }}>
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={prevStep}
                        sx={{ 
                          order: { xs: 2, sm: 1 },
                          borderRadius: '8px'
                        }}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={!isValid || totalPercentage !== 100 || isSubmitting}
                        sx={{ 
                          order: { xs: 1, sm: 2 },
                          borderRadius: '8px'
                        }}
                      >
                        {isSubmitting ? 'Saving...' : 'Submit & Complete'}
                      </Button>
                    </Box>
                  </div>
                )}
              </FieldArray>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

// Custom field component with validation and auto-fetch
const CustomTextField = ({ field, form, label, type = "text", index, setTotalPercentage, ...otherProps }) => {
  // Remove setTotalPercentage from props that go to TextField
  const { ...textFieldProps } = otherProps;
  const handleChange = (e) => {
    let value = e.target.value;
    
    // Handle name, city, district, state fields - only alphabets with sentence case
    if (field.name.includes('name') || field.name.includes('city') || 
        field.name.includes('district') || field.name.includes('state')) {
      value = value.replace(/[^A-Za-z\s]/g, '');
      value = value
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
    }
    
    // Handle phone number - only numeric, max 10 digits
    if (field.name.includes('phoneNumber')) {
      value = value.replace(/[^0-9]/g, '').slice(0, 10);
    }
    
    // Handle PIN code - only numeric, max 6 digits, auto-fetch on 6 digits
    if (field.name.includes('pinCode')) {
      value = value.replace(/[^0-9]/g, '').slice(0, 6);
      
      // Set the value first
      form.setFieldValue(field.name, value);
      
      // Auto-fetch address details when pincode is 6 digits
      if (value.length === 6 && typeof index !== 'undefined') {
        setTimeout(() => {
          try {
            const results = pincodeSearch.search(value);
            
            if (results && results.length > 0) {
              const pincodeInfo = results[0];
              console.log("Pincode API response:", pincodeInfo);
              
              const city = toSentenceCase(pincodeInfo.district || "");
              const state = toSentenceCase(pincodeInfo.state || "");
              
              form.setFieldValue(`nominees.${index}.city`, city);
              form.setFieldValue(`nominees.${index}.state`, state);
              
              toast.success(`Auto-filled: City: ${city}, State: ${state}`);
            } else {
              toast.error("Invalid pincode. Please check and try again.");
            }
          } catch (error) {
            console.error("Error fetching address from pincode:", error);
            toast.error("Failed to fetch address details");
          }
        }, 100);
      }
      return;
    }
    
    // Handle nomination percentage - numeric only, max 100, calculate total
    if (field.name.includes('nominationPercentage')) {
      value = value.replace(/[^0-9]/g, '');
      if (parseInt(value) > 100) value = '100';
      
      // Set the value
      form.setFieldValue(field.name, value);
      
      // Calculate total percentage
      if (typeof index !== 'undefined' && setTotalPercentage) {
        setTimeout(() => {
          const nominees = form.values.nominees;
          const newTotal = nominees.reduce((sum, nominee, i) => 
            sum + (i === index ? Number(value) : Number(nominee.nominationPercentage || 0)), 0);
          setTotalPercentage(newTotal);
        }, 50);
      }
      return;
    }
    
    // Update the field value for other fields
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
      {...textFieldProps}
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

export default NominationDetailsForm;
