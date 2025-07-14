import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  DatePicker,
  Select,
  Button,
  Badge,
  Space,
  Statistic,
  Progress,
  message,
  Tabs,
  Empty,
  Input, // Add this
} from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import {
  DownloadOutlined,
  ReloadOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  FilterOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import api from "../../../api/axiosInstance";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import "./EmployeeReport.css";

const { TabPane } = Tabs;
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}
const EmployeeReport = () => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    stats: {
      totalOnboarded: 0,
      totalOffboarded: 0,
      averageOnboardingTime: 0,
      completionRate: 0,
      recentOffboardings: 0,
    },
    trendData: [],
    departmentData: [],
    employeeData: [],
    offboardingData: [],
    offboardingReasons: [],
    offboardingByDepartment: [],
  });
  const [filterDepartment, setFilterDepartment] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState(null);
  const [timePeriod, setTimePeriod] = useState("6m");
  const [activeTab, setActiveTab] = useState("1");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const { RangePicker } = DatePicker;
  const { Option } = Select;


//   // Add this function at the top of your component
// const getAuthToken = () => {
//   return localStorage.getItem('token');
// };


  const fetchReportData = async (period = "6m") => {
  setLoading(true);
  try {
    // // Get authentication token
    // const token = getAuthToken();
    // if (!token) {
    //   message.error("Authentication required. Please log in again.");
    //   return;
    // }

    const today = new Date();

    let startDate = new Date();
    switch (period) {
      case "1m":
        startDate.setMonth(today.getMonth() - 1);
        break;
      case "3m":
        startDate.setMonth(today.getMonth() - 3);
        break;
      case "6m":
        startDate.setMonth(today.getMonth() - 6);
        break;
      case "1y":
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(today.getMonth() - 6);
    }

    // Fetch employee data with authentication
    const employeeResponse = await api.get(
      `/employees/report?period=${period}&startDate=${startDate.toISOString()}`,
      // {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // }
    );

    // Fetch offboarding data with authentication
    const offboardingResponse = await api.get(
      "/offboarding",
      // {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // }
    );

    // Process offboarding data
    const offboardingData = offboardingResponse.data || [];
    
    // Calculate offboarding statistics
    const offboardingStats = processOffboardingData(offboardingData, startDate);

    if (employeeResponse.data.success) {
      setReportData({
        ...employeeResponse.data.data,
        offboardingData: offboardingData,
        offboardingReasons: offboardingStats.reasonsData,
        offboardingByDepartment: offboardingStats.departmentData,
        stats: {
          ...employeeResponse.data.data.stats,
          totalOffboarded: offboardingStats.totalOffboarded,
          recentOffboardings: offboardingStats.recentOffboardings,
        }
      });
    } else {
      message.error("Failed to load report data");
      
      // Set demo data with offboarding information
      setDemoData(startDate);
    }
  } catch (error) {
    console.error("Error fetching report data:", error);
    message.error("Error loading report data");

    // Set demo data with offboarding information
    setDemoData(new Date());
  } finally {
    setLoading(false);
  }
};


  // Process offboarding data to get statistics
  const processOffboardingData = (offboardingData, startDate) => {
    // For the current implementation, we'll consider all offboarding records
    // In a real implementation, you might want to filter by a status field
    const totalOffboarded = offboardingData.length;
    
    // Count recent offboardings (within the selected time period)
    const recentOffboardings = offboardingData.filter(emp => {
      const endDate = emp.endDate ? new Date(emp.endDate) : null;
      return endDate && endDate >= startDate;
    }).length;

    // Group by reason for leaving
    const reasonsMap = {};
    offboardingData.forEach(emp => {
      if (emp.reason) {
        reasonsMap[emp.reason] = (reasonsMap[emp.reason] || 0) + 1;
      } else {
        reasonsMap["Not Specified"] = (reasonsMap["Not Specified"] || 0) + 1;
      }
    });

    // Convert to array format for charts
    const reasonsData = Object.keys(reasonsMap).map(reason => ({
      name: reason,
      value: reasonsMap[reason]
    }));

    // Group by department
    const departmentMap = {};
    offboardingData.forEach(emp => {
      if (emp.department) {
        departmentMap[emp.department] = (departmentMap[emp.department] || 0) + 1;
      } else {
        departmentMap["Not Specified"] = (departmentMap["Not Specified"] || 0) + 1;
      }
    });

    // Convert to array format for charts
    const departmentData = Object.keys(departmentMap).map(dept => ({
      name: dept,
      value: departmentMap[dept]
    }));

    return {
      totalOffboarded,
      recentOffboardings,
      reasonsData,
      departmentData
    };
  };

  // Set demo data for development/testing
  const setDemoData = (startDate) => {
    // Demo offboarding data
    const demoOffboardingData = [
      {
        _id: "off1",
        employeeName: "John Smith",
        employeeId: "EMP001",
        department: "IT",
        position: "Software Engineer",
        stage: "Clearance Process",
        startDate: new Date(startDate).setDate(startDate.getDate() - 60),
        endDate: new Date(startDate).setDate(startDate.getDate() - 30),
        reason: "Better Opportunity",
      },
      {
        _id: "off2",
        employeeName: "Sarah Johnson",
        employeeId: "EMP015",
        department: "Marketing",
        position: "Marketing Manager",
        stage: "Clearance Process",
        startDate: new Date(startDate).setDate(startDate.getDate() - 45),
        endDate: new Date(startDate).setDate(startDate.getDate() - 15),
        reason: "Relocation",
      },
      {
        _id: "off3",
        employeeName: "Michael Brown",
        employeeId: "EMP023",
        department: "Finance",
        position: "Financial Analyst",
        stage: "Clearance Process",
        startDate: new Date(startDate).setDate(startDate.getDate() - 30),
        endDate: new Date(startDate).setDate(startDate.getDate() - 1),
        reason: "Work-Life Balance",
      },
      {
        _id: "off4",
        employeeName: "Emily Davis",
        employeeId: "EMP042",
        department: "HR",
        position: "HR Specialist",
        stage: "Work Handover",
        startDate: new Date(startDate).setDate(startDate.getDate() - 20),
        endDate: new Date(startDate).setDate(startDate.getDate() + 10),
        reason: "Career Change",
      },
    ];

    // Process demo offboarding data
    const offboardingStats = processOffboardingData(demoOffboardingData, startDate);

    setReportData({
      stats: {
        totalOnboarded: 156,
        totalOffboarded: offboardingStats.totalOffboarded,
        averageOnboardingTime: 14,
        completionRate: 92,
        recentOffboardings: offboardingStats.recentOffboardings,
      },
      trendData: [
        { month: "Jan", onboarded: 30, offboarded: 10 },
        { month: "Feb", onboarded: 25, offboarded: 8 },
        { month: "Mar", onboarded: 35, offboarded: 12 },
        { month: "Apr", onboarded: 28, offboarded: 15 },
        { month: "May", onboarded: 32, offboarded: 9 },
        { month: "Jun", onboarded: 40, offboarded: 7 },
      ],
      departmentData: [
        { name: "IT", value: 40 },
        { name: "HR", value: 25 },
        { name: "Finance", value: 20 },
        { name: "Marketing", value: 15 },
        { name: "Operations", value: 30 },
      ],
      employeeData: [
        {
          key: "1",
          empId: "EMP001",
          name: "John Doe",
          department: "IT",
          designation: "Software Engineer",
          status: "Active",
          progress: 100,
          email: "john.doe@example.com",
          joiningDate: "2023-01-15",
          avatar: "https://xsgames.co/randomusers/avatar.php?g=male",
        },
        {
          key: "2",
          empId: "EMP002",
          name: "Jane Smith",
          department: "HR",
          designation: "HR Manager",
          status: "Active",
          progress: 85,
          email: "jane.smith@example.com",
          joiningDate: "2023-02-20",
          avatar: "https://xsgames.co/randomusers/avatar.php?g=female",
        },
        {
          key: "3",
          empId: "EMP003",
          name: "Mike Johnson",
          department: "Finance",
          designation: "Financial Analyst",
          status: "Inactive",
          progress: 90,
          email: "mike.johnson@example.com",
          joiningDate: "2022-11-05",
          avatar: "https://xsgames.co/randomusers/avatar.php?g=male",
        },
      ],
      offboardingData: demoOffboardingData,
      offboardingReasons: offboardingStats.reasonsData,
      offboardingByDepartment: offboardingStats.departmentData,
    });
  };

  // useEffect(() => {
  //   fetchReportData(timePeriod);
  // }, [timePeriod]);

  useEffect(() => {
  // // Check if user is authenticated
  // const token = getAuthToken();
  // if (!token) {
  //   message.error("Authentication required. Please log in again.");
  //   // You might want to redirect to login page here
  //   return;
  // }
  
  fetchReportData(timePeriod);
}, [timePeriod]);

