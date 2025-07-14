import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Avatar,
  TextField,
  Button,
  Box,
  Menu,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Fade,
  Snackbar,
  Alert,
  Paper,
  Autocomplete,
  CircularProgress,
  InputAdornment,
  alpha,
  Container,
  Tooltip,
} from "@mui/material";
import {
  Search,
  List,
  GridView,
  FilterList,
  MoreVert,
  Delete,
  GroupWork,
  Add,
} from "@mui/icons-material";
import api from "../../../api/axiosInstance";
 
// Standardized theme-based styling
const styles = {
  container: {
    padding: { xs: 2, sm: 3, md: 4 },
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  },
  contentContainer: {
    maxWidth: {
      xs: "100%",
      sm: "100%",
      md: "1200px",
      lg: "1400px",
      xl: "1600px",
    },
    margin: "0 auto",
    width: "100%",
    padding: { xs: 1, sm: 2, md: 2 }, // Add consistent padding
  },
 
  pageTitle: {
    mb: 3,
    color: "#1976d2",
    fontWeight: 600,
    letterSpacing: 0.5,
    fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
  },
  headerPaper: {
    padding: { xs: 1.5, sm: 3 },
    marginBottom: 3,
    borderRadius: 2,
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
    position: { sm: "sticky" }, // Make it sticky on sm breakpoint and above
    top: { sm: 0 }, // Position at the top
    zIndex: 10, // Ensure it stays above other content
    backgroundColor: "#fff", // Ensure it has a background to cover content below
  },
  searchField: {
    width: { xs: "100%", sm: "280px" },
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      "&:hover fieldset": {
        borderColor: "#1976d2",
      },
    },
    "& .MuiInputBase-input": {
      padding: { xs: "8px 10px", sm: "8px 14px" }, // Smaller padding on mobile
    },
  },
 
  actionButtonsContainer: {
    display: "flex",
    gap: 2,
    flexWrap: { xs: "wrap", md: "nowrap" },
    justifyContent: { xs: "space-between", sm: "flex-end" },
    marginLeft: { sm: "auto" },
  },
  toggleButtonGroup: {
    height: 40,
    backgroundColor: "white",
    "& .MuiToggleButton-root": {
      border: "1px solid rgba(0, 0, 0, 0.12)",
    },
  },
  toggleButton: {
    "&.Mui-selected": {
      backgroundColor: alpha("#1976d2", 0.1),
      color: "#1976d2",
    },
  },
  actionButton: {
    height: 40,
    whiteSpace: "nowrap", // Prevent text wrapping
    borderColor: "#1976d2",
    color: "#1976d2",
    fontSize: { xs: "0.75rem", sm: "0.875rem" },
    padding: { xs: "6px 8px", sm: "6px 16px" }, // Adjust padding for different screen sizes
    minWidth: { xs: "auto", sm: "120px" }, // Ensure minimum width on larger screens
    "& .MuiButton-startIcon": {
      marginRight: { xs: 4, sm: 8 }, // Adjust icon spacing
    },
    textTransform: "none", // Prevent uppercase transformation
  },
 
  addButton: {
    height: 40,
    background: `linear-gradient(45deg, #1976d2 30%, #1565c0 90%)`,
    color: "white",
    "&:hover": {
      background: `linear-gradient(45deg, #1565c0 30%, #1976d2 90%)`,
    },
    whiteSpace: "nowrap", // Prevent text wrapping
    fontSize: { xs: "0.75rem", sm: "0.875rem" },
    padding: { xs: "6px 8px", sm: "6px 16px" }, // Adjust padding for different screen sizes
    minWidth: { xs: "auto", sm: "140px" }, // Ensure minimum width on larger screens
    "& .MuiButton-startIcon": {
      marginRight: { xs: 4, sm: 8 }, // Adjust icon spacing
    },
    textTransform: "none", // Prevent uppercase transformation
  },
 
  sectionTitle: {
    fontWeight: 600,
    color: "#1a2027",
    mb: 2,
    pl: 1,
    fontSize: { xs: "1.25rem", sm: "1.5rem" },
  },
 
  // Updated card and content styles for better responsiveness
  card: {
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    borderRadius: 2,
    height: "100%", // Maintain full height
    display: "flex",
    flexDirection: "column",
    overflow: "visible", // Changed from hidden to visible to prevent content clipping
    backgroundColor: "white",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
    },
  },
  cardContent: {
    padding: { xs: "12px", sm: "16px", md: "18px", lg: "20px" }, // Reduced padding for smaller screens
    display: "flex",
    flexDirection: "column",
    height: "100%",
    "&:last-child": {
      paddingBottom: { xs: "12px", sm: "16px", md: "18px", lg: "20px" }, // Match top padding
    },
  },
  cardHeader: {
    display: "flex",
    flexDirection: { xs: "column", sm: "row" }, // Stack vertically on mobile
    alignItems: { xs: "flex-start", sm: "flex-start" },
    gap: { xs: 1.5, sm: 2 }, // Reduced gap for better spacing
    width: "100%",
    mb: 1.5, // Reduced margin bottom
    position: "relative", // Add position relative
  },
  avatar: {
    bgcolor: "#9e9e9e",
    color: "white",
    width: { xs: 45, sm: 50, md: 55 }, // Slightly smaller avatars
    height: { xs: 45, sm: 50, md: 55 },
    fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
    fontWeight: "bold",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    flexShrink: 0, // Prevent avatar from shrinking
  },
  cardBody: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    flexGrow: 1,
    minWidth: 0, // Important for text truncation to work properly
  },
  nameContainer: {
    display: "flex",
    width: "100%",
    mb: { xs: 1, md: 1.5 }, // Reduced margin
    position: "relative", // Keep position relative
    minWidth: 0, // Important for text truncation
  },
  candidateName: {
    fontWeight: 600,
    color: "#1a2027",
    fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem", lg: "1.1rem" }, // Slightly reduced font sizes
    lineHeight: 1.3,
    paddingRight: "40px", // Space for menu button
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    whiteSpace: "normal",
    wordBreak: "break-word", // Added to handle long words
  },
  employeeIdContainer: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    mt: 0.5,
  },
  employeeId: {
    color: "#1976d2",
    backgroundColor: "#e3f2fd",
    padding: "2px 6px", // Reduced padding
    borderRadius: "4px",
    fontSize: { xs: "0.65rem", md: "0.7rem" }, // Smaller font size
    display: "inline-block",
    marginTop: 0.5,
  },
  candidateEmail: {
    color: "text.secondary",
    mb: { xs: 0.75, sm: 1, md: 1.25 }, // Reduced margins
    fontSize: { xs: "0.8rem", sm: "0.825rem", md: "0.85rem" }, // Smaller font sizes
    lineHeight: 1.4,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap", // Force single line with ellipsis
    maxWidth: "100%", // Ensure text doesn't overflow container
  },
  candidatePosition: {
    color: "#64748b",
    fontWeight: 500,
    mb: { xs: 1, sm: 1.25, md: 1.5 }, // Reduced margins
    fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" }, // Smaller font sizes
    lineHeight: 1.4,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap", // Force single line with ellipsis
    maxWidth: "100%", // Ensure text doesn't overflow container
  },
  statusChipContainer: {
    marginTop: "auto", // Push to bottom
    paddingTop: 1,
  },
  statusChip: {
    fontWeight: 600,
    borderRadius: "8px",
    padding: "4px 8px", // Reduced padding
    height: "auto",
    minHeight: "24px", // Reduced height
    fontSize: { xs: "0.7rem", md: "0.75rem" }, // Smaller font size
    display: "inline-flex",
  },
  menuButton: {
    color: "#64748b",
    padding: 0,
    position: "absolute", // Keep position absolute
    right: 0, // Align to right edge of container
    top: 0, // Align to top of container
    zIndex: 10, // Higher z-index to ensure visibility
    minWidth: "36px", // Ensure minimum width
    minHeight: "36px", // Ensure minimum height
  },
  menuButtonIcon: {
    fontSize: { xs: "1.2rem", sm: "1.1rem" }, // Slightly smaller icon on mobile
    color: "#475569", // Darker color for better visibility
  },
 
  dialogTitle: {
    fontWeight: 600,
    background: "linear-gradient(45deg, #1976d2, #64b5f6)",
    color: "white",
    padding: "20px 24px",
  },
  dialogContent: {
    padding: "24px",
  },
  dialogActions: {
    padding: "16px 24px",
    borderTop: "1px solid #e0e0e0",
    gap: 2,
  },
  formField: {
    marginBottom: 2,
  },
  cancelButton: {
    border: "2px solid #1976d2",
    color: "#1976d2",
    "&:hover": {
      border: "2px solid #64b5f6",
      backgroundColor: "#e3f2fd",
      color: "#1976d2",
    },
    textTransform: "none",
    borderRadius: "8px",
    padding: "6px 16px",
    fontWeight: 600,
  },
  submitButton: {
    background: "linear-gradient(45deg, #1976d2, #64b5f6)",
    fontSize: "0.95rem",
    textTransform: "none",
    padding: "8px 24px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
    color: "white",
    "&:hover": {
      background: "linear-gradient(45deg, #1565c0, #42a5f5)",
    },
  },
  deleteButton: {
    background: "linear-gradient(45deg, #f44336, #ff7961)",
    fontSize: "0.95rem",
    textTransform: "none",
    padding: "8px 24px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(244, 67, 54, 0.2)",
    color: "white",
    "&:hover": {
      background: "linear-gradient(45deg, #d32f2f, #f44336)",
    },
  },
  snackbar: {
    "& .MuiAlert-root": {
      borderRadius: "8px",
    },
  },
};
 
