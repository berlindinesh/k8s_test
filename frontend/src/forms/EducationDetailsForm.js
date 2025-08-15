import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Grid, 
  Paper, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Chip,
  Box,
  IconButton
} from '@mui/material';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from "../api/axiosInstance";
import { toast } from 'react-toastify';

const EducationDetailsForm = ({ savedEducationDetails, nextStep, prevStep, employeeId, savedData }) => {
  // Helper function to convert to sentence case
  const toSentenceCase = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Get current year for validation
  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 50}, (_, i) => currentYear - i);

  const defaultInitialValues = {
    // Basic Education (10th and 12th - both mandatory)
    basic: {
      tenth: {
        education: '10th',
        institute: '',
        board: '',
        marks: '',
        year: '',
        stream: '',
        grade: ''
      },
      twelfth: {
        education: '12th',
        institute: '',
        board: '',
        marks: '',
        year: '',
        stream: '',
        grade: ''
      }
    },
    
    // Professional Education
    professional: {
      ug: {
        education: '',
        institute: '',
        university: '',
        marks: '',
        year: '',
        stream: '',
        grade: ''
      },
      pg: {
        education: '',
        institute: '',
        university: '',
        marks: '',
        year: '',
        stream: '',
        grade: ''
      },
      doctorate: {
        education: '',
        institute: '',
        university: '',
        marks: '',
        year: '',
        stream: '',
        grade: ''
      }
    },
    
    // Professional education level selection
    professionalLevel: '', // 'UG', 'PG', or 'Doctorate'
    
    // Training Details
    hasTraining: 'no',
    trainingDetails: [
      {
        type: '',
        topic: '',
        institute: '',
        country: '',
        sponsor: '',
        startDate: '',
        endDate: ''
      }
    ]
  };

  // Merge saved data with defaults, ensuring arrays exist
  const initialValues = {
    basic: {
      tenth: {
        ...defaultInitialValues.basic.tenth,
        ...(savedData?.basic?.tenth || savedEducationDetails?.basic?.tenth || {})
      },
      twelfth: {
        ...defaultInitialValues.basic.twelfth,
        ...(savedData?.basic?.twelfth || savedEducationDetails?.basic?.twelfth || {})
      }
    },
    professional: {
      ug: {
        ...defaultInitialValues.professional.ug,
        ...(savedData?.professional?.ug || savedEducationDetails?.professional?.ug || {})
      },
      pg: {
        ...defaultInitialValues.professional.pg,
        ...(savedData?.professional?.pg || savedEducationDetails?.professional?.pg || {})
      },
      doctorate: {
        ...defaultInitialValues.professional.doctorate,
        ...(savedData?.professional?.doctorate || savedEducationDetails?.professional?.doctorate || {})
      }
    },
    professionalLevel: savedData?.professionalLevel || savedEducationDetails?.professionalLevel || '',
    hasTraining: savedData?.hasTraining || savedEducationDetails?.hasTraining || 'no',
    trainingDetails: Array.isArray(savedData?.trainingDetails) ? savedData.trainingDetails :
                    (Array.isArray(savedEducationDetails?.trainingDetails) ? savedEducationDetails.trainingDetails :
                    defaultInitialValues.trainingDetails)
  };
  
  console.log('EducationDetailsForm initialValues:', initialValues);

  const validationSchema = Yup.object().shape({
    // Basic Education Validation (Both 10th and 12th mandatory)
    basic: Yup.object().shape({
      tenth: Yup.object().shape({
        institute: Yup.string()
          .matches(/^[A-Za-z\s]+$/, 'Institute name should only contain alphabets')
          .required('Institute name is required'),
        board: Yup.string()
          .matches(/^[A-Za-z\s]+$/, 'Board name should only contain alphabets')
          .required('Board name is required'),
        marks: Yup.number()
          .min(0, 'Marks cannot be negative')
          .max(100, 'Marks cannot exceed 100%')
          .required('Marks are required'),
        year: Yup.number()
          .min(1950, 'Year must be valid')
          .max(currentYear, `Year cannot be future`)
          .required('Passing year is required'),
        stream: Yup.string()
          .matches(/^[A-Za-z\s]+$/, 'Stream should only contain alphabets')
          .required('Stream is required'),
        grade: Yup.string()
          .matches(/^[A-Za-z\s+]+$/, 'Grade should only contain alphabets')
          .required('Grade is required')
      }),
      twelfth: Yup.object().shape({
        institute: Yup.string()
          .matches(/^[A-Za-z\s]+$/, 'Institute name should only contain alphabets')
          .required('Institute name is required'),
        board: Yup.string()
          .matches(/^[A-Za-z\s]+$/, 'Board name should only contain alphabets')
          .required('Board name is required'),
        marks: Yup.number()
          .min(0, 'Marks cannot be negative')
          .max(100, 'Marks cannot exceed 100%')
          .required('Marks are required'),
        year: Yup.number()
          .min(1950, 'Year must be valid')
          .max(currentYear, `Year cannot be future`)
          .required('Passing year is required'),
        stream: Yup.string()
          .matches(/^[A-Za-z\s]+$/, 'Stream should only contain alphabets')
          .required('Stream is required'),
        grade: Yup.string()
          .matches(/^[A-Za-z\s+]+$/, 'Grade should only contain alphabets')
          .required('Grade is required')
      })
    }),

    // Professional Education Level Selection
    professionalLevel: Yup.string().required('Professional education level is required'),

    // Professional Education Validation (based on level selected)
    professional: Yup.object().when('professionalLevel', {
      is: (level) => level === 'UG' || level === 'PG' || level === 'Doctorate',
      then: () => Yup.object().shape({
        ug: Yup.object().when('professionalLevel', {
          is: (level) => level === 'UG' || level === 'PG' || level === 'Doctorate',
          then: () => Yup.object().shape({
            institute: Yup.string()
              .matches(/^[A-Za-z\s]+$/, 'Institute name should only contain alphabets')
              .required('UG Institute name is required'),
            university: Yup.string()
              .matches(/^[A-Za-z\s]+$/, 'University name should only contain alphabets')
              .required('UG University name is required'),
            marks: Yup.number()
              .min(0, 'Marks cannot be negative')
              .max(100, 'Marks cannot exceed 100%')
              .required('UG Marks are required'),
            year: Yup.number()
              .min(1950, 'Year must be valid')
              .max(currentYear, `Year cannot be future`)
              .required('UG Passing year is required'),
            stream: Yup.string()
              .matches(/^[A-Za-z\s]+$/, 'Stream should only contain alphabets')
              .required('UG Stream is required'),
            grade: Yup.string()
              .matches(/^[A-Za-z\s+]+$/, 'Grade should only contain alphabets')
              .required('UG Grade is required')
          })
        }),
        pg: Yup.object().when('professionalLevel', {
          is: (level) => level === 'PG' || level === 'Doctorate',
          then: () => Yup.object().shape({
            institute: Yup.string()
              .matches(/^[A-Za-z\s]+$/, 'Institute name should only contain alphabets')
              .required('PG Institute name is required'),
            university: Yup.string()
              .matches(/^[A-Za-z\s]+$/, 'University name should only contain alphabets')
              .required('PG University name is required'),
            marks: Yup.number()
              .min(0, 'Marks cannot be negative')
              .max(100, 'Marks cannot exceed 100%')
              .required('PG Marks are required'),
            year: Yup.number()
              .min(1950, 'Year must be valid')
              .max(currentYear, `Year cannot be future`)
              .required('PG Passing year is required'),
            stream: Yup.string()
              .matches(/^[A-Za-z\s]+$/, 'Stream should only contain alphabets')
              .required('PG Stream is required'),
            grade: Yup.string()
              .matches(/^[A-Za-z\s+]+$/, 'Grade should only contain alphabets')
              .required('PG Grade is required')
          })
        }),
        doctorate: Yup.object().when('professionalLevel', {
          is: (level) => level === 'Doctorate',
          then: () => Yup.object().shape({
            institute: Yup.string()
              .matches(/^[A-Za-z\s]+$/, 'Institute name should only contain alphabets')
              .required('Doctorate Institute name is required'),
            university: Yup.string()
              .matches(/^[A-Za-z\s]+$/, 'University name should only contain alphabets')
              .required('Doctorate University name is required'),
            marks: Yup.number()
              .min(0, 'Marks cannot be negative')
              .max(100, 'Marks cannot exceed 100%')
              .required('Doctorate Marks are required'),
            year: Yup.number()
              .min(1950, 'Year must be valid')
              .max(currentYear, `Year cannot be future`)
              .required('Doctorate Passing year is required'),
            stream: Yup.string()
              .matches(/^[A-Za-z\s]+$/, 'Stream should only contain alphabets')
              .required('Doctorate Stream is required'),
            grade: Yup.string()
              .matches(/^[A-Za-z\s+]+$/, 'Grade should only contain alphabets')
              .required('Doctorate Grade is required')
          })
        })
      })
    }),

    // Training Details Validation (only if hasTraining is 'yes')
    trainingDetails: Yup.array().when('hasTraining', {
      is: 'yes',
      then: () => Yup.array().of(
        Yup.object().shape({
          type: Yup.string()
            .matches(/^[A-Za-z\s]+$/, 'Training type should only contain alphabets')
            .required('Training type is required'),
          topic: Yup.string()
            .matches(/^[A-Za-z\s]+$/, 'Topic name should only contain alphabets')
            .required('Topic name is required'),
          institute: Yup.string()
            .matches(/^[A-Za-z\s]+$/, 'Institute name should only contain alphabets')
            .required('Institute name is required'),
          country: Yup.string()
            .matches(/^[A-Za-z\s]+$/, 'Country should only contain alphabets')
            .required('Country is required'),
          sponsor: Yup.string()
            .matches(/^[A-Za-z\s]+$/, 'Sponsor should only contain alphabets')
            .required('Sponsor is required'),
          startDate: Yup.date().required('Start date is required'),
          endDate: Yup.date()
            .required('End date is required')
            .min(Yup.ref('startDate'), 'End date must be after start date')
        })
      ).min(1, 'At least one training record is required')
    })
  });

  // Custom field component with validation
  const CustomTextField = ({ field, form, label, type = "text", maxLength, ...props }) => {
    const handleChange = (e) => {
      let value = e.target.value;
      
      // Handle percentage fields
      if (field.name.includes('marks')) {
        value = value.replace(/[^0-9.]/g, '');
        if (parseFloat(value) > 100) value = '100';
        form.setFieldValue(field.name, value);
        return;
      }
      
      // Handle year fields
      if (field.name.includes('year')) {
        value = value.replace(/[^0-9]/g, '').slice(0, 4);
        form.setFieldValue(field.name, value);
        return;
      }
      
      // Handle text fields (institute, board, stream, grade, etc.)
      if (field.name.includes('institute') || field.name.includes('board') || 
          field.name.includes('university') || field.name.includes('stream') || 
          field.name.includes('grade') || field.name.includes('type') ||
          field.name.includes('topic') || field.name.includes('country') ||
          field.name.includes('sponsor')) {
        value = value.replace(/[^A-Za-z\s+]/g, '');
        value = toSentenceCase(value);
        form.setFieldValue(field.name, value);
        return;
      }
      
      // Default handling
      form.setFieldValue(field.name, value);
    };

    // Show errors immediately when field has value or is touched
    const fieldValue = field.name.split('.').reduce((obj, key) => obj?.[key], form.values);
    const fieldError = field.name.split('.').reduce((obj, key) => obj?.[key], form.errors);
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

      // Format basic education
      const basicEducation = [
        {
          education: '10th',
          institute: values.basic.tenth.institute,
          board: values.basic.tenth.board,
          marks: Number(values.basic.tenth.marks),
          year: Number(values.basic.tenth.year),
          stream: values.basic.tenth.stream,
          grade: values.basic.tenth.grade
        },
        {
          education: '12th',
          institute: values.basic.twelfth.institute,
          board: values.basic.twelfth.board,
          marks: Number(values.basic.twelfth.marks),
          year: Number(values.basic.twelfth.year),
          stream: values.basic.twelfth.stream,
          grade: values.basic.twelfth.grade
        }
      ];

      // Format professional education based on level
      const professionalEducation = [];
      
      if (values.professionalLevel === 'UG' || values.professionalLevel === 'PG' || values.professionalLevel === 'Doctorate') {
        professionalEducation.push({
          education: 'UG',
          institute: values.professional.ug.institute,
          board: values.professional.ug.university,
          marks: Number(values.professional.ug.marks),
          year: Number(values.professional.ug.year),
          stream: values.professional.ug.stream,
          grade: values.professional.ug.grade
        });
      }
      
      if (values.professionalLevel === 'PG' || values.professionalLevel === 'Doctorate') {
        professionalEducation.push({
          education: 'PG',
          institute: values.professional.pg.institute,
          board: values.professional.pg.university,
          marks: Number(values.professional.pg.marks),
          year: Number(values.professional.pg.year),
          stream: values.professional.pg.stream,
          grade: values.professional.pg.grade
        });
      }
      
      if (values.professionalLevel === 'Doctorate') {
        professionalEducation.push({
          education: 'Doctorate',
          institute: values.professional.doctorate.institute,
          board: values.professional.doctorate.university,
          marks: Number(values.professional.doctorate.marks),
          year: Number(values.professional.doctorate.year),
          stream: values.professional.doctorate.stream,
          grade: values.professional.doctorate.grade
        });
      }

      // Format training details
      const formattedTrainingData = values.hasTraining === 'yes' ? 
        values.trainingDetails.map(train => ({
          type: train.type,
          topic: train.topic,
          institute: train.institute,
          country: train.country,
          sponsor: train.sponsor,
          from: new Date(train.startDate).toISOString(),
          to: new Date(train.endDate).toISOString()
        })) : [];

      const payload = {
        employeeId: employeeId,
        educationDetails: {
          basic: basicEducation,
          professional: professionalEducation
        },
        trainingStatus: values.hasTraining,
        trainingDetails: {
          trainingInIndia: formattedTrainingData
        }
      };

      console.log('Final payload:', JSON.stringify(payload, null, 2));

      const response = await api.post('employees/education-details', payload);
      
      console.log('Server response:', response.data);
      if (response.data.success) {
        toast.success('Education details saved successfully');
        nextStep();
      }
    } catch (error) {
      console.log('Error details:', error.response?.data);
      toast.error(error.response?.data?.error || 'Failed to save education details');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom color="primary">
        Education Details
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validate={(values) => {
          // This will trigger validation on every change
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
            <Grid container spacing={4}>
              
              {/* Basic Education Section */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Basic Education (Mandatory)
                </Typography>
                
                {/* 10th Standard */}
                <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f8f9fa' }}>
                  <Typography variant="subtitle1" gutterBottom color="primary">
                    10th Standard*
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Field
                        name="basic.tenth.institute"
                        component={CustomTextField}
                        label="Institute Name*"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field
                        name="basic.tenth.board"
                        component={CustomTextField}
                        label="Board/University*"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Field
                        name="basic.tenth.marks"
                        component={CustomTextField}
                        label="Marks (%)*"
                        type="number"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Field
                        name="basic.tenth.year"
                        component={CustomTextField}
                        label="Passing Year*"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Field
                        name="basic.tenth.stream"
                        component={CustomTextField}
                        label="Stream*"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        name="basic.tenth.grade"
                        component={CustomTextField}
                        label="Grade*"
                      />
                    </Grid>
                  </Grid>
                </Paper>

                {/* 12th Standard */}
                <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f8f9fa' }}>
                  <Typography variant="subtitle1" gutterBottom color="primary">
                    12th Standard*
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Field
                        name="basic.twelfth.institute"
                        component={CustomTextField}
                        label="Institute Name*"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field
                        name="basic.twelfth.board"
                        component={CustomTextField}
                        label="Board/University*"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Field
                        name="basic.twelfth.marks"
                        component={CustomTextField}
                        label="Marks (%)*"
                        type="number"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Field
                        name="basic.twelfth.year"
                        component={CustomTextField}
                        label="Passing Year*"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Field
                        name="basic.twelfth.stream"
                        component={CustomTextField}
                        label="Stream*"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        name="basic.twelfth.grade"
                        component={CustomTextField}
                        label="Grade*"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Professional Education Section */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Professional Education
                </Typography>
                
                {/* Professional Level Selection */}
                <FormControl fullWidth error={errors.professionalLevel && (touched.professionalLevel || values.professionalLevel)} sx={{ mb: 3 }}>
                  <InputLabel>Highest Professional Education Level*</InputLabel>
                  <Field name="professionalLevel">
                    {({ field }) => (
                      <Select
                        {...field}
                        label="Highest Professional Education Level"
                        onChange={(e) => {
                          setFieldValue('professionalLevel', e.target.value);
                          // Reset professional education fields when level changes
                          setFieldValue('professional.ug', initialValues.professional.ug);
                          setFieldValue('professional.pg', initialValues.professional.pg);
                          setFieldValue('professional.doctorate', initialValues.professional.doctorate);
                        }}
                      >
                        <MenuItem value="">Select Level</MenuItem>
                        <MenuItem value="UG">Under Graduate (UG)</MenuItem>
                        <MenuItem value="PG">Post Graduate (PG)</MenuItem>
                        <MenuItem value="Doctorate">Doctorate</MenuItem>
                      </Select>
                    )}
                  </Field>
                  {errors.professionalLevel && (touched.professionalLevel || values.professionalLevel) && (
                    <FormHelperText>{errors.professionalLevel}</FormHelperText>
                  )}
                </FormControl>

                {/* Show education level indicators */}
                {values.professionalLevel && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      You need to fill details for:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Chip label="UG" color="primary" size="small" />
                      {(values.professionalLevel === 'PG' || values.professionalLevel === 'Doctorate') && (
                        <Chip label="PG" color="primary" size="small" />
                      )}
                      {values.professionalLevel === 'Doctorate' && (
                        <Chip label="Doctorate" color="primary" size="small" />
                      )}
                    </Box>
                  </Box>
                )}

                {/* UG Details (Required for UG, PG, Doctorate) */}
                {(values.professionalLevel === 'UG' || values.professionalLevel === 'PG' || values.professionalLevel === 'Doctorate') && (
                  <Paper sx={{ p: 2, mb: 2, backgroundColor: '#fff3e0' }}>
                    <Typography variant="subtitle1" gutterBottom color="primary">
                      Under Graduate (UG)*
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Field
                          name="professional.ug.institute"
                          component={CustomTextField}
                          label="Institute Name*"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field
                          name="professional.ug.university"
                          component={CustomTextField}
                          label="University*"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Field
                          name="professional.ug.marks"
                          component={CustomTextField}
                          label="Marks (%)*"
                          type="number"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Field
                          name="professional.ug.year"
                          component={CustomTextField}
                          label="Passing Year*"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Field
                          name="professional.ug.stream"
                          component={CustomTextField}
                          label="Stream*"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          name="professional.ug.grade"
                          component={CustomTextField}
                          label="Grade*"
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                )}

                {/* PG Details (Required for PG, Doctorate) */}
                {(values.professionalLevel === 'PG' || values.professionalLevel === 'Doctorate') && (
                  <Paper sx={{ p: 2, mb: 2, backgroundColor: '#e8f5e8' }}>
                    <Typography variant="subtitle1" gutterBottom color="primary">
                      Post Graduate (PG)*
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Field
                          name="professional.pg.institute"
                          component={CustomTextField}
                          label="Institute Name*"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field
                          name="professional.pg.university"
                          component={CustomTextField}
                          label="University*"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Field
                          name="professional.pg.marks"
                          component={CustomTextField}
                          label="Marks (%)*"
                          type="number"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Field
                          name="professional.pg.year"
                          component={CustomTextField}
                          label="Passing Year*"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Field
                          name="professional.pg.stream"
                          component={CustomTextField}
                          label="Stream*"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          name="professional.pg.grade"
                          component={CustomTextField}
                          label="Grade*"
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                )}

                {/* Doctorate Details (Required only for Doctorate) */}
                {values.professionalLevel === 'Doctorate' && (
                  <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f3e5f5' }}>
                    <Typography variant="subtitle1" gutterBottom color="primary">
                      Doctorate*
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Field
                          name="professional.doctorate.institute"
                          component={CustomTextField}
                          label="Institute Name*"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field
                          name="professional.doctorate.university"
                          component={CustomTextField}
                          label="University*"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Field
                          name="professional.doctorate.marks"
                          component={CustomTextField}
                          label="Marks (%)*"
                          type="number"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Field
                          name="professional.doctorate.year"
                          component={CustomTextField}
                          label="Passing Year*"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Field
                          name="professional.doctorate.stream"
                          component={CustomTextField}
                          label="Stream*"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          name="professional.doctorate.grade"
                          component={CustomTextField}
                          label="Grade*"
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                )}
              </Grid>

              {/* Training Details Section */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Training Details
                </Typography>
                
                <FormControl component="fieldset" sx={{ mb: 3 }}>
                  <FormLabel component="legend">Have you undergone any training?*</FormLabel>
                  <Field name="hasTraining">
                    {({ field }) => (
                      <RadioGroup
                        {...field}
                        row
                        onChange={(e) => {
                          setFieldValue('hasTraining', e.target.value);
                          if (e.target.value === 'no') {
                            setFieldValue('trainingDetails', []);
                          } else {
                            setFieldValue('trainingDetails', initialValues.trainingDetails);
                          }
                        }}
                      >
                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                      </RadioGroup>
                    )}
                  </Field>
                </FormControl>

                {/* Training Details Fields (only if yes is selected) */}
                {values.hasTraining === 'yes' && (
                  <FieldArray name="trainingDetails">
                    {({ remove, push }) => (
                      <div>
                        {values.trainingDetails.map((training, index) => (
                          <Paper key={index} sx={{ p: 2, mb: 2, backgroundColor: '#f0f8ff' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Typography variant="subtitle1" color="primary">
                                Training {index + 1}*
                              </Typography>
                              {values.trainingDetails.length > 1 && (
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
                              <Grid item xs={12} sm={6}>
                                <Field
                                  name={`trainingDetails.${index}.type`}
                                  component={CustomTextField}
                                  label="Training Type*"
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Field
                                  name={`trainingDetails.${index}.topic`}
                                  component={CustomTextField}
                                  label="Topic Name*"
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Field
                                  name={`trainingDetails.${index}.institute`}
                                  component={CustomTextField}
                                  label="Institute Name*"
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Field
                                  name={`trainingDetails.${index}.country`}
                                  component={CustomTextField}
                                  label="Country*"
                                />
                              </Grid>
                              <Grid item xs={12} sm={4}>
                                <Field
                                  name={`trainingDetails.${index}.sponsor`}
                                  component={CustomTextField}
                                  label="Sponsor*"
                                />
                              </Grid>
                              <Grid item xs={12} sm={4}>
                                <Field
                                  name={`trainingDetails.${index}.startDate`}
                                  component={CustomTextField}
                                  label="Start Date*"
                                  type="date"
                                  InputLabelProps={{ shrink: true }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={4}>
                                <Field
                                  name={`trainingDetails.${index}.endDate`}
                                  component={CustomTextField}
                                  label="End Date*"
                                  type="date"
                                  InputLabelProps={{ shrink: true }}
                                />
                              </Grid>
                            </Grid>
                          </Paper>
                        ))}
                        
                        <Button
                          type="button"
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={() => push({
                            type: '',
                            topic: '',
                            institute: '',
                            country: '',
                            sponsor: '',
                            startDate: '',
                            endDate: ''
                          })}
                          sx={{ mb: 2 }}
                        >
                          Add Training
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                )}
              </Grid>

              {/* Submit Buttons */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={prevStep}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    disabled={!isValid}
                  >
                    Next
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

export default EducationDetailsForm;
