import React, { useState, useEffect } from "react";
import api from "../../../api/axiosInstance";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  InputAdornment,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { Edit, Delete, Add, Search as SearchIcon } from "@mui/icons-material";

const Interview = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [candidate, setCandidate] = useState("");
  const [interviewer, setInterviewer] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateError, setDateError] = useState("");
  const [candidateError, setCandidateError] = useState("");
  const [interviewerError, setInterviewerError] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Add this function to handle opening the delete dialog
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };
  const confirmDelete = () => {
    if (deleteId) {
      // const token = getAuthToken();

      api
        .delete(`/interviews/${deleteId}`)
        .then(() => {
          setData(data.filter((item) => item._id !== deleteId));
          setSnackbar({
            open: true,
            message: "Interview deleted successfully",
            severity: "success",
          });
        })
        .catch((error) => {
          console.error("Error deleting interview:", error);
          setSnackbar({
            open: true,
            message: error.response?.data?.error || "Error deleting interview",
            severity: "error",
          });
        });
    }
    setOpenDeleteDialog(false);
    setDeleteId(null);
  };

  useEffect(() => {
    fetchInterviews();
  }, [statusFilter]);

  const fetchInterviews = () => {
    const url = "/interviews";
    // const token = getAuthToken();

    api
      .get(url)
      .then((response) => {
        let filteredData = response.data;
        if (statusFilter !== "All") {
          filteredData = response.data.filter(
            (item) => item.status === statusFilter
          );
        }
        setData(filteredData);
      })
      .catch((error) => console.error("Error fetching interviews:", error));
  };

  // Add this function to validate date (only current or future dates)
  const validateDate = (dateString) => {
    if (!dateString) return false;

    const selectedDate = new Date(dateString);
    selectedDate.setHours(0, 0, 0, 0); // Reset time part for accurate comparison

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part for accurate comparison

    return selectedDate >= today;
  };

  // Add this function to handle date changes with validation
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);

    if (newDate && !validateDate(newDate)) {
      setDateError("Please select current or future date");
    } else {
      setDateError("");
    }
  };

  const handleOpenDialog = (row = null) => {
    if (row) {
      setEditMode(true);
      setSelectedRow(row);
      setCandidate(row.candidate);
      setInterviewer(row.interviewer);
      setDate(row.date);
      setTime(row.time);
      setDescription(row.description);
      setStatus(row.status);
      // Validate the date when editing
      if (row.date && !validateDate(row.date)) {
        setDateError("Please update to current or future date");
      } else {
        setDateError("");
      }
    } else {
      setEditMode(false);
      setCandidate("");
      setInterviewer("");
      setDate("");
      setTime("");
      setDescription("");
      setStatus("");
      setDateError("");
    }
    //Reset validation errors
    setCandidateError("");
    setInterviewerError("");
    setOpenDialog(true);
  };

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Add these validation functions before the handleSave function
  const validateName = (value) => {
    const alphabetRegex = /^[A-Za-z\s]+$/;
    return alphabetRegex.test(value);
  };

  const handleCandidateChange = (e) => {
    const value = e.target.value;
    setCandidate(value);
    if (!value) {
      setCandidateError("Candidate name is required");
    } else if (!validateName(value)) {
      setCandidateError("Only alphabets are allowed");
    } else {
      setCandidateError("");
    }
  };

  const handleInterviewerChange = (e) => {
    const value = e.target.value;
    setInterviewer(value);
    if (!value) {
      setInterviewerError("Interviewer name is required");
    } else if (!validateName(value)) {
      setInterviewerError("Only alphabets are allowed");
    } else {
      setInterviewerError("");
    }
  };

  // Update the handleSave function
  const handleSave = () => {
    // Check for date validation
    if (!validateDate(date)) {
      setDateError("Please select current or future date");
      return;
    }

    // Validate all required fields
    if (!candidate || !interviewer || !date || !time) {
      setSnackbar({
        open: true,
        message: "Please fill all required fields",
        severity: "error",
      });
      return;
    }

    // Validate names
    if (!validateName(candidate) || !validateName(interviewer)) {
      setSnackbar({
        open: true,
        message: "Please correct the validation errors",
        severity: "error",
      });
      return;
    }

    // Check for date validation
    if (!validateDate(date)) {
      setDateError("Please select current or future date");
      return;
    }

    const interviewData = {
      candidate,
      interviewer,
      date,
      time,
      description,
      status: status || "Scheduled",
    };

    if (editMode && selectedRow) {
      api
        .put(`/interviews/${selectedRow._id}`, interviewData)
        .then((response) => {
          setData((prevData) =>
            prevData.map((item) =>
              item._id === selectedRow._id ? response.data : item
            )
          );
          setOpenDialog(false);
          setSnackbar({
            open: true,
            message: "Interview updated successfully",
            severity: "success",
          });
        })
        .catch((error) => {
          console.error("Error updating interview:", error);
          setSnackbar({
            open: true,
            message: error.response?.data?.error || "Error updating interview",
            severity: "error",
          });
        });
    } else {
      api
        .post("/interviews", interviewData)
        .then((response) => {
          setData([...data, response.data]);
          setOpenDialog(false);
          setSnackbar({
            open: true,
            message: "Interview added successfully",
            severity: "success",
          });
        })
        .catch((error) => {
          console.error("Error adding interview:", error);
          setSnackbar({
            open: true,
            message: error.response?.data?.error || "Error adding interview",
            severity: "error",
          });
        });
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setDateError("");
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
          color: "#1976d2",
          fontWeight: 600,
          letterSpacing: 0.5,
          fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
        }}
      >
        Interview Management
      </Typography>

      <Paper
        sx={{
          padding: { xs: 2, sm: 3 },
          marginBottom: 3,
          borderRadius: 2,
          boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .1)",
        }}
      >
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "stretch", sm: "center" }}
          gap={2}
          sx={{
            width: "100%",
          }}
        >
          <TextField
            label="Search Candidate"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: "100%",
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

          <Box
            sx={{
              display: "flex",
              gap: 2,
              width: { xs: "100%", sm: "auto" },
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <FormControl sx={{ width: "100%" }}>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                displayEmpty
                size="small"
                sx={{
                  height: "40px",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": {
                    "&:hover": {
                      borderColor: "#1976d2",
                    },
                  },
                }}
              >
                <MenuItem value="All">All Status</MenuItem>
                <MenuItem value="Scheduled">Scheduled</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={() => handleOpenDialog()}
              sx={{
                height: { xs: 40, sm: 40, md: 40 }, // Consistent height across screen sizes
                background: `linear-gradient(45deg, #1976d2 30%, #1565c0 90%)`,
                color: "white",
                "&:hover": {
                  background: `linear-gradient(45deg, #1565c0 30%, #1976d2 90%)`,
                },
                whiteSpace: "nowrap",
                width: { xs: "100%", sm: "auto" },
                fontSize: { xs: "0.8rem", sm: "0.875rem", md: "0.9rem" }, // Adjusted font size
                padding: { xs: "6px 10px", sm: "8px 16px", md: "8px 20px" }, // Better padding for larger screens
                borderRadius: "4px", // Consistent border radius
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)", // Add subtle shadow
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: { sm: "150px" }, // Ensure minimum width on larger screens
                transition: "all 0.3s ease", // Smooth transitions
              }}
            >
              Add Interview
            </Button>
          </Box>
        </Box>
      </Paper>

      <Paper
        sx={{
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .1)",
          overflow: "auto", // Enables horizontal scrolling when needed
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: { xs: "14px", sm: "16px" },
                  padding: { xs: "12px 8px", sm: "16px" },
                  backgroundColor: "#1976d2",
                }}
              >
                Candidate
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: { xs: "14px", sm: "16px" },
                  padding: { xs: "12px 8px", sm: "16px" },
                  backgroundColor: "#1976d2",
                }}
              >
                Interviewer
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: { xs: "14px", sm: "16px" },
                  padding: { xs: "12px 8px", sm: "16px" },
                  backgroundColor: "#1976d2",
                }}
              >
                Date
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: { xs: "14px", sm: "16px" },
                  padding: { xs: "12px 8px", sm: "16px" },
                  backgroundColor: "#1976d2",
                }}
              >
                Time
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: { xs: "14px", sm: "16px" },
                  padding: { xs: "12px 8px", sm: "16px" },
                  backgroundColor: "#1976d2",
                }}
              >
                Description
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: { xs: "14px", sm: "16px" },
                  padding: { xs: "12px 8px", sm: "16px" },
                  backgroundColor: "#1976d2",
                }}
              >
                Status
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: { xs: "14px", sm: "16px" },
                  padding: { xs: "12px 8px", sm: "16px" },
                  backgroundColor: "#1976d2",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .filter((item) =>
                item.candidate.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((row) => (
                <TableRow
                  key={row._id}
                  sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                >
                  <TableCell
                    sx={{
                      padding: { xs: "12px 8px", sm: "16px" },
                      fontSize: { xs: "13px", sm: "14px" },
                    }}
                  >
                    {row.candidate || "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{
                      padding: { xs: "12px 8px", sm: "16px" },
                      fontSize: { xs: "13px", sm: "14px" },
                    }}
                  >
                    {row.interviewer || "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{
                      padding: { xs: "12px 8px", sm: "16px" },
                      fontSize: { xs: "13px", sm: "14px" },
                    }}
                  >
                    {row.date || "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{
                      padding: { xs: "12px 8px", sm: "16px" },
                      fontSize: { xs: "13px", sm: "14px" },
                    }}
                  >
                    {row.time || "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{
                      padding: { xs: "12px 8px", sm: "16px" },
                      fontSize: { xs: "13px", sm: "14px" },
                      maxWidth: { xs: "100px", sm: "200px" }, // Limit width on mobile
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.description || "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{
                      padding: { xs: "12px 8px", sm: "16px" },
                      fontSize: { xs: "13px", sm: "14px" },
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor:
                          row.status === "Completed"
                            ? "#e8f5e9"
                            : row.status === "Scheduled"
                            ? "#e3f2fd"
                            : "#ffebee",
                        color:
                          row.status === "Completed"
                            ? "#2e7d32"
                            : row.status === "Scheduled"
                            ? "#1565c0"
                            : "#c62828",
                        padding: { xs: "4px 8px", sm: "6px 12px" },
                        borderRadius: "4px",
                        display: "inline-block",
                        fontWeight: "medium",
                        fontSize: { xs: "11px", sm: "13px" },
                      }}
                    >
                      {row.status || "N/A"}
                    </Box>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      padding: { xs: "12px 8px", sm: "16px" },
                      whiteSpace: "nowrap",
                    }}
                  >
                    <IconButton
                      onClick={() => handleOpenDialog(row)}
                      sx={{
                        color: "#1a237e",
                        padding: { xs: "4px", sm: "8px" },
                      }}
                      size="small"
                    >
                      <Edit fontSize="small" />
                    </IconButton>

                    <IconButton
                      onClick={() => handleDeleteClick(row._id)}
                      sx={{
                        color: "#c62828",
                        padding: { xs: "4px", sm: "8px" },
                      }}
                      size="small"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
        <Pagination
          count={Math.ceil(data.length / 10)}
          color="primary"
          sx={{
            "& .MuiPaginationItem-root": {
              fontSize: { xs: "0.9rem", sm: "1.1rem" },
              minWidth: { xs: "30px", sm: "32px" },
              height: { xs: "30px", sm: "32px" },
            },
          }}
        />
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        PaperProps={{
          sx: {
            width: { xs: "95%", sm: "600px" },
            maxWidth: "600px",
            borderRadius: "20px",
            overflow: "hidden",
            margin: { xs: "8px", sm: "32px" },
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(45deg, #1976d2, #64b5f6)",
            color: "white",
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
            fontWeight: 600,
            padding: { xs: "16px 24px", sm: "24px 32px" },
          }}
        >
          {editMode ? "Edit Interview" : "Add Interview"}
        </DialogTitle>

        <DialogContent
          sx={{
            padding: { xs: "24px", sm: "32px" },
            backgroundColor: "#f8fafc",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Candidate"
              value={candidate}
              onChange={handleCandidateChange}
              error={!!candidateError}
              helperText={candidateError}
              required
              fullWidth
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
              label="Interviewer"
              value={interviewer}
              onChange={handleInterviewerChange}
              error={!!interviewerError}
              helperText={interviewerError}
              required
              fullWidth
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
              label="Date"
              type="date"
              value={date}
              onChange={handleDateChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!dateError}
              helperText={dateError}
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
              label="Time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
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
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
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
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                displayEmpty
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
                <MenuItem value="Scheduled">Scheduled</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
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
            onClick={() => setOpenDialog(false)}
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
            onClick={handleSave}
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
          >
            {editMode ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
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
          Confirm Delete
        </DialogTitle>

        <DialogContent
          sx={{
            padding: { xs: "24px", sm: "32px" },
            backgroundColor: "#f8fafc",
            paddingTop: { xs: "24px", sm: "32px" },
          }}
        >
          <Typography variant="body1">
            Are you sure you want to delete this interview? This action cannot
            be undone.
          </Typography>
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
            onClick={() => setOpenDeleteDialog(false)}
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

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          position: "fixed",
          zIndex: 9999,
          "& .MuiAlert-root": {
            width: "100%",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{
            width: "100%",
            fontSize: { xs: "0.875rem", sm: "1rem" },
            alignItems: "center",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Interview;
