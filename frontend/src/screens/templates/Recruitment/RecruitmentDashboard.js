import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Grid, Avatar, CircularProgress, Alert, Paper } from '@mui/material';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { styled } from '@mui/system';
import api from '../../../api/axiosInstance';

// Register necessary elements and components for Chart.js
Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// Styled component for card headers
const StyledHeader = styled(Box)(({ color }) => ({
  height: '4px',
  backgroundColor: color,
  marginBottom: '10px',
}));

// Styled component for each recruitment card section
const SectionCard = ({ color, title, children, loading }) => (
  <Card sx={{ boxShadow: 3, mb: 2, height: '100%', position: 'relative' }}>
    <StyledHeader color={color} />
    <CardContent sx={{ textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress size={30} />
        </Box>
      ) : children}
    </CardContent>
  </Card>
);

const RecruitmentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [skillZones, setSkillZones] = useState([]);

// no need  for this
  // const getAuthToken = () => {
  //   return localStorage.getItem('token');
  // };

  useEffect(() => {
    fetchAllData();
  }, []);

    const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get the authentication token
      //no need for this
      // const token = getAuthToken();
      // const authHeader = { headers: { 'Authorization': `Bearer ${token}` } };
      
      // Fetch data from all relevant endpoints with auth headers
      const results = await Promise.allSettled([
        // Fetch candidates from the correct endpoint with auth
        api.get('/recruitment/Recruitment%20Drive'),
        api.get('/recruitment-survey'),
        // For applicants, we need to check if there's a specific endpoint for hired/not hired
        api.get('/applicantProfiles'),
        api.get('/skill-zone')
      ]);

      // Process candidates data
      if (results[0].status === 'fulfilled') {
        const candidatesData = results[0].value.data;
        console.log("Candidates data:", candidatesData); // Debug log
        setCandidates(candidatesData);
      } else {
        console.warn("Failed to fetch candidates:", results[0].reason);
      }

      // Process other data...
      if (results[1].status === 'fulfilled') {
        setTemplates(results[1].value.data);
      } else {
        console.warn("Failed to fetch templates:", results[1].reason);
      }

      if (results[2].status === 'fulfilled') {
        const applicantsData = results[2].value.data;
        console.log("Applicants data:", applicantsData); // Debug log
        setApplicants(applicantsData);
      } else {
        console.warn("Failed to fetch applicants:", results[2].reason);
      }

      if (results[3].status === 'fulfilled') {
        setSkillZones(results[3].value.data);
      } else {
        console.warn("Failed to fetch skill zones:", results[3].reason);
        // Try alternative endpoint if the first one fails
        try {
          const skillZoneResponse = await api.get('/skillZone');
          if (skillZoneResponse.data) {
            setSkillZones(skillZoneResponse.data);
          }
        } catch (err) {
          console.warn("Failed to fetch skill zones from alternative endpoint:", err);
        }
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load some recruitment dashboard data. Partial data may be displayed.");
    } finally {
      setLoading(false);
    }
  };


  // useEffect(() => {
  //   const fetchAllData = async () => {
  //     setLoading(true);
  //     setError(null);
  //     try {
  //       // Fetch data from all relevant endpoints
  //       const results = await Promise.allSettled([
  //         // Fetch candidates from the correct endpoint
  //         axios.get('${process.env.REACT_APP_API_URL}/api/recruitment/Recruitment%20Drive'),
  //         axios.get('${process.env.REACT_APP_API_URL}/api/recruitment-survey'),
  //         // For applicants, we need to check if there's a specific endpoint for hired/not hired
  //         axios.get('${process.env.REACT_APP_API_URL}/api/applicantProfiles'),
  //         axios.get('${process.env.REACT_APP_API_URL}/api/skill-zone')
  //       ]);

  //       // Process candidates data
  //       if (results[0].status === 'fulfilled') {
  //         const candidatesData = results[0].value.data;
  //         console.log("Candidates data:", candidatesData); // Debug log
  //         setCandidates(candidatesData);
  //       } else {
  //         console.warn("Failed to fetch candidates:", results[0].reason);
  //       }

  //       // Process other data...
  //       if (results[1].status === 'fulfilled') {
  //         setTemplates(results[1].value.data);
  //       } else {
  //         console.warn("Failed to fetch templates:", results[1].reason);
  //       }

  //       if (results[2].status === 'fulfilled') {
  //         const applicantsData = results[2].value.data;
  //         console.log("Applicants data:", applicantsData); // Debug log
  //         setApplicants(applicantsData);
  //       } else {
  //         console.warn("Failed to fetch applicants:", results[2].reason);
  //       }

  //       if (results[3].status === 'fulfilled') {
  //         setSkillZones(results[3].value.data);
  //       } else {
  //         console.warn("Failed to fetch skill zones:", results[3].reason);
  //         // Try alternative endpoint if the first one fails
  //         try {
  //           const skillZoneResponse = await axios.get('${process.env.REACT_APP_API_URL}/api/skillZone');
  //           if (skillZoneResponse.data) {
  //             setSkillZones(skillZoneResponse.data);
  //           }
  //         } catch (err) {
  //           console.warn("Failed to fetch skill zones from alternative endpoint:", err);
  //         }
  //       }
  //     } catch (err) {
  //       console.error("Error fetching dashboard data:", err);
  //       setError("Failed to load some recruitment dashboard data. Partial data may be displayed.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchAllData();
  // }, []);




  // Calculate stats from the fetched data
  
  
  const statsData = [
    { 
      label: "Total Vacancies", 
      // Check for candidates in the Initial column or with status "Open"
      value: candidates.filter(c => c.column === "Initial" || c.status === "Open").length, 
      color: "#4CAF50" 
    },
    { 
      label: "Ongoing Recruitments", 
      // Check for candidates in Interview or Technical columns or with status "In Progress"
      value: candidates.filter(c => 
        ["Interview", "Technical"].includes(c.column) || 
        c.status === "In Progress" || 
        c.status === "Interviewing"
      ).length, 
      color: "#FFA726" 
    },
    { 
      label: "Hired Candidates", 
      // Check for candidates in Hired column or with status "Hired"
      value: candidates.filter(c => c.column === "Hired" || c.status === "Hired" || c.status === "Selected").length, 
      color: "#66BB6A" 
    },
    { 
      label: "Conversion Rate", 
      value: candidates.length > 0 
        ? `${Math.round((candidates.filter(c => 
            c.column === "Hired" || 
            c.status === "Hired" || 
            c.status === "Selected"
          ).length / candidates.length) * 100)}%` 
        : "0%", 
      color: "#90A4AE" 
    },
    { 
      label: "Offer Acceptance Rate", 
      value: applicants.length > 0 
        ? `${Math.round((applicants.filter(a => 
            a.status === "Hired" || 
            a.status === "Selected" || 
            a.status === "Joined"
          ).length / applicants.length) * 100)}%` 
        : "0%", 
      color: "#FF5722" 
    },
  ];

  // Prepare data for Candidate Offer Letter Status chart
  const getOfferLetterStatusData = () => {
    // Count candidates in different stages with more flexible status checking
    const notSent = candidates.filter(c => 
      c.column === "Initial" || 
      c.status === "Open" || 
      c.status === "New"
    ).length;
    
    const sent = candidates.filter(c => 
      c.column === "Interview" || 
      c.status === "Interviewing" || 
      c.status === "In Progress"
    ).length;
    
    const accepted = candidates.filter(c => 
      c.column === "Hired" || 
      c.status === "Hired" || 
      c.status === "Selected" || 
      c.status === "Accepted"
    ).length;
    
    const rejected = candidates.filter(c => 
      c.column === "Cancelled" || 
      c.status === "Rejected" || 
      c.status === "Declined"
    ).length;
    
    const joined = applicants.filter(a => 
      a.status === "Hired" || 
      a.status === "Joined" || 
      a.status === "Onboarded"
    ).length;

    return {
      labels: ['Not Sent', 'Sent', 'Accepted', 'Rejected', 'Joined'],
      datasets: [{
        data: [notSent, sent, accepted, rejected, joined],
        backgroundColor: ['#BDBDBD', '#FFEB3B', '#42A5F5', '#F44336', '#4CAF50'],
      }],
    };
  };

  // Prepare data for Skill Zone Status
  const getSkillZoneData = () => {
    if (!skillZones || skillZones.length === 0) {
      return [];
    }
    
    return skillZones.map(zone => ({
      initials: zone.name ? zone.name.substring(0, 2).toUpperCase() : "SZ",
      skill: zone.name || "Unknown Skill",
      candidates: zone.candidates ? zone.candidates.length : 0,
      color: getRandomColor(zone.name || "Default")
    })).slice(0, 3); // Show top 3 skill zones
  };

  // Get candidates on onboard (recently hired)
  const getCandidatesOnOnboard = () => {
    // Get candidates who are hired and sort by most recent
    const hiredCandidates = candidates
      .filter(c => 
        c.column === "Hired" || 
        c.status === "Hired" || 
        c.status === "Selected" || 
        c.status === "Joined"
      )
      .sort((a, b) => new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0))
      .slice(0, 3); // Show top 3

    return hiredCandidates.map(candidate => ({
      initials: (candidate.name || "").substring(0, 2).toUpperCase(),
      name: candidate.name || candidate.candidateName || "Unknown",
      position: candidate.department || candidate.position || candidate.jobRole || "Position not specified"
    }));
  };

  // Helper function to generate consistent colors based on string
  const getRandomColor = (str) => {
    const colors = ['#FFEB3B', '#CDDC39', '#4CAF50', '#26A69A', '#42A5F5', '#7E57C2', '#EC407A'];
    const hash = str.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return colors[hash % colors.length];
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
        }
      },
    },
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading dashboard data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={2} justifyContent="space-between">
        {/* Stats Cards */}
        {statsData.map((stat, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <SectionCard color={stat.color} title={stat.label} loading={false}>
              <Typography variant="h3">{stat.value}</Typography>
            </SectionCard>
          </Grid>
        ))}

        {/* Skill Zone Status */}
        <Grid item xs={12} md={4}>
          <SectionCard color="#FFEB3B" title="Skill Zone Status" loading={false}>
            {skillZones.length === 0 ? (
              <Typography variant="body1" sx={{ py: 2 }}>No skill zones available</Typography>
            ) : (
              getSkillZoneData().map((skill, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ backgroundColor: skill.color, mr: 2 }}>{skill.initials}</Avatar>
                  <Typography variant="body1" sx={{ flex: 1 }}>{skill.skill}</Typography>
                  <Typography variant="body2">{skill.candidates} Candidate{skill.candidates > 1 ? 's' : ''}</Typography>
                </Box>
              ))
            )}
          </SectionCard>
        </Grid>

        {/* Candidate Offer Letter Status */}
        <Grid item xs={12} md={4}>
          <SectionCard color="#50E3C2" title="Candidate Offer Letter Status" loading={false}>
            {candidates.length === 0 ? (
              <Typography variant="body1" sx={{ py: 2 }}>No candidate data available</Typography>
            ) : (
              <Box sx={{ height: 220 }}>
                <Doughnut 
                  data={getOfferLetterStatusData()} 
                  options={chartOptions}
                />
              </Box>
            )}
          </SectionCard>
        </Grid>

        {/* Candidate on Onboard */}
        <Grid item xs={12} md={4}>
          <SectionCard color="#FF5C8D" title="Candidate on Onboard" loading={false}>
            {candidates.filter(c => c.column === "Hired" || c.status === "Hired" || c.status === "Selected").length === 0 ? (
              <Typography variant="body1" sx={{ py: 2 }}>No candidates onboarded yet</Typography>
            ) : (
              getCandidatesOnOnboard().map((candidate, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: "#FF5722", mr: 2 }}>{candidate.initials}</Avatar>
                  <Box>
                    <Typography variant="body1">{candidate.name}</Typography>
                    <Typography variant="caption" color="textSecondary">{candidate.position}</Typography>
                  </Box>
                </Box>
              ))
            )}
          </SectionCard>
        </Grid>

        {/* Additional Charts */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Survey Templates</Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {templates.length === 0 ? (
                <Typography variant="body1">No survey templates available</Typography>
              ) : (
                <Bar
                  data={{
                    labels: templates.map(t => t.name),
                    datasets: [{
                      label: 'Questions',
                      data: templates.map(t => t.questions.length),
                      backgroundColor: '#4A90E2',
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0
                        }
                      }
                    }
                  }}
                  />
                )}
              </Box>
            </Paper>
          </Grid>
  
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Recruitment Pipeline Status</Typography>
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {candidates.length === 0 ? (
                  <Typography variant="body1">No pipeline data available</Typography>
                ) : (
                  <Bar
                    data={{
                      labels: ['Initial', 'Interview', 'Technical', 'Hired', 'Cancelled'],
                      datasets: [{
                        label: 'Candidates',
                        data: [
                          candidates.filter(c => c.column === "Initial" || c.status === "Open" || c.status === "New").length,
                          candidates.filter(c => c.column === "Interview" || c.status === "Interviewing").length,
                          candidates.filter(c => c.column === "Technical" || c.status === "Technical Round").length,
                          candidates.filter(c => c.column === "Hired" || c.status === "Hired" || c.status === "Selected").length,
                          candidates.filter(c => c.column === "Cancelled" || c.status === "Rejected" || c.status === "Declined").length
                        ],
                        backgroundColor: [
                          '#BDBDBD', '#FFEB3B', '#42A5F5', '#4CAF50', '#F44336'
                        ],
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            precision: 0
                          }
                        }
                      }
                    }}
                  />
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  };
  
  export default RecruitmentDashboard;
  
