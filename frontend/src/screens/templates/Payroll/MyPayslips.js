import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosInstance';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  Divider,
  Container,
  Stack,
  Avatar,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { 
  Download, 
  Visibility, 
  Person, 
  Business, 
  Work, 
  Badge,
  TrendingUp,
  Receipt,
  CalendarToday,
  AccountBalance,
  FilterList,
  Clear,
  Close,
  AttachMoney,
  RemoveCircle,
  AddCircle,
  Info
} from '@mui/icons-material';

const MyPayslips = () => {
  const theme = useTheme();
  const [payslips, setPayslips] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState({});
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    month: '',
    year: new Date().getFullYear()
  });
  
  // Add state for view modal
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  // Generate month and year options
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // useEffect(() => {
  //   fetchMyPayslips();
  // }, [filters]);

//   // const fetchMyPayslips = async () => {
//   //   try {
//   //     setLoading(true);
//   //     setError('');
      
//   //     const params = new URLSearchParams();
      
//   //     if (filters.month) params.append('month', filters.month);
//   //     if (filters.year) params.append('year', filters.year);
      
//   //     console.log('Making API call to:', `/payroll/my-payslips?${params.toString()}`);
      
//   //     const response = await api.get(`/payroll/my-payslips?${params.toString()}`);

//   //     console.log('API Response:', response.data);

//   //     if (response.data.success) {
//   //       setPayslips(response.data.data.payslips);
//   //       setEmployee(response.data.data.employee);
//   //     } else {
//   //       setError(response.data.message || 'Failed to fetch payslips');
//   //     }

//   //   } catch (error) {
//   //     console.error('Error fetching payslips:', error);
//   //     if (error.response?.status === 403) {
//   //       setError('Access denied. Please contact your HR department.');
//   //     } else if (error.response?.status === 404) {
//   //       setError('No employee record found for your account.');
//   //     } else {
//   //       setError(error.response?.data?.message || 'Error fetching payslips');
//   //     }
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

// // Update the fetchMyPayslips function to handle the new response structure
// const fetchMyPayslips = async () => {
//   try {
//     setLoading(true);
//     setError('');
    
//     const params = new URLSearchParams();
    
//     if (filters.month) params.append('month', filters.month);
//     if (filters.year) params.append('year', filters.year);
    
//     console.log('Making API call to:', `/payroll/my-payslips?${params.toString()}`);
    
//     const response = await api.get(`/payroll/my-payslips?${params.toString()}`);

//     console.log('API Response:', response.data);

//     if (response.data.success) {
//       setPayslips(response.data.data.payslips || []);
//       setEmployee(response.data.data.employee);
//     } else {
//       // Handle the case where user needs to be linked to an employee
//       if (response.data.needsLinking) {
//         setError('Your account is not linked to an employee record. Please contact HR to link your account.');
//       } else {
//         setError(response.data.message || 'Failed to fetch payslips');
//       }
//     }

//   } catch (error) {
//     console.error('Error fetching payslips:', error);
//     if (error.response?.status === 403) {
//       setError('Access denied. Please contact your HR department.');
//     } else if (error.response?.status === 404) {
//       setError('No employee record found for your account. Please contact HR to link your account.');
//     } else if (error.response?.status === 401) {
//       setError('Your session has expired. Please login again.');
//     } else {
//       setError(error.response?.data?.message || 'Error fetching payslips. Please try again.');
//     }
//   } finally {
//     setLoading(false);
//   }
// };

// Add this function before handleDownloadPayslip

// Update the fetchMyPayslips function to handle the new response structure

// const fetchMyPayslips = async () => {
//   try {
//     setLoading(true);
//     setError('');
    
//     const params = new URLSearchParams();
    
//     if (filters.month) params.append('month', filters.month);
//     if (filters.year) params.append('year', filters.year);
    
//     console.log('Making API call to:', `/payroll/my-payslips?${params.toString()}`);
    
//     const response = await api.get(`/payroll/my-payslips?${params.toString()}`);

//     console.log('API Response:', response.data);

//     if (response.data.success) {
//       setPayslips(response.data.data.payslips || []);
//       setEmployee(response.data.data.employee);
      
