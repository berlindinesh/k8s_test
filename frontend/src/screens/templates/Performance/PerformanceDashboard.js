import React, { useState, useEffect } from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Alert,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Dashboard,
  Assessment,
  Refresh,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Error,
  HourglassFull,
  Archive,
  Person,
  Group,
  Comment,
  Info
} from '@mui/icons-material';
// import axios from 'axios';
import api from '../../../api/axiosInstance';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title } from 'chart.js';
import './PerformanceDashboard.css';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  ChartTooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement,
  Title
);

const PerformanceDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    objectives: [],
    feedback: {
      selfFeedback: [],
      requestedFeedback: [],
      feedbackToReview: [],
      anonymousFeedback: []
    },
    stats: {
      totalObjectives: 0,
      totalKeyResults: 0,
      totalFeedback: 0,
      objectivesAtRisk: 0
    }
  });
  const [timeRange, setTimeRange] = useState('month');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);



//   const getAuthToken = () => {
//   return localStorage.getItem('token');
// };


const fetchDashboardData = async () => {
  setLoading(true);
  setError(null);
  try {
    // Fetch objectives data with auth token
    const objectivesResponse = await api.get('/objectives'

  );
    
    // Fetch feedback data with auth token
    const feedbackResponse = await api.get('/feedback'

  );
    
    // Process objectives data
    const objectives = objectivesResponse.data;
    
    // Process feedback data
    const feedback = feedbackResponse.data;
    
    // Calculate total key results from objectives
    const totalKeyResults = objectives.reduce((sum, obj) => sum + (parseInt(obj.keyResults) || 0), 0);
    
    // Calculate objectives at risk
    const objectivesAtRisk = objectives.filter(obj => 
      obj.description && obj.description.toLowerCase().includes('risk')
    ).length;
    
    // Calculate total feedback across all categories
    const totalFeedback = 
      (feedback.selfFeedback?.length || 0) + 
      (feedback.requestedFeedback?.length || 0) + 
      (feedback.feedbackToReview?.length || 0) + 
      (feedback.anonymousFeedback?.length || 0);
    
    setDashboardData({
      objectives,
      feedback,
      stats: {
        totalObjectives: objectives.length,
        totalKeyResults,
        totalFeedback,
        objectivesAtRisk
      }
    });
    
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    setError("Failed to load dashboard data. Please try again later.");
  } finally {
    setLoading(false);
  }
};

