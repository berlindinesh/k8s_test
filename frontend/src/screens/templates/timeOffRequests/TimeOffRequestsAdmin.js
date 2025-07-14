import React, { useState, useEffect } from "react";
import { styled, alpha } from "@mui/material/styles";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  MenuItem,
  Grid,
  Chip,
  Divider,
  Tooltip,
  Alert,
  Snackbar,
  Container,
  Card,
  CardContent,
  Stack,
  useMediaQuery,
  useTheme,
  Fade,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  TextareaAutosize,
} from "@mui/material";
import {
  Search,
  Visibility,
  Close,
  Edit,
  Delete,
  Add,
  AccessTime,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import api from "../../../api/axiosInstance";
import { useNotifications } from "../../../context/NotificationContext";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(1),
  boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .1)",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontSize: 14,
  fontWeight: "bold",
  padding: theme.spacing(2),
  whiteSpace: "normal",
  "&.MuiTableCell-body": {
    color: theme.palette.text.primary,
    fontSize: 14,
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
    padding: { xs: theme.spacing(1.5), sm: theme.spacing(2) },
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
  // Hide last border
  "&:last-child td, &:last-child th": {
    borderBottom: 0,
  },
}));

const TimeOffRequestsAdmin = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reviewData, setReviewData] = useState({
    status: "Pending",
    reviewComment: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { addNotification } = useNotifications();
  const currentUserId = localStorage.getItem("userId");
  const currentUserName = localStorage.getItem("userName") || "Admin";

  const statusOptions = ["Pending", "Approved", "Rejected", "All"];

  useEffect(() => {
    fetchRequests();
  }, [searchTerm, filterStatus]);


  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };


  const handleReviewOpen = (request) => {
    setSelectedRequest(request);
    setReviewData({
      status: request.status,
      reviewComment: request.reviewComment || "",
    });
    setReviewOpen(true);
  };


  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "warning",
      Approved: "success",
      Rejected: "error",
    };
    return colors[status] || "default";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    return timeString;
  };


//   // Add this function to get the auth token
// const getAuthToken = () => {
//   return localStorage.getItem('token');
// };

// Update the fetchRequests function
const fetchRequests = async () => {
  try {
    setLoading(true);
    // const token = getAuthToken();
    const response = await api.get(
      `/time-off-requests?searchTerm=${searchTerm}&status=${filterStatus}`,
      // {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // }
    );
    setRequests(response.data);
  } catch (error) {
    console.error("Error fetching requests:", error);
    showSnackbar("Error fetching requests", "error");
  } finally {
    setLoading(false);
  }
};

// Update the handlePreview function
const handlePreview = async (id) => {
  try {
    // const token = getAuthToken();
    const response = await api.get(
      `/time-off-requests/${id}`,
      // {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // }
    );
    setSelectedRequest(response.data);
    setPreviewOpen(true);
  } catch (error) {
    showSnackbar("Error fetching request details", "error");
  }
};

