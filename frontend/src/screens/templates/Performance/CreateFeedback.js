// import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// import api from '../../../api/axiosInstance'  
// import './CreateFeedback.css';
// import { Autocomplete, TextField, Box, Avatar, Typography, CircularProgress } from '@mui/material';

// const CreateFeedback = ({ addFeedback, editData, onClose, feedbackType, currentUser }) => {
//   const [formData, setFormData] = useState(editData || {
//     title: '',
//     employee: '',
//     manager: '',
//     subordinates: '',
//     colleague: '',
//     period: '',
//     startDate: '',
//     dueDate: '',
//     questionTemplate: '',
//     keyResult: '',
//     status: 'Not Started',
//     priority: 'Medium',
//     description: ''
//   });

//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

// useEffect(() => {
//   const fetchEmployees = async () => {
//     try {
//       setLoading(true);
//       // const token = getAuthToken();
//       const response = await api.get('/employees/registered'
//       //   , {
//       //   headers: {
//       //     'Authorization': `Bearer ${token}`
//       //   }
//       // }
//     );
      
//       // Transform the data to the format we need
//       const formattedEmployees = response.data.map(emp => ({
//         id: emp.Emp_ID,
//         name: `${emp.personalInfo?.firstName || ''} ${emp.personalInfo?.lastName || ''}`.trim(),
//         email: emp.personalInfo?.email || '',
//         designation: emp.joiningDetails?.initialDesignation || 'No Designation',
//         department: emp.joiningDetails?.department || 'No Department'
//       }));
      
//       setEmployees(formattedEmployees);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching employees:', error);
//       setError('Failed to load employees data');
//       setLoading(false);
//     }
//   };

//   fetchEmployees();
// }, []);




// useEffect(() => {
//   if (feedbackType === 'selfFeedback' && currentUser) {
//     setFormData(prev => ({
//       ...prev,
//       employee: `${currentUser.personalInfo.firstName} ${currentUser.personalInfo.lastName}`,
//       employeeId: currentUser.Emp_ID
//     }));
//   }
// }, [currentUser, feedbackType]);


// // Add this helper function to get the auth token
// // const getAuthToken = () => {
// //   return localStorage.getItem('token');
// // };




//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleEmployeeSelect = (field, value) => {
//     if (value) {
//       // If value is an object (selected from dropdown)
//       if (typeof value === 'object' && value !== null) {
//         setFormData((prevData) => ({
//           ...prevData,
//           [field]: value.name,
//           [`${field}Data`]: value // Store the full employee data
//         }));
//       } else {
//         // If value is a string (manually entered)
//         setFormData((prevData) => ({
//           ...prevData,
//           [field]: value,
//           [`${field}Data`]: null
//         }));
//       }
//     } else {
//       // If value is null (cleared)
//       setFormData((prevData) => ({
//         ...prevData,
//         [field]: '',
//         [`${field}Data`]: null
//       }));
//     }
//   };

//   // const handleSubmit = (e) => {
//   //   e.preventDefault();
//   //   const newFeedback = {
//   //     id: editData ? editData.id : Date.now(),
//   //     ...formData
//   //   };
//   //   addFeedback(newFeedback, editData ? true : false);
//   //   onClose();
//   // };  


//   const validateDates = (startDate, endDate) => {
//   if (!startDate || !endDate) return true;
//   return new Date(endDate) >= new Date(startDate);
// };

// // Modify the handleSubmit function
// const handleSubmit = (e) => {
//   e.preventDefault();
  
//   // Validate that due date is after start date
//   if (!validateDates(formData.startDate, formData.dueDate)) {
//     setError("Due date must be after or equal to start date");
//     return;
//   }
  
//   const newFeedback = {
//     id: editData ? editData.id : Date.now(),
//     ...formData
//   };
//   addFeedback(newFeedback, editData ? true : false);
//   onClose();
// };


// const handleNumericChange = (e) => {
//   const { name, value } = e.target;
//   // Only allow digits
//   if (/^\d*$/.test(value)) {
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   }
// };

