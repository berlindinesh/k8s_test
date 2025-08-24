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
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Chip,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
  Autocomplete,
} from "@mui/material";
import {
  ExpandMore,
  Add,
  Edit,
  Delete,
  QuestionAnswer,
  Person,
} from "@mui/icons-material";
import api from "../../../api/axiosInstance";

const RecruitmentSurvey = () => {
  const [templates, setTemplates] = useState([]);
  const [open, setOpen] = useState(false);
  const [addQuestionDialogOpen, setAddQuestionDialogOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [newType, setNewType] = useState("");
  const [editing, setEditing] = useState(false);
  const [currentTemplateId, setCurrentTemplateId] = useState(null);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [registeredEmployees, setRegisteredEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Add these state variables at the top of the component with other state declarations
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState(""); // "template" or "question"
  const [itemToDelete, setItemToDelete] = useState(null);
  const [parentTemplateId, setParentTemplateId] = useState(null); // For question deletion

  // Replace the existing handleDeleteTemplate function with this:
  const handleDeleteTemplateClick = (templateId) => {
    setDeleteType("template");
    setItemToDelete(templates.find((t) => t._id === templateId));
    setDeleteDialogOpen(true);
  };

  // Replace the existing handleDeleteQuestion function with this:
  const handleDeleteQuestionClick = (templateId, questionId) => {
    const template = templates.find((t) => t._id === templateId);
    const question = template.questions.find((q) => q._id === questionId);

    setDeleteType("question");
    setItemToDelete(question);
    setParentTemplateId(templateId);
    setDeleteDialogOpen(true);
  };

  // Add this function to close the delete dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
    setParentTemplateId(null);
  };

  // Add this function to handle the confirmed deletion
   const handleConfirmDelete = async () => {
    try {
      setLoading(true);

      if (deleteType === "template" && itemToDelete) {
        await api.delete(
          `/recruitment-survey/${itemToDelete._id}`
        );
        setTemplates((prevTemplates) =>
          prevTemplates.filter((template) => template._id !== itemToDelete._id)
        );
        showSnackbar("Template deleted successfully");
      } else if (
        deleteType === "question" &&
        itemToDelete &&
        parentTemplateId
      ) {
        await api.delete(
          `/recruitment-survey/${parentTemplateId}/questions/${itemToDelete._id}`
        );
        setTemplates((prevTemplates) =>
          prevTemplates.map((template) =>
            template._id === parentTemplateId
              ? {
                  ...template,
                  questions: template.questions.filter(
                    (question) => question._id !== itemToDelete._id
                  ),
                }
              : template
          )
        );
        showSnackbar("Question deleted successfully");
      }

      handleCloseDeleteDialog();
    } catch (error) {
      console.error(`Error deleting ${deleteType}:`, error);
      showSnackbar(`Error deleting ${deleteType}`, "error");
    } finally {
      setLoading(false);
    }
  }; 


  



  

  // Update the fetchTemplates function
      useEffect(() => {
        const fetchTemplates = async () => {
          try {
            const response = await api.get(
              "/recruitment-survey",

            );
            console.log("Fetched templates:", response.data);
            setTemplates(response.data);
          } catch (error) {
            console.error("Error fetching templates:", error);
            showSnackbar("Error fetching templates", "error");
          }
        };

        fetchTemplates();
        fetchRegisteredEmployees();
      }, []);

 



  // Update the fetchRegisteredEmployees function
const fetchRegisteredEmployees = async () => {
  try {
    setLoadingEmployees(true);
    const response = await api.get(
      "/employees/registered",

    );
    console.log("Fetched employees:", response.data);
    setRegisteredEmployees(response.data);
    setLoadingEmployees(false);
  } catch (error) {
    console.error("Error fetching registered employees:", error);
    setLoadingEmployees(false);
  }
};

  const handleEmployeeSelect = (event, employee) => {
    console.log("Selected employee:", employee);
    setSelectedEmployee(employee);
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
    setNewTemplateName("");
    setNewQuestion("");
    setNewType("");
    setCurrentTemplateId(null);
    setCurrentQuestionId(null);
    setSelectedEmployee(null);
  };





  // Update the handleAddTemplate function
const handleAddTemplate = async () => {
  if (newTemplateName && newQuestion && newType) {
    try {
      setLoading(true);

      // Create the question object with employee data
      const questionData = {
        avatar: newTemplateName.charAt(0).toUpperCase(),
        question: newQuestion,
        type: newType,
      };

      // Add employee data if an employee is selected
      if (selectedEmployee) {
        questionData.employeeId = selectedEmployee.Emp_ID;
        questionData.employeeName = `${
          selectedEmployee.personalInfo?.firstName || ""
        } ${selectedEmployee.personalInfo?.lastName || ""}`.trim();
        questionData.employeeDepartment =
          selectedEmployee.joiningDetails?.department || "";
        questionData.employeeDesignation =
          selectedEmployee.joiningDetails?.initialDesignation || "";
      }

      const newTemplate = {
        name: newTemplateName,
        questions: [questionData],
      };

      console.log("Sending template data:", newTemplate);

      const { data } = await api.post(
        "/recruitment-survey/add",
        newTemplate,
      );

      console.log("Template added response:", data);
      setTemplates([...templates, data]);
      handleClose();
      showSnackbar("Template added successfully");
    } catch (error) {
      console.error("Error adding template:", error);
      showSnackbar("Error adding template", "error");
    } finally {
      setLoading(false);
    }
  }
};

  const handleOpenAddQuestionDialog = (templateId) => {
    setCurrentTemplateId(templateId);
    setNewQuestion("");
    setNewType("");
    setSelectedEmployee(null);
    setAddQuestionDialogOpen(true);
  };

  const handleCloseAddQuestionDialog = () => {
    setAddQuestionDialogOpen(false);
    setCurrentTemplateId(null);
    setNewQuestion("");
    setNewType("");
    setSelectedEmployee(null);
  };
 


  // Update the handleAddQuestionToTemplate function
const handleAddQuestionToTemplate = async () => {
  if (!newQuestion || !newType || !currentTemplateId) return;

  try {
    setLoading(true);

    // Create request data with employee fields directly
    const requestData = {
      question: newQuestion,
      type: newType,
    };

    // Add employee data if an employee is selected
    if (selectedEmployee) {
      requestData.employeeId = selectedEmployee.Emp_ID;
      requestData.employeeName = `${
        selectedEmployee.personalInfo?.firstName || ""
      } ${selectedEmployee.personalInfo?.lastName || ""}`.trim();
      requestData.employeeDepartment =
        selectedEmployee.joiningDetails?.department || "";
      requestData.employeeDesignation =
        selectedEmployee.joiningDetails?.initialDesignation || "";
    }

    console.log("Sending question data:", requestData);

    const { data } = await api.post(
      `/recruitment-survey/${currentTemplateId}/questions`,
      requestData,
    );

    console.log("Question added response:", data);

    // Update templates state with the new question
    setTemplates((prevTemplates) =>
      prevTemplates.map((template) =>
        template._id === currentTemplateId ? data : template
      )
    );

    handleCloseAddQuestionDialog();
    showSnackbar("Question added to template successfully");
  } catch (error) {
    console.error("Error adding question to template:", error);
    showSnackbar("Error adding question to template", "error");
  } finally {
    setLoading(false);
  }
};



  const handleEditQuestion = (templateId, questionId) => {
    const template = templates.find((t) => t._id === templateId);
    const question = template.questions.find((q) => q._id === questionId);
    setNewTemplateName(template.name);
    setNewQuestion(question.question);
    setNewType(question.type);
    setCurrentTemplateId(templateId);
    setCurrentQuestionId(questionId);

    console.log("Editing question with employee data:", {
      employeeId: question.employeeId,
      employeeName: question.employeeName,
      employeeDepartment: question.employeeDepartment,
    });

    // If the question has employee data, find and set the corresponding employee
    if (question.employeeId) {
      const employee = registeredEmployees.find(
        (emp) => emp.Emp_ID === question.employeeId
      );
      console.log("Found employee for editing:", employee);
      setSelectedEmployee(employee || null);
    } else {
      setSelectedEmployee(null);
    }

    setEditing(true);
    setOpen(true);
  };




  // Update the handleSaveEdit function
const handleSaveEdit = async () => {
  try {
    setLoading(true);

    // Create request data with employee fields directly
    const requestData = {
      question: newQuestion,
      type: newType,
    };

    // Add employee data if an employee is selected
    if (selectedEmployee) {
      requestData.employeeId = selectedEmployee.Emp_ID;
      requestData.employeeName = `${
        selectedEmployee.personalInfo?.firstName || ""
      } ${selectedEmployee.personalInfo?.lastName || ""}`.trim();
      requestData.employeeDepartment =
        selectedEmployee.joiningDetails?.department || "";
      requestData.employeeDesignation =
        selectedEmployee.joiningDetails?.initialDesignation || "";
    }

    console.log("Sending edit data:", requestData);

    const { data } = await api.put(
      `/recruitment-survey/${currentTemplateId}/questions/${currentQuestionId}`,
      requestData,
    );

    console.log("Edit saved response:", data);

    // Update templates state with the edited question
    setTemplates((prevTemplates) =>
      prevTemplates.map((template) =>
        template._id === currentTemplateId ? data : template
      )
    );

    handleClose();
    showSnackbar("Question updated successfully");
  } catch (error) {
    console.error("Error updating question:", error);
    showSnackbar("Error updating question", "error");
  } finally {
    setLoading(false);
  }
};


  return (
    <Box
      p={{ xs: 2, sm: 3, md: 4 }}
      sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
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

      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, mb: 4, borderRadius: 2 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: "#1976d2",
            fontWeight: 600,
            mb: 4,
            letterSpacing: "0.05em",
            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
          }}
        >
          Survey Templates
        </Typography>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          flexDirection={{ xs: "column", sm: "row" }}
          gap={{ xs: 2, sm: 0 }}
          mb={3}
          sx={{
            backgroundColor: "#fff",
            padding: { xs: "12px 16px", sm: "15px 25px" },
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <Typography variant="h6" sx={{ color: "#34495e" }}>
            Templates
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleClickOpen}
            sx={{
              backgroundColor: "#3498db",
              "&:hover": { backgroundColor: "#2980b9" },
              alignSelf: { xs: "flex-start", sm: "auto" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Add Template
          </Button>
        </Box>

        {templates.map((template) => (
          <Accordion
            key={template._id}
            defaultExpanded
            sx={{
              mb: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              "&:before": { display: "none" },
              borderRadius: "8px !important",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                backgroundColor: "#f8f9fa",
                borderRadius: "8px 8px 0 0",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                padding: { xs: "12px 16px", sm: "16px" },
                "& .MuiAccordionSummary-content": {
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  gap: { xs: 1, sm: 0 },
                  marginTop: { xs: 0 },
                  marginBottom: { xs: 0 },
                },
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                width="100%"
                flexDirection={{ xs: "column", sm: "row" }}
                gap={{ xs: 1, sm: 0 }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: "#2c3e50",
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  {template.name}
                  <span
                    style={{
                      color: "#e74c3c",
                      marginLeft: 12,
                      backgroundColor: "#fff",
                      padding: "2px 8px",
                      borderRadius: 12,
                      fontSize: "0.8rem",
                    }}
                  >
                    {template.questions.length}
                  </span>
                </Typography>
                <Box
                  sx={{
                    ml: { xs: 0, sm: "auto" },
                    display: "flex",
                    alignItems: "center",
                    width: { xs: "100%", sm: "auto" },
                    justifyContent: { xs: "flex-end", sm: "flex-end" },
                    mt: { xs: 1, sm: 0 },
                  }}
                >
                  <Tooltip title="Add Question">
                    <IconButton
                      size="small"
                      color="info"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenAddQuestionDialog(template._id);
                      }}
                      sx={{ mr: 1 }}
                    >
                      <QuestionAnswer />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete Template">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTemplateClick(template._id);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <Box sx={{ overflowX: "auto" }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#34495e",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Question
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#34495e",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Type
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#34495e",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Raised By
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#34495e",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {template.questions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography variant="body2" color="textSecondary">
                            No questions added yet. Click the "Add Question"
                            button to add questions.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      template.questions.map((question) => (
                        <TableRow
                          key={question._id}
                          sx={{ "&:hover": { backgroundColor: "#f8f9fa" } }}
                        >
                          <TableCell sx={{ minWidth: "200px" }}>
                            <Box display="flex" alignItems="center" gap={2}>
                              <Avatar
                                sx={{
                                  bgcolor: "#3498db",
                                  width: 35,
                                  height: 35,
                                  fontSize: "0.9rem",
                                  flexShrink: 0,
                                }}
                              >
                                {question.avatar}
                              </Avatar>
                              <Typography
                                sx={{
                                  color: "#2c3e50",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                }}
                              >
                                {question.question}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell
                            sx={{ color: "#7f8c8d", whiteSpace: "nowrap" }}
                          >
                            <Chip
                              label={question.type}
                              size="small"
                              color={
                                question.type === "Text"
                                  ? "primary"
                                  : question.type === "Multiple Choice"
                                  ? "secondary"
                                  : question.type === "Checkbox"
                                  ? "success"
                                  : "info"
                              }
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell sx={{ minWidth: "180px" }}>
                            {question.employeeId ? (
                              <Box display="flex" alignItems="center" gap={1}>
                                <Person fontSize="small" color="primary" />
                                <Box>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 500,
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      maxWidth: {
                                        xs: "100px",
                                        sm: "150px",
                                        md: "200px",
                                      },
                                    }}
                                  >
                                    {question.employeeName || "Unknown"}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                      display: "block",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      maxWidth: {
                                        xs: "100px",
                                        sm: "150px",
                                        md: "200px",
                                      },
                                    }}
                                  >
                                    {question.employeeId}
                                    {question.employeeDepartment
                                      ? ` • ${question.employeeDepartment}`
                                      : ""}
                                  </Typography>
                                </Box>
                              </Box>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Not specified
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell sx={{ whiteSpace: "nowrap" }}>
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleEditQuestion(template._id, question._id)
                              }
                              sx={{ color: "#3498db", mr: 1 }}
                            >
                              <Edit />
                            </IconButton>

                            <IconButton
                              size="small"
                              onClick={() =>
                                handleDeleteQuestionClick(
                                  template._id,
                                  question._id
                                )
                              }
                              sx={{ color: "#e74c3c" }}
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>

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
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
            fontWeight: 600,
            padding: { xs: "16px 24px", sm: "24px 32px" },
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Delete color="white" />
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
            {deleteType === "template"
              ? "Are you sure you want to delete this template? All questions in this template will also be deleted."
              : "Are you sure you want to delete this question?"}
          </Alert>
          {itemToDelete && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
              {deleteType === "template" ? (
                <>
                  <Typography variant="body1" fontWeight={600} color="#2c3e50">
                    Template: {itemToDelete.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    This template contains {itemToDelete.questions?.length || 0}{" "}
                    questions.
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="body1" fontWeight={600} color="#2c3e50">
                    Question:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      p: 1,
                      bgcolor: "#fff",
                      borderRadius: 1,
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    {itemToDelete.question}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Type: {itemToDelete.type}
                  </Typography>
                  {itemToDelete.employeeName && (
                    <Typography variant="body2" color="text.secondary">
                      Raised by: {itemToDelete.employeeName}
                    </Typography>
                  )}
                </>
              )}
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
            onClick={handleConfirmDelete}
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

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: { xs: "95%", sm: "600px" },
            maxWidth: "600px",
            borderRadius: "20px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(45deg, #3498db, #2980b9)",
            color: "white",
            fontSize: "1.5rem",
            fontWeight: 600,
            padding: "24px 32px",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {editing ? "Edit Question" : "Add Recruitment Template"}
        </DialogTitle>

        <DialogContent
          sx={{
            padding: "32px",
            backgroundColor: "#f8fafc",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <TextField
              label="Template Name"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              fullWidth
              disabled={editing}
              sx={{
                mt: 2,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "&:hover fieldset": {
                    borderColor: "#3498db",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#3498db",
                },
              }}
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
                  label="Select Employee (Who raised this question)"
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: "#3498db",
                      },
                    },
                  }}
                />
              )}
            />

            <TextField
              label="Question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              fullWidth
              multiline
              rows={3}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "&:hover fieldset": {
                    borderColor: "#3498db",
                  },
                },
              }}
            />

            <TextField
              label="Type"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              select
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "&:hover fieldset": {
                    borderColor: "#3498db",
                  },
                },
              }}
            >
              <MenuItem value="Text">Text</MenuItem>
              <MenuItem value="Multiple Choice">Multiple Choice</MenuItem>
              <MenuItem value="Checkbox">Checkbox</MenuItem>
              <MenuItem value="Rating">Rating</MenuItem>
            </TextField>
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
            onClick={handleClose}
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
            onClick={editing ? handleSaveEdit : handleAddTemplate}
            variant="contained"
            disabled={loading}
            sx={{
              background: "linear-gradient(45deg, #3498db, #2980b9)",
              fontSize: "0.95rem",
              textTransform: "none",
              padding: "8px 32px",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(52, 152, 219, 0.2)",
              "&:hover": {
                background: "linear-gradient(45deg, #2980b9, #3498db)",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : editing ? (
              "Save Changes"
            ) : (
              "Add Template"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={addQuestionDialogOpen}
        onClose={handleCloseAddQuestionDialog}
        PaperProps={{
          sx: {
            width: { xs: "95%", sm: "600px" },
            maxWidth: "600px",
            borderRadius: "20px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(45deg, #9b59b6, #8e44ad)",
            color: "white",
            fontSize: "1.5rem",
            fontWeight: 600,
            padding: "24px 32px",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <QuestionAnswer fontSize="large" />
          Add Question to Template
        </DialogTitle>

        <DialogContent
          sx={{
            padding: "32px",
            backgroundColor: "#f8fafc",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {/* Employee Selection Autocomplete */}
            <Autocomplete
              id="employee-select-dialog"
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
                  label="Select Employee (Who raised this question)"
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: "#9b59b6",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#9b59b6",
                    },
                  }}
                />
              )}
            />

            <TextField
              label="Question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              fullWidth
              multiline
              rows={3}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "&:hover fieldset": {
                    borderColor: "#9b59b6",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#9b59b6",
                },
              }}
            />

            <TextField
              label="Type"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              select
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "&:hover fieldset": {
                    borderColor: "#9b59b6",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#9b59b6",
                },
              }}
            >
              <MenuItem value="Text">Text</MenuItem>
              <MenuItem value="Multiple Choice">Multiple Choice</MenuItem>
              <MenuItem value="Checkbox">Checkbox</MenuItem>
              <MenuItem value="Rating">Rating</MenuItem>
            </TextField>
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
            onClick={handleCloseAddQuestionDialog}
            sx={{
              border: "2px solid #7f8c8d",
              color: "#7f8c8d",
              "&:hover": {
                border: "2px solid #95a5a6",
                backgroundColor: "#ecf0f1",
                color: "#7f8c8d",
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
            onClick={handleAddQuestionToTemplate}
            variant="contained"
            disabled={!newQuestion || !newType || loading}
            sx={{
              background: "linear-gradient(45deg, #9b59b6, #8e44ad)",
              fontSize: "0.95rem",
              textTransform: "none",
              padding: "8px 32px",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(155, 89, 182, 0.2)",
              "&:hover": {
                background: "linear-gradient(45deg, #8e44ad, #9b59b6)",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Add Question"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecruitmentSurvey;