// Update the statusColors object to use red for "Not-Hired"
const statusColors = {
  "Not-Hired": "#ef4444", // Changed to red
  Hired: "#4caf50", // Green (unchanged)
};
 
const RecruitmentCandidate = () => {
  const [view, setView] = useState("grid");
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [groupBy, setGroupBy] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    email: "",
    position: "",
  });
  const [registeredEmployees, setRegisteredEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
 
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    email: "",
    position: "",
    status: "Not-Hired",
    color: statusColors["Not-Hired"],
    employeeId: "",
  });
 
  useEffect(() => {
    fetchCandidates();
    fetchRegisteredEmployees();
  }, []);
 
  // // Add these validation functions before the useEffect hooks
  // const validateName = (name) => {
  //   const nameRegex = /^[a-zA-Z\s]{2,30}$/;
  //   return nameRegex.test(name);
  // };
 
  // const validateEmail = (email) => {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return emailRegex.test(email);
  // };
 
  // const validatePosition = (position) => {
  //   const positionRegex = /^[a-zA-Z\s]{0,30}$/;
  //   return position === "" || positionRegex.test(position);
  // };


   // Add these validation functions before the useEffect hooks
  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]{2,30}$/;
    return nameRegex.test(name);
  };
 
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
 
  const validatePosition = (position) => {
    const positionRegex = /^[a-zA-Z\s]{0,30}$/;
    return position === "" || positionRegex.test(position);
  };

  // Add this function to get the auth token
  // const getAuthToken = () => {
  //   return localStorage.getItem('token');
  // };


 
  // const fetchCandidates = async () => {
  //   try {
  //     const response = await axios.get(
  //       "${process.env.REACT_APP_API_URL}/api/applicantProfiles"
  //     );
  //     setCandidates(response.data);
  //   } catch (error) {
  //     showSnackbar("Error fetching candidates", "error");
  //   }
  // };
 
  const fetchCandidates = async () => {
    try {
      // const token = getAuthToken();
      const response = await api.get(
        "/applicantProfiles",
        // {
        //   headers: {
        //     'Authorization': `Bearer ${token}`
        //   }
        // }
      );
      setCandidates(response.data);
    } catch (error) {
      showSnackbar(error.response?.data?.error || "Error fetching candidates", "error");
    }
  };



  // const fetchRegisteredEmployees = async () => {
  //   try {
  //     setLoadingEmployees(true);
  //     const response = await axios.get(
  //       "${process.env.REACT_APP_API_URL}/api/employees/registered"
  //     );
  //     setRegisteredEmployees(response.data);
  //     setLoadingEmployees(false);
  //   } catch (error) {
  //     console.error("Error fetching registered employees:", error);
  //     showSnackbar("Error fetching employees", "error");
  //     setLoadingEmployees(false);
  //   }
  // };

  const fetchRegisteredEmployees = async () => {
    try {
      setLoadingEmployees(true);
      
      const response = await api.get(
        "/employees/registered",
        // {
        //   headers: {
        //     'Authorization': `Bearer ${token}`
        //   }
        // }
      );
      setRegisteredEmployees(response.data);
      setLoadingEmployees(false);
    } catch (error) {
      console.error("Error fetching registered employees:", error);
      showSnackbar(error.response?.data?.error || "Error fetching employees", "error");
      setLoadingEmployees(false);
    }
  };



  //  const handleEmployeeSelect = (event, employee) => {
  //   setSelectedEmployee(employee);
  //   if (employee) {
  //     const name = `${employee.personalInfo?.firstName || ""} ${
  //       employee.personalInfo?.lastName || ""
  //     }`.trim();
  //     const email = employee.personalInfo?.email || "";
  //     const position = employee.joiningDetails?.initialDesignation || "";
 
  //     // Update the candidate form with employee data
  //     setNewCandidate({
  //       ...newCandidate,
  //       name,
  //       email,
  //       position,
  //       employeeId: employee.Emp_ID || "",
  //     });
 
  //     // Validate the fields
  //     setValidationErrors({
  //       name: validateName(name)
  //         ? ""
  //         : "Name should contain only letters and be 2-30 characters long",
  //       email: validateEmail(email) ? "" : "Please enter a valid email address",
  //       position: validatePosition(position)
  //         ? ""
  //         : "Position should contain only letters and spaces",
  //     });
  //   }
  // };
 
   const handleEmployeeSelect = (event, employee) => {
    setSelectedEmployee(employee);
    if (employee) {
      const name = `${employee.personalInfo?.firstName || ""} ${
        employee.personalInfo?.lastName || ""
      }`.trim();
      const email = employee.personalInfo?.email || "";
      const position = employee.joiningDetails?.initialDesignation || "";
 
      // Update the candidate form with employee data
      setNewCandidate({
        ...newCandidate,
        name,
        email,
        position,
        employeeId: employee.Emp_ID || "",
      });
 
      // Validate the fields
      setValidationErrors({
        name: validateName(name)
          ? ""
          : "Name should contain only letters and be 2-30 characters long",
        email: validateEmail(email) ? "" : "Please enter a valid email address",
        position: validatePosition(position)
          ? ""
          : "Position should contain only letters and spaces",
      });
    }
  };




