import React, { useState, useEffect } from "react";
import api from "../../../api/axiosInstance";
import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  useTheme,
  alpha,
  InputAdornment,
  MenuItem,
  Menu,
  Grid,
  Avatar,
  Card,
  CardContent,
  Stack,
  Divider,
  useMediaQuery,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Tooltip,
  TablePagination,
  Autocomplete,
} from "@mui/material";
import {
  FilterList,
  Search,
  CalendarMonth,
  Person,
  AccessTime,
  Refresh,
  FileDownload,
  DateRange,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  parseISO,
} from "date-fns";
import * as XLSX from "xlsx";

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

const FilterMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 16,
    marginTop: 12,
    minWidth: 280,
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    background: "linear-gradient(to bottom, #ffffff, #f8fafc)",
    border: "1px solid rgba(25, 118, 210, 0.12)",
  },
  "& .MuiMenuItem-root": {
    padding: "12px 16px",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.light, 0.1),
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

const AttendanceRecords = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // State variables
  const [searchTerm, setSearchTerm] = useState("");
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterValues, setFilterValues] = useState({
    employee: null,
    status: "",
    dateRange: "month",
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
  });
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "checkInTime",
    direction: "desc",
  });
  const [stats, setStats] = useState({
    totalRecords: 0,
    presentToday: 0,
    lateToday: 0,
    absentToday: 0,
    averageWorkHours: 0,
  });

  const API_URL = "/timesheet";
  const EMPLOYEES_API_URL = "/employees";

  useEffect(() => {
    const loadData = async () => {
      await fetchEmployees(); // First fetch employees
      await fetchTimesheets(); // Then fetch timesheets
    };

    loadData();
  }, []);

  useEffect(() => {
    if (timesheets.length > 0) {
      calculateStats(timesheets);
    }
  }, [timesheets]);

//   const getAuthToken = () => {
//   return localStorage.getItem('token');
// };


  // Add this function to map employee IDs to names
  const getEmployeeNameById = (employeeId) => {
    if (!employeeId || !employees || employees.length === 0) {
      console.log("Missing employeeId or employees list:", {
        employeeId,
        employeesCount: employees?.length,
      });
      return "Unknown Employee";
    }

    // Log the employeeId we're looking for
    console.log("Looking for employee with ID:", employeeId);

    // Try to find the employee with the given ID
    const employee = employees.find((emp) => {
      const empId = emp._id || emp.id || emp.employeeId || emp.Emp_ID;
      const match = empId === employeeId;
      if (match) {
        console.log("Found matching employee:", emp);
      }
      return match;
    });

    if (!employee) {
      console.log("No matching employee found for ID:", employeeId);
      return "Unknown Employee";
    }

    // Handle different employee data structures
    if (employee.name) return employee.name;
    if (employee.personalInfo) {
      const firstName = employee.personalInfo.firstName || "";
      const lastName = employee.personalInfo.lastName || "";
      return `${firstName} ${lastName}`.trim();
    }
    if (employee.firstName && employee.lastName) {
      return `${employee.firstName} ${employee.lastName}`;
    }

    console.log("Employee found but couldn't extract name:", employee);
    return "Unknown Employee";
  };

  // const fetchEmployees = async () => {
  //   try {
  //     const response = await axios.get(EMPLOYEES_API_URL);
  //     console.log("Employee data fetched:", response.data);

  //     // Handle different response structures
  //     let employeeData;
  //     if (Array.isArray(response.data)) {
  //       employeeData = response.data;
  //     } else if (response.data.employees) {
  //       employeeData = response.data.employees;
  //     } else if (response.data.data) {
  //       employeeData = response.data.data;
  //     } else {
  //       employeeData = [];
  //       console.error("Unexpected employee response format:", response.data);
  //     }

  //     setEmployees(employeeData);
  //   } catch (error) {
  //     console.error("Error fetching employees:", error);
  //     setEmployees([]);
  //   }
  // };

