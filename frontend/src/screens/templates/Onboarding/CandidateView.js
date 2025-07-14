import React, { useState, useEffect } from "react";
import "./CandidateView.css";
import api from "../../../api/axiosInstance";
import { styled } from "@mui/material/styles";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Tooltip,
  Chip,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Paper,
  InputAdornment,
  useTheme,
  useMediaQuery,
  alpha,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  DialogContentText,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon, // Add this import
} from "@mui/icons-material";

const API_URL = "/hired-employees";

// Add these styled components for consistent styling with AttendanceRecords.js
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(1),
  boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .1)",
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(2),
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontSize: 14,
  fontWeight: "bold",
  padding: theme.spacing(2),
  "&.MuiTableCell-body": {
    color: theme.palette.text.primary,
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: alpha(theme.palette.primary.light, 0.05),
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
    transition: "background-color 0.2s ease",
  },
}));

const CandidatesView = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "All",
    department: "All",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const initialFormState = {
    name: "",
    email: "",
    joiningDate: "",
    probationEnds: "",
    jobPosition: "",
    recruitment: "",
    status: "Pending",
    department: "",
  };

  // Add these state variables for validation
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    jobPosition: "",
  });
  const [formData, setFormData] = useState(initialFormState);

  const departments = ["Engineering", "Product", "Marketing", "Sales", "HR"];
  const statuses = [
    "Pending",
    "Offer Letter Accepted",
    "Offer Letter Rejected",
  ];

  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({
    open: false,
    candidateId: null,
    candidateName: "",
  });

  // // Add this function to get the auth token
  // const getAuthToken = () => {
  //   return localStorage.getItem('token');
  // };

  // Modify the handleDelete function to show confirmation first
  const handleDelete = (id, name) => {
    setDeleteConfirmDialog({
      open: true,
      candidateId: id,
      candidateName: name,
    });
  };

  // Add this validation function
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value) {
          error = "Name is required";
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = "Name should contain only alphabets";
        }
        break;

      case "email":
        if (!value) {
          error = "Email is required";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          error = "Invalid email format";
        }
        break;

      case "jobPosition":
        if (!value) {
          error = "Job Position is required";
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = "Job Position should contain only alphabets";
        }
        break;

      default:
        break;
    }

    return error;
  };

  // const confirmDelete = async () => {
  //   try {
  //     setLoading(true);
  //     await axios.delete(`${API_URL}/${deleteConfirmDialog.candidateId}`);
  //     setCandidates((prev) =>
  //       prev.filter((c) => c._id !== deleteConfirmDialog.candidateId)
  //     );
  //     showSnackbar("Candidate deleted successfully", "warning");
  //   } catch (error) {
  //     showSnackbar("Error deleting candidate", "error");
  //   } finally {
  //     // Close the confirmation dialog
  //     setDeleteConfirmDialog({
  //       open: false,
  //       candidateId: null,
  //       candidateName: "",
  //     });
  //     setLoading(false);
  //   }
  // };

  // Update the confirmDelete function (this is your existing function for delete)
  const confirmDelete = async () => {
    try {
      setLoading(true);
      // const token = getAuthToken();
      await api.delete(
        `${API_URL}/${deleteConfirmDialog.candidateId}`
        //   {
        //   headers: {
        //     'Authorization': `Bearer ${token}`
        //   }
        // }
      );
      setCandidates((prev) =>
        prev.filter((c) => c._id !== deleteConfirmDialog.candidateId)
      );
      showSnackbar("Candidate deleted successfully", "warning");
    } catch (error) {
      showSnackbar(
        error.response?.data?.error || "Error deleting candidate",
        "error"
      );
    } finally {
      // Close the confirmation dialog
      setDeleteConfirmDialog({
        open: false,
        candidateId: null,
        candidateName: "",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // Add this useEffect to handle search term changes with debouncing
  useEffect(() => {
    // Set a shorter delay for better responsiveness
    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 300); // 300ms delay for faster response

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]); // This will trigger whenever searchTerm changes

  // const fetchCandidates = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(API_URL);
  //     setCandidates(response.data);
  //   } catch (error) {
  //     showSnackbar("Error fetching candidates", "error");
  //   }
  //   setLoading(false);
  // };

  // Update the fetchCandidates function

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      // const token = getAuthToken();
      const response = await api.get(
        API_URL
        //    {
        //   headers: {
        //     'Authorization': `Bearer ${token}`
        //   }
        // }
      );
      setCandidates(response.data);
    } catch (error) {
      showSnackbar("Error fetching candidates", "error");
    }
    setLoading(false);
  };

  const handleFilterChange = async (type, value) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);

    try {
      // const token = getAuthToken();
      const response = await api.get(`${API_URL}/filter`, {
        // headers: {
        //   'Authorization': `Bearer ${token}`
        // },
        params: {
          department:
            newFilters.department !== "All" ? newFilters.department : "",
          status: newFilters.status !== "All" ? newFilters.status : "",
          search: searchTerm,
        },
      });
      setCandidates(response.data);
    } catch (error) {
      console.error("Error filtering candidates:", error);
      showSnackbar("Error filtering candidates", "error");
    }
  };

  // const handleSearch = async () => {
  //   try {
  //     // const token = getAuthToken();
  //     const response = await api.get(`${API_URL}/filter`,
  //        {
  //       // headers: {
  //       //   'Authorization': `Bearer ${token}`
  //       // },
  //       params: {
  //         department: filters.department !== "All" ? filters.department : "",
  //         status: filters.status !== "All" ? filters.status : "",
  //         search: searchTerm,
  //       },
  //     });
  //     setCandidates(response.data);
  //   } catch (error) {
  //     console.error("Error searching candidates:", error);
  //     showSnackbar("Error searching candidates", "error");
  //   }
  // };

  // Update the handleSearch function to handle empty search terms properly
  const handleSearch = async () => {
    try {
      // const token = getAuthToken();
      const response = await api.get(`${API_URL}/filter`, {
        // headers: {
        //   'Authorization': `Bearer ${token}`
        // },
        params: {
          department: filters.department !== "All" ? filters.department : "",
          status: filters.status !== "All" ? filters.status : "",
          search: searchTerm, // This will be empty when search field is cleared
        },
      });
      setCandidates(response.data);
    } catch (error) {
      console.error("Error searching candidates:", error);
      showSnackbar("Error searching candidates", "error");
    }
  };

  // const handleFormChange = (event) => {
  //   const { name, value } = event.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  // Update the handleFormChange function to include validation
  const handleFormChange = (event) => {
    const { name, value } = event.target;

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate the field and update errors
    const error = validateField(name, value);
    setFormErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  //   // Update the handleSubmit function (this is your existing function for both add and edit)
  // const handleSubmit = async () => {
  //   try {
  //     // const token = getAuthToken();
  //     const candidateData = {
  //       ...formData,
  //       probationEnds: new Date(formData.joiningDate).setMonth(
  //         new Date(formData.joiningDate).getMonth() + 3
  //       ),
  //       recruitment: formData.recruitment || "Direct",
  //     };

  //     if (editMode) {
  //       const response = await api.put(
  //         `${API_URL}/${selectedCandidate._id}`,
  //         candidateData,
  //         // {
  //         //   headers: {
  //         //     'Authorization': `Bearer ${token}`
  //         //   }
  //         // }
  //       );
  //       setCandidates((prev) =>
  //         prev.map((c) => (c._id === selectedCandidate._id ? response.data : c))
  //       );
  //       showSnackbar("Candidate updated successfully");
  //     } else {
  //       const response = await api.post(API_URL, candidateData,
  //       //   {
  //       //   headers: {
  //       //     'Authorization': `Bearer ${token}`
  //       //   }
  //       // }
  //     );
  //       setCandidates((prev) => [...prev, response.data]);
  //       showSnackbar("New candidate added successfully");
  //     }
  //     handleDialogClose();
  //   } catch (error) {
  //     showSnackbar(
  //       error.response?.data?.message || "Operation failed",
  //       "error"
  //     );
  //   }
  // };

  // Update the handleSubmit function to check for errors before submission
  const handleSubmit = async () => {
    // Validate all fields first
    const nameError = validateField("name", formData.name);
    const emailError = validateField("email", formData.email);
    const jobPositionError = validateField("jobPosition", formData.jobPosition);

    // Update all errors
    setFormErrors({
      name: nameError,
      email: emailError,
      jobPosition: jobPositionError,
    });

    // If there are any errors, don't submit
    if (nameError || emailError || jobPositionError) {
      showSnackbar("Please fix the form errors before submitting", "error");
      return;
    }

    try {
      // Rest of your existing handleSubmit code...
      const candidateData = {
        ...formData,
        probationEnds: new Date(formData.joiningDate).setMonth(
          new Date(formData.joiningDate).getMonth() + 3
        ),
        recruitment: formData.recruitment || "Direct",
      };

      if (editMode) {
        const response = await api.put(
          `${API_URL}/${selectedCandidate._id}`,
          candidateData
        );
        setCandidates((prev) =>
          prev.map((c) => (c._id === selectedCandidate._id ? response.data : c))
        );
        showSnackbar("Candidate updated successfully");
      } else {
        const response = await api.post(API_URL, candidateData);
        setCandidates((prev) => [...prev, response.data]);
        showSnackbar("New candidate added successfully");
      }
      handleDialogClose();
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Operation failed",
        "error"
      );
    }
  };

  const handleEdit = (candidate) => {
    setSelectedCandidate(candidate);
    setFormData({
      name: candidate.name,
      email: candidate.email,
      joiningDate: candidate.joiningDate.split("T")[0],
      probationEnds: candidate.probationEnds.split("T")[0],
      jobPosition: candidate.jobPosition,
      recruitment: candidate.recruitment,
      status: candidate.status,
      department: candidate.department,
    });
    setEditMode(true);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditMode(false);
    setSelectedCandidate(null);
    setFormData(initialFormState);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const getStatusChipColor = (status) => {
    const colors = {
      Pending: "warning",
      "Offer Letter Accepted": "success",
      "Offer Letter Rejected": "error",
    };
    return colors[status] || "default";
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 2, sm: 3, md: 4 },
          color: theme.palette.primary.main,
          fontWeight: 600,
          letterSpacing: 0.5,
          fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
        }}
      >
        Hired Candidates
      </Typography>

      <StyledPaper sx={{ p: { xs: 2, sm: 3 } }}>
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          gap={{ xs: 2, sm: 2 }}
          sx={{
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          {/* <SearchTextField
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            size="small"
            sx={{
              width: { xs: "100%", sm: "300px" },
              marginRight: { xs: 0, sm: "auto" },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
          /> */}
          <SearchTextField
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            size="small"
            sx={{
              width: { xs: "100%", sm: "300px" },
              marginRight: { xs: 0, sm: "auto" },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      setSearchTerm("");
                    }}
                    size="small"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 2, sm: 1 },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 2, sm: 1 },
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <FormControl
                size="small"
                sx={{
                  minWidth: 120,
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  label="Status"
                >
                  <MenuItem value="All">All Status</MenuItem>
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                size="small"
                sx={{
                  minWidth: 120,
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                <InputLabel>Department</InputLabel>
                <Select
                  value={filters.department}
                  onChange={(e) =>
                    handleFilterChange("department", e.target.value)
                  }
                  label="Department"
                >
                  <MenuItem value="All">All Departments</MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
              sx={{
                height: { xs: "auto", sm: 40 },
                padding: { xs: "10px 16px", sm: "8px 16px" },
                width: { xs: "100%", sm: "auto" },
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                color: "white",
                "&:hover": {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                },
              }}
            >
              Add Candidate
            </Button>
          </Box>
        </Box>
      </StyledPaper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ boxShadow: 3, borderRadius: 2 }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Department</StyledTableCell>
                <StyledTableCell>Joining Date</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {candidates.map((candidate) => (
                <StyledTableRow key={candidate._id}>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {candidate.name}
                  </TableCell>
                  <TableCell>{candidate.email}</TableCell>
                  <TableCell>{candidate.department}</TableCell>
                  <TableCell>
                    {new Date(candidate.joiningDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={candidate.status}
                      color={getStatusChipColor(candidate.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ minWidth: 120 }}>
                    <Box
                      sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(candidate)}
                        sx={{
                          color: theme.palette.primary.main,
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.1
                            ),
                          },
                        }}
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={() =>
                          handleDelete(candidate._id, candidate.name)
                        }
                        sx={{
                          color: theme.palette.error.main,
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.error.main,
                              0.1
                            ),
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </StyledTableRow>
              ))}
              {candidates.length === 0 && (
                <StyledTableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="textSecondary">
                      No candidates found. Add a new candidate or adjust your
                      filters.
                    </Typography>
                  </TableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}

      <Dialog
        open={deleteConfirmDialog.open}
        onClose={() =>
          setDeleteConfirmDialog({ ...deleteConfirmDialog, open: false })
        }
        PaperProps={{
          sx: {
            width: { xs: "95%", sm: "500px" },
            maxWidth: "500px",
            borderRadius: "20px",
            overflow: "hidden",
            margin: { xs: "8px", sm: "32px" },
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(45deg, #f44336, #ff7961)",
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
            fontWeight: 600,
            padding: { xs: "16px 24px", sm: "24px 32px" },
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <DeleteIcon color="white" />
          Confirm Deletion
        </DialogTitle>
        <DialogContent
          sx={{
            padding: { xs: "24px", sm: "32px" },
            backgroundColor: "#f8fafc",
            paddingTop: { xs: "24px", sm: "32px" },
          }}
        >
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to delete this candidate? This action cannot
            be undone.
          </Alert>
          <Box sx={{ mt: 2, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
            <Typography variant="body1" fontWeight={600} color="#2c3e50">
              Candidate: {deleteConfirmDialog.candidateName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Deleting this candidate will permanently remove all their
              information from the system.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            padding: { xs: "16px 24px", sm: "24px 32px" },
            backgroundColor: "#f8fafc",
            borderTop: "1px solid #e0e0e0",
            gap: 2,
          }}
        >
          <Button
            onClick={() =>
              setDeleteConfirmDialog({ ...deleteConfirmDialog, open: false })
            }
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
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
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
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog and Snackbar */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            width: "600px",
            borderRadius: "20px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(45deg, #1976d2, #64b5f6)",
            color: "white",
            fontSize: "1.5rem",
            fontWeight: 600,
            padding: "24px 32px",
          }}
        >
          {editMode ? "Edit Candidate" : "Add New Candidate"}
        </DialogTitle>

        <DialogContent sx={{ padding: "32px", backgroundColor: "#f8fafc" }}>
          <Box
            className="dialog-form"
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <TextField
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleFormChange}
              fullWidth
              required
              error={!!formErrors.name}
              helperText={formErrors.name}
              sx={{
                mt: 2,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "&:hover fieldset": {
                    borderColor: "#1976d2",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#1976d2",
                },
              }}
            />

            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleFormChange}
              fullWidth
              required
              error={!!formErrors.email}
              helperText={formErrors.email}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "&:hover fieldset": {
                    borderColor: "#1976d2",
                  },
                },
              }}
            />

            <TextField
              name="joiningDate"
              label="Joining Date"
              type="date"
              value={formData.joiningDate}
              onChange={handleFormChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "&:hover fieldset": {
                    borderColor: "#1976d2",
                  },
                },
              }}
            />

            <TextField
              name="jobPosition"
              label="Job Position"
              value={formData.jobPosition}
              onChange={handleFormChange}
              fullWidth
              required
              error={!!formErrors.jobPosition}
              helperText={formErrors.jobPosition}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "&:hover fieldset": {
                    borderColor: "#1976d2",
                  },
                },
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                name="department"
                value={formData.department}
                onChange={handleFormChange}
                label="Department"
                sx={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    "&:hover": {
                      borderColor: "#1976d2",
                    },
                  },
                }}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                label="Status"
                sx={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    "&:hover": {
                      borderColor: "#1976d2",
                    },
                  },
                }}
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            padding: "24px 32px",
            backgroundColor: "#f8fafc",
            borderTop: "1px solid #e0e0e0",
            gap: 2,
          }}
        >
          <Button
            onClick={handleDialogClose}
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

          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            sx={{
              background: "linear-gradient(45deg, #1976d2, #64b5f6)",
              fontSize: "0.95rem",
              textTransform: "none",
              padding: "8px 32px",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
              "&:hover": {
                background: "linear-gradient(45deg, #1565c0, #42a5f5)",
              },
            }}
          >
            {editMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CandidatesView;