// const handleCreateSubmit = async () => {
//     if (
//       !validateName(newCandidate.name) ||
//       !validateEmail(newCandidate.email) ||
//       !validatePosition(newCandidate.position)
//     ) {
//       showSnackbar("Please fix the validation errors", "error");
//       return;
//     }
 
//     // Check for duplicate email
//     const duplicateEmail = candidates.find(
//       (candidate) =>
//         candidate.email.toLowerCase() === newCandidate.email.toLowerCase()
//     );
 
//     if (duplicateEmail) {
//       showSnackbar("A candidate with this email already exists", "error");
//       return;
//     }
 
//     // Check for duplicate name (optional, depending on your requirements)
//     const duplicateName = candidates.find(
//       (candidate) =>
//         candidate.name.toLowerCase() === newCandidate.name.toLowerCase()
//     );
 
//     if (duplicateName) {
//       showSnackbar("A candidate with this name already exists", "error");
//       return;
//     }
 
//     try {
//       const response = await axios.post(
//         "${process.env.REACT_APP_API_URL}/api/applicantProfiles",
//         newCandidate
//       );
//       setCandidates([...candidates, response.data]);
//       setCreateDialogOpen(false);
//       resetNewCandidate();
//       showSnackbar("Candidate created successfully");
//     } catch (error) {
//       showSnackbar("Error creating candidate", "error");
//     }
//   };
 