// const fetchEmployees = async () => {
//   try {
//     // const token = getAuthToken();
//     const response = await api.get(EMPLOYEES_API_URL,
//     //    {
//     //   headers: {
//     //     'Authorization': `Bearer ${token}`
//     //   }
//     // }
//   );
//     console.log("Employee data fetched:", response.data);

//     // Handle different response structures
//     let employeeData;
//     if (Array.isArray(response.data)) {
//       employeeData = response.data;
//     } else if (response.data.employees) {
//       employeeData = response.data.employees;
//     } else if (response.data.data) {
//       employeeData = response.data.data;
//     } else {
//       employeeData = [];
//       console.error("Unexpected employee response format:", response.data);
//     }

//     setEmployees(employeeData);
//   } catch (error) {
//     console.error("Error fetching employees:", error);
//     setEmployees([]);
//   }
// };


  // const fetchTimesheets = async () => {
  //   try {
  //     setLoading(true);

  //     // Build the query parameters based on filters
  //     let queryParams = new URLSearchParams();

  //     if (filterValues.employee) {
  //       // Use the correct employee ID field based on your data structure
  //       queryParams.append(
  //         "employeeId",
  //         filterValues.employee._id ||
  //           filterValues.employee.id ||
  //           filterValues.employee.employeeId
  //       );
  //     }

  //     if (filterValues.status) {
  //       queryParams.append("status", filterValues.status);
  //     }

  //     if (
  //       filterValues.dateRange !== "all" &&
  //       filterValues.startDate &&
  //       filterValues.endDate
  //     ) {
  //       queryParams.append("startDate", filterValues.startDate.toISOString());
  //       queryParams.append("endDate", filterValues.endDate.toISOString());
  //     }

  //     // First try to get all timesheets
  //     let response;
  //     try {
  //       // Try the /all endpoint first
  //       response = await axios.get(`${API_URL}/all?${queryParams.toString()}`);
  //     } catch (error) {
  //       console.log(
  //         "Error fetching from /all endpoint, trying alternative endpoint"
  //       );
  //       // If /all endpoint fails, try the base endpoint
  //       response = await axios.get(`${API_URL}?${queryParams.toString()}`);
  //     }

  //     console.log("Timesheet data fetched:", response.data);

  //     // Handle different response structures
  //     let timesheetData;
  //     if (Array.isArray(response.data)) {
  //       timesheetData = response.data;
  //     } else if (response.data.timesheets) {
  //       timesheetData = response.data.timesheets;
  //     } else if (response.data.data) {
  //       timesheetData = response.data.data;
  //     } else {
  //       timesheetData = [];
  //       console.error("Unexpected response format:", response.data);
  //     }

  //     // Log the first timesheet to see its structure
  //     if (timesheetData.length > 0) {
  //       console.log("Sample timesheet:", timesheetData[0]);
  //     }

  //     // Enhance timesheet data with employee names if needed
  //     const enhancedTimesheetData = timesheetData.map((timesheet) => {
  //       // If the timesheet already has an employeeName, use it
  //       if (
  //         timesheet.employeeName &&
  //         timesheet.employeeName !== "Unknown Employee"
  //       ) {
  //         return timesheet;
  //       }

  //       // Otherwise, try to find the employee name from the employees list
  //       const employeeId = timesheet.employeeId;
  //       const employeeName = getEmployeeNameById(employeeId);

  //       return {
  //         ...timesheet,
  //         employeeName: employeeName,
  //       };
  //     });

  //     setTimesheets(enhancedTimesheetData);
  //   } catch (error) {
  //     console.error("Error fetching timesheets:", error);
  //     setTimesheets([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


//   const fetchTimesheets = async () => {
//   try {
//     setLoading(true);

//     // Build the query parameters based on filters
//     let queryParams = new URLSearchParams();

//     if (filterValues.employee) {
//       // Use the correct employee ID field based on your data structure
//       queryParams.append('employeeId', filterValues.employee._id || filterValues.employee.id || filterValues.employee.employeeId);
//     }

//     if (filterValues.status) {
//       queryParams.append('status', filterValues.status);
//     }