// Update the handleRefresh function
const handleRefresh = () => {
  fetchDashboardData();
};



  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Calculate objective status counts based on actual data structure
  const getObjectiveStatusData = () => {
    const { objectives } = dashboardData;
    
    // Using the actual properties from your objectives data
    const onTrack = objectives.filter(obj => !obj.archived && obj.objectiveType === 'all').length;
    const atRisk = dashboardData.stats.objectivesAtRisk;
    const notStarted = objectives.filter(obj => !obj.archived && obj.objectiveType === 'self').length;
    const closed = objectives.filter(obj => obj.archived).length;
    
    return {
      labels: ['On Track', 'At Risk', 'Not Started', 'Closed'],
      datasets: [
        {
          label: 'Objective Status',
          data: [onTrack, atRisk, notStarted, closed],
          backgroundColor: ['#4CAF50', '#FF5252', '#FFC107', '#9E9E9E'],
          borderColor: ['#388E3C', '#D32F2F', '#FFA000', '#616161'],
          borderWidth: 1,
          hoverOffset: 4,
        },
      ],
    };
  };

  // Calculate feedback status counts based on actual data structure
  const getFeedbackStatusData = () => {
    const { feedback } = dashboardData;
    
    // Combine all feedback categories
    const allFeedback = [
      ...(feedback.selfFeedback || []),
      ...(feedback.requestedFeedback || []),
      ...(feedback.feedbackToReview || []),
      ...(feedback.anonymousFeedback || [])
    ];
    
    // Count by status
    const completed = allFeedback.filter(f => f.status === 'Completed').length;
    const inProgress = allFeedback.filter(f => f.status === 'In Progress').length;
    const notStarted = allFeedback.filter(f => f.status === 'Not Started').length;
    const pending = allFeedback.filter(f => f.status === 'Pending').length;
    
    return {
      labels: ['Completed', 'In Progress', 'Not Started', 'Pending'],
      datasets: [
        {
          label: 'Feedback Status',
          data: [completed, inProgress, notStarted, pending],
          backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#9E9E9E'],
          borderColor: ['#388E3C', '#1976D2', '#FFA000', '#616161'],
          borderWidth: 1,
          hoverOffset: 4,
        },
      ],
    };
  };

  // Calculate key results data based on actual data structure
  const getKeyResultsData = () => {
    const { objectives } = dashboardData;
    
    // Group objectives by key results count
    const keyResultsCount = {};
    objectives.forEach(obj => {
      const count = parseInt(obj.keyResults) || 0;
      keyResultsCount[count] = (keyResultsCount[count] || 0) + 1;
    });
    
    const labels = Object.keys(keyResultsCount).sort((a, b) => parseInt(a) - parseInt(b));
    const data = labels.map(key => keyResultsCount[key]);
    
    return {
      labels,
      datasets: [
        {
          label: 'Objectives by Key Results Count',
          data,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Calculate objective and feedback trends over time
  const getObjectiveTrendData = () => {
    const { objectives, feedback } = dashboardData;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    // Get last 6 months
    const labels = [];
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      labels.push(months[monthIndex]);
    }
    
    // Calculate objective creation trend
    // This would ideally use createdAt dates from your actual data
    // For now, we'll distribute the objectives across the last 6 months
    const objectiveData = Array(6).fill(0);
    objectives.forEach((obj, index) => {
      const monthIndex = index % 6;
      objectiveData[monthIndex]++;
    });
    
    // Calculate feedback creation trend
    // Similarly, distribute feedback across the last 6 months
    const allFeedback = [
      ...(feedback.selfFeedback || []),
      ...(feedback.requestedFeedback || []),
      ...(feedback.feedbackToReview || []),
      ...(feedback.anonymousFeedback || [])
    ];
    
    const feedbackData = Array(6).fill(0);
    allFeedback.forEach((fb, index) => {
      const monthIndex = index % 6;
      feedbackData[monthIndex]++;
    });
    
    return {
      labels,
      datasets: [
        {
          label: 'Objectives Created',
          data: objectiveData,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Feedback Created',
          data: feedbackData,
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  // Get feedback by type data
  const getFeedbackByTypeData = () => {
    const { feedback } = dashboardData;
    
    const selfCount = feedback.selfFeedback?.length || 0;
    const requestedCount = feedback.requestedFeedback?.length || 0;
    const reviewCount = feedback.feedbackToReview?.length || 0;
    const anonymousCount = feedback.anonymousFeedback?.length || 0;
    
    return {
      labels: ['Self Feedback', 'Requested Feedback', 'Feedback to Review', 'Anonymous Feedback'],
      datasets: [
        {
          label: 'Feedback by Type',
          data: [selfCount, requestedCount, reviewCount, anonymousCount],
          backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0'],
          borderColor: ['#388E3C', '#1976D2', '#F57C00', '#7B1FA2'],
          borderWidth: 1,
          hoverOffset: 4,
        },
      ],
    };
  };

  // Options for charts
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    maintainAspectRatio: false,
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Objectives by Key Results Count',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Objectives'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Key Results Count'
        }
      }
    },
    maintainAspectRatio: false,
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Performance Metrics Trend',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count'
        }
      }
    },
    maintainAspectRatio: false,
  };

  // Get all feedback items for display
  const getAllFeedbackItems = () => {
    const { feedback } = dashboardData;
    return [
      ...(feedback.selfFeedback || []),
      ...(feedback.requestedFeedback || []),
      ...(feedback.feedbackToReview || []),
      ...(feedback.anonymousFeedback || [])
    ];
  };

  if (loading && !dashboardData.objectives.length) {
    return (
      <Box className="perf-dashboard-loading">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading dashboard data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="perf-dashboard-error">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          startIcon={<Refresh />}
          onClick={handleRefresh}
          className="perf-button"
        >
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box className="perf-dashboard">
      <Box className="perf-dashboard-header">
        <Box>
          <Typography variant="h4" className="perf-dashboard-title">
            <Dashboard sx={{ mr: 1, verticalAlign: 'middle' }} />
            Performance Dashboard
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Overview of objectives, key results, and feedback
          </Typography>
        </Box>
        
        <Box className="perf-dashboard-controls">
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150, mr: 2 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={handleTimeRangeChange}
              label="Time Range"
            >
              <MenuItem value="week">Last Week</MenuItem>
              <MenuItem value="month">Last Month</MenuItem>
              <MenuItem value="quarter">Last Quarter</MenuItem>
              <MenuItem value="year">Last Year</MenuItem>
            </Select>
          </FormControl>
          
          <Tooltip title="Refresh Data" classes={{ tooltip: "perf-tooltip" }}>
            <IconButton 
              onClick={handleRefresh} 
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : <Refresh />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} className="perf-stats-row">
        <Grid item xs={12} sm={6} md={3}>
          <PerfStatCard 
            title="Total Objectives" 
            count={dashboardData.stats.totalObjectives} 
            icon={<Assessment />}
            color="#1976d2"
            trend={<TrendingUp className="perf-trend-up" />}
            trendText={`${dashboardData.stats.totalObjectives} total objectives`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <PerfStatCard 
            title="Total Key Results" 
            count={dashboardData.stats.totalKeyResults} 
            icon={<CheckCircle />}
            color="#2e7d32"
            trend={<TrendingUp className="perf-trend-up" />}
            trendText={`${dashboardData.stats.totalKeyResults} key results tracked`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <PerfStatCard 
            title="Total Feedback" 
            count={dashboardData.stats.totalFeedback} 
            icon={<Comment />}
            color="#ed6c02"
            trend={<TrendingUp className="perf-trend-up" />}
            trendText={`${dashboardData.stats.totalFeedback} feedback items`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <PerfStatCard 
            title="Objectives At-Risk" 
            count={dashboardData.stats.objectivesAtRisk} 
            icon={<Error />}
            color="#d32f2f"
            trend={dashboardData.stats.objectivesAtRisk > 0 ? 
              <TrendingUp className="perf-trend-down" /> : 
              <TrendingDown className="perf-trend-up" />
            }
            trendText={`${dashboardData.stats.objectivesAtRisk} objectives need attention`}
          />
        </Grid>
      </Grid>

      {/* Tabs for different views */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="dashboard tabs"
          variant="scrollable"
          scrollButtons="auto"
          className="perf-tabs-root"
        >
          <Tab label="Overview" icon={<Dashboard />} iconPosition="start" className="perf-tab-root" />
          <Tab label="Objectives" icon={<Assessment />} iconPosition="start" className="perf-tab-root" />
          <Tab label="Feedback" icon={<Comment />} iconPosition="start" className="perf-tab-root" />
          <Tab label="Team Performance" icon={<Group />} iconPosition="start" className="perf-tab-root" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <Box className="perf-tab-content" sx={{ mt: 3 }}>
        {/* Overview Tab */}
        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper className="perf-chart-container">
                <Box className="perf-chart-header">
                  <Typography variant="h6">Objective Status</Typography>
                  <Tooltip title="Status distribution of all objectives" classes={{ tooltip: "perf-tooltip" }}>
                    <IconButton size="small">
                      <Info fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box className="perf-chart-body">
                  <Pie data={getObjectiveStatusData()} options={pieOptions} height={300} />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className="perf-chart-container">
                <Box className="perf-chart-header">
                  <Typography variant="h6">Feedback by Type</Typography>
                  <Tooltip title="Distribution of feedback by category" classes={{ tooltip: "perf-tooltip" }}>
                    <IconButton size="small">
                      <Info fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box className="perf-chart-body">
                  <Pie data={getFeedbackByTypeData()} options={pieOptions} height={300} />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className="perf-chart-container">
                <Box className="perf-chart-header">
                  <Typography variant="h6">Performance Metrics Trend</Typography>
                  <Tooltip title="Trend of objectives and feedback over time" classes={{ tooltip: "perf-tooltip" }}>
                    <IconButton size="small">
                      <Info fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box className="perf-chart-body">
                  <Line data={getObjectiveTrendData()} options={lineOptions} height={300} />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Objectives Tab */}
        {tabValue === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper className="perf-chart-container">
                <Box className="perf-chart-header">
                  <Typography variant="h6">Objectives by Key Results</Typography>
                  <Tooltip title="Distribution of objectives by number of key results" classes={{ tooltip: "perf-tooltip" }}>
                    <IconButton size="small">
                      <Info fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box className="perf-chart-body">
                  <Bar data={getKeyResultsData()} options={barOptions} height={300} />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className="perf-chart-container">
                <Box className="perf-chart-header">
                  <Typography variant="h6">Objective Status</Typography>
                  <Tooltip title="Status distribution of all objectives" classes={{ tooltip: "perf-tooltip" }}>
                    <IconButton size="small">
                      <Info fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box className="perf-chart-body">
                  <Pie data={getObjectiveStatusData()} options={pieOptions} height={300} />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className="perf-data-table-container">
                <Box className="perf-data-table-header">
                  <Typography variant="h6">Recent Objectives</Typography>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => window.location.href = '/Dashboards/objectives'}
                    className="perf-button"
                  >
                    View All
                  </Button>
                </Box>
                <Divider />
                <Box className="perf-data-table-body">
                  {dashboardData.objectives.length === 0 ? (
                    <Typography variant="body2" sx={{ p: 2, textAlign: 'center' }}>
                      No objectives found
                    </Typography>
                  ) : (
                    <Box className="perf-objective-list">
                      {dashboardData.objectives.slice(0, 5).map((objective) => (
                        <Box key={objective._id} className="perf-objective-item">
                          <Box className="perf-objective-item-header">
                            <Typography variant="subtitle1" className="perf-objective-title">
                              {objective.title || 'Untitled Objective'}
                            </Typography>
                            <Chip 
                              label={objective.archived ? 'Archived' : 'Active'} 
                              size="small"
                              color={objective.archived ? 'default' : 'primary'}
                              variant="outlined"
                            />
                          </Box>
                          <Typography variant="body2" color="textSecondary" className="perf-objective-description">
                            {objective.description || 'No description provided'}
                          </Typography>
                          <Box className="perf-objective-meta">
                            <Chip 
                              icon={<Person fontSize="small" />}
                              label={objective.objectiveType || 'All'} 
                              size="small"
                              variant="outlined"
                              sx={{ mr: 1 }}
                            />
                            <Typography variant="caption" color="textSecondary">
                              Key Results: {objective.keyResults || '0'}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Feedback Tab */}
        {tabValue === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper className="perf-chart-container">
                <Box className="perf-chart-header">
                  <Typography variant="h6">Feedback by Type</Typography>
                  <Tooltip title="Distribution of feedback by category" classes={{ tooltip: "perf-tooltip" }}>
                    <IconButton size="small">
                      <Info fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box className="perf-chart-body">
                  <Pie data={getFeedbackByTypeData()} options={pieOptions} height={300} />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className="perf-chart-container">
                <Box className="perf-chart-header">
                  <Typography variant="h6">Feedback Status</Typography>
                  <Tooltip title="Status distribution of all feedback" classes={{ tooltip: "perf-tooltip" }}>
                    <IconButton size="small">
                      <Info fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box className="perf-chart-body">
                  <Pie data={getFeedbackStatusData()} options={pieOptions} height={300} />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className="perf-data-table-container">
                <Box className="perf-data-table-header">
                  <Typography variant="h6">Recent Feedback</Typography>
                </Box>
                <Divider />
                <Box className="perf-data-table-body">
                  {getAllFeedbackItems().length === 0 ? (
                    <Typography variant="body2" sx={{ p: 2, textAlign: 'center' }}>
                      No feedback found
                    </Typography>
                  ) : (
                    <Box className="perf-feedback-list">
                      {getAllFeedbackItems().slice(0, 5).map((feedback, index) => (
                        <Box key={feedback._id || index} className="perf-feedback-item">
                          <Box className="perf-feedback-item-header">
                            <Typography variant="subtitle1" className="perf-feedback-title">
                              {feedback.title || 'Feedback'}
                            </Typography>
                            <Chip 
                              label={feedback.status || 'Pending'} 
                              size="small"
                              color={
                                feedback.status === 'Completed' ? 'success' :
                                feedback.status === 'In Progress' ? 'primary' :
                                feedback.status === 'Not Started' ? 'warning' : 'default'
                              }
                              variant="outlined"
                            />
                          </Box>
                          <Typography variant="body2" color="textSecondary" className="perf-feedback-description">
                            {feedback.description || 'No description provided'}
                          </Typography>
                          <Box className="perf-feedback-meta">
                            <Typography variant="caption" color="textSecondary">
                              From: {feedback.from || 'Anonymous'}
                            </Typography>
                            <Typography variant="caption" color="textSecondary" sx={{ ml: 2 }}>
                              To: {feedback.to || 'Not specified'}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Team Performance Tab */}
        {tabValue === 3 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper className="perf-chart-container">
                <Box className="perf-chart-header">
                  <Typography variant="h6">Objectives by Team Member</Typography>
                  <Tooltip title="Distribution of objectives by team member" classes={{ tooltip: "perf-tooltip" }}>
                    <IconButton size="small">
                      <Info fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box className="perf-chart-body perf-team-performance">
                  {dashboardData.objectives.length === 0 ? (
                    <Typography variant="body1" sx={{ textAlign: 'center', p: 4 }}>
                      No team objectives data available.
                    </Typography>
                  ) : (
                    <Bar 
                      data={{
                        labels: ['Team Member 1', 'Team Member 2', 'Team Member 3', 'Team Member 4'],
                        datasets: [{
                          label: 'Objectives Count',
                          data: [
                            dashboardData.objectives.filter(o => o.objectiveType === 'self').length,
                            dashboardData.objectives.filter(o => o.objectiveType === 'all').length,
                            dashboardData.objectives.filter(o => o.archived).length,
                            dashboardData.objectives.length - dashboardData.objectives.filter(o => o.archived).length
                          ],
                          backgroundColor: 'rgba(75, 192, 192, 0.5)',
                          borderColor: 'rgba(75, 192, 192, 1)',
                          borderWidth: 1
                        }]
                      }}
                      options={{
                        ...barOptions,
                        plugins: {
                          ...barOptions.plugins,
                          title: {
                            display: true,
                            text: 'Objectives by Team Member'
                          }
                        }
                      }}
                      height={300}
                    />
                  )}
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className="perf-chart-container">
                <Box className="perf-chart-header">
                  <Typography variant="h6">Feedback by Team Member</Typography>
                  <Tooltip title="Distribution of feedback by team member" classes={{ tooltip: "perf-tooltip" }}>
                    <IconButton size="small">
                      <Info fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box className="perf-chart-body perf-team-performance">
                  {getAllFeedbackItems().length === 0 ? (
                    <Typography variant="body1" sx={{ textAlign: 'center', p: 4 }}>
                      No team feedback data available.
                    </Typography>
                  ) : (
                    <Bar 
                      data={{
                        labels: ['Self Feedback', 'Requested Feedback', 'Feedback to Review', 'Anonymous Feedback'],
                        datasets: [{
                          label: 'Feedback Count',
                          data: [
                            dashboardData.feedback.selfFeedback?.length || 0,
                            dashboardData.feedback.requestedFeedback?.length || 0,
                            dashboardData.feedback.feedbackToReview?.length || 0,
                            dashboardData.feedback.anonymousFeedback?.length || 0
                          ],
                          backgroundColor: 'rgba(153, 102, 255, 0.5)',
                          borderColor: 'rgba(153, 102, 255, 1)',
                          borderWidth: 1
                        }]
                      }}
                      options={{
                        ...barOptions,
                        plugins: {
                          ...barOptions.plugins,
                          title: {
                            display: true,
                            text: 'Feedback by Category'
                          }
                        }
                      }}
                      height={300}
                    />
                  )}
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className="perf-data-table-container">
                <Box className="perf-data-table-header">
                  <Typography variant="h6">Team Performance Summary</Typography>
                </Box>
                <Divider />
                <Box className="perf-data-table-body">
                  <Box sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Card variant="outlined" sx={{ mb: 2 }}>
                          <CardContent className="perf-card-content">
                            <Typography variant="h6" gutterBottom>
                              Objectives Summary
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">Total Objectives:</Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {dashboardData.stats.totalObjectives}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">Active Objectives:</Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {dashboardData.objectives.filter(o => !o.archived).length}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">Archived Objectives:</Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {dashboardData.objectives.filter(o => o.archived).length}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">At Risk Objectives:</Typography>
                              <Typography variant="body2" fontWeight="bold" color="error">
                                {dashboardData.stats.objectivesAtRisk}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Card variant="outlined">
                          <CardContent className="perf-card-content">
                            <Typography variant="h6" gutterBottom>
                              Feedback Summary
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">Self Feedback:</Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {dashboardData.feedback.selfFeedback?.length || 0}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">Requested Feedback:</Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {dashboardData.feedback.requestedFeedback?.length || 0}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">Feedback to Review:</Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {dashboardData.feedback.feedbackToReview?.length || 0}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">Anonymous Feedback:</Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {dashboardData.feedback.anonymousFeedback?.length || 0}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
};

// Stat Card Component
const PerfStatCard = ({ title, count, icon, color, trend, trendText }) => {
  return (
    <Card className="perf-stat-card">
      <CardContent className="perf-card-content">
        <Box className="perf-stat-card-header" sx={{ color }}>
          {icon}
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h3" component="div" className="perf-stat-count">
          {count}
        </Typography>
        <Box className="perf-stat-trend">
          {trend}
          <Typography variant="caption" color="textSecondary">
            {trendText}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PerformanceDashboard;