//   return (
//     <div className="create-filter-popup">
//       {/* <h3>{editData ? 'Edit Feedback' : 'Create Feedback'}</h3> */}
//       <form onSubmit={handleSubmit}>
//         <label>Employee</label>
//         <Autocomplete
//           options={employees}
//           getOptionLabel={(option) => {
//             // Handle both string values and option objects
//             if (typeof option === 'string') {
//               return option;
//             }
//             return option.name || '';
//           }}
//           freeSolo
//           value={formData.employeeData || formData.employee}
//           onChange={(event, newValue) => handleEmployeeSelect('employee', newValue)}
//           renderOption={(props, option) => (
//             <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
//               <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
//                 {option.name.charAt(0)}
//               </Avatar>
//               <Box>
//                 <Typography variant="body1">{option.name}</Typography>
//                 <Typography variant="caption" color="text.secondary">
//                   {option.id} • {option.designation} • {option.department}
//                 </Typography>
//               </Box>
//             </Box>
//           )}
//           renderInput={(params) => (
//             <TextField 
//               {...params} 
//               placeholder="Select or enter employee name"
//               required
//               fullWidth
//               variant="outlined"
//               InputProps={{
//                 ...params.InputProps,
//                 endAdornment: (
//                   <>
//                     {loading ? <CircularProgress color="inherit" size={20} /> : null}
//                     {params.InputProps.endAdornment}
//                   </>
//                 ),
//               }}
//             />
//           )}
//         />
        
//         <div className="group">
//           <label>
//             Title
//             <input type="text" name="title" value={formData.title} onChange={handleChange} required />
//           </label>
//           <label>
//             Manager
//             <Autocomplete
//               options={employees}
//               getOptionLabel={(option) => {
//                 if (typeof option === 'string') {
//                   return option;
//                 }
//                 return option.name || '';
//               }}
//               freeSolo
//               value={formData.managerData || formData.manager}
//               onChange={(event, newValue) => handleEmployeeSelect('manager', newValue)}
//               renderOption={(props, option) => (
//                 <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
//                   <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
//                     {option.name.charAt(0)}
//                   </Avatar>
//                   <Box>
//                     <Typography variant="body1">{option.name}</Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       {option.id} • {option.designation} • {option.department}
//                     </Typography>
//                   </Box>
//                 </Box>
//               )}
//               renderInput={(params) => (
//                 <TextField 
//                   {...params} 
//                   placeholder="Select or enter manager name"
//                   required
//                   fullWidth
//                   variant="outlined"
//                   InputProps={{
//                     ...params.InputProps,
//                     endAdornment: (
//                       <>
//                         {loading ? <CircularProgress color="inherit" size={20} /> : null}
//                         {params.InputProps.endAdornment}
//                       </>
//                     ),
//                   }}
//                 />
//               )}
//             />
//           </label>
//         </div>

//         <div className="group">
//           <label>
//             Subordinates
//             <Autocomplete
//               options={employees}
//               getOptionLabel={(option) => {
//                 if (typeof option === 'string') {
//                   return option;
//                 }
//                 return option.name || '';
//               }}
//               freeSolo
//               value={formData.subordinatesData || formData.subordinates}
//               onChange={(event, newValue) => handleEmployeeSelect('subordinates', newValue)}
//               renderOption={(props, option) => (
//                 <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
//                   <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
//                     {option.name.charAt(0)}
//                   </Avatar>
//                   <Box>
//                     <Typography variant="body1">{option.name}</Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       {option.id} • {option.designation} • {option.department}
//                     </Typography>
//                   </Box>
//                 </Box>
//               )}
//               renderInput={(params) => (
//                 <TextField 
//                   {...params} 
//                   placeholder="Select or enter subordinate name"
//                   fullWidth
//                   variant="outlined"
//                   InputProps={{
//                     ...params.InputProps,
//                     endAdornment: (
//                       <>
//                         {loading ? <CircularProgress color="inherit" size={20} /> : null}
//                         {params.InputProps.endAdornment}
//                       </>
//                     ),
//                   }}
//                 />
//               )}
//             />
//           </label>
//           <label>
//             Colleague
//             <Autocomplete
//               options={employees}
//               getOptionLabel={(option) => {
//                 if (typeof option === 'string') {
//                   return option;
//                 }
//                 return option.name || '';
//               }}
//               freeSolo
//               value={formData.colleagueData || formData.colleague}
//               onChange={(event, newValue) => handleEmployeeSelect('colleague', newValue)}
//               renderOption={(props, option) => (
//                 <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
//                   <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
//                     {option.name.charAt(0)}
//                   </Avatar>
//                   <Box>
//                     <Typography variant="body1">{option.name}</Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       {option.id} • {option.designation} • {option.department}
//                     </Typography>
//                   </Box>
//                 </Box>
//               )}
//               renderInput={(params) => (
//                 <TextField 
//                   {...params} 
//                   placeholder="Select or enter colleague name"
//                   fullWidth
//                   variant="outlined"
//                   InputProps={{
//                     ...params.InputProps,
//                     endAdornment: (
//                       <>
//                         {loading ? <CircularProgress color="inherit" size={20} /> : null}
//                         {params.InputProps.endAdornment}
//                       </>
//                     ),
//                   }}
//                 />
//               )}
//             />
//           </label>
//         </div>