//     if (filterValues.dateRange !== 'all' && filterValues.startDate && filterValues.endDate) {
//       queryParams.append('startDate', filterValues.startDate.toISOString());
//       queryParams.append('endDate', filterValues.endDate.toISOString());
//     }

//     // // Get the authentication token
//     // const token = getAuthToken();
//     // const headers = {
//     //   'Authorization': `Bearer ${token}`
//     // };

//     // First try to get all timesheets
//     let response;
//     try {
//       // Try the /all endpoint first
//       response = await api.get(`${API_URL}/all?${queryParams.toString()}`);
//     } catch (error) {
//       console.log("Error fetching from /all endpoint, trying alternative endpoint");
//       // If /all endpoint fails, try the base endpoint
//       response = await api.get(`${API_URL}?${queryParams.toString()}`);
//     }

//     console.log("Timesheet data fetched:", response.data);

//     // Handle different response structures
//     let timesheetData;
//     if (Array.isArray(response.data)) {
//       timesheetData = response.data;
//     } else if (response.data.timesheets) {
//       timesheetData = response.data.timesheets;
//     } else if (response.data.data) {
//       timesheetData = response.data.data;
//     } else {
//       timesheetData = [];
//       console.error("Unexpected response format:", response.data);
//     }

//     // Log the first timesheet to see its structure
//     if (timesheetData.length > 0) {
//       console.log("Sample timesheet:", timesheetData[0]);
//     }

//     // Enhance timesheet data with employee names if needed
//     const enhancedTimesheetData = timesheetData.map((timesheet) => {
//       // If the timesheet already has an employeeName, use it
//       if (timesheet.employeeName && timesheet.employeeName !== "Unknown Employee") {
//         return timesheet;
//       }

//       // Otherwise, try to find the employee name from the employees list
//       const employeeId = timesheet.employeeId;
//       const employeeName = getEmployeeNameById(employeeId);

//       return {
//         ...timesheet,
//         employeeName: employeeName,
//       };
//     });

//     setTimesheets(enhancedTimesheetData);
//   } catch (error) {
//     console.error("Error fetching timesheets:", error);
//     setTimesheets([]);
//   } finally {
//     setLoading(false);
//   }
// };

const fetchEmployees = async () => {
  try {
    // Update the endpoint to match what's used in AttendanceDashboard.js
    const response = await api.get('/employees/registered');
    console.log("Employee data fetched:", response.data);

    // Handle different response structures
    let employeeData;
    if (Array.isArray(response.data)) {
      employeeData = response.data;
    } else if (response.data.employees) {
      employeeData = response.data.employees;
    } else if (response.data.data) {
      employeeData = response.data.data;
    } else {
      employeeData = [];
      console.error("Unexpected employee response format:", response.data);
    }

    setEmployees(employeeData);
  } catch (error) {
    console.error("Error fetching employees:", error);
    setEmployees([]);
  }
};