//       // Handle case where user needs to be linked to an employee
//       if (response.data.needsLinking) {
//         setError('Your account is not linked to an employee record. Please contact HR to link your account to your employee profile.');
//       }
//     } else {
//       setError(response.data.message || 'Failed to fetch payslips');
//     }

//   } catch (error) {
//     console.error('Error fetching payslips:', error);
//     if (error.response?.status === 403) {
//       setError('Access denied. Please contact your HR department.');
//     } else if (error.response?.status === 404) {
//       setError('No employee record found for your account. Please contact HR to link your account.');
//     } else if (error.response?.status === 401) {
//       setError('Your session has expired. Please login again.');
//     } else {
//       setError(error.response?.data?.message || 'Error fetching payslips. Please try again.');
//     }
//   } finally {
//     setLoading(false);
//   }
// };






// Add this function to handle employee linking (optional - for HR use)
const handleLinkEmployee = async (empId) => {
  try {
    const response = await api.post('/payroll/link-employee', { empId });
    
    if (response.data.success) {
      setError('');
      // Refresh payslips after linking
      fetchMyPayslips();
    } else {
      setError(response.data.message || 'Failed to link employee');
    }
  } catch (error) {
    console.error('Error linking employee:', error);
    setError(error.response?.data?.message || 'Error linking employee account');
  }
};


const verifyPayslipAccess = (payslipId) => {
  const payslip = payslips.find(p => p._id === payslipId);
  if (!payslip) {
    setError('Invalid payslip selected. Please refresh the page and try again.');
    return false;
  }
  return true;
};

// // Update the handleDownloadPayslip function to include verification
// const handleDownloadPayslip = async (payslipId, retryCount = 0) => {
//   // Verify payslip access first
//   if (!verifyPayslipAccess(payslipId)) {
//     return;
//   }

//   try {
//     setDownloading(prev => ({ ...prev, [payslipId]: true }));
//     setError(''); // Clear any previous errors
    
//     console.log('Downloading payslip with ID:', payslipId);
//     console.log('Current user employee ID:', employee?.empId);
//     console.log('Making download request to:', `/payroll/my-payslips/${payslipId}/download`);
    
//     const response = await api.get(
//       `/payroll/my-payslips/${payslipId}/download`,
//       {
//         responseType: 'blob',
//         timeout: 30000 // 30 second timeout
//       }
//     );

//     console.log('Download response received:', response);

//     // Verify the response is actually a PDF
//     if (response.data.type !== 'application/pdf' && !response.headers['content-type']?.includes('pdf')) {
//       throw new Error('Server did not return a PDF file');
//     }

//     const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
//     const link = document.createElement('a');
//     link.href = url;
    
//     const contentDisposition = response.headers['content-disposition'];
//     let filename = `payslip_${employee?.empId || 'unknown'}_${payslipId.slice(-6)}.pdf`;
//     if (contentDisposition) {
//       const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
//       if (filenameMatch) {
//         filename = filenameMatch[1].replace(/['"]/g, '');
//       }
//     }
    
//     link.setAttribute('download', filename);
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//     window.URL.revokeObjectURL(url);
    
//     // Show success message
//     console.log('Payslip downloaded successfully:', filename);
    
//   } catch (error) {
//     console.error('Error downloading payslip:', error);

//     // Enhanced error handling for blob responses
//     if (error.response && error.response.data instanceof Blob) {
//       try {
//         const text = await error.response.data.text();
//         const errorData = JSON.parse(text);
//         console.error('Server error message:', errorData);
        
//         // If it's a 401 and we haven't retried yet, try to refresh token
//         if (error.response.status === 401 && retryCount === 0) {
//           console.log('Token might be expired, attempting retry...');
//           return handleDownloadPayslip(payslipId, 1);
//         }
        