const handleRefresh = () => {
  // const token = getAuthToken();
  // if (!token) {
  //   message.error("Authentication required. Please log in again.");
  //   return;
  // }
  
  fetchReportData(timePeriod);
  message.success("Report data refreshed");
};



  // const handleRefresh = () => {
  //   fetchReportData(timePeriod);
  //   message.success("Report data refreshed");
  // };
  
  // Export data to Excel
  const handleExport = () => {
    try {
      // Get filtered data
      const filteredData = getFilteredEmployeeData();
      const filteredOffboardingData = getFilteredOffboardingData();

      // Create a new workbook
      const workbook = XLSX.utils.book_new();

      // Create worksheets for different data

      // 1. Employee Data worksheet
      const employeeWorksheetData = filteredData.map((emp) => ({
        "Employee ID": emp.empId,
        Name: emp.name,
        Department: emp.department,
        Designation: emp.designation,
        Status: emp.status,
        Progress: `${emp.progress}%`,
        Email: emp.email || "N/A",
        "Joining Date": emp.joiningDate || "N/A",
      }));

      const employeeWorksheet = XLSX.utils.json_to_sheet(employeeWorksheetData);
      XLSX.utils.book_append_sheet(workbook, employeeWorksheet, "Employees");

      // 2. Offboarding Data worksheet
      const offboardingWorksheetData = filteredOffboardingData.map((emp) => ({
        "Employee ID": emp.employeeId,
        Name: emp.employeeName,
        Department: emp.department,
        Position: emp.position,
        "Notice Period Start": new Date(emp.startDate).toLocaleDateString(),
        "Notice Period End": new Date(emp.endDate).toLocaleDateString(),
        "Reason for Leaving": emp.reason || "Not Specified",
        Stage: emp.stage,
      }));

      const offboardingWorksheet = XLSX.utils.json_to_sheet(offboardingWorksheetData);
      XLSX.utils.book_append_sheet(workbook, offboardingWorksheet, "Offboarded Employees");

      // 3. Department Distribution worksheet
      const departmentWorksheetData = reportData.departmentData.map((dept) => ({
        Department: dept.name,
        "Number of Employees": dept.value,
      }));

      const departmentWorksheet = XLSX.utils.json_to_sheet(
        departmentWorksheetData
      );
      XLSX.utils.book_append_sheet(
        workbook,
        departmentWorksheet,
        "Departments"
      );

      // 4. Offboarding Reasons worksheet
      const reasonsWorksheetData = reportData.offboardingReasons.map((reason) => ({
        "Reason for Leaving": reason.name,
        "Number of Employees": reason.value,
      }));

      const reasonsWorksheet = XLSX.utils.json_to_sheet(reasonsWorksheetData);
      XLSX.utils.book_append_sheet(workbook, reasonsWorksheet, "Offboarding Reasons");

      // 5. Monthly Trends worksheet
      const trendWorksheetData = reportData.trendData.map((trend) => ({
        Month: trend.month,
        Onboarded: trend.onboarded,
        Offboarded: trend.offboarded,
      }));

      const trendWorksheet = XLSX.utils.json_to_sheet(trendWorksheetData);
      XLSX.utils.book_append_sheet(workbook, trendWorksheet, "Monthly Trends");

      // 6. Summary worksheet
      const summaryWorksheetData = [
        {
          Metric: "Total Onboarded Employees",
          Value: reportData.stats.totalOnboarded,
        },
        {
          Metric: "Total Offboarded Employees",
          Value: reportData.stats.totalOffboarded,
        },
        {
          Metric: "Average Onboarding Time (days)",
          Value: reportData.stats.averageOnboardingTime,
        },
        {
          Metric: "Completion Rate (%)",
          Value: reportData.stats.completionRate,
        },
        {
          Metric: "Recent Offboardings",
          Value: reportData.stats.recentOffboardings || 0,
        },
      ];

      const summaryWorksheet = XLSX.utils.json_to_sheet(summaryWorksheetData);
      XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "Summary");

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Save the file
      FileSaver.saveAs(data, `Employee_Report_${new Date().toISOString().split("T")[0]}.xlsx`);
      message.success("Report exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      message.error("Failed to export report");
    }
  };

  // Filter employee data based on selected filters
  const getFilteredEmployeeData = () => {
    let filteredData = [...reportData.employeeData];

    // Filter by department
    if (filterDepartment.length > 0) {
      filteredData = filteredData.filter((emp) =>
        filterDepartment.includes(emp.department)
      );
    }

    // Filter by status
    if (filterStatus !== "all") {
      filteredData = filteredData.filter(
        (emp) => emp.status.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    // Filter by date range
    if (startDate || endDate) {
      filteredData = filteredData.filter((emp) => {
        const joiningDate = new Date(emp.joiningDate);
        const start = startDate ? startDate.startOf("day").valueOf() : 0;
        const end = endDate ? endDate.endOf("day").valueOf() : Date.now();
        const empDate = joiningDate.getTime();
        return empDate >= start && empDate <= end;
      });
    }

    return filteredData;
  };

  // Filter offboarding data based on selected filters
  const getFilteredOffboardingData = () => {
    let filteredData = [...(reportData.offboardingData || [])];

    // Filter by department
    if (filterDepartment.length > 0) {
      filteredData = filteredData.filter((emp) =>
        filterDepartment.includes(emp.department)
      );
    }

    // Filter by date range
    if (startDate || endDate) {
      filteredData = filteredData.filter((emp) => {
        const offboardDate = new Date(emp.endDate);
        const start = startDate ? startDate.startOf("day").valueOf() : 0;
        const end = endDate ? endDate.endOf("day").valueOf() : Date.now();
        const empDate = offboardDate.getTime();
        return empDate >= start && empDate <= end;
      });
    }

    return filteredData;
  };

  // Get all unique departments from employee and offboarding data
  const getAllDepartments = () => {
    const departments = new Set();
    
    // Add departments from employee data
    reportData.employeeData.forEach(emp => {
      if (emp.department) departments.add(emp.department);
    });
    
    // Add departments from offboarding data
    (reportData.offboardingData || []).forEach(emp => {
      if (emp.department) departments.add(emp.department);
    });
    
    return Array.from(departments).sort();
  };


  // Columns for employee table
  const employeeColumns = [
    {
      title: "Employee ID",
      dataIndex: "empId",
      key: "empId",
      sorter: (a, b) => a.empId.localeCompare(b.empId),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="er-employee-name">
          {record.avatar ? (
            <img
              src={record.avatar}
              alt={text}
              className="er-employee-avatar"
              onError={(e) => {
                // If image fails to load, replace with initials
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="er-employee-initials"
            style={{
              display: record.avatar ? 'none' : 'flex',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: `hsl(${text.length * 30}, 70%, 50%)`,
              color: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              marginRight: '8px',
              fontSize: '14px'
            }}
          >
            {getInitials(text)}
          </div>
          <span>{text}</span>
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      sorter: (a, b) => a.department.localeCompare(b.department),
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
      sorter: (a, b) => a.designation.localeCompare(b.designation),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Badge
          status={status === "Active" ? "success" : "error"}
          text={status}
        />
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      render: (progress) => (
        <Progress
          percent={progress}
          size="small"
          status={progress === 100 ? "success" : "active"}
        />
      ),
      sorter: (a, b) => a.progress - b.progress,
    },
    {
      title: "Joining Date",
      dataIndex: "joiningDate",
      key: "joiningDate",
      sorter: (a, b) => new Date(a.joiningDate) - new Date(b.joiningDate),
    },
  ];

  // Columns for offboarding table
  const offboardingColumns = [
    {
      title: "Employee ID",
      dataIndex: "employeeId",
      key: "employeeId",
      sorter: (a, b) => (a.employeeId || '').localeCompare(b.employeeId || ''),
    },
    {
      title: "Name",
      dataIndex: "employeeName",
      key: "employeeName",
      render: (text, record) => (
        <div className="er-employee-name">
          {record.avatar ? (
            <img
              src={record.avatar}
              alt={text}
              className="er-employee-avatar"
              onError={(e) => {
                // If image fails to load, replace with initials
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="er-employee-initials"
            style={{
              display: record.avatar ? 'none' : 'flex',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: `hsl(${text.length * 30}, 70%, 50%)`,
              color: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              marginRight: '8px',
              fontSize: '14px'
            }}
          >
            {getInitials(text)}
          </div>
          <span>{text}</span>
        </div>
      ),
      sorter: (a, b) => a.employeeName.localeCompare(b.employeeName),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      sorter: (a, b) => (a.department || '').localeCompare(b.department || ''),
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      sorter: (a, b) => (a.position || '').localeCompare(b.position || ''),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      render: (reason) => (
        <span className={`er-reason-tag er-reason-${reason?.toLowerCase().replace(/\s+/g, '-') || 'other'}`}>
          {reason || "Not Specified"}
        </span>
      ),
      sorter: (a, b) => (a.reason || '').localeCompare(b.reason || ''),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
    },
    {
      title: "Stage",
      dataIndex: "stage",
      key: "stage",
      render: (stage) => (
        <Badge
          status={stage === "Clearance Process" ? "success" : "processing"}
          text={stage}
        />
      ),
      sorter: (a, b) => a.stage.localeCompare(b.stage),
    },
  ];

  return (
    <div className="er-container">
      <div className="er-header">
        <h1 className="er-header-title">Employee Analytics Dashboard</h1>
        <div className="er-action-buttons">
          <Space>
            <Select
              value={timePeriod}
              onChange={setTimePeriod}
              style={{ width: 120 }}
            >
              <Option value="1m">Last Month</Option>
              <Option value="3m">Last 3 Months</Option>
              <Option value="6m">Last 6 Months</Option>
              <Option value="1y">Last Year</Option>
            </Select>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
            >
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleExport}
            >
              Export Report
            </Button>
          </Space>
        </div>
      </div>

      <Row gutter={[16, 16]} className="er-stats-row">
        <Col xs={24} sm={12} md={6} className="er-stat-col">
          <Card className="er-stat-card er-stat-onboarded">
            <Statistic
              title="Total Onboarded"
              value={reportData.stats.totalOnboarded}
              prefix={<UserAddOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} className="er-stat-col">
          <Card className="er-stat-card er-stat-offboarded">
            <Statistic
              title="Total Offboarded"
              value={reportData.stats.totalOffboarded || 0}
              prefix={<UserDeleteOutlined />}
              loading={loading}
            />
            {reportData.stats.recentOffboardings > 0 && (
              <div className="er-recent-stat">
                +{reportData.stats.recentOffboardings} in selected period
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} className="er-stat-col">
          <Card className="er-stat-card er-stat-avg-time">
            <Statistic
              title="Avg. Onboarding Time"
              value={reportData.stats.averageOnboardingTime}
              suffix="days"
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} className="er-stat-col">
          <Card className="er-stat-card er-stat-completion">
            <Statistic
              title="Completion Rate"
              value={reportData.stats.completionRate}
              suffix="%"
              loading={loading}
            />
            <Progress
              percent={reportData.stats.completionRate}
              showInfo={false}
              status="active"
              strokeColor={{
                "0%": "#108ee9",
                "100%": "#87d068",
              }}
            />
          </Card>
        </Col>
      </Row>

      <Tabs activeKey={activeTab} onChange={setActiveTab} className="er-tabs">
        <TabPane tab="Overview" key="1">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16} className="er-chart-col">
              <Card
                title="Employee Trends"
                className="er-chart-card"
                loading={loading}
              >
                <div className="er-chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={reportData.trendData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="onboarded"
                        stroke="#1890ff"
                        activeDot={{ r: 8 }}
                        name="Onboarded"
                      />
                      <Line
                        type="monotone"
                        dataKey="offboarded"
                        stroke="#ff4d4f"
                        name="Offboarded"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={8} className="er-chart-col">
              <Card
                title="Department Distribution"
                className="er-chart-card"
                loading={loading}
              >
                <div className="er-chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={reportData.departmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {reportData.departmentData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} employees`, ""]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
            <Col xs={24} lg={12} className="er-chart-col">
              <Card
                title="Offboarding Reasons"
                className="er-chart-card"
                loading={loading}
              >
                <div className="er-offboarding-chart-container">
                  {reportData.offboardingReasons && reportData.offboardingReasons.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={reportData.offboardingReasons}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" name="Employees" fill="#ff4d4f">
                          {reportData.offboardingReasons.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="er-empty-state">
                      <InboxOutlined className="er-empty-icon" />
                      <p>No offboarding data available</p>
                    </div>
                  )}
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={12} className="er-chart-col">
              <Card
                title="Offboarding by Department"
                className="er-chart-card"
                loading={loading}
              >
                <div className="er-offboarding-chart-container">
                  {reportData.offboardingByDepartment && reportData.offboardingByDepartment.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={reportData.offboardingByDepartment}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {reportData.offboardingByDepartment.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} employees`, ""]} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="er-empty-state">
                      <InboxOutlined className="er-empty-icon" />
                      <p>No offboarding data available</p>
                    </div>
                  )}
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>


        

        <TabPane tab="Employee Data" key="2">
          <Card className="er-table-card">
            <div className="er-table-filters">
              <Space wrap>
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Filter by Department"
                  style={{ minWidth: 200 }}
                  value={filterDepartment}
                  onChange={setFilterDepartment}
                >
                  {getAllDepartments().map((dept) => (
                    <Option key={dept} value={dept}>
                      {dept}
                    </Option>
                  ))}
                </Select>
                <Select
                  allowClear
                  placeholder="Filter by Status"
                  style={{ minWidth: 150 }}
                  value={filterStatus}
                  onChange={setFilterStatus}
                >
                  <Option value="all">All Statuses</Option>
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                </Select>
                <div className="er-date-filters">
                  <DatePicker
                    placeholder="Start Date"
                    value={startDate}
                    onChange={setStartDate}
                    style={{ width: 140 }}
                    format="YYYY-MM-DD"
                  />
                  <DatePicker
                    placeholder="End Date"
                    value={endDate}
                    onChange={setEndDate}
                    style={{ width: 140 }}
                    format="YYYY-MM-DD"
                    disabledDate={(current) => startDate && current && current < startDate}
                  />
                </div>
                <Button
                  icon={<FilterOutlined />}
                  onClick={() => {
                    setFilterDepartment([]);
                    setFilterStatus("all");
                    setStartDate(null);
                    setEndDate(null);
                  }}
                >
                  Clear Filters
                </Button>
              </Space>
            </div>

            <Table
              columns={employeeColumns}
              dataSource={getFilteredEmployeeData()}
              rowKey="key"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

       <TabPane tab="Offboarding Data" key="3">
  <Card className="er-table-card">
    <div className="er-table-filters">
      <Space wrap>
        <Select
          mode="multiple"
          allowClear
          placeholder="Filter by Department"
          style={{ minWidth: 200 }}
          value={filterDepartment}
          onChange={setFilterDepartment}
        >
          {getAllDepartments().map((dept) => (
            <Option key={dept} value={dept}>
              {dept}
            </Option>
          ))}
        </Select>
        
        <div className="er-date-filters">
          <DatePicker
            placeholder="Start Date"
            value={startDate}
            onChange={setStartDate}
            style={{ width: 140 }}
            format="YYYY-MM-DD"
          />
          <DatePicker
            placeholder="End Date"
            value={endDate}
            onChange={setEndDate}
            style={{ width: 140 }}
            format="YYYY-MM-DD"
            disabledDate={(current) => startDate && current && current < startDate}
          />
        </div>

        <Button
          icon={<FilterOutlined />}
          onClick={() => {
            setFilterDepartment([]);
            setStartDate(null);
            setEndDate(null);
          }}
        >
          Clear Filters
        </Button>
      </Space>
    </div>
    {reportData.offboardingData && reportData.offboardingData.length > 0 ? (
      <Table
        columns={offboardingColumns}
        dataSource={getFilteredOffboardingData()}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    ) : (
      <div className="er-empty-state">
        <InboxOutlined className="er-empty-icon" />
        <p>No offboarding data available</p>
      </div>
    )}
  </Card>
</TabPane>

      </Tabs>

    </div>
  );
};

export default EmployeeReport;


                    