//         <div className="group">
//           {/* <label>
//             Period
//             <input type="text" name="period" value={formData.period} onChange={handleChange} required />
//           </label> */}

//           <label>
//   Period (days)
//   <input 
//     type="text" 
//     name="period" 
//     value={formData.period} 
//     onChange={handleNumericChange} 
//     placeholder="Enter number of days" 
//     required 
//   />
// </label>

//           <label>
//             Start Date
//             <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
//           </label>
//           {/* <label>
//             Due Date
//             <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required />
//           </label> */}

//           <label>
//   Due Date
//   <input 
//     type="date" 
//     name="dueDate" 
//     value={formData.dueDate} 
//     onChange={handleChange} 
//     min={formData.startDate} // This prevents selecting dates before start date
//     required 
//   />
// </label>

//         </div>

//         <div className="group">
//           <label>
//             Question Template
//             <input type="text" name="questionTemplate" value={formData.questionTemplate} onChange={handleChange} required />
//           </label>
//           {/* <label>
//             Key Result
//             <input type="text" name="keyResult" value={formData.keyResult} onChange={handleChange} required />
//           </label> */}

//           <label>
//   Key Result
//   <input 
//     type="text" 
//     name="keyResult" 
//     value={formData.keyResult} 
//     onChange={handleNumericChange} 
//     placeholder="Enter numeric value" 
//     required 
//   />
// </label>

//         </div>

//         <div className="group">
//           <label>
//             Status
//             <select name="status" value={formData.status} onChange={handleChange} required>
//               <option value="Not Started">Not Started</option>
//               <option value="In Progress">In Progress</option>
//               <option value="Completed">Completed</option>
//               <option value="Pending">Pending</option>
//             </select>
//           </label>
//           <label>
//             Priority
//             <select name="priority" value={formData.priority} onChange={handleChange} required>
//               <option value="Low">Low</option>
//               <option value="Medium">Medium</option>
//               <option value="High">High</option>
//               <option value="Critical">Critical</option>
//             </select>
//           </label>
//         </div>

//         <div className="group">
//           <label>
//             Description
//             <textarea 
//               name="description" 
//               value={formData.description || ''} 
//               onChange={handleChange} 
//               rows="3"
//             />
//           </label>
//         </div>

//         {/* {error && <div className="error-message">{error}</div>} */}

//         {error && (
//   <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
//     {error}
//   </div>
// )}

//         <button type="submit" className="save-btn">{editData ? 'Update' : 'Save'}</button>
//       </form>
//     </div>
//   );
// };

// export default CreateFeedback;



import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosInstance';
import {
  Autocomplete,
  TextField,
  Box,
  Avatar,
  Typography,
  CircularProgress,
  Grid,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextareaAutosize,
  Divider,
  Alert,
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { styled } from '@mui/material/styles';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  borderRadius: '12px',
  overflow: 'visible'
}));

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contralto,
  padding: theme.spacing(2),
  '& .MuiTypography-root': {
    color: 'white',
    fontWeight: 600
  }
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3)
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1, 4),
  fontWeight: 600
}));

