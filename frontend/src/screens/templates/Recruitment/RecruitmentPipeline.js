import React, { useState, useEffect, useMemo } from "react";
import api from "../../../api/axiosInstance";
import {
  Box,
  Typography,
  Button,
  Grid,
  Tabs,
  Tab,
  IconButton,
  Paper,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  MenuItem,
  Autocomplete,
  CircularProgress,
  InputAdornment,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";

const initialColumns = {
  "Recruitment Drive": [
    "Initial",
    "Interview",
    "Hired",
    "Cancelled",
    "Technical",
  ],
  "FutureForce Recruitment": [
    "Applied",
    "Screening",
    "Interviewed",
    "Offered",
    "Rejected",
  ],
  "Operating Manager": ["Reviewed", "In Progress", "Completed"],
  "Hiring Employees": ["Shortlisted", "Offer Extended", "Joined"],
};

const RecruitmentPipeline = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    email: "",
    department: "",
    column: "Initial",
    stars: 0,
    employeeId: "",
  });
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    email: "",
    department: "",
  });
  const [registeredEmployees, setRegisteredEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [expandedCardId, setExpandedCardId] = useState(null);

  const tabLabels = useMemo(
    () => [
      "Recruitment Drive",
      "FutureForce Recruitment",
      "Operating Manager",
      "Hiring Employees",
    ],
    []
  );

  // Add these state variables at the top of the component with other state declarations
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(null);

  const toggleCardExpansion = (candidateId) => {
    setExpandedCardId(expandedCardId === candidateId ? null : candidateId);
  };

  // This function will open the confirmation dialog
  const handleDeleteClick = (candidate) => {
    setCandidateToDelete(candidate);
    setDeleteDialogOpen(true);
  };

  // Add this function to close the delete dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCandidateToDelete(null);
  };

  useEffect(() => {
    fetchCandidates(tabLabels[tabIndex]);
  }, [tabIndex, tabLabels]);

  useEffect(() => {
    fetchRegisteredEmployees();
  }, []);

  const isEmployeeSelectionEnabled = () => {
    // Get the current column from newCandidate
    const currentColumn = newCandidate.column;
    const currentTab = tabLabels[tabIndex];

    // Define which columns should enable employee selection for each tab
    const enabledColumns = {
      "Recruitment Drive": ["Hired"],
      "FutureForce Recruitment": ["Offered"],
      "Operating Manager": ["Completed"],
      "Hiring Employees": ["Joined"],
    };

    // Check if the current column is in the enabled list for the current tab
    return enabledColumns[currentTab]?.includes(currentColumn) || false;
  };

  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]{2,30}$/;
    return nameRegex.test(name);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateDepartment = (department) => {
    const departmentRegex = /^[a-zA-Z\s]{0,30}$/;
    return department === "" || departmentRegex.test(department);
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleEmployeeSelect = (event, employee) => {
    setSelectedEmployee(employee);
    if (employee) {
      // Populate the candidate form with employee data
      setNewCandidate({
        ...newCandidate,
        name: `${employee.personalInfo?.firstName || ""} ${
          employee.personalInfo?.lastName || ""
        }`.trim(),
        email: employee.personalInfo?.email || "",
        department: employee.joiningDetails?.department || "",
        employeeId: employee.Emp_ID || "",
      });
    }
  };

  const handleDialogOpen = (candidate = null) => {
    if (candidate) {
      setEditingCandidate(candidate);
      setNewCandidate({ ...candidate });
      // If candidate has an employeeId, find and set the corresponding employee
      if (candidate.employeeId) {
        const employee = registeredEmployees.find(
          (emp) => emp.Emp_ID === candidate.employeeId
        );
        setSelectedEmployee(employee || null);
      } else {
        setSelectedEmployee(null);
      }
    } else {
      setEditingCandidate(null);
      setNewCandidate({
        name: "",
        email: "",
        department: "",
        column: "Initial",
        stars: 0,
        employeeId: "",
      });
      setSelectedEmployee(null);
    }
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => setIsDialogOpen(false);

  const handleInputChange = (field, value) => {
    setNewCandidate({ ...newCandidate, [field]: value });

    // If changing column, check if employee selection should be cleared
    if (field === "column") {
      const currentTab = tabLabels[tabIndex];
      const enabledColumns = {
        "Recruitment Drive": ["Hired"],
        "FutureForce Recruitment": ["Offered"],
        "Operating Manager": ["Completed"],
        "Hiring Employees": ["Joined"],
      };

      // If new column doesn't support employee selection, clear the selected employee
      if (!enabledColumns[currentTab]?.includes(value)) {
        setSelectedEmployee(null);
        // Also clear the employeeId in the candidate data
        setNewCandidate((prev) => ({
          ...prev,
          employeeId: "",
          [field]: value,
        }));
      }
    }

    if (field === "name") {
      setValidationErrors({
        ...validationErrors,
        name: validateName(value)
          ? ""
          : "Name should contain only letters and be 2-30 characters long",
      });
    }

    if (field === "email") {
      setValidationErrors({
        ...validationErrors,
        email: validateEmail(value) ? "" : "Please enter a valid email address",
      });
    }
    if (field === "department") {
      setValidationErrors({
        ...validationErrors,
        department: validateDepartment(value)
          ? ""
          : "Department should contain only letters and be 0-30 characters long",
      });
    }
  };

  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  const filteredCandidates = candidates.filter((candidate) =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = initialColumns[tabLabels[tabIndex]];

  // Update the fetchCandidates function
  const fetchCandidates = async (recruitment) => {
    try {
      const response = await api.get(`/recruitment/${recruitment}`);
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  // Update the handleAddOrEditCandidate function
  const handleAddOrEditCandidate = async () => {
    if (
      !validateName(newCandidate.name) ||
      !validateEmail(newCandidate.email) ||
      !validateDepartment(newCandidate.department)
    ) {
      return;
    }

    const selectedTabLabel = tabLabels[tabIndex];

    try {
      if (editingCandidate) {
        await api.put(`/recruitment/${editingCandidate._id}`, newCandidate);
      } else {
        await api.post("/recruitment", {
          ...newCandidate,
          recruitment: selectedTabLabel,
        });
      }
      fetchCandidates(selectedTabLabel);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding/editing candidate:", error);
    }
  };

  // Update the handleDeleteCandidate function
  const handleDeleteCandidate = async () => {
    if (!candidateToDelete) return;

    const selectedTabLabel = tabLabels[tabIndex];

    try {
      await api.delete(`/recruitment/${candidateToDelete._id}`);
      fetchCandidates(selectedTabLabel);
      setDeleteDialogOpen(false);
      setCandidateToDelete(null);
    } catch (error) {
      console.error("Error deleting candidate:", error);
    }
  };

  // Update the fetchRegisteredEmployees function
  const fetchRegisteredEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const response = await api.get("/employees/registered");
      setRegisteredEmployees(response.data);
      setLoadingEmployees(false);
    } catch (error) {
      console.error("Error fetching registered employees:", error);
      setLoadingEmployees(false);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          color: "#1976d2",
          fontWeight: 600,
          letterSpacing: 0.5,
        }}
      >
        Recruitment Pipeline
      </Typography>

      <Paper
        sx={{
          padding: 3,
          marginBottom: 3,
          borderRadius: 2,
          boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .1)",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          sx={{
            width: "100%",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <TextField
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={handleSearchChange}
            size="small"
            sx={{
              width: { xs: "100%", sm: "300px" },
              marginRight: "auto",
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover fieldset": {
                  borderColor: "#1976d2",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            // startIcon={<AddIcon />}
            onClick={() => handleDialogOpen()}
            sx={{
              height: 50,
              background: `linear-gradient(45deg, #1976d2 30%, #1565c0 90%)`,
              color: "white",
              "&:hover": {
                background: `linear-gradient(45deg, #1565c0 30%, #1976d2 90%)`,
              },
            }}
          >
            Add Candidate
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ boxShadow: 3, borderRadius: 2, mb: 3 }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="inherit"
          sx={{
            "& .MuiTabs-flexContainer": {
              borderBottom: "2px solid #e0e0e0",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1rem",
              minWidth: "auto",
              padding: "12px 24px",
              color: "#64748b",
              "&.Mui-selected": {
                color: "#1976d2",
              },
            },
          }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabLabels.map((label, index) => (
            <Tab key={index} label={label} />
          ))}
        </Tabs>
      </Paper>

      <Box
        sx={{
          overflowX: "auto",
          width: "100%",
          "&::-webkit-scrollbar": {
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#cbd5e1",
            borderRadius: "4px",
          },
        }}
      >
        <Grid
          container
          spacing={3}
          sx={{
            mt: 1,
            height: "calc(100vh - 250px)",
            flexWrap: "nowrap",
            minWidth: "fit-content",
          }}
        >
          {columns.map((column) => (
            <Grid item key={column} sx={{ width: 330 }}>
              <Paper
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "16px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                  backgroundColor: "#ffffff",
                  position: "relative",
                  overflow: "hidden",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Box
                  sx={{
                    p: 2.5,
                    borderBottom: "2px solid #f1f5f9",
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#ffffff",
                    zIndex: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#1976d2",
                      fontSize: { xs: "1rem", sm: "1.25rem" },
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {column}
                  </Typography>
                  <Typography
                    component="span"
                    sx={{
                      backgroundColor: "#e3f2fd",
                      color: "#1976d2",
                      borderRadius: "16px",
                      padding: "6px 14px",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: "40px",
                    }}
                  >
                    {
                      filteredCandidates.filter((c) => c.column === column)
                        .length
                    }
                  </Typography>
                </Box>

                <Box
                  sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    overflowX: "hidden",
                    p: 2,
                    "&::-webkit-scrollbar": {
                      width: "6px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#cbd5e1",
                      borderRadius: "3px",
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "#f8fafc",
                    },
                  }}
                >
                  {filteredCandidates
                    .filter((candidate) => candidate.column === column)
                    .map((candidate) => (
                      <Paper
                        key={candidate._id}
                        elevation={0}
                        sx={{
                          mb: 2,
                          p: 2.5,
                          borderRadius: "12px",
                          transition: "all 0.3s ease",
                          border: "1px solid #f1f5f9",
                          backgroundColor: "#ffffff",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                            borderColor: "#e3f2fd",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 2,
                            width: "100%",
                            minWidth: 0,
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor:
                                candidate.stars >= 4
                                  ? "#4caf50"
                                  : candidate.stars >= 3
                                  ? "#2196f3"
                                  : candidate.stars >= 2
                                  ? "#ff9800"
                                  : "#FF5C8D",
                              width: 44,
                              height: 44,
                              fontSize: "1.2rem",
                              flexShrink: 0,
                              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                              border: "2px solid #ffffff",
                            }}
                          >
                            {candidate?.name?.[0]?.toUpperCase() || "U"}
                          </Avatar>

                          <Box
                            sx={{
                              flexGrow: 1,
                              minWidth: 0,
                              width: "calc(100% - 120px)",
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              title={candidate.name} // Add tooltip
                              sx={{
                                fontWeight: 600,
                                color: "#334155",
                                mb: 0.5,
                                overflow:
                                  expandedCardId === candidate._id
                                    ? "visible"
                                    : "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace:
                                  expandedCardId === candidate._id
                                    ? "normal"
                                    : "nowrap",
                                display: "flex",
                                alignItems:
                                  expandedCardId === candidate._id
                                    ? "flex-start"
                                    : "center",
                                flexDirection:
                                  expandedCardId === candidate._id
                                    ? "column"
                                    : "row",
                                gap: 1,
                              }}
                            >
                              {candidate.name}
                              {candidate.employeeId && (
                                <Typography
                                  component="span"
                                  variant="caption"
                                  sx={{
                                    ml:
                                      expandedCardId === candidate._id ? 0 : 1,
                                    mt:
                                      expandedCardId === candidate._id ? 1 : 0,
                                    color: "#1976d2",
                                    backgroundColor: "#e3f2fd",
                                    padding: "3px 8px",
                                    borderRadius: "6px",
                                    fontSize: "0.7rem",
                                    fontWeight: 600,
                                    letterSpacing: "0.3px",
                                    display: "inline-block",
                                  }}
                                >
                                  {candidate.employeeId}
                                </Typography>
                              )}
                            </Typography>

                            <Typography
                              variant="body2"
                              title={candidate.email} // Add tooltip
                              sx={{
                                color: "#64748b",
                                mb: 1.5,
                                overflow:
                                  expandedCardId === candidate._id
                                    ? "visible"
                                    : "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace:
                                  expandedCardId === candidate._id
                                    ? "normal"
                                    : "nowrap",
                                fontSize: "0.875rem",
                              }}
                            >
                              {candidate.email}
                            </Typography>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexWrap: "wrap",
                                gap: 1,
                              }}
                            >
                              <Typography
                                variant="caption"
                                title={candidate.department || "No Department"} // Add tooltip
                                sx={{
                                  backgroundColor: "#f8fafc",
                                  padding: "5px 10px",
                                  borderRadius: "6px",
                                  color: "#475569",
                                  maxWidth: "100%",
                                  overflow:
                                    expandedCardId === candidate._id
                                      ? "visible"
                                      : "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace:
                                    expandedCardId === candidate._id
                                      ? "normal"
                                      : "nowrap",
                                  fontWeight: 500,
                                  border: "1px solid #e2e8f0",
                                }}
                              >
                                {candidate.department || "No Department"}
                              </Typography>

                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 0.5,
                                  flexShrink: 0,
                                }}
                              >
                                {Array.from({ length: 5 }).map((_, idx) => (
                                  <StarIcon
                                    key={idx}
                                    sx={{
                                      fontSize: 16,
                                      color:
                                        idx < candidate.stars
                                          ? "#FFD700"
                                          : "#E0E0E0",
                                    }}
                                  />
                                ))}
                              </Box>
                            </Box>
                            {/* Add View More/Less button */}
                            <Button
                              size="small"
                              onClick={() => toggleCardExpansion(candidate._id)}
                              sx={{
                                mt: 1,
                                color: "#1976d2",
                                fontSize: "0.75rem",
                                padding: "2px 8px",
                                minWidth: "auto",
                                textTransform: "none",
                                "&:hover": {
                                  backgroundColor: "#e3f2fd",
                                },
                              }}
                            >
                              {expandedCardId === candidate._id
                                ? "View Less"
                                : "View More"}
                            </Button>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              flexShrink: 0,
                              ml: "auto",
                              alignSelf: "flex-start",
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleDialogOpen(candidate)}
                              sx={{
                                color: "#64748b",
                                backgroundColor: "#f8fafc",
                                "&:hover": {
                                  color: "#1976d2",
                                  backgroundColor: "#e3f2fd",
                                },
                                width: 32,
                                height: 32,
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>

                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(candidate)}
                              sx={{
                                color: "#64748b",
                                backgroundColor: "#f8fafc",
                                "&:hover": {
                                  color: "#ef4444",
                                  backgroundColor: "#fee2e2",
                                },
                                width: 32,
                                height: 32,
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                        {/* Add expanded details section */}
                        {expandedCardId === candidate._id && (
                          <Box
                            sx={{
                              mt: 2,
                              pt: 2,
                              borderTop: "1px dashed #e2e8f0",
                              animation: "fadeIn 0.3s ease-in-out",
                              "@keyframes fadeIn": {
                                "0%": {
                                  opacity: 0,
                                  transform: "translateY(-10px)",
                                },
                                "100%": {
                                  opacity: 1,
                                  transform: "translateY(0)",
                                },
                              },
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ mb: 1, fontWeight: 600 }}
                            >
                              Full Details:
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                              <strong>Name:</strong> {candidate.name}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                              <strong>Email:</strong> {candidate.email}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                              <strong>Department:</strong>{" "}
                              {candidate.department || "Not specified"}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                              <strong>Status:</strong> {candidate.column}
                            </Typography>
                            {candidate.employeeId && (
                              <Typography variant="body2" sx={{ mb: 0.5 }}>
                                <strong>Employee ID:</strong>{" "}
                                {candidate.employeeId}
                              </Typography>
                            )}
                            <Typography
                              variant="body2"
                              sx={{
                                mb: 0.5,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <strong>Rating:</strong>
                              <Box sx={{ display: "flex", ml: 1 }}>
                                {Array.from({ length: 5 }).map((_, idx) => (
                                  <StarIcon
                                    key={idx}
                                    sx={{
                                      fontSize: 16,
                                      color:
                                        idx < candidate.stars
                                          ? "#FFD700"
                                          : "#E0E0E0",
                                    }}
                                  />
                                ))}
                              </Box>
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    ))}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
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
            color: "white",
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
            fontWeight: 600,
            padding: { xs: "16px 24px", sm: "24px 32px" },
          }}
        >
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
            Are you sure you want to delete this candidate?
          </Alert>
          {candidateToDelete && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" fontWeight={500}>
                {candidateToDelete.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {candidateToDelete.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Department: {candidateToDelete.department || "Not specified"}
              </Typography>
            </Box>
          )}
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
            onClick={handleCloseDeleteDialog}
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
            onClick={handleDeleteCandidate}
            variant="contained"
            color="error"
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
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
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
          }}
        >
          {editingCandidate ? "Edit Candidate" : "Add New Candidate"}
        </DialogTitle>
        <DialogContent sx={{ p: 3, backgroundColor: "#f8fafc" }}>
          <TextField
            fullWidth
            label="Name"
            value={newCandidate.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            error={!!validationErrors.name}
            helperText={validationErrors.name}
            sx={{ mb: 2, mt: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            value={newCandidate.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={!!validationErrors.email}
            helperText={validationErrors.email}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Department"
            value={newCandidate.department}
            onChange={(e) => handleInputChange("department", e.target.value)}
            error={!!validationErrors.department}
            helperText={validationErrors.department}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            fullWidth
            label="Column"
            value={newCandidate.column}
            onChange={(e) => handleInputChange("column", e.target.value)}
            sx={{ mb: 2 }}
          >
            {columns.map((column) => (
              <MenuItem key={column} value={column}>
                {column}
              </MenuItem>
            ))}
          </TextField>

          {/* Employee Selection Autocomplete - only enabled for specific columns */}
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
                    : "Employee selection only available for Hired/Completed/Joined candidates"
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
                  "Change column to Hired/Completed/Joined to enable employee selection"
                }
              />
            )}
            sx={{
              mb: 2,
              "& .Mui-disabled": {
                opacity: 0.7,
                backgroundColor: "#f5f5f5",
              },
            }}
          />

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Rating
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {Array.from({ length: 5 }).map((_, idx) => (
                <IconButton
                  key={idx}
                  onClick={() =>
                    setNewCandidate({ ...newCandidate, stars: idx + 1 })
                  }
                >
                  <StarIcon
                    sx={{
                      color: idx < newCandidate.stars ? "#FFD700" : "#E0E0E0",
                    }}
                  />
                </IconButton>
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: "#f8fafc" }}>
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
            variant="contained"
            onClick={handleAddOrEditCandidate}
            disabled={!!validationErrors.name || !!validationErrors.email}
          >
            {editingCandidate ? "Save Changes" : "Add Candidate"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecruitmentPipeline;
