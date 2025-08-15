import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  Container,
  Paper,
  LinearProgress
} from '@mui/material';
import api from "../api/axiosInstance";

import PersonalInformationForm from "../forms/PersonalInformationForm";
import AddressDetailsForm from "../forms/AddressDetailsForm";
import JoiningDetailsForm from "../forms/JoiningDetailsForm";
import EducationDetailsForm from "../forms/EducationDetailsForm";
import FamilyDetailsForm from "../forms/FamilyDetailsForm";
import ServiceHistoryForm from "../forms/ServiceHistoryForm";
import NominationDetailsForm from "../forms/NominationDetailsForm";

// Month names for date transformation
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const RegisterScreen = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem('currentRegistrationStep');
    return savedStep ? parseInt(savedStep) : 1;
  });
  const [employeeId, setEmployeeId] = useState(null);
  const [savedData, setSavedData] = useState({
    personalInfo: {},
    addressInfo: {},
    joiningDetails: {},
    educationDetails: {
      basic: [],
      professional: [],
      trainingDetails: [],
      hasTraining: 'no'
    },
    familyDetails: [],
    serviceHistory: {
      hasPreviousExperience: 'no',
      serviceHistory: []
    },
    nominationDetails: {
      nominees: []
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  // Step labels for the stepper
  const steps = [
    'Personal Information',
    'Address Details',
    'Joining Details',
    'Education Details',
    'Family Details',
    'Service History',
    'Nomination Details'
  ];

  // Update localStorage whenever currentStep changes
  useEffect(() => {
    localStorage.setItem('currentRegistrationStep', currentStep.toString());
  }, [currentStep]);

  // Load employee data and previously saved form data
  useEffect(() => {
    const loadSavedData = async () => {
      setIsLoading(true);
      try {
        const storedEmpId = localStorage.getItem('Emp_ID');
        console.log('Loading saved data for Employee ID:', storedEmpId);
        
        if (storedEmpId) {
          setEmployeeId(storedEmpId);
          
          // Fetch existing employee data from backend
          try {
            const response = await api.get(`employees/get-employee/${storedEmpId}`);
            console.log('Employee data response:', response.data);
            
            if (response.data.success && response.data.data) {
              const employeeData = response.data.data;
              
              // Transform backend data to match form expectations
              const fetchedData = {
                personalInfo: {
                  ...employeeData.personalInfo,
                  // Handle date of birth transformation
                  dob: employeeData.personalInfo?.dob,
                  dobDay: employeeData.personalInfo?.dob ? new Date(employeeData.personalInfo.dob).getDate() : '',
                  dobMonth: employeeData.personalInfo?.dob ? months[new Date(employeeData.personalInfo.dob).getMonth()] : '',
                  dobYear: employeeData.personalInfo?.dob ? new Date(employeeData.personalInfo.dob).getFullYear() : '',
                },
                addressInfo: {
                  // Handle current address structure - check multiple possible structures
                  presentAddress: employeeData.addressDetails?.currentAddress?.street || 
                                 employeeData.addressDetails?.presentAddress || 
                                 employeeData.currentAddress?.street || "",
                  presentCity: employeeData.addressDetails?.currentAddress?.city || 
                              employeeData.addressDetails?.presentCity ||
                              employeeData.currentAddress?.city || "",
                  presentDistrict: employeeData.addressDetails?.currentAddress?.district || 
                                  employeeData.addressDetails?.presentDistrict ||
                                  employeeData.currentAddress?.district || "",
                  presentState: employeeData.addressDetails?.currentAddress?.state || 
                               employeeData.addressDetails?.presentState ||
                               employeeData.currentAddress?.state || "",
                  presentPinCode: employeeData.addressDetails?.currentAddress?.pincode || 
                                 employeeData.addressDetails?.presentPinCode ||
                                 employeeData.currentAddress?.pincode || "",
                  presentCountry: employeeData.addressDetails?.currentAddress?.country || 
                                 employeeData.addressDetails?.presentCountry ||
                                 employeeData.currentAddress?.country || "",
                  // Handle permanent address structure
                  permanentAddress: employeeData.addressDetails?.permanentAddress?.street || 
                                   employeeData.addressDetails?.permanentAddress || 
                                   employeeData.permanentAddress?.street || "",
                  permanentCity: employeeData.addressDetails?.permanentAddress?.city || 
                                employeeData.addressDetails?.permanentCity ||
                                employeeData.permanentAddress?.city || "",
                  permanentDistrict: employeeData.addressDetails?.permanentAddress?.district || 
                                    employeeData.addressDetails?.permanentDistrict ||
                                    employeeData.permanentAddress?.district || "",
                  permanentState: employeeData.addressDetails?.permanentAddress?.state || 
                                 employeeData.addressDetails?.permanentState ||
                                 employeeData.permanentAddress?.state || "",
                  permanentPinCode: employeeData.addressDetails?.permanentAddress?.pincode || 
                                   employeeData.addressDetails?.permanentPinCode ||
                                   employeeData.permanentAddress?.pincode || "",
                  permanentCountry: employeeData.addressDetails?.permanentAddress?.country || 
                                   employeeData.addressDetails?.permanentCountry ||
                                   employeeData.permanentAddress?.country || "",
                  sameAsPresent: employeeData.addressDetails?.sameAsPresent || false,
                },
                joiningDetails: {
                  ...employeeData.joiningDetails,
                  // Transform dates to form format
                  appointmentDay: employeeData.joiningDetails?.dateOfAppointment ? new Date(employeeData.joiningDetails.dateOfAppointment).getDate() : '',
                  appointmentMonth: employeeData.joiningDetails?.dateOfAppointment ? months[new Date(employeeData.joiningDetails.dateOfAppointment).getMonth()] : '',
                  appointmentYear: employeeData.joiningDetails?.dateOfAppointment ? new Date(employeeData.joiningDetails.dateOfAppointment).getFullYear() : '',
                  joiningDay: employeeData.joiningDetails?.dateOfJoining ? new Date(employeeData.joiningDetails.dateOfJoining).getDate() : '',
                  joiningMonth: employeeData.joiningDetails?.dateOfJoining ? months[new Date(employeeData.joiningDetails.dateOfJoining).getMonth()] : '',
                  joiningYear: employeeData.joiningDetails?.dateOfJoining ? new Date(employeeData.joiningDetails.dateOfJoining).getFullYear() : '',
                },
                educationDetails: {
                  basic: employeeData.educationDetails?.basic || [],
                  professional: employeeData.educationDetails?.professional || [],
                  trainingDetails: employeeData.educationDetails?.trainingDetails || [],
                  hasTraining: employeeData.educationDetails?.hasTraining || 'no',
                  ...employeeData.educationDetails
                },
                familyDetails: Array.isArray(employeeData.familyDetails) ? employeeData.familyDetails : [],
                serviceHistory: {
                  hasPreviousExperience: employeeData.serviceHistory?.hasPreviousExperience || 'no',
                  serviceHistory: Array.isArray(employeeData.serviceHistory?.serviceHistory) ? employeeData.serviceHistory.serviceHistory : []
                },
                nominationDetails: {
                  nominees: Array.isArray(employeeData.nominationDetails?.nominees) ? employeeData.nominationDetails.nominees : [],
                  ...employeeData.nominationDetails
                }
              };
              
              console.log('Transformed saved data:', fetchedData);
              setSavedData(fetchedData);
            }
          } catch (error) {
            console.log('No existing employee data found, starting fresh:', error.message);
          }
        }
        
        // Also load from localStorage as fallback
        const savedFormData = localStorage.getItem('savedFormData');
        if (savedFormData) {
          const localData = JSON.parse(savedFormData);
          console.log('Local storage data:', localData);
          setSavedData(prev => ({ ...prev, ...localData }));
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedData();
  }, []);

  // Reload data when employee ID changes or when navigating back
  useEffect(() => {
    const reloadData = async () => {
      if (employeeId && currentStep > 1) {
        try {
          console.log('Reloading data for step:', currentStep);
          const response = await api.get(`employees/get-employee/${employeeId}`);
          
          if (response.data.success && response.data.data) {
            const employeeData = response.data.data;
            const fetchedData = {
              personalInfo: employeeData.personalInfo || {},
              addressInfo: employeeData.addressDetails || {},
              joiningDetails: employeeData.joiningDetails || {},
              educationDetails: employeeData.educationDetails || {},
              familyDetails: employeeData.familyDetails || [],
              serviceHistory: employeeData.serviceHistory || [],
              nominationDetails: employeeData.nominationDetails || []
            };
            
            setSavedData(fetchedData);
            console.log('Reloaded data for current step:', fetchedData);
          }
        } catch (error) {
          console.log('Error reloading data:', error.message);
        }
      }
    };
    
    reloadData();
  }, [currentStep, employeeId]);

  const nextStep = () => {
    setCurrentStep(prev => {
      const newStep = prev + 1;
      localStorage.setItem('currentRegistrationStep', newStep.toString());
      return newStep;
    });
  };

  const prevStep = () => {
    setCurrentStep(prev => {
      const newStep = Math.max(1, prev - 1);
      localStorage.setItem('currentRegistrationStep', newStep.toString());
      return newStep;
    });
  };

  const handleEmployeeIdUpdate = (id) => {
    setEmployeeId(id);
    localStorage.setItem('Emp_ID', id);
    console.log('Employee ID updated:', id);
  };

  // Save form data to both localStorage and state
  const saveFormData = (formType, data) => {
    setSavedData(prev => {
      const updatedData = {
        ...prev,
        [formType]: data
      };
      localStorage.setItem('savedFormData', JSON.stringify(updatedData));
      return updatedData;
    });
  };

  const handleComplete = async (formData) => {
    try {
      setIsLoading(true);
      
      // First save the nomination details
      const nominationResponse = await api.post('employees/nomination-details', {
        employeeId,
        nominationDetails: formData
      });

      if (!nominationResponse.data.success) {
        toast.error(nominationResponse.data.error || 'Failed to save nomination details');
        return;
      }
  
      // Then complete the registration
      const completeResponse = await api.post('employees/complete-registration', {
        employeeId,
        registrationComplete: true,
        allFormData: {
          ...savedData,
          nominationDetails: formData
        }
      });
  
      if (completeResponse.data.success) {
        // Get final employee data
        const employeeData = await api.get(`employees/get-employee/${employeeId}`);
  
        toast.success(`Registration completed successfully! Employee Code: ${employeeData.data.data.Emp_ID}`);
        
        // Clear all registration data from localStorage
        localStorage.removeItem('Emp_ID');
        localStorage.removeItem('currentRegistrationStep');
        localStorage.removeItem('savedFormData');
        
        // Redirect to dashboard
        navigate('/');
      } else {
        toast.error(completeResponse.data.error || 'Registration completion failed');
      }
    } catch (error) {
      console.error('Registration error details:', error);
      
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please log in again.');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.error || 'Registration completion failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => {
    console.log('Rendering form for step:', currentStep, 'with saved data:', savedData);
    
    const commonProps = {
      nextStep,
      prevStep,
      employeeId,
      setEmployeeId: handleEmployeeIdUpdate,
    };

    switch (currentStep) {
      case 1:
        return (
          <PersonalInformationForm
            key={`personal-${currentStep}-${JSON.stringify(savedData.personalInfo)}`}
            {...commonProps}
            savedData={savedData.personalInfo}
            userEmail={localStorage.getItem('userEmail')}
            userId={localStorage.getItem('userId')}
            onSave={(id) => {
              handleEmployeeIdUpdate(id);
              saveFormData('employeeId', id);
            }}
          />
        );
      case 2:
        console.log('Passing to AddressDetailsForm:', savedData.addressInfo);
        return (
          <AddressDetailsForm
            key={`address-${currentStep}-${JSON.stringify(savedData.addressInfo)}`}
            {...commonProps}
            savedData={savedData.addressInfo}
            onSave={(data) => saveFormData('addressInfo', data)}
          />
        );
      case 3:
        return (
          <JoiningDetailsForm
            key={`joining-${currentStep}-${JSON.stringify(savedData.joiningDetails)}`}
            {...commonProps}
            savedJoiningDetails={savedData.joiningDetails}
            savedData={savedData.joiningDetails}
            onSave={(data) => saveFormData('joiningDetails', data)}
          />
        );
      case 4:
        return (
          <EducationDetailsForm
            key={`education-${currentStep}-${JSON.stringify(savedData.educationDetails)}`}
            {...commonProps}
            savedEducationDetails={savedData.educationDetails || {}}
            savedData={savedData.educationDetails || {}}
            onSave={(data) => saveFormData('educationDetails', data)}
          />
        );
      case 5:
        return (
          <FamilyDetailsForm
            key={`family-${currentStep}-${JSON.stringify(savedData.familyDetails)}`}
            {...commonProps}
            savedFamilyDetails={Array.isArray(savedData.familyDetails) ? savedData.familyDetails : []}
            savedData={Array.isArray(savedData.familyDetails) ? savedData.familyDetails : []}
            onSave={(data) => saveFormData('familyDetails', data)}
          />
        );
      case 6:
        return (
          <ServiceHistoryForm
            key={`service-${currentStep}-${JSON.stringify(savedData.serviceHistory)}`}
            {...commonProps}
            savedServiceHistory={savedData.serviceHistory || { hasPreviousExperience: 'no', serviceHistory: [] }}
            savedData={savedData.serviceHistory || { hasPreviousExperience: 'no', serviceHistory: [] }}
            onSave={(data) => saveFormData('serviceHistory', data)}
          />
        );
      case 7:
        return (
          <NominationDetailsForm
            key={`nomination-${currentStep}-${JSON.stringify(savedData.nominationDetails)}`}
            {...commonProps}
            savedNominationDetails={savedData.nominationDetails || { nominees: [] }}
            savedData={savedData.nominationDetails || { nominees: [] }}
            onComplete={handleComplete}
          />
        );
      default:
        return <div>Invalid step</div>;
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Loading Registration Data...
          </Typography>
          <LinearProgress sx={{ mt: 2 }} />
        </Paper>
      </Container>
    );
  }
      
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" color="primary" gutterBottom>
            Employee Registration
          </Typography>
          {employeeId && (
            <Typography variant="subtitle1" color="text.secondary">
              Employee ID: {employeeId}
            </Typography>
          )}
        </Box>

        {/* MUI Stepper */}
        <Box sx={{ mb: 4 }}>
          <Stepper 
            activeStep={currentStep - 1} 
            alternativeLabel
            sx={{
              '& .MuiStepLabel-root .Mui-completed': {
                color: 'success.main',
              },
              '& .MuiStepLabel-root .Mui-active': {
                color: 'primary.main',
              },
            }}
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      textAlign: 'center'
                    }}
                  >
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Progress Bar */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Step {currentStep} of {steps.length}: {steps[currentStep - 1]}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={(currentStep / steps.length) * 100} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
              }
            }}
          />
        </Box>

        {/* Form Content */}
        <Box>
          {renderForm()}
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterScreen;
