import React, { useState, useEffect } from "react";
import api from "../../../api/axiosInstance";
import moment from "moment";
import { format } from "date-fns";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Tooltip,
  IconButton,
  Typography,
  Stack,
  Chip,
  Checkbox,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Badge,
  Avatar,
  Tabs,
  Tab,
  LinearProgress,
  Breadcrumbs,
  Link,
  Autocomplete,
  useMediaQuery,
  useTheme,
  Fade,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  Edit,
  Delete,
  Search,
  FilterList,
  Add,
  Archive,
  Unarchive,
  Refresh,
  AccessTime,
  Person,
  Group,
  CheckCircle,
  Home,
  Dashboard,
  Assessment,
  Close,
  Menu as MenuIcon,
} from "@mui/icons-material";
import Popover from "@mui/material/Popover";

import "./Objectives.css";

const API_URL = "/objectives";
const EMPLOYEES_API_URL = "/employees/registered";

const Objectives = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [objectives, setObjectives] = useState([]);
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    managers: "",
    assignees: "",
    keyResults: "",
    duration: "",
    archived: "",
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentObjective, setCurrentObjective] = useState(null);
  const [showArchivedTable, setShowArchivedTable] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  //const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  // Add these state variables for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Add this near the top of your component with other state variables
  const [currentUserId, setCurrentUserId] = useState(null);

  // Add this near your other state declarations
  const [keyResultDateError, setKeyResultDateError] = useState(null);

  // New state variables for enhanced functionality
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [tabValue, setTabValue] = useState(0);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalObjectives, setTotalObjectives] = useState(0);
  const [objectiveStats, setObjectiveStats] = useState({
    total: 0,
    active: 0,
    archived: 0,
    selfObjectives: 0,
    allObjectives: 0,
  });
  const [viewMode, setViewMode] = useState("table"); // table, card, kanban
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // State variables for managers and assignees
  const [managerInput, setManagerInput] = useState("");
  const [assigneeInput, setAssigneeInput] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  // In the keyResultInput state, add a completed field
  const [keyResultInput, setKeyResultInput] = useState({
    title: "",
    description: "",
    targetValue: "",
    unit: "",
    dueDate: null,
    completed: false, // Add this line
  });

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter button click handler
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
    setIsFilterModalOpen(true);
  };

  // Filter close handler
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
    setIsFilterModalOpen(false);
  };

  // Load objectives on component mount and when dependencies change
  useEffect(() => {
    loadObjectives();
    fetchEmployees();
  }, [selectedTab, searchTerm, page, rowsPerPage, sortConfig]);

  // Calculate statistics when objectives change
  useEffect(() => {
    if (objectives.length > 0) {
      const stats = {
        total: objectives.length,
        active: objectives.filter((obj) => !obj.archived).length,
        archived: objectives.filter((obj) => obj.archived).length,
        selfObjectives: objectives.filter((obj) => obj.objectiveType === "self")
          .length,
        allObjectives: objectives.filter((obj) => obj.objectiveType === "all")
          .length,
      };
      setObjectiveStats(stats);
    }
  }, [objectives]);

  useEffect(() => {
    // Get the current user ID from localStorage or your auth system
    const userId = localStorage.getItem("userId"); // Adjust this based on how you store user info
    setCurrentUserId(userId);

    // Only load objectives if we have a userId
    if (userId) {
      loadObjectives();
    }

    fetchEmployees();
  }, []);

  // Update the useEffect to avoid conflicts with tab changes
  useEffect(() => {
    console.log("useEffect triggered with selectedTab:", selectedTab);

    // Only load objectives if:
    // 1. We have a currentUserId
    // 2. We're not in the middle of a tab change
    if (currentUserId && !window.isChangingTab) {
      console.log("Loading objectives from useEffect");
      fetchObjectivesForTab(selectedTab);
    }
  }, [selectedTab, currentUserId]);

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const response = await api.get(EMPLOYEES_API_URL);

      // Transform the data to the format we need
      const formattedEmployees = response.data.map((emp) => ({
        id: emp.Emp_ID,
        name: `${emp.personalInfo?.firstName || ""} ${
          emp.personalInfo?.lastName || ""
        }`.trim(),
        designation: emp.joiningDetails?.initialDesignation || "No Designation",
        department: emp.joiningDetails?.department || "No Department",
      }));

      setEmployees(formattedEmployees);
      setLoadingEmployees(false);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setLoadingEmployees(false);
    }
  };

  // Update the useEffect to avoid conflicts with tab changes
  useEffect(() => {
    console.log("useEffect triggered with selectedTab:", selectedTab);

    // Only load objectives if:
    // 1. We have a currentUserId
    // 2. We're not in the middle of a tab change
    if (currentUserId && !window.isChangingTab) {
      console.log("Loading objectives from useEffect");
      fetchObjectivesForTab(selectedTab);
    }
  }, [selectedTab, currentUserId]);

  const loadObjectives = async () => {
    if (window.isChangingTab) {
      console.log("Skipping loadObjectives during tab change");
      return;
    }

    console.log("Regular loadObjectives called");
    fetchObjectivesForTab(selectedTab);
  };

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const filteredObjectives = objectives.filter((obj) => {
    // Apply search and other filters
    const matchesSearch =
      searchTerm === "" ||
      obj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obj.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters =
      (filter.managers === "" ||
        (Array.isArray(obj.managers)
          ? obj.managers.length.toString() === filter.managers
          : obj.managers.toString() === filter.managers)) &&
      (filter.assignees === "" ||
        (Array.isArray(obj.assignees)
          ? obj.assignees.length.toString() === filter.assignees
          : obj.assignees.toString() === filter.assignees)) &&
      (filter.keyResults === "" ||
        obj.keyResults.toString() === filter.keyResults) &&
      (filter.duration === "" || obj.duration.includes(filter.duration)) &&
      (filter.archived === "" || obj.archived.toString() === filter.archived);

    return matchesSearch && matchesFilters;
  });

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilter({ ...filter, [field]: value });
  };

  const applyFilter = () => {
    setIsFilterModalOpen(false);
    loadObjectives();
  };

  // Reset filter
  const resetFilter = () => {
    setFilter({
      managers: "",
      assignees: "",
      keyResults: "",
      duration: "",
      archived: "",
    });
    setIsFilterModalOpen(false);
    loadObjectives();
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteClick = (objective) => {
    setItemToDelete(objective);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      // const token = getAuthToken();
      await api.delete(
        `${API_URL}/${itemToDelete._id}`
        //   , {
        //   headers: {
        //     "Authorization": `Bearer ${token}`
        //   }
        // }
      );
      setObjectives(objectives.filter((obj) => obj._id !== itemToDelete._id));
      setNotification({
        open: true,
        message: "Objective deleted successfully",
        severity: "success",
      });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting objective:", error);
      setNotification({
        open: true,
        message: "Failed to delete objective",
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

  const handleArchive = async (id) => {
    try {
      setLoading(true);
      // const token = getAuthToken();
      const response = await api.patch(`${API_URL}/${id}/archive`, {});

      setObjectives((prevObjectives) =>
        prevObjectives.map((obj) => (obj._id === id ? response.data : obj))
      );

      setNotification({
        open: true,
        message: response.data.archived
          ? "Objective archived successfully"
          : "Objective unarchived successfully",
        severity: "success",
      });
      setLoading(false);
    } catch (error) {
      console.error("Error toggling archive status:", error);
      setNotification({
        open: true,
        message: "Failed to update archive status",
        severity: "error",
      });
      setLoading(false);
    }
  };

  // Handle add new objective
  const handleAdd = () => {
    const newObjective = {
      title: "",
      managers: [],
      keyResults: 0,
      keyResultsData: [],
      assignees: [],
      duration: "30 Days",
      description: "",
      archived: false,
      objectiveType: "all",
    };
    setCurrentObjective(newObjective);
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Format the data according to the schema
      const objectiveData = {
        title: currentObjective.title,
        managers: Array.isArray(currentObjective.managers)
          ? currentObjective.managers
          : [],
        keyResults: Number(currentObjective.keyResults) || 0,
        keyResultsData: Array.isArray(currentObjective.keyResultsData)
          ? currentObjective.keyResultsData
          : [],
        assignees: Array.isArray(currentObjective.assignees)
          ? currentObjective.assignees
          : [],
        duration: currentObjective.duration,
        description: currentObjective.description,
        objectiveType: currentObjective.objectiveType || "all",
        archived: false,
        userId: currentUserId, // Add the userId to associate with the creator
      };
      const response = await api.post(
        API_URL,
        objectiveData
      );

      setObjectives([...objectives, response.data]);
      setIsCreateModalOpen(false);
      setCurrentObjective(null);
      setSelectedTab(response.data.objectiveType);
      setNotification({
        open: true,
        message: "Objective created successfully",
        severity: "success",
      });
      setLoading(false);

      // Reload objectives to ensure we have the latest data
      loadObjectives();
    } catch (error) {
      console.error("Error creating objective:", error);
      setNotification({
        open: true,
        message: "Failed to create objective",
        severity: "error",
      });
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (objective) => {
    setCurrentObjective({ ...objective });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.put(
        `${API_URL}/${currentObjective._id}`,
        currentObjective
      );
      setObjectives(
        objectives.map((obj) =>
          obj._id === currentObjective._id ? response.data : obj
        )
      );
      setIsEditModalOpen(false);
      setCurrentObjective(null);
      setNotification({
        open: true,
        message: "Objective updated successfully",
        severity: "success",
      });
      setLoading(false);
    } catch (error) {
      console.error("Error updating objective:", error);
      setNotification({
        open: true,
        message: "Failed to update objective",
        severity: "error",
      });
      setLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentObjective((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Completely revamp the handleTabChange function
  const handleTabChange = (event, newValue) => {
    console.log("Tab changed to:", newValue);

    // Determine the new tab
    const newTab = newValue === 0 ? "all" : newValue === 1 ? "self" : "all";
    console.log("Setting selectedTab to:", newTab);

    // Update state
    setTabValue(newValue);
    setSelectedTab(newTab);

    // Clear any existing timeouts
    if (window.tabChangeTimeout) {
      clearTimeout(window.tabChangeTimeout);
    }

    // Set a flag to indicate we're in the middle of a tab change
    window.isChangingTab = true;

    // Use a direct approach instead of setTimeout
    fetchObjectivesForTab(newTab);
  };

  // Create a new function specifically for fetching objectives for a tab
  const fetchObjectivesForTab = async (tabName) => {
    console.log("Fetching objectives specifically for tab:", tabName);

    setLoading(true);
    setError(null);

    try {
      let url = API_URL;
      const params = {
        searchTerm,
        archived: filter.archived || undefined,
      };

      // For self tab, only fetch the current user's objectives
      if (tabName === "self" && currentUserId) {
        params.userId = currentUserId;
        params.objectiveType = "self"; // Only get self objectives
      }
      const response = await api.get(url, {
        params,
      });
      console.log(
        `Received ${response.data.length} objectives for tab:`,
        tabName
      );

      // Process based on tab
      if (tabName === "all" && currentUserId) {
        // For "all" tab: show team objectives and current user's self objectives
        const filteredData = response.data.filter(
          (obj) =>
            obj.objectiveType === "all" ||
            (obj.objectiveType === "self" && obj.userId === currentUserId)
        );
        console.log(
          `Filtered to ${filteredData.length} objectives for 'all' tab`
        );
        setObjectives(filteredData);
        setTotalObjectives(filteredData.length);
      } else if (tabName === "self") {
        // For "self" tab: only show current user's self objectives
        setObjectives(response.data);
        setTotalObjectives(response.data.length);
      } else {
        // For other tabs
        setObjectives(response.data);
        setTotalObjectives(response.data.length);
      }

      setLoading(false);

      // Clear the tab change flag
      window.isChangingTab = false;
    } catch (error) {
      console.error("Error fetching objectives for tab:", error);
      setError("Failed to load objectives. Please try again.");
      setLoading(false);
      window.isChangingTab = false;
    }
  };

  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  // Handle view objective details
  const handleViewDetails = (objective) => {
    setSelectedObjective(objective);
    setIsDetailModalOpen(true);
  };

  // Handle refresh data
  const handleRefresh = () => {
    loadObjectives();
  };

  // Replace the mock calculateProgress function with this real implementation
  const calculateProgress = (objective) => {
    // If the objective has a progress field, use it
    if (objective.progress !== undefined) {
      return objective.progress;
    }

    // Otherwise, calculate based on completed key results
    if (objective.keyResultsData && objective.keyResultsData.length > 0) {
      const completedKeyResults = objective.keyResultsData.filter(
        (kr) => kr.completed
      ).length;
      return Math.round(
        (completedKeyResults / objective.keyResultsData.length) * 100
      );
    }

    // Default to 0 if no key results
    return 0;
  };

  // Add a function to update key result status
  const updateKeyResultStatus = async (
    objectiveId,
    keyResultIndex,
    completed
  ) => {
    try {
      setLoading(true);
      const response = await api.patch(
        `${API_URL}/${objectiveId}/keyresults/${keyResultIndex}`,
        { completed }
      );

      // Update the objectives state with the updated objective
      setObjectives(
        objectives.map((obj) => (obj._id === objectiveId ? response.data : obj))
      );

      setNotification({
        open: true,
        message: "Key result status updated successfully",
        severity: "success",
      });

      setLoading(false);
    } catch (error) {
      console.error("Error updating key result status:", error);
      setNotification({
        open: true,
        message: "Failed to update key result status",
        severity: "error",
      });
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return moment(dateString).format("MMM DD, YYYY");
  };

  const handleAddManager = () => {
    if (managerInput.trim() !== "") {
      setCurrentObjective((prev) => ({
        ...prev,
        managers: Array.isArray(prev.managers)
          ? [...prev.managers, managerInput.trim()]
          : [managerInput.trim()],
      }));
      setManagerInput("");
    }
  };

  const handleAddAssignee = () => {
    if (assigneeInput.trim() !== "") {
      setCurrentObjective((prev) => ({
        ...prev,
        assignees: Array.isArray(prev.assignees)
          ? [...prev.assignees, assigneeInput.trim()]
          : [assigneeInput.trim()],
      }));
      setAssigneeInput("");
    }
  };

  const handleRemoveManager = (index) => {
    setCurrentObjective((prev) => ({
      ...prev,
      managers: prev.managers.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveAssignee = (index) => {
    setCurrentObjective((prev) => ({
      ...prev,
      assignees: prev.assignees.filter((_, i) => i !== index),
    }));
  };

  // Key Results handlers
  const handleKeyResultInputChange = (e) => {
    const { name, value } = e.target;
    setKeyResultInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleKeyResultDateChange = (newDate) => {
    // Check if the date is valid
    if (newDate && isNaN(new Date(newDate).getTime())) {
      setKeyResultDateError("Please enter a valid date");
    } else if (newDate && new Date(newDate) < new Date()) {
      setKeyResultDateError("Due date cannot be in the past");
    } else {
      setKeyResultDateError(null);
    }

    setKeyResultInput((prev) => ({
      ...prev,
      dueDate: newDate,
    }));
  };

  const handleAddKeyResult = () => {
    if (keyResultInput.title.trim() === "") {
      setNotification({
        open: true,
        message: "Key result title is required",
        severity: "error",
      });
      return;
    }

    if (keyResultDateError) {
      setNotification({
        open: true,
        message: keyResultDateError,
        severity: "error",
      });
      return;
    }

    setCurrentObjective((prev) => ({
      ...prev,
      keyResultsData: Array.isArray(prev.keyResultsData)
        ? [...prev.keyResultsData, keyResultInput]
        : [keyResultInput],
      keyResults: Array.isArray(prev.keyResultsData)
        ? prev.keyResultsData.length + 1
        : 1,
    }));

    // Reset the input and error
    setKeyResultInput({
      title: "",
      description: "",
      targetValue: "",
      unit: "",
      dueDate: null,
    });
    setKeyResultDateError(null);
  };

  const handleRemoveKeyResult = (index) => {
    setCurrentObjective((prev) => {
      const updatedKeyResults = prev.keyResultsData.filter(
        (_, i) => i !== index
      );
      return {
        ...prev,
        keyResultsData: updatedKeyResults,
        keyResults: updatedKeyResults.length,
      };
    });
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };


  const handleNumericInputChange = (e) => {
  const { name, value } = e.target;
  // Only allow digits
  if (/^\d*$/.test(value)) {
    setKeyResultInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};

  return (
    <div className="objectives">
      {/* Breadcrumbs */}
      {/* Mobile Header */}
      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          backgroundColor: "white",
          p: 2,
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#1976d2" }}>
          OKRs
        </Typography>
        <IconButton onClick={toggleMobileMenu}>
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <Box
          sx={{
            display: { xs: "flex", sm: "none" },
            flexDirection: "column",
            gap: 1,
            mb: 2,
            backgroundColor: "white",
            p: 2,
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
          className="mobile-menu"
        >
          <TextField
            placeholder="Search objectives..."
            value={searchTerm}
            onChange={handleSearch}
            size="small"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#f8fafc",
                borderRadius: "8px",
              },
            }}
            InputProps={{
              startAdornment: <Search sx={{ color: "action.active", mr: 1 }} />,
            }}
          />
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              onClick={handleFilterClick}
              startIcon={<FilterList />}
              fullWidth
              sx={{
                borderColor: "#1976d2",
                color: "#1976d2",
                textTransform: "none",
                borderRadius: "8px",
              }}
            >
              Filter
            </Button>
            <Button
              variant="outlined"
              onClick={handleRefresh}
              startIcon={<Refresh />}
              fullWidth
              sx={{
                borderColor: "#4caf50",
                color: "#4caf50",
                textTransform: "none",
                borderRadius: "8px",
              }}
            >
              Refresh
            </Button>
          </Box>
          <Button
            variant="contained"
            onClick={handleAdd}
            startIcon={<Add />}
            fullWidth
            sx={{
              background: "linear-gradient(45deg, #1976d2, #64b5f6)",
              color: "white",
              textTransform: "none",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(25, 118, 210, 0.25)",
            }}
          >
            Create Objective
          </Button>
        </Box>
      )}

      {/* Header and Stats */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          padding: { xs: "16px", sm: "24px 32px" },
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          marginBottom: "24px",
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{
            fontWeight: 600,
            color: "#1976d2",
            display: { xs: "none", sm: "block" },
          }}
        >
          Objectives & Key Results (OKRs)
        </Typography>

        {/* Stats Cards */}
        <Grid
          container
          spacing={isMobile ? 1 : 3}
          sx={{ mt: isMobile ? 0 : 1 }}
        >
          <Grid item xs={6} sm={6} md={2.4}>
            <Paper
              elevation={0}
              sx={{
                p: isMobile ? 1 : 2,
                textAlign: "center",
                borderRadius: 2,
                bgcolor: "#e3f2fd",
                border: "1px solid #bbdefb",
              }}
            >
              <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                sx={{ fontWeight: 600 }}
              >
                {objectiveStats.total}
              </Typography>
              <Typography
                variant={isMobile ? "caption" : "body2"}
                color="text.secondary"
              >
                Total Objectives
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={6} md={2.4}>
            <Paper
              elevation={0}
              sx={{
                p: isMobile ? 1 : 2,
                textAlign: "center",
                borderRadius: 2,
                bgcolor: "#e8f5e9",
                border: "1px solid #c8e6c9",
              }}
            >
              <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                sx={{ fontWeight: 600 }}
              >
                {objectiveStats.active}
              </Typography>
              <Typography
                variant={isMobile ? "caption" : "body2"}
                color="text.secondary"
              >
                Active Objectives
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={6} md={2.4}>
            <Paper
              elevation={0}
              sx={{
                p: isMobile ? 1 : 2,
                textAlign: "center",
                borderRadius: 2,
                bgcolor: "#fff8e1",
                border: "1px solid #ffecb3",
              }}
            >
              <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                sx={{ fontWeight: 600 }}
              >
                {objectiveStats.archived}
              </Typography>
              <Typography
                variant={isMobile ? "caption" : "body2"}
                color="text.secondary"
              >
                Archived Objectives
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={6} md={2.4}>
            <Paper
              elevation={0}
              sx={{
                p: isMobile ? 1 : 2,
                textAlign: "center",
                borderRadius: 2,
                bgcolor: "#f3e5f5",
                border: "1px solid #e1bee7",
              }}
            >
              <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                sx={{ fontWeight: 600 }}
              >
                {objectiveStats.selfObjectives}
              </Typography>
              <Typography
                variant={isMobile ? "caption" : "body2"}
                color="text.secondary"
              >
                Self Objectives
              </Typography>
            </Paper>


            
          </Grid>
          <Grid item xs={6} sm={6} md={2.4}>
            <Paper
              elevation={0}
              sx={{
                p: isMobile ? 1 : 2,
                textAlign: "center",
                borderRadius: 2,
                bgcolor: "#e0f7fa",
                border: "1px solid #b2ebf2",
              }}
            >
              <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                sx={{ fontWeight: 600 }}
              >
                {objectiveStats.allObjectives}
              </Typography>
              <Typography
                variant={isMobile ? "caption" : "body2"}
                color="text.secondary"
              >
                Team Objectives
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Search and Actions - Desktop/Tablet */}
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            gap: "16px",
            width: "100%",
            justifyContent: "space-between",
            position: "relative",
            flexWrap: isTablet ? "wrap" : "nowrap",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: isTablet ? "wrap" : "nowrap",
            }}
          >
            <TextField
              placeholder="Search objectives..."
              value={searchTerm}
              onChange={handleSearch}
              size="small"
              sx={{
                width: { sm: "200px", md: "300px" },
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
                  <Search sx={{ color: "action.active", mr: 1 }} />
                ),
              }}
            />
            <Button
              variant="outlined"
              onClick={handleFilterClick}
              startIcon={<FilterList />}
              sx={{
                borderColor: "#1976d2",
                color: "#1976d2",
                "&:hover": {
                  borderColor: "#1565c0",
                  backgroundColor: "#e3f2fd",
                },
                textTransform: "none",
                borderRadius: "8px",
                height: "40px",
              }}
            >
              Filter
            </Button>
            <Button
              variant="outlined"
              onClick={handleRefresh}
              startIcon={<Refresh />}
              sx={{
                borderColor: "#4caf50",
                color: "#4caf50",
                "&:hover": {
                  borderColor: "#388e3c",
                  backgroundColor: "#e8f5e9",
                },
                textTransform: "none",
                borderRadius: "8px",
                height: "40px",
              }}
            >
              Refresh
            </Button>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleAdd}
              startIcon={<Add />}
              sx={{
                background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(45deg, #1565c0, #42a5f5)",
                },
                textTransform: "none",
                borderRadius: "8px",
                height: "40px",
                boxShadow: "0 2px 8px rgba(25, 118, 210, 0.25)",
              }}
            >
              Create Objective
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Tabs */}
      <Box
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          mb: 3,
          overflowX: "auto",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered={!isMobile}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : false}
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "#1976d2",
              height: 3,
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: isMobile ? "0.875rem" : "1rem",
              minWidth: isMobile ? 100 : 120,
              "&.Mui-selected": {
                color: "#1976d2",
              },
            },
          }}
        >
          <Tab
            label="All Objectives"
            icon={<Group fontSize={isMobile ? "small" : "medium"} />}
            iconPosition="start"
          />
          <Tab
            label="Self Objectives"
            icon={<Person fontSize={isMobile ? "small" : "medium"} />}
            iconPosition="start"
          />
          <Tab
            label={
              <Badge
                badgeContent={objectiveStats.archived}
                color="error"
                max={99}
                sx={{ "& .MuiBadge-badge": { fontSize: "0.6rem" } }}
              >
                Archived
              </Badge>
            }
            icon={<Archive fontSize={isMobile ? "small" : "medium"} />}
            iconPosition="start"
            onClick={() => setShowArchivedTable(!showArchivedTable)}
          />
        </Tabs>
      </Box>

      {/* Loading and Error States */}
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
          <Button size="small" onClick={handleRefresh} sx={{ ml: 2 }}>
            Retry
          </Button>
        </Alert>
      )}

      {/* Main Content */}
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          overflow: "hidden",
          margin: "24px 0",
        }}
        className="responsive-table-container"
      >
        <Box
          sx={{
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            "&::-webkit-scrollbar": {
              height: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#e0e0e0",
              borderRadius: "4px",
            },
          }}
        >
          <div className="table-responsive" style={{ minWidth: "1000px" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "14px",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      padding: "16px",
                      textAlign: "left",
                      color: "white",
                      fontWeight: 600,
                      cursor: "pointer",
                      backgroundColor: "#1976d2",
                    }}
                    onClick={() => handleSort("title")}
                  >
                    Title{" "}
                    {sortConfig.key === "title" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    style={{
                      padding: "16px",
                      textAlign: "left",
                      color: "white",
                      fontWeight: 600,
                      backgroundColor: "#1976d2",
                    }}
                  >
                    Managers
                  </th>
                  <th
                    style={{
                      padding: "16px",
                      textAlign: "left",
                      color: "white",
                      fontWeight: 600,
                      backgroundColor: "#1976d2",
                    }}
                  >
                    Key Results
                  </th>
                  <th
                    style={{
                      padding: "16px",
                      textAlign: "left",
                      color: "white",
                      fontWeight: 600,
                      backgroundColor: "#1976d2",
                    }}
                  >
                    Assignees
                  </th>
                  <th
                    style={{
                      padding: "16px",
                      textAlign: "left",
                      color: "white",
                      fontWeight: 600,
                      cursor: "pointer",
                      backgroundColor: "#1976d2",
                    }}
                    onClick={() => handleSort("duration")}
                  >
                    Duration{" "}
                    {sortConfig.key === "duration" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    style={{
                      padding: "16px",
                      textAlign: "left",
                      color: "white",
                      fontWeight: 600,
                      width: "150px",
                      backgroundColor: "#1976d2",
                    }}
                  >
                    Progress
                  </th>
                  <th
                    style={{
                      padding: "16px",
                      textAlign: "left",
                      color: "white",
                      fontWeight: 600,
                      backgroundColor: "#1976d2",
                    }}
                  >
                    Type
                  </th>
                  <th
                    style={{
                      padding: "16px",
                      textAlign: "left",
                      color: "white",
                      fontWeight: 600,
                      cursor: "pointer",
                      backgroundColor: "#1976d2",
                    }}
                    onClick={() => handleSort("createdAt")}
                  >
                    Created{" "}
                    {sortConfig.key === "createdAt" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    style={{
                      padding: "16px",
                      textAlign: "left",
                      color: "white",
                      fontWeight: 600,
                      backgroundColor: "#1976d2",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredObjectives
                  .filter((obj) =>
                    tabValue !== 2 ? !obj.archived : obj.archived
                  )
                  .map((obj) => {
                    const progress = calculateProgress(obj);
                    return (
                      <tr
                        key={obj._id}
                        style={{
                          borderBottom: "1px solid #e2e8f0",
                          "&:hover": {
                            backgroundColor: "#f8fafc",
                          },
                        }}
                      >
                        <td
                          style={{
                            padding: "16px",
                            cursor: "pointer",
                            color: "#1976d2",
                            fontWeight: 500,
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          onClick={() => handleViewDetails(obj)}
                        >
                          {obj.title}
                        </td>
                        <td style={{ padding: "16px" }}>
                          {Array.isArray(obj.managers) ? (
                            <Box>
                              <Chip
                                label={`${obj.managers.length} Managers`}
                                size="small"
                                sx={{
                                  bgcolor: "#e3f2fd",
                                  color: "#0d47a1",
                                  fontWeight: 500,
                                }}
                              />
                              <Box sx={{ mt: 1 }}>
                                {obj.managers
                                  .slice(0, 2)
                                  .map((manager, index) => (
                                    <Typography
                                      key={index}
                                      variant="caption"
                                      display="block"
                                      color="text.secondary"
                                    >
                                      • {manager}
                                    </Typography>
                                  ))}
                                {obj.managers.length > 2 && (
                                  <Typography variant="caption" color="primary">
                                    +{obj.managers.length - 2} more
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          ) : (
                            <Chip
                              label={`${obj.managers} Managers`}
                              size="small"
                              sx={{
                                bgcolor: "#e3f2fd",
                                color: "#0d47a1",
                                fontWeight: 500,
                              }}
                            />
                          )}
                        </td>
                        <td style={{ padding: "16px" }}>
                          <Chip
                            label={`${obj.keyResults} Key Results`}
                            size="small"
                            sx={{
                              bgcolor: "#e8f5e9",
                              color: "#1b5e20",
                              fontWeight: 500,
                            }}
                          />
                          {obj.keyResultsData &&
                            obj.keyResultsData.length > 0 && (
                              <Box sx={{ mt: 1 }}>
                                {obj.keyResultsData
                                  .slice(0, 2)
                                  .map((kr, index) => (
                                    <Typography
                                      key={index}
                                      variant="caption"
                                      display="block"
                                      color="text.secondary"
                                    >
                                      • {kr.title}
                                    </Typography>
                                  ))}
                                {obj.keyResultsData.length > 2 && (
                                  <Typography variant="caption" color="primary">
                                    +{obj.keyResultsData.length - 2} more
                                  </Typography>
                                )}
                              </Box>
                            )}
                        </td>
                        <td style={{ padding: "16px" }}>
                          {Array.isArray(obj.assignees) ? (
                            <Box>
                              <Chip
                                label={`${obj.assignees.length} Assignees`}
                                size="small"
                                sx={{
                                  bgcolor: "#fff8e1",
                                  color: "#ff6f00",
                                  fontWeight: 500,
                                }}
                              />
                              <Box sx={{ mt: 1 }}>
                                {obj.assignees
                                  .slice(0, 2)
                                  .map((assignee, index) => (
                                    <Typography
                                      key={index}
                                      variant="caption"
                                      display="block"
                                      color="text.secondary"
                                    >
                                      • {assignee}
                                    </Typography>
                                  ))}
                                {obj.assignees.length > 2 && (
                                  <Typography variant="caption" color="primary">
                                    +{obj.assignees.length - 2} more
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          ) : (
                            <Chip
                              label={`${obj.assignees} Assignees`}
                              size="small"
                              sx={{
                                bgcolor: "#fff8e1",
                                color: "#ff6f00",
                                fontWeight: 500,
                              }}
                            />
                          )}
                        </td>
                        <td style={{ padding: "16px" }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <AccessTime fontSize="small" color="action" />
                            <Typography variant="body2">
                              {obj.duration}
                            </Typography>
                          </Box>
                        </td>
                        <td style={{ padding: "16px", width: "150px" }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <LinearProgress
                              variant="determinate"
                              value={progress}
                              sx={{
                                width: "100%",
                                height: 8,
                                borderRadius: 5,
                                bgcolor: "#f5f5f5",
                                "& .MuiLinearProgress-bar": {
                                  bgcolor:
                                    progress < 30
                                      ? "#f44336"
                                      : progress < 70
                                      ? "#ff9800"
                                      : "#4caf50",
                                  borderRadius: 5,
                                },
                              }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {progress}%
                            </Typography>
                          </Box>
                        </td>
                        <td style={{ padding: "16px" }}>
                          <Chip
                            label={
                              obj.objectiveType === "self" ? "Self" : "Team"
                            }
                            size="small"
                            color={
                              obj.objectiveType === "self"
                                ? "primary"
                                : "secondary"
                            }
                            sx={{ fontWeight: 500 }}
                          />
                        </td>
                        <td style={{ padding: "16px" }}>
                          {obj.createdAt ? formatDate(obj.createdAt) : "N/A"}
                        </td>
                        <td style={{ padding: "16px" }}>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <Tooltip title="View Details">
                              <IconButton
                                color="info"
                                onClick={() => handleViewDetails(obj)}
                                size="small"
                                sx={{
                                  backgroundColor: "info.lighter",
                                  "&:hover": { backgroundColor: "info.light" },
                                }}
                              >
                                <Search fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton
                                color="primary"
                                onClick={() => handleEdit(obj)}
                                size="small"
                                sx={{
                                  backgroundColor: "primary.lighter",
                                  "&:hover": {
                                    backgroundColor: "primary.light",
                                  },
                                }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip
                              title={obj.archived ? "Unarchive" : "Archive"}
                            >
                              <IconButton
                                color="warning"
                                onClick={() => handleArchive(obj._id)}
                                size="small"
                                sx={{
                                  backgroundColor: "warning.lighter",
                                  "&:hover": {
                                    backgroundColor: "warning.light",
                                  },
                                }}
                              >
                                {obj.archived ? (
                                  <Unarchive fontSize="small" />
                                ) : (
                                  <Archive fontSize="small" />
                                )}
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete">
                              <IconButton
                                color="error"
                                onClick={() => handleDeleteClick(obj)}
                                size="small"
                                sx={{
                                  backgroundColor: "error.lighter",
                                  "&:hover": { backgroundColor: "error.light" },
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </Box>

        {/* Empty state */}
        {filteredObjectives.filter((obj) =>
          tabValue !== 2 ? !obj.archived : obj.archived
        ).length === 0 &&
          !loading && (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No objectives found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {tabValue === 2
                  ? "There are no archived objectives matching your criteria."
                  : "There are no active objectives matching your criteria."}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={handleAdd}
              >
                Create New Objective
              </Button>
            </Box>
          )}

        {/* Pagination */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: isMobile ? 1 : 2,
            borderTop: "1px solid #e2e8f0",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 1 : 0,
          }}
        >
          <Typography
            variant={isMobile ? "caption" : "body2"}
            color="text.secondary"
            sx={{ alignSelf: isMobile ? "flex-start" : "center" }}
          >
            Showing {Math.min(rowsPerPage, filteredObjectives.length)} of{" "}
            {totalObjectives} objectives
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              size="small"
            >
              Previous
            </Button>
            <Typography variant="body2" sx={{ mx: 2, alignSelf: "center" }}>
              Page {page}
            </Typography>
            <Button
              disabled={rowsPerPage * page >= totalObjectives}
              onClick={() => setPage(page + 1)}
              size="small"
            >
              Next
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <Dialog
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              width: { xs: "100%", sm: "600px" },
              maxWidth: "100%",
              borderRadius: { xs: 0, sm: "20px" },
              margin: { xs: 0, sm: 2 },
              overflow: "hidden",
            },
          }}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(45deg, #1976d2, #64b5f6)",
              color: "white",
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
              fontWeight: 600,
              padding: { xs: "16px", sm: "24px 32px" },
              zIndex: 1,
              position: "relative",
              marginBottom: "0",
              marginTop: "0",
            }}
          >
            Create New Objective
          </DialogTitle>

          <DialogContent
            sx={{
              padding: { xs: "16px", sm: "32px" },
              backgroundColor: "f8fafc",
              marginTop: "20px",
              overflowY: "auto",
            }}
          >
            <form onSubmit={handleCreateSubmit}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2.5,
                  mt: 2,
                }}
              >
                <TextField
                  name="title"
                  label="Title"
                  value={currentObjective.title}
                  onChange={handleInputChange}
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
                  name="duration"
                  label="Duration"
                  value={currentObjective.duration}
                  onChange={handleInputChange}
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

                {/* Managers Input */}
                <Box sx={{ mb: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Managers (
                    {Array.isArray(currentObjective.managers)
                      ? currentObjective.managers.length
                      : 0}
                    )
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      mb: 1,
                      flexDirection: isMobile ? "column" : "row",
                    }}
                  >
                    <Autocomplete
                      options={employees}
                      getOptionLabel={(option) => option.name || ""}
                      renderOption={(props, option) => (
                        <Box
                          component="li"
                          {...props}
                          className="employee-option"
                        >
                          <Avatar className="employee-option-avatar">
                            {option.name.charAt(0)}
                          </Avatar>
                          <Box className="employee-option-info">
                            <Typography className="employee-option-name">
                              {option.name}
                            </Typography>
                            <Box className="employee-option-details">
                              <Typography className="employee-option-id">
                                {option.id}
                              </Typography>
                              <Typography className="employee-option-designation">
                                {option.designation}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select manager"
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "white",
                              borderRadius: "8px",
                              "&:hover fieldset": {
                                borderColor: "#1976d2",
                              },
                            },
                          }}
                        />
                      )}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          const employeeInfo = `${newValue.name} (${newValue.id}, ${newValue.designation})`;
                          setCurrentObjective((prev) => ({
                            ...prev,
                            managers: Array.isArray(prev.managers)
                              ? [...prev.managers, employeeInfo]
                              : [employeeInfo],
                          }));
                        }
                      }}
                      sx={{ flex: 1 }}
                    />
                    <Button
                      variant="contained"
                      onClick={() => {
                        if (managerInput.trim() !== "") {
                          handleAddManager();
                        }
                      }}
                      sx={{
                        minWidth: isMobile ? "100%" : "80px",
                        height: isMobile ? "auto" : "56px",
                        background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                        borderRadius: "8px",
                      }}
                    >
                      Add
                    </Button>
                  </Box>

                  {/* Display added managers */}
                  {Array.isArray(currentObjective.managers) &&
                    currentObjective.managers.length > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          p: 2,
                          bgcolor: "#f0f7ff",
                          borderRadius: 2,
                          maxHeight: "150px",
                          overflowY: "auto",
                        }}
                      >
                        {currentObjective.managers.map((manager, index) => (
                          <Chip
                            key={index}
                            label={manager}
                            onDelete={() => handleRemoveManager(index)}
                            sx={{
                              bgcolor: "#e3f2fd",
                              "&:hover": { bgcolor: "#bbdefb" },
                              maxWidth: isMobile ? "100%" : "auto",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          />
                        ))}
                      </Box>
                    )}
                </Box>

                {/* Key Results Section */}
                <Box sx={{ mb: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Key Results ({currentObjective.keyResults || 0})
                  </Typography>

                  <Box
                    sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 2, mb: 2 }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          name="title"
                          label="Key Result Title"
                          value={keyResultInput.title}
                          onChange={handleKeyResultInputChange}
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "white",
                              borderRadius: "8px",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name="description"
                          label="Description"
                          value={keyResultInput.description}
                          onChange={handleKeyResultInputChange}
                          multiline
                          rows={2}
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "white",
                              borderRadius: "8px",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
  <TextField
    name="targetValue"
    label="Target Value"
    value={keyResultInput.targetValue}
    onChange={handleNumericInputChange} // Use the numeric handler here
    fullWidth
    type="text"
    inputProps={{ 
      inputMode: 'numeric', 
      pattern: '[0-9]*' 
    }}
    sx={{
      "& .MuiOutlinedInput-root": {
        backgroundColor: "white",
        borderRadius: "8px",
      },
    }}
  />
</Grid>
<Grid item xs={12} sm={4}>
  <TextField
    name="unit"
    label="Unit"
    value={keyResultInput.unit}
    onChange={handleNumericInputChange} // Change to numeric handler
    fullWidth
    type="text"
    inputProps={{ 
      inputMode: 'numeric', 
      pattern: '[0-9]*' 
    }}
    sx={{
      "& .MuiOutlinedInput-root": {
        backgroundColor: "white",
        borderRadius: "8px",
      },
    }}
  />
</Grid>


                      <Grid item xs={12} sm={4}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label="Due Date"
                            value={keyResultInput.dueDate}
                            onChange={handleKeyResultDateChange}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                error={!!keyResultDateError}
                                helperText={keyResultDateError}
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    backgroundColor: "white",
                                    borderRadius: "8px",
                                  },
                                }}
                              />
                            )}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          onClick={handleAddKeyResult}
                          startIcon={<Add />}
                          sx={{
                            background:
                              "linear-gradient(45deg, #2e7d32, #66bb6a)",
                            color: "white",
                            borderRadius: "8px",
                            textTransform: "none",
                          }}
                        >
                          Add Key Result
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Display added key results */}
                  {Array.isArray(currentObjective.keyResultsData) &&
                    currentObjective.keyResultsData.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Added Key Results:
                        </Typography>

                        {currentObjective.keyResultsData.map((kr, index) => (
                          <Box
                            key={index}
                            sx={{
                              p: 2,
                              mb: 2,
                              bgcolor: "#e8f5e9",
                              borderRadius: 2,
                              border: "1px solid #c8e6c9",
                              position: "relative",
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveKeyResult(index)}
                              sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                bgcolor: "#ffebee",
                                "&:hover": { bgcolor: "#ffcdd2" },
                              }}
                            >
                              <Close fontSize="small" />
                            </IconButton>

                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 600, mb: 1, pr: 4 }}
                            >
                              {kr.title}
                            </Typography>

                            {kr.description && (
                              <Typography
                                variant="body2"
                                sx={{ mb: 2, color: "#546e7a" }}
                              >
                                {kr.description}
                              </Typography>
                            )}

                            <Box
                              sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
                            >
                              {kr.targetValue && kr.unit && (
                                <Chip
                                  size="small"
                                  label={`Target: ${kr.targetValue} ${kr.unit}`}
                                  sx={{ bgcolor: "#c8e6c9", color: "#2e7d32" }}
                                />
                              )}

                              {kr.dueDate && (
                                <Chip
                                  size="small"
                                  label={`Due: ${format(
                                    new Date(kr.dueDate),
                                    "MMM dd, yyyy"
                                  )}`}
                                  sx={{ bgcolor: "#bbdefb", color: "#1565c0" }}
                                />
                              )}
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}
                </Box>

                {/* Assignees Input */}
                <Box sx={{ mb: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Assignees (
                    {Array.isArray(currentObjective.assignees)
                      ? currentObjective.assignees.length
                      : 0}
                    )
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      mb: 1,
                      flexDirection: isMobile ? "column" : "row",
                    }}
                  >
                    <Autocomplete
                      options={employees}
                      getOptionLabel={(option) => option.name || ""}
                      renderOption={(props, option) => (
                        <Box
                          component="li"
                          {...props}
                          className="employee-option"
                        >
                          <Avatar className="employee-option-avatar">
                            {option.name.charAt(0)}
                          </Avatar>
                          <Box className="employee-option-info">
                            <Typography className="employee-option-name">
                              {option.name}
                            </Typography>
                            <Box className="employee-option-details">
                              <Typography className="employee-option-id">
                                {option.id}
                              </Typography>
                              <Typography className="employee-option-designation">
                                {option.designation}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select assignee"
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "white",
                              borderRadius: "8px",
                              "&:hover fieldset": {
                                borderColor: "#1976d2",
                              },
                            },
                          }}
                        />
                      )}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          const employeeInfo = `${newValue.name} (${newValue.id}, ${newValue.designation})`;
                          setCurrentObjective((prev) => ({
                            ...prev,
                            assignees: Array.isArray(prev.assignees)
                              ? [...prev.assignees, employeeInfo]
                              : [employeeInfo],
                          }));
                        }
                      }}
                      sx={{ flex: 1 }}
                    />
                    <Button
                      variant="contained"
                      onClick={() => {
                        if (assigneeInput.trim() !== "") {
                          handleAddAssignee();
                        }
                      }}
                      sx={{
                        minWidth: isMobile ? "100%" : "80px",
                        height: isMobile ? "auto" : "56px",
                        background: "linear-gradient(45deg, #ff9800, #ffb74d)",
                        borderRadius: "8px",
                      }}
                    >
                      Add
                    </Button>
                  </Box>

                  {/* Display added assignees */}
                  {Array.isArray(currentObjective.assignees) &&
                    currentObjective.assignees.length > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          p: 2,
                          bgcolor: "#fff8e1",
                          borderRadius: 2,
                          maxHeight: "150px",
                          overflowY: "auto",
                        }}
                      >
                        {currentObjective.assignees.map((assignee, index) => (
                          <Chip
                            key={index}
                            label={assignee}
                            onDelete={() => handleRemoveAssignee(index)}
                            sx={{
                              bgcolor: "#ffecb3",
                              "&:hover": { bgcolor: "#ffe082" },
                              maxWidth: isMobile ? "100%" : "auto",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          />
                        ))}
                      </Box>
                    )}
                </Box>

                <FormControl fullWidth>
                  <InputLabel>Objective Type</InputLabel>
                  <Select
                    name="objectiveType"
                    value={currentObjective.objectiveType}
                    onChange={handleInputChange}
                    required
                    sx={{
                      backgroundColor: "white",
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                    }}
                  >
                    <MenuItem value="">Select Type</MenuItem>
                    <MenuItem value="self">Self Objective</MenuItem>
                    <MenuItem value="all">Team Objective</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  name="description"
                  label="Description"
                  value={currentObjective.description}
                  onChange={handleInputChange}
                  required
                  multiline
                  rows={4}
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
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: "10px",
                  mt: 4,
                  justifyContent: "flex-end",
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <Button
                  onClick={() => setIsCreateModalOpen(false)}
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
                  type="submit"
                  disabled={loading}
                  sx={{
                    background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                    color: "white",
                    "&:hover": {
                      background: "linear-gradient(45deg, #1565c0, #42a5f5)",
                    },
                    textTransform: "none",
                    borderRadius: "8px",
                    px: 4,
                    py: 1,
                    fontWeight: 600,
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Create"
                  )}
                </Button>
              </Box>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <Dialog
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              width: { xs: "100%", sm: "600px" },
              maxWidth: "100%",
              borderRadius: { xs: 0, sm: "20px" },
              margin: { xs: 0, sm: 2 },
              overflow: "hidden",
            },
          }}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(45deg, #1976d2, #64b5f6)",
              color: "white",
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
              fontWeight: 600,
              padding: { xs: "16px", sm: "24px 32px" },
              zIndex: 1,
              position: "relative",
              marginBottom: "0",
              marginTop: "0",
            }}
          >
            Edit Objective
          </DialogTitle>

          <DialogContent
            sx={{
              padding: { xs: "16px", sm: "32px" },
              backgroundColor: "#f8fafc",
              marginTop: "20px",
              overflowY: "auto",
            }}
          >
            <form onSubmit={handleEditSubmit}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2.5,
                  mt: 2,
                }}
              >
                <TextField
                  name="title"
                  label="Title"
                  value={currentObjective.title}
                  onChange={handleInputChange}
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
                  name="duration"
                  label="Duration"
                  value={currentObjective.duration}
                  onChange={handleInputChange}
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

                {/* Managers Input */}
                <Box sx={{ mb: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Managers (
                    {Array.isArray(currentObjective.managers)
                      ? currentObjective.managers.length
                      : 0}
                    )
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      mb: 1,
                      flexDirection: isMobile ? "column" : "row",
                    }}
                  >
                    <Autocomplete
                      options={employees}
                      getOptionLabel={(option) => option.name || ""}
                      renderOption={(props, option) => (
                        <Box
                          component="li"
                          {...props}
                          className="employee-option"
                        >
                          <Avatar className="employee-option-avatar">
                            {option.name.charAt(0)}
                          </Avatar>
                          <Box className="employee-option-info">
                            <Typography className="employee-option-name">
                              {option.name}
                            </Typography>
                            <Box className="employee-option-details">
                              <Typography className="employee-option-id">
                                {option.id}
                              </Typography>
                              <Typography className="employee-option-designation">
                                {option.designation}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select manager"
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "white",
                              borderRadius: "8px",
                              "&:hover fieldset": {
                                borderColor: "#1976d2",
                              },
                            },
                          }}
                        />
                      )}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          const employeeInfo = `${newValue.name} (${newValue.id}, ${newValue.designation})`;
                          setCurrentObjective((prev) => ({
                            ...prev,
                            managers: Array.isArray(prev.managers)
                              ? [...prev.managers, employeeInfo]
                              : [employeeInfo],
                          }));
                        }
                      }}
                      sx={{ flex: 1 }}
                    />
                    <Button
                      variant="contained"
                      onClick={() => {
                        if (managerInput.trim() !== "") {
                          handleAddManager();
                        }
                      }}
                      sx={{
                        minWidth: isMobile ? "100%" : "80px",
                        height: isMobile ? "auto" : "56px",
                        background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                        borderRadius: "8px",
                      }}
                    >
                      Add
                    </Button>
                  </Box>

                  {/* Display added managers */}
                  {Array.isArray(currentObjective.managers) &&
                    currentObjective.managers.length > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          p: 2,
                          bgcolor: "#f0f7ff",
                          borderRadius: 2,
                          maxHeight: "150px",
                          overflowY: "auto",
                        }}
                      >
                        {currentObjective.managers.map((manager, index) => (
                          <Chip
                            key={index}
                            label={manager}
                            onDelete={() => handleRemoveManager(index)}
                            sx={{
                              bgcolor: "#e3f2fd",
                              "&:hover": { bgcolor: "#bbdefb" },
                              maxWidth: isMobile ? "100%" : "auto",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          />
                        ))}
                      </Box>
                    )}
                </Box>

                {/* Key Results Section */}
                <Box sx={{ mb: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Key Results ({currentObjective.keyResults || 0})
                  </Typography>

                  <Box
                    sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 2, mb: 2 }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          name="title"
                          label="Key Result Title"
                          value={keyResultInput.title}
                          onChange={handleKeyResultInputChange}
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "white",
                              borderRadius: "8px",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name="description"
                          label="Description"
                          value={keyResultInput.description}
                          onChange={handleKeyResultInputChange}
                          multiline
                          rows={2}
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "white",
                              borderRadius: "8px",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          name="targetValue"
                          label="Target Value"
                          value={keyResultInput.targetValue}
                          onChange={handleKeyResultInputChange}
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "white",
                              borderRadius: "8px",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          name="unit"
                          label="Unit"
                          value={keyResultInput.unit}
                          onChange={handleKeyResultInputChange}
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "white",
                              borderRadius: "8px",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label="Due Date"
                            value={keyResultInput.dueDate}
                            onChange={handleKeyResultDateChange}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    backgroundColor: "white",
                                    borderRadius: "8px",
                                  },
                                }}
                              />
                            )}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          onClick={handleAddKeyResult}
                          startIcon={<Add />}
                          sx={{
                            background:
                              "linear-gradient(45deg, #2e7d32, #66bb6a)",
                            color: "white",
                            borderRadius: "8px",
                            textTransform: "none",
                          }}
                        >
                          Add Key Result
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Display added key results */}
                  {Array.isArray(currentObjective.keyResultsData) &&
                    currentObjective.keyResultsData.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Added Key Results:
                        </Typography>

                        {currentObjective.keyResultsData.map((kr, index) => (
                          <Box
                            key={index}
                            sx={{
                              p: 2,
                              mb: 2,
                              bgcolor: "#e8f5e9",
                              borderRadius: 2,
                              border: "1px solid #c8e6c9",
                              position: "relative",
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveKeyResult(index)}
                              sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                bgcolor: "#ffebee",
                                "&:hover": { bgcolor: "#ffcdd2" },
                              }}
                            >
                              <Close fontSize="small" />
                            </IconButton>

                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 600, mb: 1, pr: 4 }}
                            >
                              {kr.title}
                            </Typography>

                            {kr.description && (
                              <Typography
                                variant="body2"
                                sx={{ mb: 2, color: "#546e7a" }}
                              >
                                {kr.description}
                              </Typography>
                            )}

                            <Box
                              sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
                            >
                              {kr.targetValue && kr.unit && (
                                <Chip
                                  size="small"
                                  label={`Target: ${kr.targetValue} ${kr.unit}`}
                                  sx={{ bgcolor: "#c8e6c9", color: "#2e7d32" }}
                                />
                              )}

                              {kr.dueDate && (
                                <Chip
                                  size="small"
                                  label={`Due: ${format(
                                    new Date(kr.dueDate),
                                    "MMM dd, yyyy"
                                  )}`}
                                  sx={{ bgcolor: "#bbdefb", color: "#1565c0" }}
                                />
                              )}
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}
                </Box>

                {/* Assignees Input */}
                <Box sx={{ mb: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Assignees (
                    {Array.isArray(currentObjective.assignees)
                      ? currentObjective.assignees.length
                      : 0}
                    )
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      mb: 1,
                      flexDirection: isMobile ? "column" : "row",
                    }}
                  >
                    <Autocomplete
                      options={employees}
                      getOptionLabel={(option) => option.name || ""}
                      renderOption={(props, option) => (
                        <Box
                          component="li"
                          {...props}
                          className="employee-option"
                        >
                          <Avatar className="employee-option-avatar">
                            {option.name.charAt(0)}
                          </Avatar>
                          <Box className="employee-option-info">
                            <Typography className="employee-option-name">
                              {option.name}
                            </Typography>
                            <Box className="employee-option-details">
                              <Typography className="employee-option-id">
                                {option.id}
                              </Typography>
                              <Typography className="employee-option-designation">
                                {option.designation}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select assignee"
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "white",
                              borderRadius: "8px",
                              "&:hover fieldset": {
                                borderColor: "#1976d2",
                              },
                            },
                          }}
                        />
                      )}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          const employeeInfo = `${newValue.name} (${newValue.id}, ${newValue.designation})`;
                          setCurrentObjective((prev) => ({
                            ...prev,
                            assignees: Array.isArray(prev.assignees)
                              ? [...prev.assignees, employeeInfo]
                              : [employeeInfo],
                          }));
                        }
                      }}
                      sx={{ flex: 1 }}
                    />
                    <Button
                      variant="contained"
                      onClick={() => {
                        if (assigneeInput.trim() !== "") {
                          handleAddAssignee();
                        }
                      }}
                      sx={{
                        minWidth: isMobile ? "100%" : "80px",
                        height: isMobile ? "auto" : "56px",
                        background: "linear-gradient(45deg, #ff9800, #ffb74d)",
                        borderRadius: "8px",
                      }}
                    >
                      Add
                    </Button>
                  </Box>

                  {/* Display added assignees */}
                  {Array.isArray(currentObjective.assignees) &&
                    currentObjective.assignees.length > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          p: 2,
                          bgcolor: "#fff8e1",
                          borderRadius: 2,
                          maxHeight: "150px",
                          overflowY: "auto",
                        }}
                      >
                        {currentObjective.assignees.map((assignee, index) => (
                          <Chip
                            key={index}
                            label={assignee}
                            onDelete={() => handleRemoveAssignee(index)}
                            sx={{
                              bgcolor: "#ffecb3",
                              "&:hover": { bgcolor: "#ffe082" },
                              maxWidth: isMobile ? "100%" : "auto",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          />
                        ))}
                      </Box>
                    )}
                </Box>

                <FormControl fullWidth>
                  <InputLabel>Objective Type</InputLabel>
                  <Select
                    name="objectiveType"
                    value={currentObjective.objectiveType}
                    onChange={handleInputChange}
                    required
                    sx={{
                      backgroundColor: "white",
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                    }}
                  >
                    <MenuItem value="self">Self Objective</MenuItem>
                    <MenuItem value="all">Team Objective</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  name="description"
                  label="Description"
                  value={currentObjective.description}
                  onChange={handleInputChange}
                  required
                  multiline
                  rows={4}
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
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: "10px",
                  mt: 4,
                  justifyContent: "flex-end",
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <Button
                  onClick={() => setIsEditModalOpen(false)}
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
                  type="submit"
                  disabled={loading}
                  sx={{
                    background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                    color: "white",
                    "&:hover": {
                      background: "linear-gradient(45deg, #1565c0, #42a5f5)",
                    },
                    textTransform: "none",
                    borderRadius: "8px",
                    px: 4,
                    py: 1,
                    fontWeight: 600,
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </Box>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Objective Details Modal */}
      {isDetailModalOpen && selectedObjective && (
        <Dialog
          open={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "20px",
              overflow: "hidden",
              width: { xs: "95%", sm: "800px" },
              margin: { xs: "16px", sm: "auto" },
            },
          }}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(45deg, #1976d2, #64b5f6)",
              color: "white",
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
              fontWeight: 600,
              padding: { xs: "16px", sm: "24px 32px" },
            }}
          >
            Objective Details
          </DialogTitle>

          <DialogContent sx={{ p: 0 }}>
            <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: "#f8fafc" }}>
              <Typography
                variant={isMobile ? "h6" : "h5"}
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: "#1976d2",
                  wordBreak: "break-word",
                }}
              >
                {selectedObjective.title}
              </Typography>

              <Chip
                label={
                  selectedObjective.objectiveType === "self"
                    ? "Self Objective"
                    : "Team Objective"
                }
                color={
                  selectedObjective.objectiveType === "self"
                    ? "primary"
                    : "secondary"
                }
                sx={{ mb: 2 }}
              />

              <Typography
                variant="body1"
                paragraph
                sx={{
                  mt: 2,
                  wordBreak: "break-word",
                }}
              >
                {selectedObjective.description}
              </Typography>
            </Box>

            <Divider />

            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Grid container spacing={isMobile ? 2 : 3}>
                <Grid item xs={12} sm={6}>
                  <Paper
                    elevation={0}
                    sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      Duration
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <AccessTime fontSize="small" color="action" />
                      {selectedObjective.duration}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Paper
                    elevation={0}
                    sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      Progress
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 1,
                      }}
                    >
                      <LinearProgress
                        variant="determinate"
                        value={calculateProgress(selectedObjective)}
                        sx={{
                          width: "100%",
                          height: 10,
                          borderRadius: 5,
                          bgcolor: "#e0e0e0",
                        }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {calculateProgress(selectedObjective)}%
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Paper
                    elevation={0}
                    sx={{ p: 2, bgcolor: "#e3f2fd", borderRadius: 2 }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      Managers
                    </Typography>
                    {Array.isArray(selectedObjective.managers) ? (
                      <Box sx={{ mt: 1 }}>
                        {selectedObjective.managers.length > 0 ? (
                          selectedObjective.managers.map((manager, index) => (
                            <Typography
                              key={index}
                              variant="body2"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Person fontSize="small" color="primary" />
                              {manager}
                            </Typography>
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No managers assigned
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: "#0d47a1" }}
                      >
                        {selectedObjective.managers}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper
                    elevation={0}
                    sx={{ p: 2, bgcolor: "#e8f5e9", borderRadius: 2 }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      Key Results
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "#1b5e20" }}
                    >
                      {selectedObjective.keyResults}
                    </Typography>
                    {selectedObjective.keyResultsData &&
                      selectedObjective.keyResultsData.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          {selectedObjective.keyResultsData.map((kr, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 1,
                                mb: 1,
                                p: 1,
                                bgcolor: kr.completed
                                  ? "#c8e6c9"
                                  : "transparent",
                                borderRadius: 1,
                                transition: "all 0.3s ease",
                              }}
                            >
                              <Checkbox
                                checked={kr.completed || false}
                                onChange={(e) =>
                                  updateKeyResultStatus(
                                    selectedObjective._id,
                                    index,
                                    e.target.checked
                                  )
                                }
                                sx={{
                                  color: kr.completed ? "#4caf50" : "#9e9e9e",
                                  "&.Mui-checked": {
                                    color: "#4caf50",
                                  },
                                  padding: 0,
                                }}
                                size="small"
                              />
                              <Typography
                                variant="body2"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  textDecoration: kr.completed
                                    ? "line-through"
                                    : "none",
                                  color: kr.completed ? "#2e7d32" : "inherit",
                                }}
                              >
                                {kr.title}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                  </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Paper
                    elevation={0}
                    sx={{ p: 2, bgcolor: "#fff8e1", borderRadius: 2 }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      Assignees
                    </Typography>
                    {Array.isArray(selectedObjective.assignees) ? (
                      <Box sx={{ mt: 1 }}>
                        {selectedObjective.assignees.length > 0 ? (
                          selectedObjective.assignees.map((assignee, index) => (
                            <Typography
                              key={index}
                              variant="body2"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Person fontSize="small" color="warning" />
                              {assignee}
                            </Typography>
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No assignees assigned
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: "#ff6f00" }}
                      >
                        {selectedObjective.assignees}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Timeline
                </Typography>
                <Paper
                  elevation={0}
                  sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Created
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {selectedObjective.createdAt
                        ? formatDate(selectedObjective.createdAt)
                        : "N/A"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {selectedObjective.updatedAt
                        ? formatDate(selectedObjective.updatedAt)
                        : "N/A"}
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Box>

            <Divider />

            <Box
              sx={{
                p: { xs: 2, sm: 3 },
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  handleEdit(selectedObjective);
                }}
                startIcon={<Edit />}
                fullWidth={isMobile}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="warning"
                onClick={() => {
                  handleArchive(selectedObjective._id);
                  setIsDetailModalOpen(false);
                }}
                startIcon={
                  selectedObjective.archived ? <Unarchive /> : <Archive />
                }
                fullWidth={isMobile}
              >
                {selectedObjective.archived ? "Unarchive" : "Archive"}
              </Button>
              <Button
                variant="contained"
                onClick={() => setIsDetailModalOpen(false)}
                fullWidth={isMobile}
              >
                Close
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      )}

      {/* Filter Popover */}
      {isFilterModalOpen && (
        <Popover
          open={Boolean(filterAnchorEl)}
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
              width: { xs: "90%", sm: "400px" },
              borderRadius: "16px",
              mt: 1,
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              position: "relative",
              zIndex: 1300,
            },
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(45deg, #1976d2, #64b5f6)",
              color: "white",
              p: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Filter Objectives
            </Typography>
          </Box>

          <Box sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Select
                value={filter.managers}
                onChange={(e) => handleFilterChange("managers", e.target.value)}
                fullWidth
                displayEmpty
                sx={{
                  height: "56px",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e0e7ff",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1976d2",
                  },
                }}
                renderValue={(selected) => selected || "Select Managers"}
              >
                <MenuItem value="">All Managers</MenuItem>
                <MenuItem value="1">1 Manager</MenuItem>
                <MenuItem value="2">2 Managers</MenuItem>
                <MenuItem value="3">3 Managers</MenuItem>
                <MenuItem value="4">4+ Managers</MenuItem>
              </Select>

              <Select
                value={filter.assignees}
                onChange={(e) =>
                  handleFilterChange("assignees", e.target.value)
                }
                fullWidth
                displayEmpty
                sx={{
                  height: "56px",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e0e7ff",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1976d2",
                  },
                }}
                renderValue={(selected) => selected || "Select Assignees"}
              >
                <MenuItem value="">All Assignees</MenuItem>
                <MenuItem value="1">1 Assignee</MenuItem>
                <MenuItem value="2">2 Assignees</MenuItem>
                <MenuItem value="3">3 Assignees</MenuItem>
                <MenuItem value="4">4+ Assignees</MenuItem>
              </Select>

              <Select
                value={filter.keyResults}
                onChange={(e) =>
                  handleFilterChange("keyResults", e.target.value)
                }
                fullWidth
                displayEmpty
                sx={{
                  height: "56px",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e0e7ff",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1976d2",
                  },
                }}
                renderValue={(selected) => selected || "Select Key Results"}
              >
                <MenuItem value="">All Results</MenuItem>
                <MenuItem value="1">1 Result</MenuItem>
                <MenuItem value="2">2 Results</MenuItem>
                <MenuItem value="3">3 Results</MenuItem>
                <MenuItem value="4">4+ Results</MenuItem>
              </Select>

              <Select
                value={filter.archived}
                onChange={(e) => handleFilterChange("archived", e.target.value)}
                fullWidth
                displayEmpty
                sx={{
                  height: "56px",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e0e7ff",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1976d2",
                  },
                }}
                renderValue={(selected) => selected || "Archive Status"}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="true">Archived</MenuItem>
                <MenuItem value="false">Not Archived</MenuItem>
              </Select>
            </Stack>

            <Stack
              direction={isMobile ? "column" : "row"}
              spacing={2}
              sx={{ mt: 4 }}
            >
              <Button
                fullWidth
                onClick={resetFilter}
                sx={{
                  border: "2px solid #1976d2",
                  color: "#1976d2",
                  "&:hover": {
                    border: "2px solid #64b5f6",
                    backgroundColor: "#e3f2fd",
                  },
                  borderRadius: "8px",
                  py: 1,
                  fontWeight: 600,
                }}
              >
                Clear All
              </Button>

              <Button
                fullWidth
                onClick={applyFilter}
                sx={{
                  background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                  color: "white",
                  "&:hover": {
                    background: "linear-gradient(45deg, #1565c0, #42a5f5)",
                  },
                  borderRadius: "8px",
                  py: 1,
                  fontWeight: 600,
                }}
              >
                Apply Filters
              </Button>
            </Stack>
          </Box>
        </Popover>
      )}
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
            Are you sure you want to delete this objective? All key results in
            this objective will also be deleted.
          </Alert>
          {itemToDelete && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
              <Typography variant="body1" fontWeight={600} color="#2c3e50">
                Objective: {itemToDelete.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                This objective contains {itemToDelete.keyResults || 0} key
                results.
              </Typography>
              {itemToDelete.description && (
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
                  {itemToDelete.description.substring(0, 100)}
                  {itemToDelete.description.length > 100 ? "..." : ""}
                </Typography>
              )}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {itemToDelete.objectiveType && (
                  <Chip
                    label={
                      itemToDelete.objectiveType === "self"
                        ? "Self Objective"
                        : "Team Objective"
                    }
                    size="small"
                    color={
                      itemToDelete.objectiveType === "self"
                        ? "primary"
                        : "secondary"
                    }
                  />
                )}
                {itemToDelete.archived && (
                  <Chip label="Archived" size="small" color="warning" />
                )}
              </Box>
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

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={5002}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Objectives;