const CreateFeedback = ({ addFeedback, editData, onClose, feedbackType, currentUser }) => {
  const [formData, setFormData] = useState(editData || {
    title: '',
    employee: '',
    manager: '',
    subordinates: '',
    colleague: '',
    period: '',
    startDate: '',
    dueDate: '',
    questionTemplate: '',
    keyResult: '',
    status: 'Not Started',
    priority: 'Medium',
    description: ''
  });

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await api.get('/employees/registered');
        
        // Transform the data to the format we need
        const formattedEmployees = response.data.map(emp => ({
          id: emp.Emp_ID,
          name: `${emp.personalInfo?.firstName || ''} ${emp.personalInfo?.lastName || ''}`.trim(),
          email: emp.personalInfo?.email || '',
          designation: emp.joiningDetails?.initialDesignation || 'No Designation',
          department: emp.joiningDetails?.department || 'No Department'
        }));
        
        setEmployees(formattedEmployees);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setError('Failed to load employees data');
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    if (feedbackType === 'selfFeedback' && currentUser) {
      setFormData(prev => ({
        ...prev,
        employee: `${currentUser.personalInfo.firstName} ${currentUser.personalInfo.lastName}`,
        employeeId: currentUser.Emp_ID
      }));
    }
  }, [currentUser, feedbackType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEmployeeSelect = (field, value) => {
    if (value) {
      // If value is an object (selected from dropdown)
      if (typeof value === 'object' && value !== null) {
        setFormData((prevData) => ({
          ...prevData,
          [field]: value.name,
          [`${field}Data`]: value // Store the full employee data
        }));
      } else {
        // If value is a string (manually entered)
        setFormData((prevData) => ({
          ...prevData,
          [field]: value,
          [`${field}Data`]: null
        }));
      }
    } else {
      // If value is null (cleared)
      setFormData((prevData) => ({
        ...prevData,
        [field]: '',
        [`${field}Data`]: null
      }));
    }
  };

  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    // Only allow digits
    if (/^\d*$/.test(value)) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const validateDates = (startDate, endDate) => {
    if (!startDate || !endDate) return true;
    return new Date(endDate) >= new Date(startDate);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate that due date is after start date
    if (!validateDates(formData.startDate, formData.dueDate)) {
      setError("Due date must be after or equal to start date");
      return;
    }
    
    const newFeedback = {
      id: editData ? editData.id : Date.now(),
      ...formData
    };
    addFeedback(newFeedback, editData ? true : false);
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StyledCard>
        {/* <StyledCardHeader 
          title={editData ? 'Edit Feedback' : 'Create Feedback'} 
        /> */}
        <StyledCardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Employee Field */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom fontWeight={500}>
                  Employee
                </Typography>
                <Autocomplete
                  options={employees}
                  getOptionLabel={(option) => {
                    if (typeof option === 'string') return option;
                    return option.name || '';
                  }}
                  freeSolo
                  value={formData.employeeData || formData.employee}
                  onChange={(event, newValue) => handleEmployeeSelect('employee', newValue)}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        {option.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1">{option.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.id} • {option.designation} • {option.department}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      placeholder="Select or enter employee name"
                      required
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Title and Manager */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom fontWeight={500}>
                  Title
                </Typography>
                <TextField 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  required 
                  fullWidth
                  variant="outlined"
                  placeholder="Enter feedback title"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom fontWeight={500}>
                  Manager
                </Typography>
                <Autocomplete
                  options={employees}
                  getOptionLabel={(option) => {
                    if (typeof option === 'string') return option;
                    return option.name || '';
                  }}
                  freeSolo
                  value={formData.managerData || formData.manager}
                  onChange={(event, newValue) => handleEmployeeSelect('manager', newValue)}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        {option.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1">{option.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.id} • {option.designation} • {option.department}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      placeholder="Select or enter manager name"
                      required
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Subordinates and Colleague */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom fontWeight={500}>
                  Subordinates
                </Typography>
                <Autocomplete
                  options={employees}
                  getOptionLabel={(option) => {
                    if (typeof option === 'string') return option;
                    return option.name || '';
                  }}
                  freeSolo
                  value={formData.subordinatesData || formData.subordinates}
                  onChange={(event, newValue) => handleEmployeeSelect('subordinates', newValue)}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        {option.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1">{option.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.id} • {option.designation} • {option.department}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      placeholder="Select or enter subordinate name"
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom fontWeight={500}>
                  Colleague
                </Typography>
                <Autocomplete
                  options={employees}
                  getOptionLabel={(option) => {
                    if (typeof option === 'string') return option;
                    return option.name || '';
                  }}
                  freeSolo
                  value={formData.colleagueData || formData.colleague}
                  onChange={(event, newValue) => handleEmployeeSelect('colleague', newValue)}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        {option.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1">{option.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.id} • {option.designation} • {option.department}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      placeholder="Select or enter colleague name"
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Period, Start Date, Due Date */}
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom fontWeight={500}>
                  Period (days)
                </Typography>
                <TextField
                  name="period"
                  value={formData.period}
                  onChange={handleNumericChange}
                  placeholder="Enter number of days"
                  required
                  fullWidth
                  variant="outlined"
                  type="text"
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom fontWeight={500}>
                  Start Date
                </Typography>
                <TextField
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  fullWidth
                  variant="outlined"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom fontWeight={500}>
                  Due Date
                </Typography>
                <TextField
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                  fullWidth
                  variant="outlined"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: formData.startDate }}
                />
              </Grid>

                            {/* Question Template and Key Result */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom fontWeight={500}>
                  Question Template
                </Typography>
                <TextField
                  name="questionTemplate"
                  value={formData.questionTemplate}
                  onChange={handleChange}
                  required
                  fullWidth
                  variant="outlined"
                  placeholder="Enter question template"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom fontWeight={500}>
                  Key Result
                </Typography>
                <TextField
                  name="keyResult"
                  value={formData.keyResult}
                  onChange={handleNumericChange}
                  placeholder="Enter numeric value"
                  required
                  fullWidth
                  variant="outlined"
                  type="text"
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                />
              </Grid>

              {/* Status and Priority */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom fontWeight={500}>
                  Status
                </Typography>
                <FormControl fullWidth variant="outlined">
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="Not Started">Not Started</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom fontWeight={500}>
                  Priority
                </Typography>
                <FormControl fullWidth variant="outlined">
                  <Select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Critical">Critical</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom fontWeight={500}>
                  Description
                </Typography>
                <TextField
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  placeholder="Enter detailed description"
                />
              </Grid>

              {/* Error Message */}
              {error && (
                <Grid item xs={12}>
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {error}
                  </Alert>
                </Grid>
              )}

              {/* Submit Button */}
              {/* <Grid item xs={12}  
              sx={{  display: "flex",
                  gap: "10px",
                  mt: 4,
                  justifyContent: "flex-end", }}
              >
                <Button 
                  // variant="outlined" 
                  // color="secondary" 
                  onClick={onClose} 
                  sx={{
                    border: "2px solid #1976d2",
                    color: "#1976d2",
                    "&:hover": {
                      border: "2px solid #64b5f6",
                      backgroundColor: "#e3f2fd",
                      color: "#1976d2",
                    },
                    textTransform: "none",
                    borderRadius: "8px",
                    px: 3,
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </Button>
                <SubmitButton 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  sx={{
                    background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                    color: "white",
                    "&:hover": {
                      background: "linear-gradient(45deg, #1565c0, #42a5f5)",
                    },
                    textTransform: "none",
                    borderRadius: "8px",
                    px: 4,
                    py: 1,
                    fontWeight: 600,
                  }}
                >
                  {editData ? 'Update' : 'Save'}
                </SubmitButton>
              </Grid> */}

              {/* Submit Button */}
<Grid item xs={12}  
sx={{  display: "flex",
    gap: "10px",
    mt: 4,
    justifyContent: "flex-end", }}
>
  <Button 
    // variant="outlined" 
    // color="secondary" 
    onClick={onClose} 
    sx={{
      border: "2px solid #1976d2",
      color: "#1976d2",
      "&:hover": {
        border: "2px solid #64b5f6",
        backgroundColor: "#e3f2fd",
        color: "#1976d2",
      },
      textTransform: "none",
      borderRadius: "8px",
      px: 3,
      fontWeight: 600,
    }}
  >
    Cancel
  </Button>
  <SubmitButton 
    type="submit" 
    variant="contained" 
    color="primary"
    sx={{
      background: "linear-gradient(45deg, #1976d2, #64b5f6)",
      color: "white",
      "&:hover": {
        background: "linear-gradient(45deg, #1565c0, #42a5f5)",
      },
      textTransform: "none",
      borderRadius: "8px",
      px: 4,
      py: 1,
      fontWeight: 600,
    }}
  >
    {editData ? 'Update' : 'Save'}
  </SubmitButton>
</Grid>

            </Grid>
          </form>
        </StyledCardContent>
      </StyledCard>
    </LocalizationProvider>
  );
};

export default CreateFeedback;

