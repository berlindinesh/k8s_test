import React, { useState, useEffect } from "react";
import { FaList, FaTh, FaEnvelope } from "react-icons/fa";
import ReactQuill from "react-quill";
import api from "../../../api/axiosInstance";
import "react-quill/dist/quill.snow.css";
import { styled } from "@mui/material/styles";
import { MoreVert, Info, CalendarToday } from "@mui/icons-material";
import {
  Box,
  Stack,
  TextField,
  ButtonGroup,
  IconButton,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Chip,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Popover,
  Avatar,
  useMediaQuery,
  useTheme,
  Paper,
  Divider,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
  Fade,
  Zoom,
  InputAdornment,
  TableContainer,
  Menu,
} from "@mui/material";
import {
  Search,
  FilterList,
  Add,
  Edit,
  Delete,
  Email,
  WorkOutline,
  EmailOutlined,
  Visibility,
  Close,
  CheckCircle,
  Cancel,
  AccessTime,
  Send,
  GetApp,
  Save,
} from "@mui/icons-material";

import { LoadingButton } from "@mui/lab";
import { useNotifications } from "../../../context/NotificationContext";

import "./ResignationPage.css";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(1),
  boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .1)",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const ResignationPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isSmallDesktop = useMediaQuery(theme.breakpoints.between("md", "lg"));

  const [isSaving, setIsSaving] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  // Inside the ResignationPage component, add:
 const { addResignationNotification } = useNotifications();

  // Add these state variables for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [viewMode, setViewMode] = useState(isMobile ? "grid" : "list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [data, setData] = useState([]);

  const [statusMenuAnchorEl, setStatusMenuAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Add these state variables near the top of your component
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [currentUserPosition, setCurrentUserPosition] = useState("");

  const handleStatusMenuOpen = (event, item) => {
    setStatusMenuAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleStatusMenuClose = () => {
    setStatusMenuAnchorEl(null);
    setSelectedItem(null);
  };
 
const handleStatusChange = async (newStatus) => {
  if (!selectedItem) return;

  try {
    setLoading(true);
    await api.put(
      `/resignations/${selectedItem._id}`,
      {
        status: newStatus,
      }
    );

    // Update the local state
    setData(
      data.map((item) =>
        item._id === selectedItem._id ? { ...item, status: newStatus } : item
      )
    );

    // Send notification to the user who submitted the resignation
    if (selectedItem.userId && (newStatus === "Approved" || newStatus === "Rejected")) {
      addResignationNotification(
        selectedItem.name,
        newStatus.toLowerCase(), // "approved" or "rejected"
        selectedItem.userId
      );
      
      console.log(`Sent ${newStatus.toLowerCase()} notification to user ${selectedItem.userId}`);
    }

    setSnackbar({
      open: true,
      message: `Status updated to ${newStatus}`,
      severity: "success",
    });
  } catch (error) {
    console.error("Error updating status:", error);
    setSnackbar({
      open: true,
      message: "Error updating status",
      severity: "error",
    });
  } finally {
    setLoading(false);
    handleStatusMenuClose();
  }
};

 
  useEffect(() => {
    if (isMobile) {
      setViewMode("grid");
    }
  }, [isMobile]);

 const fetchResignations = async () => {
  try {
    setLoading(true);

    // Get the user's role and ID from localStorage
    const userRole = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("No user ID found in localStorage");
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    // Determine which API endpoint to use based on user role
    let url;
    if (userRole && (userRole.includes("admin") || userRole.includes("hr"))) {
      // Admin or HR can see all resignations
      console.log("Fetching all resignations for admin/HR");
      url = "/resignations";
    } else {
      // Regular users can only see their own resignations
      console.log("Fetching resignations for user:", userId);
      url = `/resignations/user/${userId}`;
    }

    const response = await api.get(url);
    console.log("Fetched resignations:", response.data);
    setData(response.data);
    setError(null);
  } catch (err) {
    setError("Failed to fetch resignations");
    console.error("Error:", err);
  } finally {
    setLoading(false);
  }
};
 

  useEffect(() => {
    if (currentUserId) {
      fetchResignations();
    }
  }, [currentUserId]);

  useEffect(() => {
  const fetchCurrentUser = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        setCurrentUserId(userId);
        

        // Fetch user details
        const response = await api.get(
          `/employees/by-user/${userId}`
        );
        const userData = response.data.data;

        if (userData) {
          // Set user information
          setCurrentUserName(
            `${userData.personalInfo?.firstName || ""} ${
              userData.personalInfo?.lastName || ""
            }`
          );
          setCurrentUserEmail(userData.personalInfo?.email || "");
          setCurrentUserPosition(
            userData.joiningDetails?.initialDesignation || ""
          );
        }

        // Fetch resignations after user data is loaded
        await fetchResignations();
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  fetchCurrentUser();
}, []);


  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [newResignation, setNewResignation] = useState({
    name: "",
    email: "",
    title: "",
    status: "Requested",
    description: "",
  });

  const handleEditClick = (res) => {
    setShowCreatePopup(true);
    setIsEditing(true);
    setCurrentId(res._id);
    setNewResignation({
      name: res.name,
      email: res.email,
      title: res.position,
      status: res.status,
      description: res.description,
    });
  };

  const handleDeleteClick = (resignation) => {
    setItemToDelete(resignation);
    setDeleteDialogOpen(true);
  };

const handleConfirmDelete = async () => {
  try {
    setLoading(true);
    await api.delete(
      `/resignations/${itemToDelete._id}`
    );
    await fetchResignations();
    setDeleteDialogOpen(false);
    setItemToDelete(null);
    setSnackbar({
      open: true,
      message: "Resignation letter deleted successfully",
      severity: "success",
    });
  } catch (error) {
    console.error("Error deleting resignation:", error);
    setSnackbar({
      open: true,
      message: "Failed to delete resignation letter",
      severity: "error",
    });
  } finally {
    setLoading(false);
  }
};


  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  // Modify the handleCreateClick function to pre-fill user information
  const handleCreateClick = () => {
    setShowCreatePopup(true);
    setIsEditing(false);
    setNewResignation({
      name: currentUserName || "",
      email: currentUserEmail || "",
      title: currentUserPosition || "",
      status: "Requested",
      description: "",
    });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewResignation((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (content) => {
    setNewResignation((prev) => ({ ...prev, description: content }));
  };

  const handleClosePopup = () => {
    setShowCreatePopup(false);
    setIsEditing(false);
    setCurrentId(null);
    setNewResignation({
      name: "",
      email: "",
      title: "",
      status: "Requested",
      description: "",
    });
  };

const handleSendEmail = async (employee) => {
  try {
    await api.post("/resignations/email", {
      name: employee.name,
      email: employee.email,
      position: employee.position,
      status: employee.status,
      description: employee.description,
    }
  );
    setSnackbar({
      open: true,
      message: `Resignation email sent successfully to ${employee.email}`,
      severity: "success",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    setSnackbar({
      open: true,
      message: "Failed to send email",
      severity: "error",
    });
  }
};


  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

  const applyFilter = (status) => {
    setSelectedStatus(status);
    setFilterOpen(false);
    setFilterAnchorEl(null);
  };

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus
      ? item.status === selectedStatus
      : true;
    return matchesSearch && matchesStatus;
  });

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link"],
      ["clean"],
    ],
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return {
          bg: "#e6f7ff",
          color: "#1890ff",
          icon: <CheckCircle fontSize="small" />,
        };
      case "Rejected":
        return {
          bg: "#fff1f0",
          color: "#ff4d4f",
          icon: <Cancel fontSize="small" />,
        };
      case "Pending":
        return {
          bg: "#fff7e6",
          color: "#fa8c16",
          icon: <AccessTime fontSize="small" />,
        };
      default:
        return {
          bg: "#f0f5ff",
          color: "#2f54eb",
          icon: <Email fontSize="small" />,
        };
    }
  };

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Loading resignations...
        </Typography>
      </Box>
    );

const handleSave = async () => {
  if (isSaving) return;

  try {
    setIsSaving(true);
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setSnackbar({
        open: true,
        message: "User not authenticated",
        severity: "error",
      });
      setIsSaving(false);
      return;
    }

    const resignationData = {
      name: newResignation.name,
      email: newResignation.email,
      position: newResignation.title,
      status: newResignation.status,
      description: newResignation.description,
      userId: userId, // Ensure userId is included
    };

    if (isEditing) {
      await api.put(
        `/resignations/${currentId}`,
        resignationData
      );
      setSnackbar({
        open: true,
        message: "Resignation letter updated successfully",
        severity: "success",
      });
    } else {
      await api.post(
        "/resignations",
        resignationData
      );
      setSnackbar({
        open: true,
        message: "Resignation letter created successfully",
        severity: "success",
      });
    }

    await fetchResignations();
    handleClosePopup();
  } catch (error) {
    console.error("Error saving resignation:", error);
    setSnackbar({
      open: true,
      message: "Error saving resignation letter",
      severity: "error",
    });
  } finally {
    setIsSaving(false);
  }
};


  const toggleFilter = (event) => {
    setFilterAnchorEl(event.currentTarget);
    setFilterOpen(!filterOpen);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
    setFilterOpen(false);
  };

  const handlePreview = (item) => {
    setPreviewData(item);
    setPreviewOpen(true);
  };

  return (
    <div className="resignation-letters">
      <Box
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          backgroundColor: "#f5f5f5",
          // minHeight: "100vh",
        }}
      >
        <Box>
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
            Resignations
          </Typography>

          <StyledPaper sx={{ p: { xs: 2, sm: 3 } }}>
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              gap={2}
              sx={{
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <TextField
                placeholder="Search by name, email or position"
                value={searchTerm}
                onChange={handleSearch}
                size="small"
                sx={{
                  width: { xs: "100%", sm: "300px" },
                  marginRight: { xs: 0, sm: "auto" },
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f8fafc",
                    borderRadius: "8px",
                    "&:hover fieldset": {
                      borderColor: "#1976d2",
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "action.active", mr: 1 }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 1, sm: 1 },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                <ButtonGroup
                  variant="outlined"
                  sx={{
                    height: { xs: "auto", sm: 40 },
                    flexGrow: isMobile ? 1 : 0,
                    "& .MuiButtonGroup-grouped": {
                      flex: isMobile ? 1 : "auto",
                      borderColor: "#1976d2",
                    },
                  }}
                >
                  <Tooltip title="List View">
                    <IconButton
                      onClick={() => handleViewChange("list")}
                      sx={{
                        color: viewMode === "list" ? "white" : "#64748b",
                        backgroundColor:
                          viewMode === "list" ? "#1976d2" : "transparent",
                        borderColor: "#1976d2",
                        "&:hover": {
                          backgroundColor:
                            viewMode === "list" ? "#1565c0" : "#e3f2fd",
                        },
                      }}
                    >
                      <FaList />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Grid View">
                    <IconButton
                      onClick={() => handleViewChange("grid")}
                      sx={{
                        color: viewMode === "grid" ? "white" : "#64748b",
                        backgroundColor:
                          viewMode === "grid" ? "#1976d2" : "transparent",
                        borderColor: "#1976d2",
                        "&:hover": {
                          backgroundColor:
                            viewMode === "grid" ? "#1565c0" : "#e3f2fd",
                        },
                      }}
                    >
                      <FaTh />
                    </IconButton>
                  </Tooltip>
                </ButtonGroup>

                <Button
                  onClick={toggleFilter}
                  startIcon={<FilterList />}
                  sx={{
                    height: { xs: "auto", sm: 40 },
                    padding: { xs: "8px 16px", sm: "6px 16px" },
                    width: { xs: "100%", sm: "auto" },
                    borderColor: "#1976d2",
                    color: "#1976d2",
                    "&:hover": {
                      borderColor: "#1565c0",
                      backgroundColor: "#e3f2fd",
                    },
                    textTransform: "none",
                    borderRadius: "8px",
                    fontWeight: 500,
                  }}
                  variant="outlined"
                >
                  {selectedStatus ? `Filter: ${selectedStatus}` : "Filter"}
                </Button>

                <Button
                  onClick={handleCreateClick}
                  startIcon={<Add />}
                  sx={{
                    height: { xs: "auto", sm: 40 },
                    padding: { xs: "8px 16px", sm: "6px 16px" },
                    width: { xs: "100%", sm: "auto" },
                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                    color: "white",
                    "&:hover": {
                      background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                    },
                    textTransform: "none",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(25, 118, 210, 0.25)",
                    fontWeight: 500,
                  }}
                  variant="contained"
                >
                  Create
                </Button>
              </Box>
            </Box>
          </StyledPaper>
        </Box>
      </Box>

      {/* Status summary cards */}

      <Box sx={{ mb: 3, display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            bgcolor: "#e6f7ff",
            border: "1px solid #91d5ff",
            flex: 1,
            minWidth: isMobile ? "100%" : isTablet ? "45%" : "200px",
          }}
        >
          <CheckCircle sx={{ color: "#1890ff", mr: 1 }} />
          <Box>
            <Typography variant="body2" color="#1890ff" fontWeight={500}>
              Approved
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {data.filter((item) => item.status === "Approved").length}
            </Typography>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            bgcolor: "#fff7e6",
            border: "1px solid #ffd591",
            flex: 1,
            minWidth: isMobile ? "100%" : isTablet ? "45%" : "200px",
          }}
        >
          <AccessTime sx={{ color: "#fa8c16", mr: 1 }} />
          <Box>
            <Typography variant="body2" color="#fa8c16" fontWeight={500}>
              Pending
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {data.filter((item) => item.status === "Pending").length}
            </Typography>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            bgcolor: "#f0f5ff",
            border: "1px solid #adc6ff",
            flex: 1,
            minWidth: isMobile ? "100%" : isTablet ? "45%" : "200px",
          }}
        >
          <Email sx={{ color: "#2f54eb", mr: 1 }} />
          <Box>
            <Typography variant="body2" color="#2f54eb" fontWeight={500}>
              Requested
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {data.filter((item) => item.status === "Requested").length}
            </Typography>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            bgcolor: "#fff1f0",
            border: "1px solid #ffa39e",
            flex: 1,
            minWidth: isMobile ? "100%" : isTablet ? "45%" : "200px",
          }}
        >
          <Cancel sx={{ color: "#ff4d4f", mr: 1 }} />
          <Box>
            <Typography variant="body2" color="#ff4d4f" fontWeight={500}>
              Rejected
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {data.filter((item) => item.status === "Rejected").length}
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/*** Filter Popup ***/}
      <Popover
        open={filterOpen}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            width: isMobile ? "90%" : "400px",
            borderRadius: "16px",
            mt: 1,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          },
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(45deg, #1976d2, #64b5f6)",
            p: isMobile ? 2 : 3,
          }}
        >
          <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
            Filter Resignations
          </Typography>
        </Box>

        <Box sx={{ p: isMobile ? 2 : 3 }}>
          <Stack spacing={2}>
            <Button
              onClick={() => applyFilter("")}
              variant={selectedStatus === "" ? "contained" : "outlined"}
              fullWidth
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              All
            </Button>
            <Button
              onClick={() => applyFilter("Requested")}
              variant={
                selectedStatus === "Requested" ? "contained" : "outlined"
              }
              fullWidth
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 500,
              }}
              startIcon={<Email fontSize="small" />}
            >
              Requested
            </Button>
            <Button
              onClick={() => applyFilter("Approved")}
              variant={selectedStatus === "Approved" ? "contained" : "outlined"}
              fullWidth
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 500,
              }}
              startIcon={<CheckCircle fontSize="small" />}
            >
              Approved
            </Button>
            <Button
              onClick={() => applyFilter("Rejected")}
              variant={selectedStatus === "Rejected" ? "contained" : "outlined"}
              fullWidth
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 500,
              }}
              startIcon={<Cancel fontSize="small" />}
            >
              Rejected
            </Button>
            <Button
              onClick={() => applyFilter("Pending")}
              variant={selectedStatus === "Pending" ? "contained" : "outlined"}
              fullWidth
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 500,
              }}
              startIcon={<AccessTime fontSize="small" />}
            >
              Pending
            </Button>
          </Stack>
        </Box>
      </Popover>

      {/* List View */}
      {viewMode === "list" && filteredData.length > 0 && (
        <Paper
          sx={{
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            overflow: "hidden",
            mb: 3,
            width: "100%",
          }}
          elevation={0}
        >
          {isMobile ? (
            // Mobile view - simplified table with fewer columns
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "white",
                        backgroundColor: "#1976d2",
                        borderBottom: "2px solid #1565c0",
                        py: 1.5,
                        width: "60%",
                      }}
                    >
                      Employee
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "white",
                        backgroundColor: "#1976d2",
                        borderBottom: "2px solid #1565c0",
                        py: 1.5,
                        width: "40%",
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow
                      key={item._id}
                      sx={{
                        "&:hover": { backgroundColor: "#f8fafc" },
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      <TableCell sx={{ py: 1.5 }}>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 0.5,
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: getStatusColor(item.status).color,
                                width: 32,
                                height: 32,
                                mr: 1,
                                fontWeight: "bold",
                              }}
                            >
                              {item.name.charAt(0)}
                            </Avatar>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                wordBreak: "break-word",
                                whiteSpace: "normal",
                                lineHeight: 1.3,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.name}
                            </Typography>
                          </Box>
                          <Box sx={{ pl: 5 }}>
                            <Chip
                              icon={getStatusColor(item.status).icon}
                              label={item.status}
                              size="small"
                              sx={{
                                backgroundColor: getStatusColor(item.status).bg,
                                color: getStatusColor(item.status).color,
                                fontWeight: 600,
                                borderRadius: "6px",
                                py: 0.5,
                                border: `1px solid ${
                                  getStatusColor(item.status).color
                                }20`,
                                fontSize: "0.7rem",
                                height: "24px",
                              }}
                            />
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handlePreview(item)}
                              sx={{
                                color: "#1976d2",
                                "&:hover": {
                                  backgroundColor: "#e3f2fd",
                                },
                                padding: "4px",
                              }}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleEditClick(item)}
                              sx={{
                                color: "#1976d2",
                                "&:hover": {
                                  backgroundColor: "#e3f2fd",
                                },
                                padding: "4px",
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(item)}
                              sx={{
                                color: "#ef4444",
                                "&:hover": {
                                  backgroundColor: "#fee2e2",
                                },
                                padding: "4px",
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : isTablet ? (
            // Tablet view - more columns but still simplified
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "white",
                        width: "30%",
                        borderBottom: "2px solid #1565c0",
                        py: 2,
                        backgroundColor: "#1976d2",
                      }}
                    >
                      Employee
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "white",
                        width: "25%",
                        borderBottom: "2px solid #1565c0",
                        py: 2,
                        backgroundColor: "#1976d2",
                      }}
                    >
                      Position
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "white",
                        width: "20%",
                        borderBottom: "2px solid #1565c0",
                        py: 2,
                        backgroundColor: "#1976d2",
                      }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "white",
                        width: "25%",
                        borderBottom: "2px solid #1565c0",
                        py: 2,
                        backgroundColor: "#1976d2",
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow
                      key={item._id}
                      sx={{
                        "&:hover": { backgroundColor: "#f8fafc" },
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      <TableCell sx={{ py: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            sx={{
                              bgcolor: getStatusColor(item.status).color,
                              width: 36,
                              height: 36,
                              mr: 1.5,
                              fontWeight: "bold",
                            }}
                          >
                            {item.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 600,
                                wordBreak: "break-word",
                                whiteSpace: "normal",
                                lineHeight: 1.3,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#64748b",
                                fontWeight: 600,
                                wordBreak: "break-word",
                                whiteSpace: "normal",
                                lineHeight: 1.3,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          py: 2,
                          textOverflow: "ellipsis",
                          whiteSpace: "normal",
                          overflow: "hidden",
                        }}
                      >
                        {item.position}
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Chip
                          icon={getStatusColor(item.status).icon}
                          label={item.status}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(item.status).bg,
                            color: getStatusColor(item.status).color,
                            fontWeight: 600,
                            borderRadius: "6px",
                            py: 0.5,
                            border: `1px solid ${
                              getStatusColor(item.status).color
                            }20`,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handlePreview(item)}
                              sx={{
                                color: "#1976d2",
                                "&:hover": {
                                  backgroundColor: "#e3f2fd",
                                  transform: "translateY(-2px)",
                                },
                                transition: "all 0.2s ease",
                              }}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleEditClick(item)}
                              sx={{
                                color: "#1976d2",
                                "&:hover": {
                                  backgroundColor: "#e3f2fd",
                                  transform: "translateY(-2px)",
                                },
                                transition: "all 0.2s ease",
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(item)}
                              sx={{
                                color: "#ef4444",
                                "&:hover": {
                                  backgroundColor: "#fee2e2",
                                  transform: "translateY(-2px)",
                                },
                                transition: "all 0.2s ease",
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Send Email">
                            <IconButton
                              size="small"
                              onClick={() => handleSendEmail(item)}
                              sx={{
                                color: "#1976d2",
                                "&:hover": {
                                  backgroundColor: "#e3f2fd",
                                  transform: "translateY(-2px)",
                                },
                                transition: "all 0.2s ease",
                              }}
                            >
                              <EmailOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            // Desktop view - full table with all columns
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "white",
                        width: isMobile || isTablet ? "40%" : "25%",
                        borderBottom: "2px solid #1565c0",
                        py: 2,
                        backgroundColor: "#1976d2",
                      }}
                    >
                      Employee
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "white",
                        borderBottom: "2px solid #1565c0",
                        py: 2,
                        backgroundColor: "#1976d2",
                      }}
                    >
                      Position
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "white",
                        borderBottom: "2px solid #1565c0",
                        py: 2,
                        backgroundColor: "#1976d2",
                      }}
                    >
                      Email
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "white",
                        width: isMobile ? "30%" : "15%",
                        borderBottom: "2px solid #1565c0",
                        py: 2,
                        backgroundColor: "#1976d2",
                      }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "white",
                        width: isMobile ? "30%" : "20%",
                        borderBottom: "2px solid #1565c0",
                        py: 2,
                        backgroundColor: "#1976d2",
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow
                      key={item._id}
                      sx={{
                        "&:hover": { backgroundColor: "#f8fafc" },
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      <TableCell sx={{ py: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            sx={{
                              bgcolor: getStatusColor(item.status).color,
                              width: 40,
                              height: 40,
                              mr: 1.5,
                              fontWeight: "bold",
                            }}
                          >
                            {item.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 600,
                                whiteSpace: "normal",
                                lineHeight: 1.3,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.name}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          py: 2,
                          textOverflow: "ellipsis",
                          whiteSpace: "normal",
                          overflow: "hidden",
                        }}
                      >
                        {item.position}
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>{item.email}</TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Chip
                          icon={getStatusColor(item.status).icon}
                          label={item.status}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(item.status).bg,
                            color: getStatusColor(item.status).color,
                            fontWeight: 600,
                            borderRadius: "6px",
                            py: 0.5,
                            border: `1px solid ${
                              getStatusColor(item.status).color
                            }20`,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handlePreview(item)}
                              sx={{
                                color: "#1976d2",
                                "&:hover": {
                                  backgroundColor: "#e3f2fd",
                                  transform: "translateY(-2px)",
                                },
                                transition: "all 0.2s ease",
                              }}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleEditClick(item)}
                              sx={{
                                color: "#1976d2",
                                "&:hover": {
                                  backgroundColor: "#e3f2fd",
                                  transform: "translateY(-2px)",
                                },
                                transition: "all 0.2s ease",
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(item)}
                              sx={{
                                color: "#ef4444",
                                "&:hover": {
                                  backgroundColor: "#fee2e2",
                                  transform: "translateY(-2px)",
                                },
                                transition: "all 0.2s ease",
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Send Email">
                            <IconButton
                              size="small"
                              onClick={() => handleSendEmail(item)}
                              sx={{
                                color: "#1976d2",
                                "&:hover": {
                                  backgroundColor: "#e3f2fd",
                                  transform: "translateY(-2px)",
                                },
                                transition: "all 0.2s ease",
                              }}
                            >
                              <EmailOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
            mb: 3,
          }}
        >
          {filteredData.map((item) => (
            <Paper
              key={item._id}
              elevation={0}
              sx={{
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
                },
                border: `1px solid ${getStatusColor(item.status).color}20`,
              }}
            >
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  borderBottom: `1px solid ${
                    getStatusColor(item.status).color
                  }20`,
                  backgroundColor: `${getStatusColor(item.status).color}05`,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: getStatusColor(item.status).color,
                    width: 64,
                    height: 64,
                    mb: 1.5,
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                  }}
                >
                  {item.name.charAt(0)}
                </Avatar>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, textAlign: "center", mb: 0.5 }}
                >
                  {item.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#64748b", textAlign: "center", mb: 1 }}
                >
                  {item.position}
                </Typography>
                <Chip
                  icon={getStatusColor(item.status).icon}
                  label={item.status}
                  size="small"
                  sx={{
                    backgroundColor: getStatusColor(item.status).bg,
                    color: getStatusColor(item.status).color,
                    fontWeight: 600,
                    borderRadius: "6px",
                    py: 0.5,
                    border: `1px solid ${getStatusColor(item.status).color}20`,
                  }}
                />
              </Box>

              <Box sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Email fontSize="small" sx={{ color: "#64748b", mr: 1 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#334155",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.email}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CalendarToday
                      fontSize="small"
                      sx={{ color: "#64748b", mr: 1 }}
                    />
                    <Typography variant="body2" sx={{ color: "#334155" }}>
                      {item.date
                        ? new Date(item.date).toLocaleDateString()
                        : item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "Date not available"}
                    </Typography>
                  </Box>

                  {item.reason && (
                    <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                      <Info
                        fontSize="small"
                        sx={{ color: "#64748b", mr: 1, mt: 0.3 }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#334155",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.reason}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => handlePreview(item)}
                    sx={{
                      borderColor: getStatusColor(item.status).color,
                      color: getStatusColor(item.status).color,
                      "&:hover": {
                        borderColor: getStatusColor(item.status).color,
                        backgroundColor: `${
                          getStatusColor(item.status).color
                        }10`,
                      },
                      textTransform: "none",
                      borderRadius: "8px",
                    }}
                  >
                    Details
                  </Button>

                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(item)}
                      sx={{
                        color: "#1976d2",
                        "&:hover": { backgroundColor: "#e3f2fd" },
                        mr: 0.5,
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(item)}
                      sx={{
                        color: "#ef4444",
                        "&:hover": { backgroundColor: "#fee2e2" },
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => handleStatusMenuOpen(e, item)}
                      sx={{
                        color: "#4caf50",
                        "&:hover": { backgroundColor: "#e8f5e9" },
                        ml: 0.5,
                      }}
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {/* Empty state */}
      {filteredData.length === 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            px: 2,
            textAlign: "center",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <img
            src="/assets/empty-state.svg"
            alt="No data"
            style={{ width: "180px", marginBottom: "24px", opacity: 0.7 }}
          />
          <Typography
            variant="h6"
            sx={{ mb: 1, fontWeight: 600, color: "#334155" }}
          >
            No resignation requests found
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 3, color: "#64748b", maxWidth: "500px" }}
          >
            {searchTerm
              ? `No results found for "${searchTerm}". Try a different search term or clear filters.`
              : selectedStatus
              ? `No ${selectedStatus.toLowerCase()} resignation requests found. Try a different filter.`
              : "There are no resignation requests yet. Create a new request to get started."}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateClick}
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
              color: "white",
              "&:hover": {
                background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
              },
              textTransform: "none",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(25, 118, 210, 0.25)",
              fontWeight: 500,
              px: 3,
              py: 1,
            }}
          >
            Create New Request
          </Button>
        </Box>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={showCreatePopup}
        onClose={handleClosePopup}
        maxWidth="md"
        fullWidth
        TransitionComponent={Zoom}
        PaperProps={{
          sx: {
            width: isMobile ? "95%" : "800px",
            maxWidth: "95vw",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(45deg, #1976d2, #64b5f6)",
            color: "white",
            fontSize: isMobile ? "1.25rem" : "1.5rem",
            fontWeight: 600,
            padding: isMobile ? "16px 20px" : "20px 24px",
            position: "relative",
          }}
        >
          {isEditing ? "Edit Resignation Letter" : "Create Resignation Letter"}
          <IconButton
            onClick={handleClosePopup}
            sx={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ padding: isMobile ? "16px" : "24px" }}>
          <Grid container spacing={isMobile ? 2 : 3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Employee Name"
                name="name"
                value={newResignation.name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#1976d2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1976d2",
                      borderWidth: "2px",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={newResignation.email}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#1976d2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1976d2",
                      borderWidth: "2px",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Position/Title"
                name="title"
                value={newResignation.title}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#1976d2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1976d2",
                      borderWidth: "2px",
                    },
                  },
                }}
              />
            </Grid>

            {/* Status Change Menu */}
            <Menu
              anchorEl={statusMenuAnchorEl}
              open={Boolean(statusMenuAnchorEl)}
              onClose={handleStatusMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                  borderRadius: "8px",
                  minWidth: 180,
                },
              }}
            >
              <MenuItem
                onClick={() => handleStatusChange("Requested")}
                sx={{
                  color: "#2f54eb",
                  "&:hover": { backgroundColor: "#f0f5ff" },
                }}
              >
                <Email fontSize="small" sx={{ mr: 1.5 }} />
                Requested
              </MenuItem>
              <MenuItem
                onClick={() => handleStatusChange("Pending")}
                sx={{
                  color: "#fa8c16",
                  "&:hover": { backgroundColor: "#fff7e6" },
                }}
              >
                <AccessTime fontSize="small" sx={{ mr: 1.5 }} />
                Pending
              </MenuItem>
              <MenuItem
                onClick={() => handleStatusChange("Approved")}
                sx={{
                  color: "#1890ff",
                  "&:hover": { backgroundColor: "#e6f7ff" },
                }}
              >
                <CheckCircle fontSize="small" sx={{ mr: 1.5 }} />
                Approved
              </MenuItem>
              <MenuItem
                onClick={() => handleStatusChange("Rejected")}
                sx={{
                  color: "#ff4d4f",
                  "&:hover": { backgroundColor: "#fff1f0" },
                }}
              >
                <Cancel fontSize="small" sx={{ mr: 1.5 }} />
                Rejected
              </MenuItem>
            </Menu>

            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, mt: 1, fontWeight: 500 }}
              >
                Resignation Letter
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <div className="quill-container">
                  <ReactQuill
                    theme="snow"
                    value={newResignation.description}
                    onChange={handleDescriptionChange}
                    modules={modules}
                    style={{
                      height: isMobile ? "180px" : "250px",
                      marginBottom: "40px",
                      borderRadius: "0",
                    }}
                    placeholder="Write your resignation letter here..."
                  />
                </div>
              </Paper>
            </Grid>
          </Grid>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: isMobile ? 6 : 4,
            }}
          >
            <Button
              onClick={handleClosePopup}
              variant="outlined"
              sx={{
                borderColor: "#1976d2",
                color: "#1976d2",
                "&:hover": {
                  borderColor: "#1565c0",
                  backgroundColor: "#e3f2fd",
                },
                textTransform: "none",
                borderRadius: "8px",
                px: 3,
                py: 1,
                fontWeight: 500,
              }}
            >
              Cancel
            </Button>
            <LoadingButton
              onClick={handleSave}
              loading={isSaving}
              loadingPosition="start"
              startIcon={<Save />}
              variant="contained"
              sx={{
                background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(45deg, #1565c0, #42a5f5)",
                  boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                },
                textTransform: "none",
                borderRadius: "8px",
                px: 3,
                py: 1,
                fontWeight: 500,
                boxShadow: "0 2px 8px rgba(25, 118, 210, 0.25)",
              }}
            >
              {isEditing ? "Update" : "Save"}
            </LoadingButton>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            width: isMobile ? "95%" : "800px",
            maxWidth: "95vw",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          },
        }}
      >
        {previewData && (
          <>
            <DialogTitle
              sx={{
                background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                color: "white",
                fontSize: isMobile ? "1.25rem" : "1.5rem",
                fontWeight: 600,
                padding: isMobile ? "16px 20px" : "20px 24px",
                position: "relative",
              }}
            >
              Resignation Letter
              <IconButton
                onClick={() => setPreviewOpen(false)}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                <Close />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ padding: isMobile ? "16px" : "24px" }}>
              <Grid container spacing={isMobile ? 2 : 3}>
                <Grid item xs={12} md={8}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 3,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: getStatusColor(previewData.status).color,
                        width: 48,
                        height: 48,
                        mr: 2,
                        fontWeight: "bold",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      {previewData.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {previewData.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#64748b" }}>
                        {previewData.position}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4} sx={{ textAlign: "right" }}>
                  <Chip
                    icon={getStatusColor(previewData.status).icon}
                    label={previewData.status}
                    sx={{
                      backgroundColor: getStatusColor(previewData.status).bg,
                      color: getStatusColor(previewData.status).color,
                      fontWeight: 500,
                      borderRadius: "6px",
                      py: 0.5,
                      border: `1px solid ${
                        getStatusColor(previewData.status).color
                      }20`,
                      mb: 1,
                    }}
                  />
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    {previewData.email}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      p: 3,
                      mt: 2,
                      backgroundColor: "#f8fafc",
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: previewData.description,
                      }}
                      className="resignation-content"
                    />
                  </Paper>
                </Grid>
              </Grid>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 3,
                }}
              >
                <Button
                  onClick={() => handleEditClick(previewData)}
                  startIcon={<Edit />}
                  variant="outlined"
                  sx={{
                    borderColor: "#1976d2",
                    color: "#1976d2",
                    "&:hover": {
                      borderColor: "#1565c0",
                      backgroundColor: "#e3f2fd",
                    },
                    textTransform: "none",
                    borderRadius: "8px",
                    fontWeight: 500,
                  }}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleSendEmail(previewData)}
                  startIcon={<Send />}
                  variant="contained"
                  sx={{
                    background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                    color: "white",
                    "&:hover": {
                      background: "linear-gradient(45deg, #1565c0, #42a5f5)",
                      boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                    },
                    textTransform: "none",
                    borderRadius: "8px",
                    fontWeight: 500,
                    boxShadow: "0 2px 8px rgba(25, 118, 210, 0.25)",
                  }}
                >
                  Send Email
                </Button>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>

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
        TransitionComponent={Fade}
        TransitionProps={{
          timeout: 300,
        }}
        sx={{
          "& .MuiDialog-container": {
            justifyContent: "center",
            alignItems: "center",
            "& .MuiPaper-root": {
              margin: { xs: "16px", sm: "32px" },
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            },
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
            Are you sure you want to delete this resignation letter? This action
            cannot be undone.
          </Alert>
          {itemToDelete && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
              <Typography variant="body1" fontWeight={600} color="#2c3e50">
                Employee: {itemToDelete.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Position: {itemToDelete.position}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: {itemToDelete.email}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip
                  icon={getStatusColor(itemToDelete.status).icon}
                  label={itemToDelete.status}
                  size="small"
                  sx={{
                    backgroundColor: getStatusColor(itemToDelete.status).bg,
                    color: getStatusColor(itemToDelete.status).color,
                    fontWeight: 600,
                    borderRadius: "6px",
                    py: 0.5,
                    border: `1px solid ${
                      getStatusColor(itemToDelete.status).color
                    }20`,
                  }}
                />
              </Box>
              {itemToDelete.description && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" fontWeight={600} color="#2c3e50">
                    Letter Preview:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      p: 1,
                      bgcolor: "#fff",
                      borderRadius: 1,
                      border: "1px solid #e2e8f0",
                      maxHeight: "100px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {itemToDelete.description
                      .replace(/<[^>]*>?/gm, "")
                      .substring(0, 150)}
                    {itemToDelete.description.length > 150 ? "..." : ""}
                  </Typography>
                </Box>
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

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5002}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={Fade}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            borderRadius: "8px",
            alignItems: "center",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ResignationPage;
