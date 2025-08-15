import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  FormControlLabel,
  Checkbox,
  Alert,
} from "@mui/material";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";
import pincodeSearch from "india-pincode-search";

const AddressDetailsForm = ({ nextStep, prevStep, employeeId, savedData }) => {
  console.log('AddressDetailsForm received savedData:', savedData);
  
  const [sameAsPresent, setSameAsPresent] = useState(false);
  
  const defaultValues = {
    presentAddress: "",
    presentCity: "",
    presentDistrict: "",
    presentState: "",
    presentPinCode: "",
    presentCountry: "",
    permanentAddress: "",
    permanentCity: "",
    permanentDistrict: "",
    permanentState: "",
    permanentPinCode: "",
    permanentCountry: "",
    sameAsPresent: false,
  };

  // Create initial values with savedData override
  const initialValues = savedData && Object.keys(savedData).length > 0 ? {
    presentAddress: savedData.presentAddress || "",
    presentCity: savedData.presentCity || "",
    presentDistrict: savedData.presentDistrict || "",
    presentState: savedData.presentState || "",
    presentPinCode: savedData.presentPinCode || "",
    presentCountry: savedData.presentCountry || "",
    permanentAddress: savedData.permanentAddress || "",
    permanentCity: savedData.permanentCity || "",
    permanentDistrict: savedData.permanentDistrict || "",
    permanentState: savedData.permanentState || "",
    permanentPinCode: savedData.permanentPinCode || "",
    permanentCountry: savedData.permanentCountry || "",
    sameAsPresent: savedData.sameAsPresent || false,
  } : defaultValues;
  
  console.log('AddressDetailsForm initialValues:', initialValues);
  
  // Update sameAsPresent state when savedData changes
  useEffect(() => {
    console.log('AddressDetailsForm useEffect triggered with savedData:', savedData);
    if (savedData?.sameAsPresent !== undefined) {
      setSameAsPresent(savedData.sameAsPresent);
      console.log('Updated sameAsPresent to:', savedData.sameAsPresent);
    }
  }, [savedData]);

  // Helper function to convert to sentence case
  const toSentenceCase = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Pincode auto-fetch function
  const fetchAddressFromPincode = (pincode, setFieldValue, addressType) => {
    if (pincode && pincode.length === 6) {
      try {
        const results = pincodeSearch.search(pincode);
        
        if (results && results.length > 0) {
          const pincodeInfo = results[0];
          console.log("Pincode API response:", pincodeInfo); // Debug log
          
          // The API structure varies, so let's use what works:
          // - pincodeInfo.district actually contains the city/town name
          // - For district, we'll auto-fill with available data or leave for manual entry
          const city = toSentenceCase(pincodeInfo.district || "");
          const state = toSentenceCase(pincodeInfo.state || "");
          const country = "India";
          
          // Only auto-fill city, state, and country
          // District needs to be entered manually as API doesn't provide accurate district data
          console.log("Auto-filling:", { city, state, country }); // Debug log
          
          // Set values based on address type (present or permanent)
          setFieldValue(`${addressType}City`, city);
          setFieldValue(`${addressType}State`, state);
          setFieldValue(`${addressType}Country`, country);
          
          toast.success(`Auto-filled: City: ${city}, State: ${state}. Please enter district manually.`);
        } else {
          toast.error("Invalid pincode. Please check and try again.");
        }
      } catch (error) {
        console.error("Error fetching address from pincode:", error);
        toast.error("Failed to fetch address details from pincode");
      }
    }
  };

  const validationSchema = Yup.object({
    presentAddress: Yup.string().required("Present address is required"),
    presentCity: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "City should only contain alphabets")
      .required("City is required"),
    presentDistrict: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "District should only contain alphabets")
      .required("District is required"),
    presentState: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "State should only contain alphabets")
      .required("State is required"),
    presentPinCode: Yup.string()
      .matches(/^[0-9]{6}$/, "PIN code must be exactly 6 digits")
      .required("PIN code is required"),
    presentCountry: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Country should only contain alphabets")
      .required("Country is required"),
    
    // Permanent address fields - required when not same as present
    permanentAddress: Yup.string().when("sameAsPresent", {
      is: false,
      then: () => Yup.string().required("Permanent address is required"),
      otherwise: () => Yup.string()
    }),
    permanentCity: Yup.string().when("sameAsPresent", {
      is: false,
      then: () => Yup.string()
        .matches(/^[A-Za-z\s]+$/, "City should only contain alphabets")
        .required("City is required"),
      otherwise: () => Yup.string()
    }),
    permanentDistrict: Yup.string().when("sameAsPresent", {
      is: false,
      then: () => Yup.string()
        .matches(/^[A-Za-z\s]+$/, "District should only contain alphabets")
        .required("District is required"),
      otherwise: () => Yup.string()
    }),
    permanentState: Yup.string().when("sameAsPresent", {
      is: false,
      then: () => Yup.string()
        .matches(/^[A-Za-z\s]+$/, "State should only contain alphabets")
        .required("State is required"),
      otherwise: () => Yup.string()
    }),
    permanentPinCode: Yup.string().when("sameAsPresent", {
      is: false,
      then: () => Yup.string()
        .matches(/^[0-9]{6}$/, "PIN code must be exactly 6 digits")
        .required("PIN code is required"),
      otherwise: () => Yup.string()
    }),
    permanentCountry: Yup.string().when("sameAsPresent", {
      is: false,
      then: () => Yup.string()
        .matches(/^[A-Za-z\s]+$/, "Country should only contain alphabets")
        .required("Country is required"),
      otherwise: () => Yup.string()
    }),
  });

  // Custom field component with validation and auto-formatting
  const CustomTextField = ({ field, form, label, type = "text", ...props }) => {
    const handleChange = (e) => {
      let value = e.target.value;
      
      // Handle pincode fields - only numeric, max 6 digits
      if (field.name.includes("PinCode")) {
        value = value.replace(/[^0-9]/g, "").slice(0, 6);
        
        // Auto-fetch address details when pincode is 6 digits
        if (value.length === 6) {
          const addressType = field.name.includes("present") ? "present" : "permanent";
          setTimeout(() => {
            fetchAddressFromPincode(value, form.setFieldValue, addressType);
          }, 100);
        }
      }
      
      // Handle city, district, state, country fields - only alphabets with sentence case
      else if (field.name.includes("City") || field.name.includes("District") || 
          field.name.includes("State") || field.name.includes("Country")) {
        value = value.replace(/[^A-Za-z\s]/g, "");
        value = toSentenceCase(value);
      }
      
      // Set the value using the default field onChange
      const event = { 
        ...e, 
        target: { 
          ...e.target, 
          value,
          name: field.name 
        } 
      };
      field.onChange(event);
    };

    const hasError = form.errors[field.name] && (form.touched[field.name] || form.values[field.name]);

    return (
      <TextField
        {...field}
        {...props}
        label={label}
        onChange={handleChange}
        error={hasError}
        helperText={hasError ? form.errors[field.name] : ""}
        fullWidth
      />
    );
  };

  const handleSubmit = async (values) => {
    try {
      console.log("Form values being submitted:", values);

      // Create the address data object with the exact field names expected by the backend
      const addressData = {
        employeeId: employeeId,
        currentAddress: {
          street: values.presentAddress,
          city: values.presentCity,
          district: values.presentDistrict,
          state: values.presentState,
          pincode: values.presentPinCode,
          country: values.presentCountry,
        },
        permanentAddress: sameAsPresent
          ? {
              street: values.presentAddress,
              city: values.presentCity,
              district: values.presentDistrict,
              state: values.presentState,
              pincode: values.presentPinCode,
              country: values.presentCountry,
            }
          : {
              street: values.permanentAddress,
              city: values.permanentCity,
              district: values.permanentDistrict,
              state: values.permanentState,
              pincode: values.permanentPinCode,
              country: values.permanentCountry,
            },
      };

      console.log("Data being sent to API:", addressData);

      const response = await api.post("employees/address-info", addressData, {
        headers: {
          "Content-Type": "application/json"
        },
      });

      console.log("API Response:", response.data);

      if (response.data.success) {
        toast.success("Address information saved successfully");
        nextStep();
      } else {
        toast.error("Failed to save address information");
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      toast.error("Failed to save address information");
    }
  };

  const handleSameAddressChange = (e, setFieldValue, values) => {
    const checked = e.target.checked;
    setSameAsPresent(checked);

    if (checked) {
      // Copy present address values to permanent address fields
      setFieldValue("permanentAddress", values.presentAddress);
      setFieldValue("permanentCity", values.presentCity);
      setFieldValue("permanentDistrict", values.presentDistrict);
      setFieldValue("permanentState", values.presentState);
      setFieldValue("permanentPinCode", values.presentPinCode);
      setFieldValue("permanentCountry", values.presentCountry);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom color="primary">
        Address Details
      </Typography>
      
      {/* Debug info */}
      {savedData && Object.keys(savedData).length > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Loaded saved data: {savedData.presentCity || 'No city'}, {savedData.presentState || 'No state'}
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
          isValid,
        }) => (
          <Form>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6">Present Address*</Typography>
              </Grid>

              <Grid item xs={12}>
                <Field
                  name="presentAddress"
                  component={CustomTextField}
                  label="Street Address*"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="presentCity"
                  component={CustomTextField}
                  label="City*"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="presentDistrict"
                  component={CustomTextField}
                  label="District*"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Field
                  name="presentState"
                  component={CustomTextField}
                  label="State*"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Field
                  name="presentPinCode"
                  component={CustomTextField}
                  label="PIN Code* (6 digits)"
                  placeholder="Enter 6-digit PIN code"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Field
                  name="presentCountry"
                  component={CustomTextField}
                  label="Country*"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sameAsPresent}
                      onChange={(e) =>
                        handleSameAddressChange(e, setFieldValue, values)
                      }
                      name="sameAsPresent"
                    />
                  }
                  label="Permanent Address same as Present Address"
                />
              </Grid>

              {!sameAsPresent && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="h6">Permanent Address*</Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      name="permanentAddress"
                      component={CustomTextField}
                      label="Street Address*"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field
                      name="permanentCity"
                      component={CustomTextField}
                      label="City*"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field
                      name="permanentDistrict"
                      component={CustomTextField}
                      label="District*"
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Field
                      name="permanentState"
                      component={CustomTextField}
                      label="State*"
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Field
                      name="permanentPinCode"
                      component={CustomTextField}
                      label="PIN Code* (6 digits)"
                      placeholder="Enter 6-digit PIN code"
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Field
                      name="permanentCountry"
                      component={CustomTextField}
                      label="Country*"
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={prevStep}
                  sx={{ mr: 1 }}
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
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default AddressDetailsForm;