const handleCreateSubmit = async () => {
    if (
      !validateName(newCandidate.name) ||
      !validateEmail(newCandidate.email) ||
      !validatePosition(newCandidate.position)
    ) {
      showSnackbar("Please fix the validation errors", "error");
      return;
    }
 
    // Check for duplicate email
    const duplicateEmail = candidates.find(
      (candidate) =>
        candidate.email.toLowerCase() === newCandidate.email.toLowerCase()
    );
 
    if (duplicateEmail) {
      showSnackbar("A candidate with this email already exists", "error");
      return;
    }
 
    // Check for duplicate name (optional, depending on your requirements)
    const duplicateName = candidates.find(
      (candidate) =>
        candidate.name.toLowerCase() === newCandidate.name.toLowerCase()
    );
 
    if (duplicateName) {
      showSnackbar("A candidate with this name already exists", "error");
      return;
    }
 
    try {
      // const token = getAuthToken();
      const response = await api.post(
        "/applicantProfiles",
        newCandidate,
        // {
        //   headers: {
        //     'Authorization': `Bearer ${token}`
        //   }
        // }
      );
      setCandidates([...candidates, response.data]);
      setCreateDialogOpen(false);
      resetNewCandidate();
      showSnackbar("Candidate created successfully");
    } catch (error) {
      showSnackbar(error.response?.data?.error || "Error creating candidate", "error");
    }
  };


  // const handleDeleteCandidate = async (id) => {
  //   try {
  //     await axios.delete(`${process.env.REACT_APP_API_URL}/api/applicantProfiles/${id}`);
  //     setCandidates(candidates.filter((c) => c._id !== id));
  //     setDeleteDialogOpen(false);
  //     showSnackbar("Candidate deleted successfully");
  //   } catch (error) {
  //     showSnackbar("Error deleting candidate", "error");
  //   }
  // };
 