const fetchTimesheets = async () => {
  try {
    setLoading(true);

    // Build the query parameters based on filters
    let queryParams = new URLSearchParams();

    if (filterValues.employee) {
      // Use the correct employee ID field based on your data structure
      queryParams.append('employeeId', filterValues.employee._id || filterValues.employee.id || filterValues.employee.employeeId);
    }

    if (filterValues.status) {
      queryParams.append('status', filterValues.status);
    }

    // Format dates as YYYY-MM-DD to avoid issues with timezone and encoding
    if (filterValues.dateRange !== 'all' && filterValues.startDate && filterValues.endDate) {
      const formatDate = (date) => {
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      };
      queryParams.append('startDate', formatDate(filterValues.startDate));
      queryParams.append('endDate', formatDate(filterValues.endDate));
    }

    // Try different endpoints with better error handling
    let timesheetData = [];
    try {
      // First try the base endpoint without /all
      const response = await api.get(`${API_URL}?${queryParams.toString()}`);
      console.log("Timesheet data fetched from base endpoint:", response.data);
      
      // Handle different response structures
      if (Array.isArray(response.data)) {
        timesheetData = response.data;
      } else if (response.data.timesheets) {
        timesheetData = response.data.timesheets;
      } else if (response.data.data) {
        timesheetData = response.data.data;
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.log("Error fetching from base endpoint, trying /all endpoint");
      try {
        // If base endpoint fails, try the /all endpoint
        const response = await api.get(`${API_URL}/all?${queryParams.toString()}`);
        console.log("Timesheet data fetched from /all endpoint:", response.data);
        
        // Handle different response structures
        if (Array.isArray(response.data)) {
          timesheetData = response.data;
        } else if (response.data.timesheets) {
          timesheetData = response.data.timesheets;
        } else if (response.data.data) {
          timesheetData = response.data.data;
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (fallbackError) {
        console.error("All timesheet endpoints failed:", fallbackError);
        // Continue with empty timesheet data
      }
    }

    // Log the first timesheet to see its structure
    if (timesheetData.length > 0) {
      console.log("Sample timesheet:", timesheetData[0]);
    }

    // Enhance timesheet data with employee names if needed
    const enhancedTimesheetData = timesheetData.map((timesheet) => {
      // If the timesheet already has an employeeName, use it
      if (timesheet.employeeName && timesheet.employeeName !== "Unknown Employee") {
        return timesheet;
      }

      // Otherwise, try to find the employee name from the employees list
      const employeeId = timesheet.employeeId;
      const employeeName = getEmployeeNameById(employeeId);

      return {
        ...timesheet,
        employeeName: employeeName,
      };
    });

    setTimesheets(enhancedTimesheetData);
  } catch (error) {
    console.error("Error fetching timesheets:", error);
    setTimesheets([]);
  } finally {
    setLoading(false);
  }
};



  const calculateStats = (data) => {
    if (!data || data.length === 0) {
      setStats({
        totalRecords: 0,
        presentToday: 0,
        lateToday: 0,
        absentToday: 0,
        averageWorkHours: 0,
      });
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const todayRecords = data.filter(
      (record) =>
        new Date(record.checkInTime).toISOString().split("T")[0] === today
    );

    const presentToday = todayRecords.length;

    const lateToday = todayRecords.filter((record) => {
      const checkInTime = new Date(record.checkInTime);
      if (!checkInTime) return false;

      // Assuming late is after 9:15 AM
      return (
        checkInTime.getHours() > 9 ||
        (checkInTime.getHours() === 9 && checkInTime.getMinutes() > 15)
      );
    }).length;

    // Calculate average work hours
    const recordsWithDuration = data.filter(
      (record) => record.duration && !isNaN(parseFloat(record.duration))
    );
    const totalHours = recordsWithDuration.reduce(
      (sum, record) => sum + parseFloat(record.duration) / 3600,
      0
    );
    const averageWorkHours =
      recordsWithDuration.length > 0
        ? (totalHours / recordsWithDuration.length).toFixed(2)
        : 0;

    // Estimate absent employees (this would need to be refined based on your business logic)
    const absentToday = employees.length - presentToday;

    setStats({
      totalRecords: data.length,
      presentToday,
      lateToday,
      absentToday: absentToday > 0 ? absentToday : 0,
      averageWorkHours,
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleEmployeeChange = (event, newValue) => {
    setFilterValues({
      ...filterValues,
      employee: newValue,
    });
  };

  const handleFilterChange = (name, value) => {
    setFilterValues({
      ...filterValues,
      [name]: value,
    });
  };

  const handleDateRangeChange = (range) => {
    let startDate = null;
    let endDate = null;
    const today = new Date();

    switch (range) {
      case "today":
        startDate = today;
        endDate = today;
        break;
      case "week":
        startDate = startOfWeek(today);
        endDate = endOfWeek(today);
        break;
      case "month":
        startDate = startOfMonth(today);
        endDate = endOfMonth(today);
        break;
      case "custom":
        // Keep existing custom dates
        startDate = filterValues.startDate;
        endDate = filterValues.endDate;
        break;
      default:
        // 'all' - no date filtering
        break;
    }

    setFilterValues({
      ...filterValues,
      dateRange: range,
      startDate,
      endDate,
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleApplyFilters = () => {
    fetchTimesheets();
    handleFilterClose();
  };

  const exportToExcel = () => {
    if (filteredData.length === 0) return;

    // Create worksheet data
    const worksheetData = filteredData.map((row) => {
      // Format dates properly
      let checkInDate = "N/A";
      let checkInTime = "N/A";
      let checkOutTime = "N/A";

      try {
        if (row.checkInTime) {
          const checkIn = new Date(row.checkInTime);
          if (!isNaN(checkIn.getTime())) {
            checkInDate = checkIn.toLocaleDateString();
            checkInTime = checkIn.toLocaleTimeString();
          }
        }

        if (row.checkOutTime) {
          const checkOut = new Date(row.checkOutTime);
          if (!isNaN(checkOut.getTime())) {
            checkOutTime = checkOut.toLocaleTimeString();
          }
        }
      } catch (error) {
        console.error("Error formatting dates for Excel:", error);
      }

      // Calculate duration in hours
      const durationHours = row.duration
        ? (row.duration / 3600).toFixed(2)
        : "N/A";

      // Determine status
      let status = "N/A";
      if (row.checkInTime) {
        try {
          const checkIn = new Date(row.checkInTime);
          if (!isNaN(checkIn.getTime())) {
            if (
              checkIn.getHours() > 9 ||
              (checkIn.getHours() === 9 && checkIn.getMinutes() > 15)
            ) {
              status = "Late";
            } else if (!row.checkOutTime) {
              status = "Checked In";
            } else {
              status = "Present";
            }
          }
        } catch (error) {
          console.error("Error determining status for Excel:", error);
        }
      } else {
        status = "Absent";
      }

      // Return a row object with named properties (this becomes a row in the Excel file)
      return {
        "Employee Name": row.employeeName || "Unknown Employee",
        "Employee ID": row.employeeId || "N/A",
        Date: checkInDate,
        "Check In": checkInTime,
        "Check Out": checkOutTime,
        "Duration (hours)": durationHours,
        Status: status,
      };
    });

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    // Create a workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Records");

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Create a Blob from the buffer
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create a download link and trigger the download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance_records_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFilteredData = () => {
    return timesheets.filter((timesheet) => {
      // Search term filter (search by employee name or ID)
      if (
        searchTerm &&
        !(
          timesheet.employeeName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          timesheet.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ) {
        return false;
      }

      return true;
    });
  };

  const getSortedData = (data) => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (
        sortConfig.key === "checkInTime" ||
        sortConfig.key === "checkOutTime"
      ) {
        const dateA = new Date(a[sortConfig.key] || 0);
        const dateB = new Date(b[sortConfig.key] || 0);
        return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
      }

      if (sortConfig.key === "duration") {
        const durationA = a[sortConfig.key] || 0;
        const durationB = b[sortConfig.key] || 0;
        return sortConfig.direction === "asc"
          ? durationA - durationB
          : durationB - durationA;
      }

      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0h 0m";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getAttendanceStatus = (timesheet) => {
    if (!timesheet.checkInTime) {
      return (
        <Chip
          label="Absent"
          size="small"
          sx={{
            backgroundColor: "#ffebee",
            color: "#d32f2f",
            fontWeight: 500,
          }}
        />
      );
    }

    const checkInTime = new Date(timesheet.checkInTime);

    // If check-in is after 9:15 AM, consider it late
    if (
      checkInTime.getHours() > 9 ||
      (checkInTime.getHours() === 9 && checkInTime.getMinutes() > 15)
    ) {
      return (
        <Chip
          label="Late"
          size="small"
          sx={{
            backgroundColor: "#fff8e1",
            color: "#ffa000",
            fontWeight: 500,
          }}
        />
      );
    }

    // If there's no checkout time but there is a check-in time
    if (!timesheet.checkOutTime && timesheet.checkInTime) {
      return (
        <Chip
          label="Checked In"
          size="small"
          sx={{
            backgroundColor: "#e8f5e9",
            color: "#4caf50",
            fontWeight: 500,
          }}
        />
      );
    }

    // Otherwise, present and completed the day
    return (
      <Chip
        label="Present"
        size="small"
        sx={{
          backgroundColor: "#e8f5e9",
          color: "#4caf50",
          fontWeight: 500,
        }}
      />
    );
  };

  const filteredData = getFilteredData();
  const sortedData = getSortedData(filteredData);
  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Render attendance card for mobile view
  const renderAttendanceCard = (timesheet) => (
    <Card
      key={timesheet._id}
      sx={{ mb: 2, borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                width: 40,
                height: 40,
              }}
            >
              {timesheet.employeeName ? timesheet.employeeName[0] : "U"}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={500}>
                {timesheet.employeeName || "Unknown Employee"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {timesheet.employeeId || "No ID"}
              </Typography>
            </Box>
          </Box>
          {getAttendanceStatus(timesheet)}
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Stack spacing={1.5}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Date:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {timesheet.checkInTime
                ? new Date(timesheet.checkInTime).toLocaleDateString()
                : "N/A"}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Check In:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {timesheet.checkInTime
                ? new Date(timesheet.checkInTime).toLocaleTimeString()
                : "N/A"}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Check Out:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {timesheet.checkOutTime
                ? new Date(timesheet.checkOutTime).toLocaleTimeString()
                : "N/A"}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Duration:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {formatDuration(timesheet.duration)}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        p: isMobile ? 2 : 4,
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          color: theme.palette.primary.main,
          fontWeight: 600,
          letterSpacing: 0.5,
          fontSize: isMobile ? "1.75rem" : "2.125rem",
        }}
      >
        Attendance Records
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              bgcolor: "#e3f2fd",
              border: "1px solid #90caf9",
            }}
          >
            <Box
              sx={{
                bgcolor: "#1976d2",
                borderRadius: "50%",
                p: 1,
                mr: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Person sx={{ color: "white" }} />
            </Box>
            <Box>
              <Typography variant="body2" color="#1976d2" fontWeight={500}>
                Total Records
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {stats.totalRecords}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              bgcolor: "#e8f5e9",
              border: "1px solid #a5d6a7",
            }}
          >
            <Box
              sx={{
                bgcolor: "#4caf50",
                borderRadius: "50%",
                p: 1,
                mr: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CalendarMonth sx={{ color: "white" }} />
            </Box>
            <Box>
              <Typography variant="body2" color="#4caf50" fontWeight={500}>
                Present Today
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {stats.presentToday}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              bgcolor: "#fff8e1",
              border: "1px solid #ffe082",
            }}
          >
            <Box
              sx={{
                bgcolor: "#ffa000",
                borderRadius: "50%",
                p: 1,
                mr: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AccessTime sx={{ color: "white" }} />
            </Box>
            <Box>
              <Typography variant="body2" color="#ffa000" fontWeight={500}>
                Late Today
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {stats.lateToday}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              bgcolor: "#e1f5fe",
              border: "1px solid #81d4fa",
            }}
          >
            <Box
              sx={{
                bgcolor: "#03a9f4",
                borderRadius: "50%",
                p: 1,
                mr: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AccessTime sx={{ color: "white" }} />
            </Box>
            <Box>
              <Typography variant="body2" color="#03a9f4" fontWeight={500}>
                Avg. Work Hours
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {stats.averageWorkHours}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Search and Filter Bar */}
      <StyledPaper sx={{ p: isMobile ? 2 : 3 }}>
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          sx={{
            width: "100%",
            justifyContent: "space-between",
            flexWrap: "wrap",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <SearchTextField
            placeholder="Search by employee name or ID..."
            value={searchTerm}
            onChange={handleSearch}
            size="small"
            sx={{
              width: isMobile ? "100%" : { xs: "100%", sm: "300px" },
              marginRight: isMobile ? 0 : "auto",
              mb: isMobile ? 2 : 0,
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
            sx={{ display: "flex", gap: 1, width: isMobile ? "100%" : "auto" }}
          >
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={handleFilterClick}
              sx={{
                height: 40,
                whiteSpace: "nowrap",
                flex: isMobile ? 1 : "none",
              }}
            >
              Filters
            </Button>

            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchTimesheets}
              sx={{
                height: 40,
                whiteSpace: "nowrap",
                flex: isMobile ? 1 : "none",
              }}
            >
              Refresh
            </Button>

            <Button
              variant="contained"
              startIcon={<FileDownload />}
              onClick={exportToExcel}
              sx={{
                height: 40,
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                color: "white",
                "&:hover": {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                },
                flex: isMobile ? 1 : "none",
              }}
            >
              Export
            </Button>
          </Box>
        </Box>
      </StyledPaper>

      {/* Filter Menu */}
      <FilterMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 2,
              fontWeight: 600,
              color: theme.palette.primary.main,
            }}
          >
            Filter Attendance Records
          </Typography>
          <Stack spacing={2}>
            {/* <Autocomplete
  options={employees}
  getOptionLabel={(option) => {
    // Handle different employee data structures
    if (option.name) return option.name;
    if (option.personalInfo) {
      return `${option.personalInfo.firstName || ''} ${option.personalInfo.lastName || ''}`;
    }
    return option.employeeId || "Unknown Employee";
  }}
  value={filterValues.employee}
  onChange={handleEmployeeChange}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Employee"
      size="small"
      fullWidth
    />
  )}
/> */}
            <Autocomplete
              options={employees}
              getOptionLabel={(option) => {
                // Handle different employee data structures
                if (option.name) return option.name;
                if (option.personalInfo) {
                  return `${option.personalInfo.firstName || ""} ${
                    option.personalInfo.lastName || ""
                  }`;
                }
                return option.employeeId || "Unknown Employee";
              }}
              value={filterValues.employee}
              onChange={handleEmployeeChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Employee"
                  size="small"
                  fullWidth
                />
              )}
            />

            <FormControl fullWidth size="small">
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={filterValues.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                label="Status"
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="Present">Present</MenuItem>
                <MenuItem value="Late">Late</MenuItem>
                <MenuItem value="Absent">Absent</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel id="date-range-filter-label">Date Range</InputLabel>
              <Select
                labelId="date-range-filter-label"
                value={filterValues.dateRange}
                onChange={(e) => handleDateRangeChange(e.target.value)}
                label="Date Range"
              >
                <MenuItem value="all">All Dates</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </Select>
            </FormControl>

            {filterValues.dateRange === "custom" && (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <DatePicker
                      label="Start Date"
                      value={filterValues.startDate}
                      onChange={(date) => handleFilterChange("startDate", date)}
                      renderInput={(params) => (
                        <TextField size="small" {...params} />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <DatePicker
                      label="End Date"
                      value={filterValues.endDate}
                      onChange={(date) => handleFilterChange("endDate", date)}
                      renderInput={(params) => (
                        <TextField size="small" {...params} />
                      )}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>
            )}

            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setFilterValues({
                    employee: null,
                    status: "",
                    dateRange: "month",
                    startDate: startOfMonth(new Date()),
                    endDate: endOfMonth(new Date()),
                  });
                }}
                fullWidth
              >
                Clear
              </Button>
              <Button
                variant="contained"
                onClick={handleApplyFilters}
                fullWidth
              >
                Apply
              </Button>
            </Box>
          </Stack>
        </Box>
      </FilterMenu>

      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Mobile View - Cards */}
          {isMobile ? (
            <Box>
              {paginatedData.length > 0 ? (
                paginatedData.map((timesheet) =>
                  renderAttendanceCard(timesheet)
                )
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No attendance records found
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            /* Desktop/Tablet View - Table */
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: 2,
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                overflow: "auto",
                maxWidth: "100%",
                mb: 2,
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <StyledTableCell
                      onClick={() => handleSort("employeeName")}
                      sx={{
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        minWidth: 180,
                      }}
                    >
                      Employee
                      {sortConfig.key === "employeeName" &&
                        (sortConfig.direction === "asc" ? (
                          <ArrowUpward fontSize="small" />
                        ) : (
                          <ArrowDownward fontSize="small" />
                        ))}
                    </StyledTableCell>

                    <StyledTableCell
                      onClick={() => handleSort("checkInTime")}
                      sx={{
                        cursor: "pointer",
                        minWidth: 130,
                      }}
                    >
                      Date
                      {sortConfig.key === "checkInTime" &&
                        (sortConfig.direction === "asc" ? (
                          <ArrowUpward fontSize="small" />
                        ) : (
                          <ArrowDownward fontSize="small" />
                        ))}
                    </StyledTableCell>

                    <StyledTableCell sx={{ minWidth: 130 }}>
                      Check In
                    </StyledTableCell>

                    <StyledTableCell sx={{ minWidth: 130 }}>
                      Check Out
                    </StyledTableCell>

                    <StyledTableCell
                      onClick={() => handleSort("duration")}
                      sx={{
                        cursor: "pointer",
                        minWidth: 120,
                      }}
                    >
                      Duration
                      {sortConfig.key === "duration" &&
                        (sortConfig.direction === "asc" ? (
                          <ArrowUpward fontSize="small" />
                        ) : (
                          <ArrowDownward fontSize="small" />
                        ))}
                    </StyledTableCell>

                    <StyledTableCell sx={{ minWidth: 120 }}>
                      Status
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((timesheet) => (
                      <StyledTableRow
                        key={timesheet._id}
                        sx={{
                          "&:nth-of-type(odd)": {
                            backgroundColor: alpha(
                              theme.palette.primary.light,
                              0.05
                            ),
                          },
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.primary.light,
                              0.1
                            ),
                            transition: "background-color 0.2s ease",
                          },
                          // Hide last border
                          "&:last-child td, &:last-child th": {
                            borderBottom: 0,
                          },
                        }}
                      >
                        {/* <TableCell>
                                              <Box
                                                sx={{ display: "flex", alignItems: "center", gap: 1 }}
                                              >
                                                <Avatar
                                                  sx={{
                                                    bgcolor: theme.palette.primary.main,
                                                    width: 32,
                                                    height: 32,
                                                  }}
                                                >
                                                  {timesheet.employeeName ? timesheet.employeeName[0] : "U"}
                                                </Avatar>
                                                <Box>
                                                  <Typography variant="body2" fontWeight={500}>
                                                    {timesheet.employeeName || "Unknown Employee"}
                                                  </Typography>
                                                  <Typography variant="caption" color="text.secondary">
                                                    {timesheet.employeeId || "No ID"}
                                                  </Typography>
                                                </Box>
                                              </Box>
                                            </TableCell> */}
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: theme.palette.primary.main,
                                width: 32,
                                height: 32,
                              }}
                            >
                              {timesheet.employeeName
                                ? timesheet.employeeName[0]
                                : "U"}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                {timesheet.employeeName || "Unknown Employee"}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {timesheet.employeeId || "No ID"}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2">
                            {timesheet.checkInTime
                              ? new Date(
                                  timesheet.checkInTime
                                ).toLocaleDateString()
                              : "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {timesheet.checkInTime
                              ? new Date(
                                  timesheet.checkInTime
                                ).toLocaleTimeString()
                              : "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {timesheet.checkOutTime
                              ? new Date(
                                  timesheet.checkOutTime
                                ).toLocaleTimeString()
                              : "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDuration(timesheet.duration)}
                          </Typography>
                        </TableCell>
                        <TableCell>{getAttendanceStatus(timesheet)}</TableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                        <Typography variant="body1" color="text.secondary">
                          No attendance records found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Pagination */}
          <TablePagination
            component="div"
            count={filteredData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{
              ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                {
                  margin: 0,
                },
            }}
          />
        </>
      )}
    </Box>
  );
};

export default AttendanceRecords;
