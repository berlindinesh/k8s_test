import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axiosInstance";

import PersonalInformationForm from "../forms/PersonalInformationForm";
import AddressDetailsForm from "../forms/AddressDetailsForm";
import JoiningDetailsForm from "../forms/JoiningDetailsForm";
import EducationDetailsForm from "../forms/EducationDetailsForm";
import FamilyDetailsForm from "../forms/FamilyDetailsForm";
import ServiceHistoryForm from "../forms/ServiceHistoryForm";
import NominationDetailsForm from "../forms/NominationDetailsForm";

// // Add this function to get the auth token
// const getAuthToken = () => {
//   return localStorage.getItem('token');
// };

const RegisterScreen = () => {
  const navigate = useNavigate();
  // Initialize currentStep from localStorage or default to 1
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem('currentRegistrationStep');
    return savedStep ? parseInt(savedStep) : 1;
  });
  const [employeeId, setEmployeeId] = useState(null);
  const [savedData, setSavedData] = useState({});

  

  // Update localStorage whenever currentStep changes
  useEffect(() => {
    localStorage.setItem('currentRegistrationStep', currentStep.toString());
  }, [currentStep]);

  // Check for authentication token on component mount
  useEffect(() => {
    // const token = getAuthToken();
    // if (!token) {
    //   toast.error('Authentication required. Please log in.');
    //   navigate('/login');
    // }
  }, [navigate]);

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

  useEffect(() => {
    const storedEmpId = localStorage.getItem('Emp_ID');
    if (storedEmpId) {
      setEmployeeId(storedEmpId);
      console.log('Retrieved stored Employee ID:', storedEmpId);
    }
    
    // Load saved form data from localStorage if available
    const savedFormData = localStorage.getItem('savedFormData');
    if (savedFormData) {
      setSavedData(JSON.parse(savedFormData));
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(savedData).length > 0) {
      localStorage.setItem('savedFormData', JSON.stringify(savedData));
    }
  }, [savedData]);

  const handleComplete = async (formData) => {
    try {
      // // Get the authentication token
      // const token = getAuthToken();
      // const companyCode = localStorage.getItem('companyCode');
      
      // if (!token) {
      //   toast.error('Authentication token not found. Please log in again.');
      //   navigate('/login');
      //   return;
      // }
      
      // First save the nomination details
      const nominationResponse = await api.post(
        '/employees/nomination-details',
        {
          employeeId,
          nominationDetails: formData
        },
        {
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`,
            // 'X-Company-Code': companyCode
          }
        }
      );

      if (!nominationResponse.data.success) {
        toast.error(nominationResponse.data.error || 'Failed to save nomination details');
        return;
      }
  
      // Then complete the registration
      const completeResponse = await api.post(
        '/employees/complete-registration',
        {
          employeeId,
          registrationComplete: true,
          allFormData: {
            ...savedData,
            nominationDetails: formData
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
          }
        }
      );
  
      if (completeResponse.data.success) {
        // Get final employee data
        const employeeData = await api.get(
          `/employees/get-employee/${employeeId}`
          // ,
          // {
          //   headers: {
          //     'Authorization': `Bearer ${token}`
          //   }
          // }
        );
  
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
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        
        if (error.response.status === 401) {
          toast.error('Authentication failed. Please log in again.');
          navigate('/login');
        } else if (error.response.status === 403) {
          toast.error('You do not have permission to complete this registration.');
        } else {
          toast.error(error.response.data.error || 'Registration completion failed: ' + error.message);
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        toast.error('No response from server. Please check your connection and try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        toast.error('Registration completion failed: ' + error.message);
      }
    }
  };
  
  // Add a function to save form data at each step
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

  // Create a custom axios instance with authentication token
  const createAuthAxios = () => {
    // const token = getAuthToken();
    // const companyCode = localStorage.getItem('companyCode');
    
    return api.create({
      headers: {
        // 'Authorization': `Bearer ${token}`,
        // 'X-Company-Code': companyCode,
        'Content-Type': 'application/json'
      }
    });
  };

  const renderForm = () => {
    const authAxios = createAuthAxios();
    
    const commonProps = {
      nextStep,
      prevStep,
      employeeId,
      setEmployeeId: handleEmployeeIdUpdate,
      authAxios // Pass the authenticated axios instance to all forms
    };

    switch (currentStep) {
      case 1:
        return (
          <PersonalInformationForm
            {...commonProps}
            savedData={savedData.personalInfo}
            onSave={(id) => {
              handleEmployeeIdUpdate(id);
              setSavedData(prev => {
                const updatedData = {
                  ...prev,
                  employeeId: id
                };
                localStorage.setItem('savedFormData', JSON.stringify(updatedData));
                return updatedData;
              });
            }}
          />
        );
      case 2:
        return (
          <AddressDetailsForm
            {...commonProps}
            savedData={savedData.addressInfo}
            onSave={(data) => saveFormData('addressInfo', data)}
          />
        );
      case 3:
        return (
          <JoiningDetailsForm
            {...commonProps}
            savedData={savedData.joiningDetails}
            onSave={(data) => saveFormData('joiningDetails', data)}
          />
        );
      case 4:
        return (
          <EducationDetailsForm
            {...commonProps}
            savedData={savedData.educationDetails}
            onSave={(data) => saveFormData('educationDetails', data)}
          />
        );
      case 5:
        return (
          <FamilyDetailsForm
            {...commonProps}
            savedData={savedData.familyDetails}
            onSave={(data) => saveFormData('familyDetails', data)}
          />
        );
      case 6:
        return (
          <ServiceHistoryForm
            {...commonProps}
            savedData={savedData.serviceHistory}
            onSave={(data) => saveFormData('serviceHistory', data)}
          />
        );
      case 7:
        return (
          <NominationDetailsForm
            {...commonProps}
            savedData={savedData.nominationDetails}
            onComplete={handleComplete}
          />
        );
      default:
        return <div>Invalid step</div>;
    }
  };
      
  return (
    <div className="register-screen">
      <div className="progress-indicator">
        {employeeId && <div>Employee Code: {employeeId}</div>}
        Step {currentStep} of 7
      </div>
      {renderForm()}
    </div>
  );
};

export default RegisterScreen;