// Update the handleReviewSubmit function
const handleReviewSubmit = async () => {
  try {
    setLoading(true);
    // const token = getAuthToken();

    const response = await api.put(
      `/time-off-requests/${selectedRequest._id}`,
      {
        ...reviewData,
        reviewedBy: currentUserName,
      }
    );

    if (response.data) {
      showSnackbar(`Request ${reviewData.status.toLowerCase()} successfully`);

      // No need to manually add notification here as the backend will handle it
      // The backend will create the notification and emit the socket event

      fetchRequests();
      setReviewOpen(false);
    }
  } catch (error) {
    console.error("Error updating request:", error);
    showSnackbar("Error updating request", "error");
  } finally {
    setLoading(false);
  }
};


  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
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
            Time Off Requests Management
          </Typography>
        </Box>

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
              placeholder="Search by employee name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{
                width: { xs: "100%", sm: "300px" },
                marginRight: { xs: 0, sm: "auto" },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="primary" />
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
              <Button
                variant="contained"
                color="primary"
                onClick={fetchRequests}
                startIcon={<AccessTime />}
                sx={{
                  height: { xs: "auto", sm: 50 },
                  padding: { xs: "8px 16px", sm: "6px 16px" },
                  width: { xs: "100%", sm: "auto" },
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                  color: "white",
                  "&:hover": {
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                  },
                }}
              >
                Refresh Requests
              </Button>
            </Box>
          </Box>
        </StyledPaper>

        {/* Status Filter */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1,
            mb: 2,
          }}
        >
          <Button
            sx={{
              color: "green",
              justifyContent: { xs: "flex-start", sm: "center" },
              width: { xs: "100%", sm: "auto" },
            }}
            onClick={() => setFilterStatus("Approved")}
          >
            ● Approved
          </Button>
          <Button
            sx={{
              color: "red",
              justifyContent: { xs: "flex-start", sm: "center" },
              width: { xs: "100%", sm: "auto" },
            }}
            onClick={() => setFilterStatus("Rejected")}
          >
            ● Rejected
          </Button>
          <Button
            sx={{
              color: "orange",
              justifyContent: { xs: "flex-start", sm: "center" },
              width: { xs: "100%", sm: "auto" },
            }}
            onClick={() => setFilterStatus("Pending")}
          >
            ● Pending
          </Button>
          <Button
            sx={{
              color: "gray",
              justifyContent: { xs: "flex-start", sm: "center" },
              width: { xs: "100%", sm: "auto" },
            }}
            onClick={() => setFilterStatus("all")}
          >
            ● All
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              my: 6,
            }}
          >
            <CircularProgress
              size={40}
              thickness={4}
              sx={{ color: theme.palette.primary.main }}
            />
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              Loading time off requests...
            </Typography>
          </Box>
        ) : (
          <>
            {requests.length > 0 ? (
              <TableContainer
                component={Paper}
                sx={{
                  maxHeight: { xs: 450, sm: 500, md: 550 },
                  overflowY: "auto",
                  overflowX: "auto",
                  mx: 0,
                  borderRadius: 2,
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  mb: 4,
                  "& .MuiTableContainer-root": {
                    scrollbarWidth: "thin",
                    "&::-webkit-scrollbar": {
                      width: 8,
                      height: 8,
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: alpha(theme.palette.primary.light, 0.1),
                      borderRadius: 8,
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.2),
                      borderRadius: 8,
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.3),
                      },
                    },
                  },
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell sx={{ minWidth: 200 }}>
                        Employee
                      </StyledTableCell>
                      <StyledTableCell sx={{ minWidth: 130 }}>
                        Date
                      </StyledTableCell>
                      <StyledTableCell sx={{ minWidth: 100 }}>
                        Shift
                      </StyledTableCell>
                      <StyledTableCell sx={{ minWidth: 100 }}>
                        Work Type
                      </StyledTableCell>
                      <StyledTableCell sx={{ minWidth: 100 }}>
                        Status
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{ minWidth: 120, textAlign: "center" }}
                      >
                        Actions
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {requests.map((request) => (
                      <StyledTableRow key={request._id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="flex-start" gap={1}>
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                bgcolor: alpha(theme.palette.primary.main, 0.8),
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "bold",
                                fontSize: "0.875rem",
                                flexShrink: 0,
                                mt: 0.5,
                              }}
                            >
                              {request.name?.[0] || "U"}
                            </Box>
                            <Box
                              sx={{ display: "flex", flexDirection: "column" }}
                            >
                              <Typography variant="body2" fontWeight={600}>
                                {request.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {request.empId}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <Typography variant="body2" fontWeight={500}>
                              {formatDate(request.date)}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {request.day}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={request.shift}
                            size="small"
                            sx={{
                              backgroundColor: alpha(
                                theme.palette.primary.light,
                                0.1
                              ),
                              color: theme.palette.primary.dark,
                              fontWeight: 500,
                              borderRadius: "4px",
                              "& .MuiChip-label": { px: 1 },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={request.workType}
                            size="small"
                            sx={{
                              backgroundColor: alpha(
                                theme.palette.success.light,
                                0.1
                              ),
                              color: theme.palette.success.dark,
                              fontWeight: 500,
                              borderRadius: "4px",
                              "& .MuiChip-label": { px: 1 },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "inline-block",
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              fontSize: "0.75rem",
                              fontWeight: "medium",
                              backgroundColor:
                                request.status === "Approved"
                                  ? alpha("#4caf50", 0.1)
                                  : request.status === "Rejected"
                                  ? alpha("#f44336", 0.1)
                                  : alpha("#ff9800", 0.1),
                              color:
                                request.status === "Approved"
                                  ? "#2e7d32"
                                  : request.status === "Rejected"
                                  ? "#d32f2f"
                                  : "#e65100",
                            }}
                          >
                            {request.status}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              gap: 1,
                            }}
                          >
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => handlePreview(request._id)}
                                color="info"
                                sx={{
                                  backgroundColor: alpha(
                                    theme.palette.info.main,
                                    0.1
                                  ),
                                  "&:hover": {
                                    backgroundColor: alpha(
                                      theme.palette.info.main,
                                      0.2
                                    ),
                                  },
                                }}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Review Request">
                              <IconButton
                                size="small"
                                onClick={() => handleReviewOpen(request)}
                                color="primary"
                                sx={{
                                  backgroundColor: alpha(
                                    theme.palette.primary.main,
                                    0.1
                                  ),
                                  "&:hover": {
                                    backgroundColor: alpha(
                                      theme.palette.primary.main,
                                      0.2
                                    ),
                                  },
                                }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </StyledTableRow>
                    ))}
                    {requests.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" color="text.secondary">
                            No time off requests found matching your filters.
                          </Typography>
                          <Button
                            variant="text"
                            color="primary"
                            onClick={() => {
                              setSearchTerm("");
                              setFilterStatus("all");
                            }}
                            sx={{ mt: 1 }}
                          >
                            Clear filters
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Card
                sx={{
                  textAlign: "center",
                  py: 6,
                  borderRadius: 2,
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  backgroundColor: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: "blur(8px)",
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 3 }}>
                    <AccessTime
                      sx={{
                        fontSize: 60,
                        color: alpha(theme.palette.primary.main, 0.2),
                        mb: 2,
                      }}
                    />
                    <Typography
                      variant="h5"
                      color="text.primary"
                      gutterBottom
                      fontWeight={600}
                    >
                      No time off requests found
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ maxWidth: 500, mx: "auto" }}
                    >
                      There are no requests matching your search criteria.
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setSearchTerm("");
                      setFilterStatus("all");
                    }}
                    sx={{
                      mt: 2,
                      px: 3,
                      py: 1,
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      "&:hover": {
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          0.05
                        ),
                        borderColor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Preview Dialog */}
        <Dialog
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Time Off Request Details</Typography>
            <IconButton onClick={() => setPreviewOpen(false)}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {selectedRequest && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: "100%" }}>
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        gutterBottom
                      >
                        Employee Information
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Name
                          </Typography>
                          <Typography variant="body1">
                            {selectedRequest.name}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Employee ID
                          </Typography>
                          <Typography variant="body1">
                            {selectedRequest.empId}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Status
                          </Typography>
                          <Chip
                            label={selectedRequest.status}
                            color={getStatusColor(selectedRequest.status)}
                            size="small"
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: "100%" }}>
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        gutterBottom
                      >
                        Time Off Details
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Date
                          </Typography>
                          <Typography variant="body1">
                            {formatDate(selectedRequest.date)} (
                            {selectedRequest.day})
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Time
                          </Typography>
                          <Typography variant="body1">
                            {formatTime(selectedRequest.checkIn)} -{" "}
                            {formatTime(selectedRequest.checkOut)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Shift & Work Type
                          </Typography>
                          <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                            <Chip
                              label={selectedRequest.shift}
                              size="small"
                              sx={{
                                backgroundColor: "#e3f2fd",
                                color: "#1976d2",
                              }}
                            />
                            <Chip
                              label={selectedRequest.workType}
                              size="small"
                              sx={{
                                backgroundColor: "#e8f5e9",
                                color: "#2e7d32",
                              }}
                            />
                          </Box>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        gutterBottom
                      >
                        Additional Information
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Minimum Hours
                          </Typography>
                          <Typography variant="body1">
                            {selectedRequest.minHour} hours
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            At Work
                          </Typography>
                          <Typography variant="body1">
                            {selectedRequest.atWork} hours
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Overtime
                          </Typography>
                          <Typography variant="body1">
                            {selectedRequest.overtime || 0} hours
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">
                            Comment
                          </Typography>
                          <Typography variant="body1">
                            {selectedRequest.comment || "No comment provided"}
                          </Typography>
                        </Grid>
                        {selectedRequest.reviewComment && (
                          <Grid item xs={12}>
                            <Typography variant="body2" color="text.secondary">
                              Review Comment
                            </Typography>
                            <Typography variant="body1">
                              {selectedRequest.reviewComment}
                            </Typography>
                          </Grid>
                        )}
                        {selectedRequest.reviewedBy && (
                          <Grid item xs={12}>
                            <Typography variant="body2" color="text.secondary">
                              Reviewed By
                            </Typography>
                            <Typography variant="body1">
                              {selectedRequest.reviewedBy}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPreviewOpen(false)}>Close</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setPreviewOpen(false);
                handleReviewOpen(selectedRequest);
              }}
            >
              Review Request
            </Button>
          </DialogActions>
        </Dialog>

        {/* Review Dialog */}
        <Dialog
          open={reviewOpen}
          onClose={() => setReviewOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Review Time Off Request</Typography>
            <IconButton onClick={() => setReviewOpen(false)}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {selectedRequest && (
              <Box sx={{ mb: 2 }}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Reviewing request for {selectedRequest.name} on{" "}
                  {formatDate(selectedRequest.date)}
                </Alert>

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={reviewData.status}
                    onChange={handleReviewChange}
                    label="Status"
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Approved">Approve</MenuItem>
                    <MenuItem value="Rejected">Reject</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Review Comment"
                  name="reviewComment"
                  value={reviewData.reviewComment}
                  onChange={handleReviewChange}
                  multiline
                  rows={4}
                  placeholder="Add a comment about your decision (optional)"
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReviewOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              color={
                reviewData.status === "Approved"
                  ? "success"
                  : reviewData.status === "Rejected"
                  ? "error"
                  : "primary"
              }
              onClick={handleReviewSubmit}
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={20} />
                ) : reviewData.status === "Approved" ? (
                  <CheckCircle />
                ) : reviewData.status === "Rejected" ? (
                  <Cancel />
                ) : null
              }
            >
              {loading
                ? "Submitting..."
                : reviewData.status === "Approved"
                ? "Approve"
                : reviewData.status === "Rejected"
                ? "Reject"
                : "Submit"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default TimeOffRequestsAdmin;