const handleDeleteCandidate = async (id) => {
    try {
      // const token = getAuthToken();
      await api.delete(`/applicantProfiles/${id}`, 
      //   {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // }
    );
      setCandidates(candidates.filter((c) => c._id !== id));
      setDeleteDialogOpen(false);
      showSnackbar("Candidate deleted successfully");
    } catch (error) {
      showSnackbar(error.response?.data?.error || "Error deleting candidate", "error");
    }
  };


  const handleInputChange = (field, value) => {
    setNewCandidate({ ...newCandidate, [field]: value });
 
    if (field === "name") {
      // Validate name format
      const nameError = validateName(value)
        ? ""
        : "Name should contain only letters and be 2-30 characters long";
 
      // Check for duplicate name
      const duplicateName =
        value &&
        candidates.find(
          (candidate) => candidate.name.toLowerCase() === value.toLowerCase()
        );
 
      setValidationErrors({
        ...validationErrors,
        name:
          nameError ||
          (duplicateName ? "A candidate with this name already exists" : ""),
      });
    }
 
    if (field === "email") {
      // Validate email format
      const emailError = validateEmail(value)
        ? ""
        : "Please enter a valid email address";
 
      // Check for duplicate email
      const duplicateEmail =
        value &&
        candidates.find(
          (candidate) => candidate.email.toLowerCase() === value.toLowerCase()
        );
 
      setValidationErrors({
        ...validationErrors,
        email:
          emailError ||
          (duplicateEmail ? "A candidate with this email already exists" : ""),
      });
    }
 
    if (field === "position") {
      setValidationErrors({
        ...validationErrors,
        position: validatePosition(value)
          ? ""
          : "Position should contain only letters and spaces",
      });
    }
  };
 



  
  // const handleStatusChange = (event) => {
  //   const status = event.target.value;
  //   setNewCandidate({
  //     ...newCandidate,
  //     status: status,
  //     color: statusColors[status],
  //   });
 
  //   // If changing to a status that doesn't support employee selection, clear the selected employee
  //   if (status !== "Hired") {
  //     setSelectedEmployee(null);
  //     setNewCandidate((prev) => ({
  //       ...prev,
  //       status: status,
  //       color: statusColors[status],
  //       employeeId: "",
  //     }));
  //   }
  // };
 
  // const showSnackbar = (message, severity = "success") => {
  //   setSnackbar({ open: true, message, severity });
  // };
 


   const handleStatusChange = (event) => {
    const status = event.target.value;
    setNewCandidate({
      ...newCandidate,
      status: status,
      color: statusColors[status],
    });
 
    // If changing to a status that doesn't support employee selection, clear the selected employee
    if (status !== "Hired") {
      setSelectedEmployee(null);
      setNewCandidate((prev) => ({
        ...prev,
        status: status,
        color: statusColors[status],
        employeeId: "",
      }));
    }
  };
 
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };


  // const resetNewCandidate = () => {
  //   setNewCandidate({
  //     name: "",
  //     email: "",
  //     position: "",
  //     status: "Not-Hired",
  //     color: statusColors["Not-Hired"],
  //     employeeId: "",
  //   });
  //   setSelectedEmployee(null);
  // };
 
  // const filteredCandidates = candidates.filter(
  //   (candidate) =>
  //     candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
  //     (filter ? candidate.status === filter : true)
  // );
 
  // const groupedCandidates = groupBy
  //   ? filteredCandidates.reduce((groups, candidate) => {
  //       const position = candidate.position || "Unspecified Position";
  //       if (!groups[position]) groups[position] = [];
  //       groups[position].push(candidate);
  //       return groups;
  //     }, {})
  //   : { All: filteredCandidates };
 
  // // Check if employee selection should be enabled
  // const isEmployeeSelectionEnabled = () => {
  //   return newCandidate.status === "Hired";
  // };

  const resetNewCandidate = () => {
    setNewCandidate({
      name: "",
      email: "",
      position: "",
      status: "Not-Hired",
      color: statusColors["Not-Hired"],
      employeeId: "",
    });
    setSelectedEmployee(null);
  };
 
  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter ? candidate.status === filter : true)
  );
 
  const groupedCandidates = groupBy
    ? filteredCandidates.reduce((groups, candidate) => {
        const position = candidate.position || "Unspecified Position";
        if (!groups[position]) groups[position] = [];
        groups[position].push(candidate);
        return groups;
      }, {})
    : { All: filteredCandidates };
 
  // Check if employee selection should be enabled
  const isEmployeeSelectionEnabled = () => {
    return newCandidate.status === "Hired";
  };


  return (
    <Box sx={styles.container}>
      <Container disableGutters sx={styles.contentContainer}>
        <Typography variant="h4" sx={styles.pageTitle}>
          Recruitment Candidates
        </Typography>
 
        {/* Header with search and actions */}
        <Paper elevation={0} sx={styles.headerPaper}>
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "stretch", sm: "center" }}
            gap={2}
            width="100%"
          >
            {/* Search field */}
            <TextField
              variant="outlined"
              placeholder="Search candidates..."
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "#94a3b8" }} />
                  </InputAdornment>
                ),
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={styles.searchField}
            />
 
            {/* Action buttons for larger screens */}
            <Box sx={styles.actionButtonsContainer}>
              {/* View toggle */}
              <ToggleButtonGroup
                value={view}
                exclusive
                onChange={(e, nextView) => nextView && setView(nextView)}
                size="small"
                sx={styles.toggleButtonGroup}
              >
                <ToggleButton value="list" sx={styles.toggleButton}>
                  <List />
                </ToggleButton>
                <ToggleButton value="grid" sx={styles.toggleButton}>
                  <GridView />
                </ToggleButton>
              </ToggleButtonGroup>
 
              {/* Filter button */}
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() =>
                  setFilter(
                    filter === ""
                      ? "Hired"
                      : filter === "Hired"
                      ? "Not-Hired"
                      : ""
                  )
                }
                sx={styles.actionButton}
              >
                {filter || "All Status"}
              </Button>
 
              {/* Group button - hidden on xs screens */}
              <Button
                variant="outlined"
                startIcon={<GroupWork />}
                onClick={() => setGroupBy(!groupBy)}
                sx={{
                  ...styles.actionButton,
                  display: { xs: "none", sm: "flex" },
                }}
              >
                {groupBy ? "Ungroup" : "Group by Position"}
              </Button>
 
              {/* Add button - hidden on xs screens */}
              <Button
                variant="contained"
                // startIcon={<Add />}
                onClick={() => setCreateDialogOpen(true)}
                sx={{
                  ...styles.addButton,
                  display: { xs: "none", sm: "flex" },
                }}
              >
                Add Candidate
              </Button>
            </Box>
 
            {/* Add button - visible on xs screens mobile view */}
            <Box
              sx={{
                display: { xs: "flex", sm: "none" },
                width: "100%",
                gap: 1, // Reduce gap between buttons
                mt: 1,
              }}
            >
              <Button
                variant="outlined"
                startIcon={<GroupWork />}
                onClick={() => setGroupBy(!groupBy)}
                sx={{
                  ...styles.actionButton,
                  flex: 1,
                  minWidth: "unset",
                  justifyContent: "center",
                  padding: "6px 4px", // Reduce padding
                  fontSize: "0.7rem", // Smaller font size
                  "& .MuiButton-startIcon": {
                    marginRight: 4, // Reduce icon spacing
                    "& svg": {
                      fontSize: "1rem", // Smaller icon
                    },
                  },
                }}
              >
                {groupBy ? "Ungroup" : "Group"}
              </Button>
 
              <Button
                variant="contained"
                //  startIcon={<Add />}
                onClick={() => setCreateDialogOpen(true)}
                sx={{
                  ...styles.addButton,
                  flex: 1,
                  minWidth: "unset",
                  justifyContent: "center",
                  padding: "6px 4px", // Reduce padding
                  fontSize: "0.7rem", // Smaller font size
                  "& .MuiButton-startIcon": {
                    marginRight: 4, // Reduce icon spacing
                    "& svg": {
                      fontSize: "1rem", // Smaller icon
                    },
                  },
                }}
              >
                Add
              </Button>
            </Box>
          </Box>
        </Paper>
 
  {/* Candidates grid/list */}
        {Object.entries(groupedCandidates).map(([position, candidates]) => (
          <Fade in={true} timeout={500} key={position}>
            <Box mb={4}>
              {/* Position heading (only when grouped) */}
              {groupBy && (
                <Typography variant="h5" sx={styles.sectionTitle}>
                  {position}
                </Typography>
              )}
 
              {/* Candidates grid */}
              <Grid container spacing={{ xs: 2, sm: 2, md: 2.5, lg: 3 }}>
                {candidates.map((candidate) => (
                  <Grid
                    item
                    xs={12}
                    sm={view === "grid" ? 6 : 12}
                    md={view === "grid" ? 4 : 12} // Changed back to 4 columns at md breakpoint for better use of space
                    lg={view === "grid" ? 3 : 12} // Changed to 3 columns at lg breakpoint for better distribution
                    xl={view === "grid" ? 3 : 12}
                    key={candidate._id}
                  >
                    <Card
                      sx={{
                        ...styles.card,
                        borderLeft: `4px solid ${candidate.color || "#9e9e9e"}`,
                      }}
                    >
                      <CardContent sx={styles.cardContent}>
                        {/* Card header with absolute positioned menu button */}
                        <Box sx={styles.cardHeader}>
                          {/* Menu button - positioned absolutely in the top-right corner */}
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              setAnchorEl(e.currentTarget);
                              setSelectedCandidate(candidate);
                            }}
                            sx={styles.menuButton}
                            aria-label="More options"
                          >
                            <MoreVert sx={styles.menuButtonIcon} />
                          </IconButton>
 
                          {/* Avatar */}
                          <Avatar sx={styles.avatar}>
                            {(candidate?.name?.[0] || "U").toUpperCase()}
                          </Avatar>
 
                          {/* Card content */}
                          <Box sx={styles.cardBody}>
                            {/* Name */}
                            <Box sx={styles.nameContainer}>
                              <Tooltip
                                title={candidate.name || "Unnamed Candidate"}
                                placement="top"
                              >
                                <Typography
                                  variant="h6"
                                  sx={styles.candidateName}
                                >
                                  {candidate.name || "Unnamed Candidate"}
                                </Typography>
                              </Tooltip>
                            </Box>
 
                            {/* Employee ID if available */}
                            {candidate.employeeId && (
                              <Box sx={{ mb: 1 }}>
                                <Typography
                                  component="span"
                                  variant="caption"
                                  sx={styles.employeeId}
                                >
                                  {candidate.employeeId}
                                </Typography>
                              </Box>
                            )}
 
                            {/* Email */}
                            <Tooltip
                              title={candidate.email || "No email provided"}
                              placement="top"
                            >
                              <Typography sx={styles.candidateEmail}>
                                {candidate.email || "No email provided"}
                              </Typography>
                            </Tooltip>
 
                            {/* Position */}
                            <Tooltip
                              title={
                                candidate.position || "No position specified"
                              }
                              placement="top"
                            >
                              <Typography sx={styles.candidatePosition}>
                                {candidate.position || "No position specified"}
                              </Typography>
                            </Tooltip>
 
                            {/* Status chip */}
                            <Box sx={styles.statusChipContainer}>
                              <Chip
                                label={candidate.status || "Unknown"}
                                sx={{
                                  ...styles.statusChip,
                                  bgcolor: candidate.color || "#9e9e9e",
                                  color: "white",
                                }}
                              />
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>
        ))}

        {/* Menu for candidate actions */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          TransitionComponent={Fade}
        >
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              setDeleteDialogOpen(true);
            }}
          >
            <Delete sx={{ color: "#ef4444", mr: 1 }} />
            <Typography color="#ef4444">Delete</Typography>
          </MenuItem>
        </Menu>
 
        {/* Delete confirmation dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          sx={styles.dialog}
        >
          <DialogTitle
            sx={{
              ...styles.dialogTitle,
              background: "linear-gradient(45deg, #f44336, #ff7961)",
            }}
          >
            Delete Candidate
          </DialogTitle>
          <DialogContent sx={styles.dialogContent}>
            <Typography>
              Are you sure you want to delete{" "}
              <strong>{selectedCandidate?.name}</strong>? This action cannot be
              undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={styles.dialogActions}>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              sx={styles.cancelButton}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleDeleteCandidate(selectedCandidate?._id)}
              variant="contained"
              color="error"
              sx={styles.deleteButton}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create candidate dialog */}
        <Dialog
          open={createDialogOpen}
          onClose={() => {
            setCreateDialogOpen(false);
            resetNewCandidate();
          }}
          sx={styles.dialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={styles.dialogTitle}>Add New Candidate</DialogTitle>
          <DialogContent sx={styles.dialogContent}>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              {/* <TextField
                label="Name"
                fullWidth
                value={newCandidate.name}
                onChange={(e) =>
                  setNewCandidate({ ...newCandidate, name: e.target.value })
                }
                sx={styles.formField}
              />
              <TextField
                label="Email"
                fullWidth
                value={newCandidate.email}
                onChange={(e) =>
                  setNewCandidate({ ...newCandidate, email: e.target.value })
                }
                sx={styles.formField}
              />
              <TextField
                label="Position"
                fullWidth
                value={newCandidate.position}
                onChange={(e) =>
                  setNewCandidate({ ...newCandidate, position: e.target.value })
                }
                sx={styles.formField}
              /> */}
              <TextField
                label="Name"
                fullWidth
                value={newCandidate.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                error={!!validationErrors.name}
                helperText={validationErrors.name}
                sx={styles.formField}
              />
              <TextField
                label="Email"
                fullWidth
                value={newCandidate.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                error={!!validationErrors.email}
                helperText={validationErrors.email}
                sx={styles.formField}
              />
              <TextField
                label="Position"
                fullWidth
                value={newCandidate.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                error={!!validationErrors.position}
                helperText={validationErrors.position}
                sx={styles.formField}
              />
 
              <FormControl fullWidth sx={styles.formField}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newCandidate.status}
                  label="Status"
                  onChange={handleStatusChange}
                >
                  <MenuItem value="Hired">Hired</MenuItem>
                  <MenuItem value="Not-Hired">Not Hired</MenuItem>
                </Select>
              </FormControl>
 
              {/* Employee Selection Autocomplete - only enabled for Hired status */}
              <Autocomplete
                id="employee-select"
                options={registeredEmployees}
                getOptionLabel={(option) =>
                  `${option.Emp_ID} - ${option.personalInfo?.firstName || ""} ${
                    option.personalInfo?.lastName || ""
                  }`
                }
                value={selectedEmployee}
                onChange={handleEmployeeSelect}
                loading={loadingEmployees}
                disabled={!isEmployeeSelectionEnabled()}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={
                      isEmployeeSelectionEnabled()
                        ? "Select Onboarded Employee"
                        : "Employee selection only available for Hired status"
                    }
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingEmployees ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                    helperText={
                      !isEmployeeSelectionEnabled() &&
                      "Change status to Hired to enable employee selection"
                    }
                  />
                )}
                sx={{
                  "& .Mui-disabled": {
                    opacity: 0.7,
                    backgroundColor: "#f5f5f5",
                  },
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={styles.dialogActions}>
            <Button
              onClick={() => {
                setCreateDialogOpen(false);
                resetNewCandidate();
              }}
              sx={styles.cancelButton}
            >
              Cancel
            </Button>
            {/* <Button
              onClick={handleCreateSubmit}
              variant="contained"
              sx={styles.submitButton}
              disabled={!newCandidate.name || !newCandidate.email}
            >
              Create
            </Button> */}
            <Button
              onClick={handleCreateSubmit}
              variant="contained"
              sx={styles.submitButton}
              disabled={
                !newCandidate.name ||
                !newCandidate.email ||
                !!validationErrors.name ||
                !!validationErrors.email ||
                !!validationErrors.position
              }
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
 
        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          sx={styles.snackbar}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%", borderRadius: "8px" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};
 
export default RecruitmentCandidate;