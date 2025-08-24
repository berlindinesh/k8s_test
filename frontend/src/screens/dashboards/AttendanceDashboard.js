import React, { useState, useEffect } from "react";
import api from "../../api/axiosInstance";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUserCheck,
  faUserClock,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import "./AttendanceDashboard.css";

function AttendanceDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [attendanceStats, setAttendanceStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    lateToday: 0,
    onLeave: 0,
    attendanceRate: 0,
    averageWorkHours: 0,
    recentAttendance: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);

  // Updated API URLs to match the ones used in AttendanceRecords.js and TimeOffRequests.js
  const TIMESHEET_API_URL = "/timesheet";
  const TIME_OFF_API_URL = "/time-off-requests";
  const EMPLOYEES_API_URL = "/employees/registered";

  useEffect(() => {
    fetchDashboardData();
  }, []);
const fetchDashboardData = async () => {
  try {
    setLoading(true);

    // Fetch all employees
    const employeesResponse = await api.get(EMPLOYEES_API_URL);
    const employeeData = employeesResponse.data;
    setEmployees(employeeData);
    
    // Fetch all timesheet records with better error handling
    let timesheetData = [];
    try {
      // Try the /all endpoint first
      const timesheetResponse = await api.get(`${TIMESHEET_API_URL}/all`);
      timesheetData = timesheetResponse.data;
    } catch (error) {
      console.log("Error fetching from /all endpoint, trying alternative endpoint");
      try {
        // If /all endpoint fails, try the base endpoint
        const timesheetResponse = await api.get(TIMESHEET_API_URL);
        timesheetData = timesheetResponse.data;
      } catch (fallbackError) {
        console.error("Failed to fetch timesheet data:", fallbackError);
        // Continue with empty timesheet data
      }
    }
    
    // Fetch time-off requests
    let timeOffData = [];
    try {
      const timeOffResponse = await api.get(TIME_OFF_API_URL);
      timeOffData = timeOffResponse.data;
    } catch (error) {
      console.error("Failed to fetch time-off data:", error);
      // Continue with empty time-off data
    }
    
    // Calculate statistics based on the fetched data
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    
    // Process the data to calculate dashboard statistics
    const totalEmployees = employeeData.length;
    
    // Calculate present, late, and on leave counts
    // This is a simplified example - adjust according to your data structure
    const presentToday = timesheetData.filter(record => 
      record.date === today && record.status === 'Present').length;
    
    const lateToday = timesheetData.filter(record => 
      record.date === today && record.status === 'Late').length;
    
    const onLeave = timeOffData.filter(request => 
      request.status === 'Approved' && 
      new Date(request.startDate) <= new Date(today) && 
      new Date(request.endDate) >= new Date(today)).length;
    
    // Calculate attendance rate
    const attendanceRate = totalEmployees > 0 
      ? Math.round((presentToday / totalEmployees) * 100) 
      : 0;
    
    // Calculate average work hours (simplified)
    const todayRecords = timesheetData.filter(record => record.date === today);
    const totalHours = todayRecords.reduce((sum, record) => {
      return sum + (record.hoursWorked || 0);
    }, 0);
    const averageWorkHours = todayRecords.length > 0 
      ? (totalHours / todayRecords.length).toFixed(1) 
      : '0.0';
    
    // Get recent attendance records (last 5)
    const recentAttendance = timesheetData
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map(record => ({
        id: record.id || record._id,
        name: record.employeeName || 'Unknown',
        empId: record.employeeId || 'N/A',
        date: record.date || 'N/A',
        time: record.time || 'N/A',
        status: record.status || 'Unknown',
        workType: record.workType || '-',
        shift: record.shift || '-'
      }));
    
    // Update state with calculated statistics
    setAttendanceStats({
      totalEmployees,
      presentToday,
      lateToday,
      onLeave,
      attendanceRate,
      averageWorkHours,
      recentAttendance
    });
    
    setLoading(false);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    setError("Failed to load attendance data. Please try again later.");
    setLoading(false);
  }
};



  const renderMobileAttendanceCards = () => {
    if (attendanceStats.recentAttendance.length === 0) {
      return (
        <div className="text-center p-3">
          No recent attendance records found
        </div>
      );
    }

    return attendanceStats.recentAttendance.map((record) => (
      <div key={record.id} className="mobile-attendance-card">
        <div className="mobile-card-header">
          <div className="mobile-card-name">{record.name}</div>
          <span
            className={`status-badge status-${record.status
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            {record.status}
          </span>
        </div>
        <div className="mobile-card-details">
          <div className="mobile-card-row">
            <span className="mobile-card-label">ID:</span>
            <span className="mobile-card-value">{record.empId}</span>
          </div>
          <div className="mobile-card-row">
            <span className="mobile-card-label">Date:</span>
            <span className="mobile-card-value">{record.date}</span>
          </div>
          <div className="mobile-card-row">
            <span className="mobile-card-label">Time:</span>
            <span className="mobile-card-value">{record.time}</span>
          </div>
          {record.shift && record.shift !== "-" && (
            <div className="mobile-card-row">
              <span className="mobile-card-label">Shift:</span>
              <span className="mobile-card-value">{record.shift}</span>
            </div>
          )}
          {record.workType && record.workType !== "-" && (
            <div className="mobile-card-row">
              <span className="mobile-card-label">Work Type:</span>
              <span className="mobile-card-value">{record.workType}</span>
            </div>
          )}
        </div>
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="dashboard-wrapper">
        <Container fluid className="attendance-dashboard-content">
          <h2 className="page-title">Attendance Dashboard</h2>
          <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading attendance data...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-wrapper">
        <Container fluid className="attendance-dashboard-content">
          <h2 className="page-title">Attendance Dashboard</h2>
          <div className="alert alert-danger mt-4" role="alert">
            {error}
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <Container fluid className="attendance-dashboard-content">
        <h2 className="page-title">Attendance Dashboard</h2>

        <Row className="stats-cards-att">
          <Col lg={3} md={6} sm={6} xs={12}>
            <Card className="stat-card improved-card">
              <Card.Body>
                <div className="stat-icon-container">
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="stat-icon-improved"
                  />
                </div>
                <div className="stat-content-improved">
                  <h2 className="stat-number">
                    {attendanceStats.totalEmployees}
                  </h2>
                  <p className="total-employees-label">Total Employees</p>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6} sm={6} xs={12}>
            <Card className="stat-card improved-card present-card">
              <Card.Body>
                <div className="stat-icon-container">
                  <FontAwesomeIcon
                    icon={faUserCheck}
                    className="stat-icon-improved"
                  />
                </div>
                <div className="stat-content-improved">
                  <h2 className="stat-number">
                    {attendanceStats.presentToday}
                  </h2>
                  <p className="stat-label">Present Today</p>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6} sm={6} xs={12}>
            <Card className="stat-card improved-card late-card">
              <Card.Body>
              <div className="stat-icon-container">
                  <FontAwesomeIcon
                    icon={faUserClock}
                    className="stat-icon-improved"
                  />
                </div>
                <div className="stat-content-improved">
                  <h2 className="stat-number">{attendanceStats.lateToday}</h2>
                  <p className="stat-label">Late Today</p>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6} sm={6} xs={12}>
            <Card className="stat-card improved-card leave-card">
              <Card.Body>
                <div className="stat-icon-container">
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="stat-icon-improved"
                  />
                </div>
                <div className="stat-content-improved">
                  <h2 className="stat-number">{attendanceStats.onLeave}</h2>
                  <p className="stat-label">On Leave</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col lg={6} md={12} sm={12} xs={12}>
            <Card className="dashboard-card">
              <Card.Header className="card-header-improved">
                <h5 className="mb-0">Attendance Rate</h5>
              </Card.Header>
              <Card.Body>
                <div className="attendance-rate-container">
                  <div className="attendance-rate-circle">
                    <div className="attendance-rate-inner">
                      <h2 className="attendance-rate-number">
                        {attendanceStats.attendanceRate}%
                      </h2>
                    </div>
                  </div>
                  <div className="attendance-rate-details">
                    <div className="attendance-detail">
                      <span className="detail-label">Present:</span>
                      <span className="detail-value">
                        {attendanceStats.presentToday}
                      </span>
                    </div>
                    <div className="attendance-detail">
                      <span className="detail-label">Total:</span>
                      <span className="detail-value">
                        {attendanceStats.totalEmployees}
                      </span>
                    </div>
                    <div className="attendance-detail">
                      <span className="detail-label">On Leave:</span>
                      <span className="detail-value">
                        {attendanceStats.onLeave}
                      </span>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6} md={12} sm={12} xs={12}>
            <Card className="dashboard-card">
              <Card.Header className="card-header-improved">
                <h5 className="mb-0">Working Hours</h5>
              </Card.Header>
              <Card.Body>
                <div className="working-hours-container">
                  <div className="working-hours-circle">
                    <div className="working-hours-inner">
                      <h2 className="working-hours-number">
                        {attendanceStats.averageWorkHours}
                      </h2>
                      <p className="hours-label">hours</p>
                    </div>
                  </div>
                  <div className="working-hours-details">
                    <p className="working-hours-description">
                      Average working hours per employee
                    </p>
                    <div className="working-hours-stats">
                      <div className="hours-stat">
                        <span className="hours-stat-label">Target:</span>
                        <span className="hours-stat-value">8.0 hours</span>
                      </div>
                      <div className="hours-stat">
                        <span className="hours-stat-label">Variance:</span>
                        <span
                          className={`hours-stat-value ${
                            parseFloat(attendanceStats.averageWorkHours) >= 8
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          {(
                            parseFloat(attendanceStats.averageWorkHours) - 8
                          ).toFixed(1)}{" "}
                          hours
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col xs={12}>
            <Card className="dashboard-card">
              <Card.Header className="card-header-improved">
                <h5 className="mb-0">Recent Attendance</h5>
              </Card.Header>
              <Card.Body>
                {isMobile ? (
                  <div className="mobile-attendance-list">
                    {renderMobileAttendanceCards()}
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover attendance-table">
                      <thead>
                        <tr>
                          <th>Employee</th>
                          <th>ID</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Status</th>
                          {isDesktop && <th>Work Type</th>}
                          {isDesktop && <th>Shift</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceStats.recentAttendance.length > 0 ? (
                          attendanceStats.recentAttendance.map((record) => (
                            <tr key={record.id}>
                              <td>{record.name}</td>
                              <td>{record.empId}</td>
                              <td>{record.date}</td>
                              <td>{record.time}</td>
                              <td>
                                <span
                                  className={`status-badge status-${record.status
                                    .toLowerCase()
                                    .replace(/\s+/g, "-")}`}
                                >
                                  {record.status}
                                </span>
                              </td>
                              {isDesktop && <td>{record.workType}</td>}
                              {isDesktop && <td>{record.shift}</td>}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={isDesktop ? 7 : 5} className="text-center">
                              No recent attendance records found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AttendanceDashboard;

