import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux'; // Add Redux hook
import { selectUserRole, selectUser } from '../../../redux/authSlice'; // Import selectors
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Alert,
  Snackbar,
  Paper,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LockIcon from "@mui/icons-material/Lock";
import api from "../../../api/axiosInstance";

// Add these styled components for consistent styling
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(1),
  boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .1)",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(2),
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const Policies = () => {
  const [policies, setPolicies] = useState([]);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [policyToDelete, setPolicyToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Redux selectors for RBAC
  const userRole = useSelector(selectUserRole);
  const currentUser = useSelector(selectUser);

  // Add responsive hooks
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // RBAC helper functions
  const canCreateEditDelete = () => {
    const role = userRole || localStorage.getItem('userRole');
    return ['admin', 'hr'].includes(role);
  };

  const canViewOnly = () => {
    const role = userRole || localStorage.getItem('userRole');
    return ['manager', 'employee'].includes(role);
  };

  const getUserRole = () => {
    return userRole || localStorage.getItem('userRole') || 'employee';
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  useEffect(() => {
    // Check if user has access to policies
    const role = getUserRole();
    if (!['admin', 'hr', 'manager', 'employee'].includes(role)) {
      setSnackbar({
        open: true,
        message: "You don't have permission to access policies",
        severity: "error",
      });
    }
  }, [userRole]);

  const handleSearchChange = (e) => setSearch(e.target.value);

  const filteredPolicies = policies.filter((policy) =>
    policy.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    if (!canCreateEditDelete()) {
      setSnackbar({
        open: true,
        message: "You don't have permission to create policies",
        severity: "error",
      });
      return;
    }
    setSelectedPolicy({ title: "", content: "" });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleEdit = (policy) => {
    if (!canCreateEditDelete()) {
      setSnackbar({
        open: true,
        message: "You don't have permission to edit policies",
        severity: "error",
      });
      return;
    }
    setSelectedPolicy(policy);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (policy) => {
    if (!canCreateEditDelete()) {
      setSnackbar({
        open: true,
        message: "You don't have permission to delete policies",
        severity: "error",
      });
      return;
    }
    setPolicyToDelete(policy);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setPolicyToDelete(null);
  };

  const handleView = (policy) => {
    setSelectedPolicy(policy);
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedPolicy(null);
    setIsEditMode(false);
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

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const response = await api.get("/policies");
      setPolicies(response.data);
    } catch (error) {
      console.error("Error fetching policies:", error);
      showSnackbar("Error fetching policies", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!canCreateEditDelete()) {
      showSnackbar("You don't have permission to save policies", "error");
      return;
    }

    try {
      setLoading(true);
      
      if (isEditMode) {
        if (selectedPolicy._id) {
          // Update existing policy
          const response = await api.put(
            `/policies/${selectedPolicy._id}`,
            selectedPolicy
          );
          setPolicies(
            policies.map((p) =>
              p._id === selectedPolicy._id ? response.data : p
            )
          );
          showSnackbar("Policy updated successfully");
        } else {
          // Create new policy
          const response = await api.post(
            "/policies",
            selectedPolicy
          );
          setPolicies([...policies, response.data]);
          showSnackbar("Policy created successfully");
        }
      }
      handleDialogClose();
    } catch (error) {
      console.error("Error saving policy:", error);
      showSnackbar(error.response?.data?.error || "Error saving policy", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!policyToDelete) return;
    
    if (!canCreateEditDelete()) {
      showSnackbar("You don't have permission to delete policies", "error");
      return;
    }
    
    try {
      setLoading(true);
      await api.delete(`/policies/${policyToDelete._id}`);
      setPolicies(policies.filter((policy) => policy._id !== policyToDelete._id));
      showSnackbar("Policy deleted successfully");
    } catch (error) {
      console.error("Error deleting policy:", error);
      showSnackbar(error.response?.data?.error || "Error deleting policy", "error");
    } finally {
      setLoading(false);
      handleCloseDeleteDialog();
    }
  };

  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3, md: 4 }, 
      backgroundColor: "#f5f5f5", 
      minHeight: "100vh" 
    }}>
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
        Company Policies
        {canViewOnly() && (
          <Typography
            variant="caption"
            sx={{
              display: "block",
              color: theme.palette.text.secondary,
              fontWeight: 400,
              mt: 0.5,
            }}
          >
            View Only Mode - Contact HR/Admin for policy changes
          </Typography>
        )}
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
          <SearchTextField
            placeholder="Search policies..."
            value={search}
            onChange={handleSearchChange}
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
          />

          {canCreateEditDelete() && (
            <Button
              variant="contained"
              onClick={handleCreate}
              startIcon={<AddIcon />}
              sx={{
                height: { xs: "auto", sm: 40 },
                padding: { xs: "8px 16px", sm: "6px 16px" },
                width: { xs: "100%", sm: "auto" },
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                color: "white",
                "&:hover": {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                },
              }}
            >
              Create Policy
            </Button>
          )}

          {canViewOnly() && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: theme.palette.text.secondary,
                fontSize: "0.875rem",
              }}
            >
              <VisibilityIcon fontSize="small" />
              <Typography variant="body2">
                View Only Access
              </Typography>
            </Box>
          )}
        </Box>
      </StyledPaper>

      {loading && !isDialogOpen && !deleteDialogOpen ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={40} />
        </Box>
      ) : (
        <Grid container spacing={isMobile ? 2 : 3}>
          {filteredPolicies.map((policy) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={policy._id}>
              <Card
                sx={{ 
                  height: "100%", 
                  padding: isMobile ? "12px" : "16px", 
                  position: "relative",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Typography variant="h6">
                  <span style={{ color: "green", fontSize: "24px" }}>●</span>{" "}
                  {policy.title}
                  
                  {/* Action buttons - only show for admin/hr */}
                  {canCreateEditDelete() && (
                    <>
                      <IconButton
                        onClick={() => handleEdit(policy)}
                        size="small"
                        sx={{ position: "absolute", top: 8, right: 40 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(policy)}
                        size="small"
                        sx={{ position: "absolute", top: 8, right: 8 }}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </>
                  )}

                  {/* View only indicator for manager/employee */}
                  {canViewOnly() && (
                    <IconButton
                      size="small"
                      sx={{ 
                        position: "absolute", 
                        top: 8, 
                        right: 8,
                        color: theme.palette.text.secondary 
                      }}
                      disabled
                    >
                      <LockIcon fontSize="small" />
                    </IconButton>
                  )}
                </Typography>
                
                <CardContent sx={{ height: "120px", overflowY: "auto", px: 0 }}>
                  <Typography 
                    variant="body2" 
                    component="p"
                    sx={{
                      wordBreak: "break-word",
                      overflowWrap: "break-word"
                    }}
                  >
                    {policy.content}
                  </Typography>
                </CardContent>
                
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => handleView(policy)}
                  sx={{ mt: 1 }}
                  startIcon={<VisibilityIcon />}
                >
                  {canCreateEditDelete() ? "View Policy" : "Read Policy"}
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* View/Edit Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            width: isMobile ? "100%" : "600px",
            borderRadius: isMobile ? "0" : "20px",
            margin: isMobile ? "0" : "32px",
            maxWidth: "100%",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: isEditMode 
              ? "linear-gradient(45deg, #1976d2, #64b5f6)"
              : "linear-gradient(45deg, #4caf50, #81c784)",
            color: "white",
            fontSize: "1.5rem",
            fontWeight: 600,
            padding: "24px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isEditMode ? (
              canCreateEditDelete() ? (
                selectedPolicy?._id ? "Edit Policy" : "Create New Policy"
              ) : (
                "View Policy (Read Only)"
              )
            ) : (
              "View Policy"
            )}
            
            {canViewOnly() && (
              <LockIcon sx={{ ml: 1, fontSize: "1.2rem" }} />
            )}
          </Box>
          
          <IconButton
            onClick={handleDialogClose}
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ padding: "32px", backgroundColor: "#f8fafc" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Role-based access message */}
            {canViewOnly() && (
              <Alert severity="info" sx={{ mb: 2 }}>
                You have read-only access to policies. Contact HR or Admin for modifications.
              </Alert>
            )}

            <TextField
              label="Policy Title"
              fullWidth
              value={selectedPolicy?.title || ""}
              onChange={(e) =>
                setSelectedPolicy({
                  ...selectedPolicy,
                  title: e.target.value,
                })
              }
              disabled={!isEditMode || !canCreateEditDelete()}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: (!isEditMode || !canCreateEditDelete()) ? "#f5f5f5" : "white",
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
              label="Policy Content"
              fullWidth
              multiline
              rows={12}
              value={selectedPolicy?.content || ""}
              onChange={(e) =>
                setSelectedPolicy({
                  ...selectedPolicy,
                  content: e.target.value,
                })
              }
              disabled={!isEditMode || !canCreateEditDelete()}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: (!isEditMode || !canCreateEditDelete()) ? "#f5f5f5" : "white",
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

            {/* Show policy metadata for view mode */}
            {!isEditMode && selectedPolicy?.createdAt && (
              <Box sx={{ 
                p: 2, 
                bgcolor: "#e3f2fd", 
                borderRadius: 2,
                border: "1px solid #bbdefb"
              }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Created:</strong> {new Date(selectedPolicy.createdAt).toLocaleDateString()}
                </Typography>
                {selectedPolicy.updatedAt && selectedPolicy.updatedAt !== selectedPolicy.createdAt && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    <strong>Last Updated:</strong> {new Date(selectedPolicy.updatedAt).toLocaleDateString()}
                  </Typography>
                )}
              </Box>
            )}
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
            {isEditMode ? "Cancel" : "Close"}
          </Button>

          {/* Only show save button for admin/hr in edit mode */}
          {isEditMode && canCreateEditDelete() && (
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={
                loading ||
                !selectedPolicy?.title?.trim() ||
                !selectedPolicy?.content?.trim()
              }
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
                "&:disabled": {
                  background: "#cccccc",
                  color: "#666666",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : selectedPolicy?._id ? (
                "Update Policy"
              ) : (
                "Create Policy"
              )}
            </Button>
          )}
        </DialogActions>
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
          <DeleteIcon />
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
            Are you sure you want to delete this policy? This action cannot be undone.
          </Alert>

          {policyToDelete && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "#fff3e0", borderRadius: 2 }}>
              <Typography variant="body1" fontWeight={600} color="#e65100">
                Policy to be deleted:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  p: 1,
                  bgcolor: "#fff",
                  borderRadius: 1,
                  border: "1px solid #ffcc02",
                }}
              >
                <strong>Title:</strong> {policyToDelete.title}
                <br />
                <strong>Content Preview:</strong>{" "}
                {policyToDelete.content.substring(0, 100)}
                {policyToDelete.content.length > 100 ? "..." : ""}
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
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={loading}
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
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Delete Policy"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Empty state */}
      {!loading && filteredPolicies.length === 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {search ? "No policies found matching your search" : "No policies available"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {search 
              ? "Try adjusting your search terms" 
              : canCreateEditDelete() 
                ? "Create your first policy to get started"
                : "Contact HR or Admin to add policies"
            }
          </Typography>
          
          {!search && canCreateEditDelete() && (
            <Button
              variant="contained"
              onClick={handleCreate}
              startIcon={<AddIcon />}
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                color: "white",
                "&:hover": {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                },
              }}
            >
              Create First Policy
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Policies;