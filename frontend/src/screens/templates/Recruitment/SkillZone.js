import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  InputAdornment,
  Paper,
  Grid,
  Container,
  Fade,
  Tooltip,
  ThemeProvider,
  createTheme,
  CircularProgress,
  Snackbar,
  Alert,
  Fab,
  Autocomplete,
} from "@mui/material";
import {
  ExpandMore,
  Edit,
  Delete,
  Search,
  PersonAdd,
  WorkOutline,
  Add,
  Email,
  Work,
} from "@mui/icons-material";
import api from "../../../api/axiosInstance";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

const SkillZone = () => {
  const [skills, setSkills] = useState([]);
  const [open, setOpen] = useState(false);
  const [addCandidateDialogOpen, setAddCandidateDialogOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newCandidateName, setNewCandidateName] = useState("");
  const [newReason, setNewReason] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editing, setEditing] = useState(false);
  const [currentSkillId, setCurrentSkillId] = useState(null);
  const [currentCandidateId, setCurrentCandidateId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [validationErrors, setValidationErrors] = useState({
    skillName: "",
    candidateName: "",
  });
  const [registeredEmployees, setRegisteredEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);

  // Add these state variables at the top of the component with other state declarations
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState(""); // "skill" or "candidate"
  const [itemToDelete, setItemToDelete] = useState(null);
  const [parentSkillId, setParentSkillId] = useState(null); // For candidate deletion

  // Replace the existing handleDeleteSkill function with this:
  const handleDeleteSkillClick = (skillId) => {
    setDeleteType("skill");
    setItemToDelete(skills.find((s) => s._id === skillId));
    setDeleteDialogOpen(true);
  };

  // Replace the existing handleDeleteCandidate function with this:
  const handleDeleteCandidateClick = (skillId, candidateId) => {
    const skill = skills.find((s) => s._id === skillId);
    const candidate = skill.candidates.find((c) => c._id === candidateId);

    setDeleteType("candidate");
    setItemToDelete(candidate);
    setParentSkillId(skillId);
    setDeleteDialogOpen(true);
  };

  // Add this function to close the delete dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
    setParentSkillId(null);
  };

  // Add these validation functions before the useEffect hooks
  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]{2,30}$/;
    return nameRegex.test(name);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);

      if (deleteType === "skill" && itemToDelete) {
        await api.delete(`/skill-zone/${itemToDelete._id}`);
        setSkills((prevSkills) =>
          prevSkills.filter((skill) => skill._id !== itemToDelete._id)
        );
        showSnackbar("Skill deleted successfully");
      } else if (deleteType === "candidate" && itemToDelete && parentSkillId) {
        await api.delete(
          `/skill-zone/${parentSkillId}/candidates/${itemToDelete._id}`
        );
        setSkills((prevSkills) =>
          prevSkills.map((skill) =>
            skill._id === parentSkillId
              ? {
                  ...skill,
                  candidates: skill.candidates.filter(
                    (c) => c._id !== itemToDelete._id
                  ),
                }
              : skill
          )
        );
        showSnackbar("Candidate deleted successfully");
      }

      handleCloseDeleteDialog();
    } catch (error) {
      console.error(`Error deleting ${deleteType}:`, error);
      showSnackbar(
        error.response?.data?.error || `Error deleting ${deleteType}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
    fetchRegisteredEmployees();
  }, []);

  // Update the fetchSkills function

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const response = await api.get("/skill-zone");
      console.log("Fetched skills:", response.data);
      setSkills(response.data);
    } catch (error) {
      console.error("Error fetching skills:", error);
      showSnackbar("Error fetching skills", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchRegisteredEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const response = await api.get("/employees/registered");
      console.log("Fetched employees:", response.data);
      setRegisteredEmployees(response.data);
      setLoadingEmployees(false);
    } catch (error) {
      console.error("Error fetching registered employees:", error);
      showSnackbar("Error fetching employees", "error");
      setLoadingEmployees(false);
    }
  };

  const handleEmployeeSelect = (event, employee) => {
    console.log("Selected employee:", employee);
    setSelectedEmployee(employee);
    if (employee) {
      // Populate the candidate form with employee data
      const fullName = `${employee.personalInfo?.firstName || ""} ${
        employee.personalInfo?.lastName || ""
      }`.trim();
      setNewCandidateName(fullName);

      // Validate the name
      if (fullName) {
        setValidationErrors({
          ...validationErrors,
          candidateName: validateName(fullName)
            ? ""
            : "Candidate name should contain only letters and be 2-30 characters long",
        });
      }

      // Store additional employee data to be used when adding candidate
      const employeeDataObj = {
        employeeId: employee.Emp_ID,
        email: employee.personalInfo?.email || "",
        department: employee.joiningDetails?.department || "",
        designation: employee.joiningDetails?.initialDesignation || "",
      };
      console.log("Setting employee data:", employeeDataObj);
      setEmployeeData(employeeDataObj);
    } else {
      setEmployeeData(null);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const handleClickOpen = () => {
    setEditing(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewSkillName("");
    setNewCandidateName("");
    setNewReason("");
    setCurrentSkillId(null);
    setCurrentCandidateId(null);
    setSelectedEmployee(null);
    setEmployeeData(null);
    setValidationErrors({ skillName: "", candidateName: "" });
  };

  const handleOpenAddCandidateDialog = (skillId) => {
    setCurrentSkillId(skillId);
    setNewCandidateName("");
    setNewReason("");
    setSelectedEmployee(null);
    setEmployeeData(null);
    setAddCandidateDialogOpen(true);
  };

  // Update the handleCloseAddCandidateDialog function to reset validation errors
  const handleCloseAddCandidateDialog = () => {
    setAddCandidateDialogOpen(false);
    setCurrentSkillId(null);
    setNewCandidateName("");
    setNewReason("");
    setSelectedEmployee(null);
    setEmployeeData(null);
    setValidationErrors({ skillName: "", candidateName: "" });
  };

  const handleAddSkill = async () => {
    if (!newSkillName) {
      showSnackbar("Please enter a skill name", "error");
      return;
    }

    // Validate skill name
    if (!validateName(newSkillName)) {
      setValidationErrors({
        ...validationErrors,
        skillName:
          "Skill name should contain only letters and be 2-30 characters long",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/skill-zone", {
        name: newSkillName,
        candidates: [], // Start with empty candidates array
      });

      setSkills([...skills, response.data]);
      handleClose();
      showSnackbar("Skill added successfully");
    } catch (error) {
      console.error("Error adding skill:", error);
      showSnackbar(
        error.response?.data?.error || "Error adding skill",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Update the handleAddCandidate function
  const handleAddCandidate = async () => {
    if (!newCandidateName || !newReason) {
      showSnackbar("Please fill all required fields", "error");
      return;
    }

    // Validate candidate name
    if (!validateName(newCandidateName)) {
      setValidationErrors({
        ...validationErrors,
        candidateName:
          "Candidate name should contain only letters and be 2-30 characters long",
      });
      return;
    }

    try {
      setLoading(true);
      // const token = getAuthToken();

      // Create the candidate data object
      const candidateData = {
        name: newCandidateName,
        reason: newReason,
        addedOn: new Date().toLocaleDateString(),
      };

      // Add employee data if available
      if (employeeData) {
        console.log("Adding employee data to candidate:", employeeData);
        candidateData.employeeId = employeeData.employeeId;
        candidateData.email = employeeData.email;
        candidateData.department = employeeData.department;
        candidateData.designation = employeeData.designation;
      }

      console.log("Sending candidate data:", candidateData);

      const response = await api.post(
        `/skill-zone/${currentSkillId}/candidates`,
        candidateData
      );

      console.log("Response after adding candidate:", response.data);

      setSkills((prevSkills) =>
        prevSkills.map((skill) =>
          skill._id === currentSkillId ? response.data : skill
        )
      );

      handleCloseAddCandidateDialog();
      showSnackbar("Candidate added successfully");
    } catch (error) {
      console.error("Error adding candidate:", error);
      showSnackbar(
        error.response?.data?.error || "Error adding candidate",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditCandidate = (skillId, candidateId) => {
    const skill = skills.find((s) => s._id === skillId);
    const candidate = skill.candidates.find((c) => c._id === candidateId);

    console.log("Editing candidate:", candidate);

    setCurrentSkillId(skillId);
    setCurrentCandidateId(candidateId);
    setNewCandidateName(candidate.name);
    setNewReason(candidate.reason);
    setNewSkillName(skill.name);
    setEditing(true);

    // If candidate has employee data, try to find the corresponding employee
    if (candidate.employeeId) {
      const employee = registeredEmployees.find(
        (emp) => emp.Emp_ID === candidate.employeeId
      );
      setSelectedEmployee(employee || null);

      // Store employee data even if we can't find the employee in the list
      setEmployeeData({
        employeeId: candidate.employeeId,
        email: candidate.email || "",
        department: candidate.department || "",
        designation: candidate.designation || "",
      });

      console.log("Found employee for candidate:", employee);
    } else {
      setSelectedEmployee(null);
      setEmployeeData(null);
    }

    setOpen(true);
  };

  const handleSaveEdit = async () => {
    // Validate candidate name
    if (!validateName(newCandidateName)) {
      setValidationErrors({
        ...validationErrors,
        candidateName:
          "Candidate name should contain only letters and be 2-30 characters long",
      });
      return;
    }

    try {
      setLoading(true);

      // Create the updated candidate data
      const updatedCandidate = {
        name: newCandidateName,
        reason: newReason,
      };

      // Include employee data if available
      if (employeeData) {
        console.log("Including employee data in update:", employeeData);
        updatedCandidate.employeeId = employeeData.employeeId;
        updatedCandidate.email = employeeData.email;
        updatedCandidate.department = employeeData.department;
        updatedCandidate.designation = employeeData.designation;
      }

      console.log("Sending updated candidate data:", updatedCandidate);

      const response = await api.put(
        `/skill-zone/${currentSkillId}/candidates/${currentCandidateId}`,
        updatedCandidate
      );

      console.log("Response after updating candidate:", response.data);

      setSkills((prevSkills) =>
        prevSkills.map((skill) =>
          skill._id === currentSkillId ? response.data : skill
        )
      );
      handleClose();
      showSnackbar("Candidate updated successfully");
    } catch (error) {
      console.error("Error updating candidate:", error);
      showSnackbar(
        error.response?.data?.error || "Error updating candidate",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSkillNameChange = (e) => {
    const value = e.target.value;
    setNewSkillName(value);

    if (value) {
      setValidationErrors({
        ...validationErrors,
        skillName: validateName(value)
          ? ""
          : "Skill name should contain only letters and be 2-30 characters long",
      });
    } else {
      setValidationErrors({
        ...validationErrors,
        skillName: "",
      });
    }
  };

  const handleCandidateNameChange = (e) => {
    const value = e.target.value;
    setNewCandidateName(value);

    if (value) {
      setValidationErrors({
        ...validationErrors,
        candidateName: validateName(value)
          ? ""
          : "Candidate name should contain only letters and be 2-30 characters long",
      });
    } else {
      setValidationErrors({
        ...validationErrors,
        candidateName: "",
      });
    }
  };

  const filteredSkills = skills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.candidates.some((candidate) =>
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        <Fade in={true} timeout={800}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 2,
              bgcolor: "#ffffff",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 4,
                borderBottom: "2px solid #1976d2",
                pb: 2,
                flexDirection: { xs: "column", sm: "row" },
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              <WorkOutline
                sx={{
                  fontSize: { xs: 32, sm: 40 },
                  color: "primary.main",
                  mr: { xs: 0, sm: 2 },
                  mb: { xs: 1, sm: 0 },
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  color: "primary.main",
                  fontWeight: 600,
                  flexGrow: 1,
                  textAlign: "center",
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.25rem" },
                }}
              >
                Skill Zone Management
              </Typography>
            </Box>

            {/* Search and Add Button - Make responsive */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search skills or candidates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    bgcolor: "#f8f9fa",
                    borderRadius: "15px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<WorkOutline />}
                  onClick={handleClickOpen}
                  sx={{
                    height: { xs: "48px", sm: "56px" },
                    boxShadow: 2,
                    "&:hover": {
                      boxShadow: 4,
                    },
                  }}
                >
                  Add New Skill
                </Button>
              </Grid>
            </Grid>

            {loading && skills.length === 0 ? (
              <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                <CircularProgress />
              </Box>
            ) : filteredSkills.length === 0 ? (
              <Paper
                sx={{
                  p: 4,
                  textAlign: "center",
                  bgcolor: "#f8f9fa",
                  border: "1px dashed #ccc",
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  No skills found. Add your first skill!
                </Typography>
              </Paper>
            ) : (
              /* Skills Accordion - Make responsive */
              filteredSkills.map((skill) => (
                <Accordion
                  key={skill._id}
                  sx={{
                    mb: 2,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    "&:before": { display: "none" },
                    borderRadius: "12px !important",
                    overflow: "hidden",
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{
                      bgcolor: "#f8f9fa",
                      borderBottom: "1px solid #e0e0e0",
                      padding: { xs: "0 8px", sm: "0 16px" },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: { xs: "flex-start", sm: "center" },
                        width: "100%",
                        justifyContent: "space-between",
                        flexDirection: { xs: "column", sm: "row" },
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: "primary.main",
                          fontSize: { xs: "1rem", sm: "1.25rem" },
                          mb: { xs: 1, sm: 0 },
                          display: "flex",
                          alignItems: { xs: "flex-start", sm: "center" },
                          flexDirection: { xs: "column", sm: "row" },
                          gap: { xs: 1, sm: 2 },
                        }}
                      >
                        {skill.name}
                        <Typography
                          component="span"
                          sx={{
                            bgcolor: "primary.light",
                            color: "white",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 10,
                            fontSize: "0.8rem",
                            alignSelf: { xs: "flex-start", sm: "auto" },
                          }}
                        >
                          {skill.candidates.length} candidates
                        </Typography>
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignSelf: { xs: "flex-end", sm: "auto" },
                        }}
                      >
                        <Tooltip title="Add Candidate">
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenAddCandidateDialog(skill._id);
                            }}
                            sx={{ color: "primary.main" }}
                          >
                            <PersonAdd />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Skill">
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSkillClick(skill._id);
                            }}
                            sx={{ color: "error.main" }}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails sx={{ p: 0 }}>
                    {/* Table - Make responsive with horizontal scroll */}
                    <Box sx={{ overflowX: "auto" }}>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                            <TableCell
                              sx={{ fontWeight: 600, whiteSpace: "nowrap" }}
                            >
                              Name
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                                display: { xs: "none", md: "table-cell" },
                              }}
                            >
                              Employee ID
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                                display: { xs: "none", md: "table-cell" },
                              }}
                            >
                              Department
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: 600, whiteSpace: "nowrap" }}
                            >
                              Reason
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                                display: { xs: "none", sm: "table-cell" },
                              }}
                            >
                              Added On
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: 600, whiteSpace: "nowrap" }}
                            >
                              Actions
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {skill.candidates.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} align="center">
                                <Typography
                                  variant="body2"
                                  sx={{ py: 2, color: "text.secondary" }}
                                >
                                  No candidates added yet. Click the "Add
                                  Candidate" button to add candidates.
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ) : (
                            skill.candidates.map((candidate) => (
                              <TableRow
                                key={candidate._id}
                                sx={{
                                  "&:hover": { bgcolor: "#f8f9fa" },
                                }}
                              >
                                <TableCell
                                  sx={{
                                    whiteSpace: "nowrap",
                                    maxWidth: { xs: "150px", sm: "200px" },
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <Typography
                                      fontWeight={500}
                                      sx={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {candidate.name}
                                    </Typography>
                                    {candidate.email && (
                                      <Tooltip title={candidate.email}>
                                        <Email
                                          fontSize="small"
                                          color="action"
                                        />
                                      </Tooltip>
                                    )}
                                  </Box>
                                  {candidate.email && (
                                    <Typography
                                      variant="caption"
                                      display="block"
                                      color="text.secondary"
                                      sx={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {candidate.email}
                                    </Typography>
                                  )}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    whiteSpace: "nowrap",
                                    display: { xs: "none", md: "table-cell" },
                                  }}
                                >
                                  {candidate.employeeId ? (
                                    <Typography
                                      component="span"
                                      sx={{
                                        bgcolor: "#e3f2fd",
                                        color: "primary.main",
                                        px: 1,
                                        py: 0.5,
                                        borderRadius: 1,
                                        fontSize: "0.8rem",
                                        fontWeight: 500,
                                      }}
                                    >
                                      {candidate.employeeId}
                                    </Typography>
                                  ) : (
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      Not assigned
                                    </Typography>
                                  )}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    whiteSpace: "nowrap",
                                    display: { xs: "none", md: "table-cell" },
                                  }}
                                >
                                  {candidate.department ? (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                      }}
                                    >
                                      <Work fontSize="small" color="action" />
                                      <Typography variant="body2">
                                        {candidate.department}
                                      </Typography>
                                    </Box>
                                  ) : (
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      N/A
                                    </Typography>
                                  )}
                                  {candidate.designation && (
                                    <Typography
                                      variant="caption"
                                      display="block"
                                      color="text.secondary"
                                    >
                                      {candidate.designation}
                                    </Typography>
                                  )}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    maxWidth: {
                                      xs: "120px",
                                      sm: "200px",
                                      md: "300px",
                                    },
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: { xs: "nowrap", md: "normal" },
                                  }}
                                >
                                  {candidate.reason}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    whiteSpace: "nowrap",
                                    display: { xs: "none", sm: "table-cell" },
                                  }}
                                >
                                  {candidate.addedOn}
                                </TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap" }}>
                                  <Tooltip title="Edit Candidate">
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handleEditCandidate(
                                          skill._id,
                                          candidate._id
                                        )
                                      }
                                      sx={{ color: "primary.main" }}
                                    >
                                      <Edit fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete Candidate">
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handleDeleteCandidateClick(
                                          skill._id,
                                          candidate._id
                                        )
                                      }
                                      sx={{ color: "error.main" }}
                                    >
                                      <Delete fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))
            )}
          </Paper>
        </Fade>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          PaperProps={{
            sx: {
              borderRadius: "16px",
              overflow: "hidden",
              p: 0,
              maxWidth: "500px",
              width: "100%",
            },
          }}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(45deg, #f44336, #e57373)",
              color: "white",
              fontSize: "1.25rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1,
              padding: { xs: "16px", sm: "24px" },
              margin: 0,
            }}
          >
            <Delete />
            Confirm Deletion
          </DialogTitle>
          <DialogContent sx={{ p: 3, pt: 3 }}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              {deleteType === "skill"
                ? "Are you sure you want to delete this skill? All candidates in this skill will also be deleted."
                : "Are you sure you want to delete this candidate?"}
            </Alert>
            {itemToDelete && (
              <Box sx={{ mt: 2, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
                {deleteType === "skill" ? (
                  <>
                    <Typography
                      variant="body1"
                      fontWeight={600}
                      color="#2c3e50"
                    >
                      Skill: {itemToDelete.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      This skill contains {itemToDelete.candidates?.length || 0}{" "}
                      candidates.
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography
                      variant="body1"
                      fontWeight={600}
                      color="#2c3e50"
                    >
                      Candidate: {itemToDelete.name}
                    </Typography>
                    {itemToDelete.employeeId && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        Employee ID: {itemToDelete.employeeId}
                      </Typography>
                    )}
                    {itemToDelete.department && (
                      <Typography variant="body2" color="text.secondary">
                        Department: {itemToDelete.department}
                      </Typography>
                    )}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Reason: {itemToDelete.reason}
                    </Typography>
                  </>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions
            sx={{
              p: 3,
              backgroundColor: "#f8fafc",
              borderTop: "1px solid #e0e0e0",
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
              onClick={handleConfirmDelete}
              variant="contained"
              color="error"
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={20} color="inherit" /> : null
              }
              sx={{
                background: "linear-gradient(45deg, #f44336, #e57373)",
                fontSize: "0.95rem",
                textTransform: "none",
                padding: "8px 32px",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(244, 67, 54, 0.2)",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(45deg, #d32f2f, #ef5350)",
                },
              }}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Skill Dialog */}
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              width: { xs: "95%", sm: "500px" },
              maxWidth: "500px",
              borderRadius: "16px",
              overflow: "hidden",
              p: 0,
            },
          }}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(45deg, #1976d2, #42a5f5)",
              color: "white",
              borderRadius: "0",
              fontWeight: 600,
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
              padding: { xs: "16px", sm: "24px" },
              margin: 0,
            }}
          >
            {editing ? "Edit Candidate" : "Add New Skill"}
          </DialogTitle>

          <DialogContent sx={{ mt: 2, p: { xs: 2, sm: 3 } }}>
            {editing ? (
              <>
                <TextField
                  autoFocus
                  label="Skill Name"
                  value={newSkillName}
                  onChange={handleSkillNameChange}
                  fullWidth
                  margin="normal"
                  error={!!validationErrors.skillName}
                  helperText={validationErrors.skillName}
                />

                {/* Employee Selection Autocomplete */}
                <Autocomplete
                  id="employee-select"
                  options={registeredEmployees}
                  getOptionLabel={(option) =>
                    `${option.Emp_ID} - ${
                      option.personalInfo?.firstName || ""
                    } ${option.personalInfo?.lastName || ""}`
                  }
                  value={selectedEmployee}
                  onChange={handleEmployeeSelect}
                  loading={loadingEmployees}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Employee (Optional)"
                      variant="outlined"
                      fullWidth
                      margin="normal"
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
                    />
                  )}
                />
                <TextField
                  label="Candidate Name"
                  value={newCandidateName}
                  onChange={handleCandidateNameChange}
                  fullWidth
                  margin="normal"
                  error={!!validationErrors.candidateName}
                  helperText={validationErrors.candidateName}
                />

                <TextField
                  label="Reason"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                  margin="normal"
                />
              </>
            ) : (
              <TextField
                autoFocus
                label="Skill Name"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                fullWidth
                margin="normal"
              />
            )}
          </DialogContent>
          <DialogActions sx={{ p: { xs: 2, sm: 3 } }}>
            <Button
              onClick={handleClose}
              color="primary"
              variant="outlined"
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
              onClick={editing ? handleSaveEdit : handleAddSkill}
              color="primary"
              variant="contained"
              sx={{
                background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                fontSize: "0.95rem",
                textTransform: "none",
                padding: "8px 32px",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(45deg, #1565c0, #42a5f5)",
                },
              }}
              disabled={
                editing ? !newCandidateName.trim() : !newSkillName.trim()
              }
            >
              {editing ? "Update Candidate" : "Add Skill"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Candidate Dialog */}

        <Dialog
          open={addCandidateDialogOpen}
          onClose={() => setAddCandidateDialogOpen(false)}
          PaperProps={{
            sx: {
              width: { xs: "95%", sm: "500px" },
              maxWidth: "500px",
              borderRadius: "16px",
              overflow: "hidden",
              p: 0,
            },
          }}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(45deg, #1976d2, #42a5f5)",
              color: "white",
              borderRadius: "0",
              fontWeight: 600,
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
              padding: { xs: "16px", sm: "24px" },
              margin: 0,
            }}
          >
            Add Candidate to Skill
          </DialogTitle>
          <DialogContent sx={{ mt: 2, p: { xs: 2, sm: 3 } }}>
            <TextField
              autoFocus
              label="Candidate Name"
              value={newCandidateName}
              onChange={(e) => setNewCandidateName(e.target.value)}
              fullWidth
              margin="normal"
            />

            {/* Employee Selection Autocomplete */}
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
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Employee (Optional)"
                  variant="outlined"
                  fullWidth
                  margin="normal"
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
                />
              )}
            />

            <TextField
              label="Reason for Adding"
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              fullWidth
              multiline
              rows={3}
              margin="normal"
            />
          </DialogContent>
          <DialogActions sx={{ p: { xs: 2, sm: 3 } }}>
            <Button
              onClick={() => setAddCandidateDialogOpen(false)}
              color="primary"
              variant="outlined"
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
              onClick={handleAddCandidate}
              color="primary"
              variant="contained"
              disabled={!newCandidateName.trim()}
              sx={{
                background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                fontSize: "0.95rem",
                textTransform: "none",
                padding: "8px 32px",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(45deg, #1565c0, #42a5f5)",
                },
              }}
            >
              Add Candidate
            </Button>
          </DialogActions>
        </Dialog>

        {/* Floating action button for adding new skill */}
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleClickOpen}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            boxShadow: 3,
          }}
        >
          <Add />
        </Fab>
      </Container>
    </ThemeProvider>
  );
};

export default SkillZone;