//         setError(errorData.message || 'Error downloading payslip');
//       } catch (parseError) {
//         console.error('Could not parse error response:', parseError);
//         setError('Error downloading payslip - server returned invalid response');
//       }
//     } else {
//       // Handle different error scenarios
//       if (error.response?.status === 403) {
//         setError('Access denied. This payslip may not belong to your account or you may not have permission to download it. Please contact HR if you believe this is an error.');
//       } else if (error.response?.status === 404) {
//         setError('Payslip not found. It may have been removed or the link is invalid.');
//       } else if (error.response?.status === 401) {
//         if (retryCount === 0) {
//           console.log('Authentication failed, attempting retry...');
//           return handleDownloadPayslip(payslipId, 1);
//         } else {
//           setError('Authentication failed. Please logout and login again.');
//         }
//       } else if (error.code === 'ECONNABORTED') {
//         setError('Download timeout. Please check your internet connection and try again.');
//       } else {
//         setError(error.response?.data?.message || 'Error downloading payslip. Please try again later.');
//       }
//     }
//   } finally {
//     setDownloading(prev => ({ ...prev, [payslipId]: false }));
//   }
// };

// Update the fetchMyPayslips function with better error handling
const fetchMyPayslips = async () => {
  try {
    setLoading(true);
    setError('');
    
    // Check if user is authenticated before making request
    const token = localStorage.getItem('token');
    const companyCode = localStorage.getItem('companyCode');
    
    if (!token || !companyCode) {
      setError('Authentication required. Please login again.');
      // Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      return;
    }
    
    const params = new URLSearchParams();
    
    if (filters.month) params.append('month', filters.month);
    if (filters.year) params.append('year', filters.year);
    
    console.log('Making API call to:', `/payroll/my-payslips?${params.toString()}`);
    console.log('With headers:', {
      Authorization: `Bearer ${token.substring(0, 10)}...`,
      'x-company-code': companyCode
    });
    
    const response = await api.get(`/payroll/my-payslips?${params.toString()}`);

    console.log('API Response:', response.data);

    if (response.data.success) {
      setPayslips(response.data.data.payslips || []);
      setEmployee(response.data.data.employee);
      
      // Handle case where user needs to be linked to an employee
      if (response.data.needsLinking) {
        setError('Your account is not linked to an employee record. Please contact HR to link your account to your employee profile.');
      }
    } else {
      setError(response.data.message || 'Failed to fetch payslips');
    }

  } catch (error) {
    console.error('Error fetching payslips:', error);
    
    if (error.response?.status === 401) {
      setError('Your session has expired. Please login again.');
      // Clear auth data and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('companyCode');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } else if (error.response?.status === 403) {
      setError('Access denied. Please contact your HR department.');
    } else if (error.response?.status === 404) {
      setError('No employee record found for your account. Please contact HR to link your account.');
    } else if (error.code === 'ECONNABORTED') {
      setError('Request timeout. Please check your internet connection and try again.');
    } else {
      setError(error.response?.data?.message || 'Error fetching payslips. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};

// Update the handleDownloadPayslip function with better error handling
const handleDownloadPayslip = async (payslipId, retryCount = 0) => {
  // Verify payslip access first
  if (!verifyPayslipAccess(payslipId)) {
    return;
  }

  // Check authentication before download
  const token = localStorage.getItem('token');
  const companyCode = localStorage.getItem('companyCode');
  
  if (!token || !companyCode) {
    setError('Authentication required for download. Please login again.');
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
    return;
  }

  try {
    setDownloading(prev => ({ ...prev, [payslipId]: true }));
    setError(''); // Clear any previous errors
    
    console.log('Downloading payslip with ID:', payslipId);
    console.log('Current user employee ID:', employee?.empId);
    console.log('Making download request to:', `/payroll/my-payslips/${payslipId}/download`);
    
    const response = await api.get(
      `/payroll/my-payslips/${payslipId}/download`,
      {
        responseType: 'blob',
        timeout: 60000, // Increase timeout for PDF generation
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-company-code': companyCode
        }
      }
    );

    console.log('Download response received:', {
      status: response.status,
      contentType: response.headers['content-type'],
      size: response.data.size
    });

    // Verify the response is actually a PDF
    if (response.data.type !== 'application/pdf' && !response.headers['content-type']?.includes('pdf')) {
           throw new Error('Server did not return a PDF file');
    }

    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    
    const contentDisposition = response.headers['content-disposition'];
    let filename = `payslip_${employee?.empId || 'unknown'}_${payslipId.slice(-6)}.pdf`;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch) {
        filename = filenameMatch[1].replace(/['"]/g, '');
      }
    }
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    // Show success message
    console.log('Payslip downloaded successfully:', filename);
    
  } catch (error) {
    console.error('Error downloading payslip:', error);

    // Enhanced error handling for blob responses
    if (error.response && error.response.data instanceof Blob) {
      try {
        const text = await error.response.data.text();
        const errorData = JSON.parse(text);
        console.error('Server error message:', errorData);
        
        // Handle authentication errors
        if (error.response.status === 401) {
          if (retryCount === 0) {
            console.log('Authentication failed, clearing auth and redirecting...');
            localStorage.removeItem('token');
            localStorage.removeItem('companyCode');
            setError('Your session has expired. Redirecting to login...');
            setTimeout(() => {
              window.location.href = '/login';
            }, 2000);
            return;
          }
        }
        
        setError(errorData.message || 'Error downloading payslip');
      } catch (parseError) {
        console.error('Could not parse error response:', parseError);
        setError('Error downloading payslip - server returned invalid response');
      }
    } else {
      // Handle different error scenarios
      if (error.response?.status === 403) {
        setError('Access denied. This payslip may not belong to your account or you may not have permission to download it. Please contact HR if you believe this is an error.');
      } else if (error.response?.status === 404) {
        setError('Payslip not found. It may have been removed or the link is invalid.');
      } else if (error.response?.status === 401) {
        setError('Authentication failed. Redirecting to login...');
        localStorage.removeItem('token');
        localStorage.removeItem('companyCode');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (error.code === 'ECONNABORTED') {
        setError('Download timeout. Please check your internet connection and try again.');
      } else if (error.message === 'Network Error') {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError(error.response?.data?.message || 'Error downloading payslip. Please try again later.');
      }
    }
  } finally {
    setDownloading(prev => ({ ...prev, [payslipId]: false }));
  }
};

// Add useEffect to check authentication on component mount
useEffect(() => {
  const checkAuthentication = () => {
    const token = localStorage.getItem('token');
    const companyCode = localStorage.getItem('companyCode');
    
    if (!token || !companyCode) {
      console.log('No authentication found, redirecting to login');
      setError('Authentication required. Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      return false;
    }
    return true;
  };
  
  if (checkAuthentication()) {
    fetchMyPayslips();
  }
}, [filters]);

// Update the existing useEffect to remove the old one
// useEffect(() => {
//   fetchMyPayslips();
// }, [filters]);
 



  
  const handleViewPayslip = (payslip) => {
    console.log('Viewing payslip:', payslip);
    setSelectedPayslip(payslip);
    setViewModalOpen(true);
  };

  // Add function to close view modal
  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedPayslip(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  const getMonthName = (monthNumber) => {
    const month = months.find(m => m.value === monthNumber);
    return month ? month.label : monthNumber;
  };

  const calculateNetPay = (payslip) => {
    return parseFloat(payslip.netSalary || 0);
  };

  const calculateAllowancesTotal = (payslip) => {
    if (payslip.allowances && Array.isArray(payslip.allowances)) {
      return payslip.allowances.reduce((sum, allowance) => sum + parseFloat(allowance.amount || 0), 0);
    }
    return parseFloat(payslip.grossSalary || 0);
  };

  const calculateDeductionsTotal = (payslip) => {
    if (payslip.deductions && Array.isArray(payslip.deductions)) {
      return payslip.deductions.reduce((sum, deduction) => sum + parseFloat(deduction.amount || 0), 0);
    }
    return parseFloat(payslip.totalDeductions || 0);
  };

  // Add PayslipViewModal component
  const PayslipViewModal = ({ open, onClose, payslip, employee }) => {
    if (!payslip) return null;

    const netPay = calculateNetPay(payslip);
    const grossSalary = parseFloat(payslip.grossSalary || 0);
    const totalDeductions = calculateDeductionsTotal(payslip);

    return (
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: theme.palette.primary.main, 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Receipt />
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Payslip Details
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {getMonthName(payslip.month)} {payslip.year}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 3 }}>
            {/* Employee Info Section */}
            <Card variant="outlined" sx={{ mb: 3, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom fontWeight="600">
                  <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Employee Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">Employee ID</Typography>
                    <Typography variant="body2" fontWeight="600">{employee?.empId}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">Name</Typography>
                    <Typography variant="body2" fontWeight="600">{employee?.empName}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">Department</Typography>
                    <Typography variant="body2" fontWeight="600">{employee?.department}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">Designation</Typography>
                    <Typography variant="body2" fontWeight="600">{employee?.designation}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Pay Period Info */}
            <Card variant="outlined" sx={{ mb: 3, bgcolor: alpha(theme.palette.info.main, 0.02) }}>
              <CardContent>
                <Typography variant="h6" color="info.main" gutterBottom fontWeight="600">
                  <CalendarToday sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Pay Period Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">Pay Month</Typography>
                    <Typography variant="body2" fontWeight="600">
                      {getMonthName(payslip.month)} {payslip.year}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">Generated Date</Typography>
                    <Typography variant="body2" fontWeight="600">
                      {payslip.generatedDate ? 
                        new Date(payslip.generatedDate).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        }) : 
                        'N/A'
                      }
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">Status</Typography>
                    <Box>
                      <Chip 
                        label={payslip.status || 'Generated'} 
                        color={payslip.status === 'Paid' ? 'success' : 'default'}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Salary Breakdown */}
            <Grid container spacing={3}>
              {/* Earnings */}
              <Grid item xs={12} md={6}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    bgcolor: alpha(theme.palette.success.main, 0.02),
                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                    height: '100%'
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" color="success.main" gutterBottom fontWeight="600">
                      <AddCircle sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Earnings
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <List dense>
                      {payslip.allowances && payslip.allowances.length > 0 ? (
                        payslip.allowances.map((allowance, index) => (
                          <ListItem key={index} sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <AttachMoney color="success" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={allowance.name}
                              secondary={`${allowance.percentage}% of base`}
                            />
                            <Typography variant="body2" fontWeight="600" color="success.main">
                              {formatCurrency(allowance.amount)}
                            </Typography>
                          </ListItem>
                        ))
                      ) : (
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <AttachMoney color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Basic Pay" />
                          <Typography variant="body2" fontWeight="600" color="success.main">
                            {formatCurrency(payslip.basicPay)}
                          </Typography>
                        </ListItem>
                      )}
                    </List>
                    
                    <Divider sx={{ my: 2 }} />
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body1" fontWeight="700" color="success.main">
                        Total Earnings
                      </Typography>
                      <Typography variant="h6" fontWeight="700" color="success.main">
                        {formatCurrency(grossSalary)}

                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Deductions */}
              <Grid item xs={12} md={6}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    bgcolor: alpha(theme.palette.error.main, 0.02),
                    border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                    height: '100%'
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" color="error.main" gutterBottom fontWeight="600">
                      <RemoveCircle sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Deductions
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <List dense>
                      {payslip.deductions && payslip.deductions.length > 0 ? (
                        payslip.deductions.map((deduction, index) => (
                          <ListItem key={index} sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <RemoveCircle color="error" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={deduction.name}
                              secondary={deduction.isFixedAmount ? 'Fixed Amount' : `${deduction.percentage}% of basic`}
                            />
                            <Typography variant="body2" fontWeight="600" color="error.main">
                              {formatCurrency(deduction.amount)}
                            </Typography>
                          </ListItem>
                        ))
                      ) : (
                        <ListItem sx={{ px: 0 }}>
                          <ListItemText 
                            primary="No Deductions"
                            secondary="No deductions applied"
                          />
                          <Typography variant="body2" fontWeight="600" color="text.secondary">
                            {formatCurrency(0)}
                          </Typography>
                        </ListItem>
                      )}
                    </List>
                    
                    <Divider sx={{ my: 2 }} />
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body1" fontWeight="700" color="error.main">
                        Total Deductions
                      </Typography>
                      <Typography variant="h6" fontWeight="700" color="error.main">
                        {formatCurrency(totalDeductions)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Net Salary */}
            {/* <Card 
              sx={{ 
                mt: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: 'white'
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <AccountBalance sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h4" fontWeight="900" sx={{ mb: 1 }}>
                  {formatCurrency(netPay)}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Net Salary (Take Home)
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                  After all deductions
                </Typography>
              </CardContent>
            </Card> */}

            {/* Net Salary */}
<Card 
  sx={{ 
    mt: 3,
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    color: 'white'
  }}
>
  <CardContent sx={{ textAlign: 'center', py: 2 }}>
    <AccountBalance sx={{ fontSize: 32, mb: 1 }} />
    <Typography variant="h5" fontWeight="900" sx={{ mb: 0.5 }}>
      {formatCurrency(netPay)}
    </Typography>
    <Typography variant="body1" sx={{ opacity: 0.9 }}>
      Net Salary (Take Home)
    </Typography>
    <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
      After all deductions
    </Typography>
  </CardContent>
</Card>


            {/* Additional Info */}
            {(payslip.lopDays > 0 || payslip.payableDays) && (
              <Card variant="outlined" sx={{ mt: 3, bgcolor: alpha(theme.palette.warning.main, 0.02) }}>
                <CardContent>
                  <Typography variant="h6" color="warning.main" gutterBottom fontWeight="600">
                    <Info sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Attendance Information
                  </Typography>
                  <Grid container spacing={2}>
                    {payslip.payableDays && (
                      <Grid item xs={6} sm={4}>
                        <Typography variant="caption" color="text.secondary">Payable Days</Typography>
                        <Typography variant="body2" fontWeight="600">{payslip.payableDays} days</Typography>
                      </Grid>
                    )}
                    {payslip.lopDays !== undefined && (
                      <Grid item xs={6} sm={4}>
                        <Typography variant="caption" color="text.secondary">LOP Days</Typography>
                        <Typography variant="body2" fontWeight="600" color={payslip.lopDays > 0 ? 'error.main' : 'success.main'}>
                          {payslip.lopDays} days
                        </Typography>
                      </Grid>
                    )}
                    {payslip.payableDays && payslip.lopDays !== undefined && (
                      <Grid item xs={6} sm={4}>
                        <Typography variant="caption" color="text.secondary">Working Days</Typography>
                        <Typography variant="body2" fontWeight="600" color="success.main">
                          {payslip.payableDays - payslip.lopDays} days
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, bgcolor: alpha(theme.palette.grey[500], 0.05) }}>
          <Button 
            onClick={onClose} 
            variant="outlined"
            startIcon={<Close />}
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
            Close
          </Button>
          <Button 
            onClick={() => handleDownloadPayslip(payslip._id)}
            variant="contained"
            startIcon={downloading[payslip._id] ? <CircularProgress size={16} /> : <Download />}
            disabled={downloading[payslip._id]}
            sx={{
              background: "linear-gradient(45deg, #f44336, #ff7961)",
              fontSize: "0.95rem",
              textTransform: "none",
              padding: "8px 32px",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(244, 67, 54, 0.2)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(45deg, #d32f2f, #f44336)",
              },
            }}
          >
            {downloading[payslip._id] ? 'Downloading...' : 'Download PDF'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box 
          display="flex" 
          flexDirection="column"
          justifyContent="center" 
          alignItems="center" 
          minHeight="60vh"
          gap={2}
        >
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" color="text.secondary">
            Loading your payslips...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Stack spacing={4}>
        {/* Header Section */}
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            fontWeight="bold"
            color="primary"
            sx={{ 
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Receipt sx={{ fontSize: 40 }} />
            My Payslips
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and download your salary statements
          </Typography>
        </Box>

        {/* Employee Information Card */}
        {employee && (
          <Card 
            elevation={2}
            sx={{ 
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Avatar 
                  sx={{ 
                    width: 60, 
                    height: 60, 
                    bgcolor: theme.palette.primary.main,
                    fontSize: '1.5rem'
                  }}
                >
                  {employee.empName?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold" color="primary">
                    {employee.empName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Employee Profile
                  </Typography>
                </Box>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Badge color="primary" />
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Employee ID
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {employee.empId}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Person color="primary" />
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Full Name
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {employee.empName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Business color="primary" />
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Department
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {employee.department}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Work color="primary" />
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Designation
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {employee.designation}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Filters Section */}
        <Card elevation={1}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <FilterList color="primary" />
              <Typography variant="h6" fontWeight="600">
                Filter Payslips
              </Typography>
            </Box>
            
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Month</InputLabel>
                  <Select
                    value={filters.month}
                    onChange={(e) => setFilters(prev => ({ ...prev, month: e.target.value }))}
                    label="Month"
                  >
                    <MenuItem value="">All Months</MenuItem>
                    {months.map((month) => (
                      <MenuItem key={month.value} value={month.value}>
                        {month.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Year</InputLabel>
                  <Select
                    value={filters.year}
                    onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                    label="Year"
                  >
                    <MenuItem value="">All Years</MenuItem>
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="outlined" 
                  onClick={() => setFilters({ month: '', year: '' })}
                  size="medium"
                  startIcon={<Clear />}
                  fullWidth
                  sx={{ height: 40 }}
                >
                  Clear Filters
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 2,
              '& .MuiAlert-message': {
                width: '100%'
              }
            }}
          >
            {error}
          </Alert>
        )}

        {/* Payslips Table */}
        <Card elevation={2}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3, pb: 0 }}>
              <Typography variant="h6" fontWeight="600" color="primary">
                Payslip Records
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {payslips.length} payslip{payslips.length !== 1 ? 's' : ''} found
              </Typography>
            </Box>
            
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                    <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <CalendarToday fontSize="small" />
                        Pay Period
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <TrendingUp fontSize="small" />
                        Gross Salary
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                      Total Deductions
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <AccountBalance fontSize="small" />
                        Net Pay
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                      Generated Date
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }} align="center">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payslips.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                          <Receipt sx={{ fontSize: 60, color: 'text.disabled' }} />
                          <Typography variant="h6" color="text.secondary">
                            No payslips found
                          </Typography>
                          <Typography variant="body2" color="text.disabled">
                            No payslips match the selected criteria
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    payslips.map((payslip, index) => {
                      const netPay = calculateNetPay(payslip);
                      const grossSalary = parseFloat(payslip.grossSalary || 0);
                      const totalDeductions = calculateDeductionsTotal(payslip);

                      return (
                        <TableRow 
                          key={payslip._id}
                          sx={{ 
                            '&:hover': { 
                              bgcolor: alpha(theme.palette.primary.main, 0.02) 
                            },
                            '&:nth-of-type(even)': {
                              bgcolor: alpha(theme.palette.grey[500], 0.02)
                            }
                          }}
                        >
                          <TableCell>
                            <Box>
                              <Typography variant="body1" fontWeight="600">
                                {getMonthName(payslip.month)} {payslip.year}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Pay Period #{index + 1}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1" fontWeight="600" color="success.main">
                              {formatCurrency(grossSalary)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1" fontWeight="600" color="error.main">
                              {formatCurrency(totalDeductions)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body1" fontWeight="700" color="primary.main">
                                {formatCurrency(netPay)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Take Home
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {payslip.generatedDate ? 
                                new Date(payslip.generatedDate).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                }) : 
                                'N/A'
                              }
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={payslip.status || 'Generated'} 
                              color={payslip.status === 'Paid' ? 'success' : 'default'}
                              size="small"
                              sx={{ 
                                fontWeight: 600,
                                minWidth: 80
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Stack direction="row" spacing={1} justifyContent="center">
                              <Tooltip title="View Payslip Details">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleViewPayslip(payslip)}
                                  sx={{
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    '&:hover': {
                                      bgcolor: alpha(theme.palette.primary.main, 0.2)
                                    }
                                  }}
                                >
                                  <Visibility fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Download PDF">
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={() => handleDownloadPayslip(payslip._id)}
                                  disabled={downloading[payslip._id]}
                                  sx={{
                                    bgcolor: alpha(theme.palette.success.main, 0.1),
                                    '&:hover': {
                                      bgcolor: alpha(theme.palette.success.main, 0.2)
                                    }
                                  }}
                                >
                                  {downloading[payslip._id] ? 
                                    <CircularProgress size={16} /> : 
                                    <Download fontSize="small" />
                                  }
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        {payslips.length > 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                elevation={2}
                sx={{ 
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Receipt sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {payslips.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Payslips
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                elevation={2}
                sx={{ 
                  background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <CalendarToday sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold" color="info.main">
                    {payslips.length > 0 && 
                      `${getMonthName(payslips[0].month)} ${payslips[0].year}`
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Latest Pay Period
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                elevation={2}
                sx={{ 
                  background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <AccountBalance sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold" color="success.main">
                    {payslips.length > 0 && formatCurrency(calculateNetPay(payslips[0]))}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Latest Net Pay
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                elevation={2}
                sx={{ 
                  background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <TrendingUp sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold" color="warning.main">
                    {formatCurrency(
                      payslips
                        .filter(p => p.year === new Date().getFullYear())
                        .reduce((sum, p) => sum + calculateNetPay(p), 0)
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    YTD Earnings
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Detailed Breakdown Card */}
        {payslips.length > 0 && payslips[0] && (
          <Card elevation={2}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Receipt color="primary" />
                <Typography variant="h6" fontWeight="600">
                  Latest Payslip Breakdown
                </Typography>
                <Chip 
                  label={`${getMonthName(payslips[0].month)} ${payslips[0].year}`}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </Box>
              
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      bgcolor: alpha(theme.palette.success.main, 0.02),
                      border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" color="success.main" gutterBottom fontWeight="600">
                        💰 Earnings
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      {payslips[0].allowances && payslips[0].allowances.length > 0 ? (
                        payslips[0].allowances.map((allowance, index) => (
                          <Box key={index} display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                            <Typography variant="body2" color="text.secondary">
                              {allowance.name}
                            </Typography>
                            <Typography variant="body2" fontWeight="600">
                              {formatCurrency(allowance.amount)}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                          <Typography variant="body2" color="text.secondary">
                            Basic Pay
                          </Typography>
                          <Typography variant="body2" fontWeight="600">
                            {formatCurrency(payslips[0].basicPay)}
                          </Typography>
                        </Box>
                      )}
                      
                      <Divider sx={{ my: 2 }} />
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body1" fontWeight="700" color="success.main">
                          Gross Salary
                        </Typography>
                        <Typography variant="body1" fontWeight="700" color="success.main">
                          {formatCurrency(payslips[0].grossSalary)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      bgcolor: alpha(theme.palette.error.main, 0.02),
                      border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" color="error.main" gutterBottom fontWeight="600">
                        📉 Deductions
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      {payslips[0].deductions && payslips[0].deductions.length > 0 ? (
                        payslips[0].deductions.map((deduction, index) => (
                          <Box key={index} display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                            <Typography variant="body2" color="text.secondary">
                              {deduction.name}
                            </Typography>
                            <Typography variant="body2" fontWeight="600">
                              {formatCurrency(deduction.amount)}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                          <Typography variant="body2" color="text.secondary">
                            No Deductions
                          </Typography>
                          <Typography variant="body2" fontWeight="600">
                            {formatCurrency(0)}
                          </Typography>
                        </Box>
                      )}
                      
                      <Divider sx={{ my: 2 }} />
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body1" fontWeight="700" color="error.main">
                          Total Deductions
                        </Typography>
                        <Typography variant="body1" fontWeight="700" color="error.main">
                          {formatCurrency(calculateDeductionsTotal(payslips[0]))}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              <Card 
                sx={{ 
                  mt: 3,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  color: 'white'
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h5" fontWeight="700" sx={{ mb: 1 }}>
                    💳 Net Salary
                  </Typography>
                  <Typography variant="h3" fontWeight="900">
                                        {formatCurrency(calculateNetPay(payslips[0]))}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                    Take Home Amount
                  </Typography>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        )}
      </Stack>

      {/* Add the PayslipViewModal component */}
      <PayslipViewModal 
        open={viewModalOpen}
        onClose={handleCloseViewModal}
        payslip={selectedPayslip}
        employee={employee}
      />
    </Container>
  );
};

export default MyPayslips;

