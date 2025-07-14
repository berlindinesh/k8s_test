import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Typography, Paper, Tab, Tabs, Alert, CircularProgress } from '@mui/material';
import UserList from './UserList';
import InvitationList from './InvitationList';
import InviteUserForm from './InviteUserForm';
import { fetchUsers } from '../../redux/actions/userActions';
import { fetchInvitations, checkInvitationUpdates } from '../../redux/actions/invitationActions';

const UserManagementDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const intervalRef = useRef(null);
  
  // Add safe fallbacks with default values
  const users = useSelector(state => state.users || {});
  const invitations = useSelector(state => state.invitations || {});
  
  const usersLoading = users.loading || false;
  const usersError = users.error || null;
  const invitationsLoading = invitations.loading || false;
  const invitationsError = invitations.error || null;

  // Auto-refresh function with invitation status checking
  const startAutoRefresh = () => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Set up polling every 10 seconds for invitation updates
    intervalRef.current = setInterval(() => {
      const token = localStorage.getItem('token');
      const companyCode = localStorage.getItem('companyCode');
      
      if (token && companyCode) {
        // Check for invitation updates first
        dispatch(checkInvitationUpdates());
        
        // Full refresh every 30 seconds
        if (Date.now() % 30000 < 10000) {
          dispatch(fetchUsers());
          dispatch(fetchInvitations());
        }
      }
    }, 10000); // 10 seconds
  };

  const stopAutoRefresh = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    // Check if token and company code exist
    const token = localStorage.getItem('token');
    const companyCode = localStorage.getItem('companyCode');
    
    if (!token || !companyCode) {
        setError('Authentication information missing. Please log in again.');
        return;
    }
      
    // Fetch data when component mounts
    const fetchData = async () => {
      try {
        await dispatch(fetchUsers());
        await dispatch(fetchInvitations());
        // Start auto-refresh after initial load
        startAutoRefresh();
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try refreshing the page.');
      }
    };
      
    fetchData();

    // Cleanup interval on unmount
    return () => {
      stopAutoRefresh();
    };
  }, [dispatch]);

  // Handle visibility change to pause/resume polling
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAutoRefresh();
      } else {
        startAutoRefresh();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleInviteSuccess = () => {
    setShowInviteForm(false);
    // Immediately refresh data after successful invitation
    refreshData();
  };
  
  const refreshData = () => {
    dispatch(fetchUsers());
    dispatch(fetchInvitations());
  };
  
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => window.location.href = '/login'}
        >
          Return to Login
        </Button>
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3 }}>
      {(usersError || invitationsError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {usersError || invitationsError}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            color="primary"
            onClick={refreshData}
            disabled={usersLoading || invitationsLoading}
          >
            {(usersLoading || invitationsLoading) ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => setShowInviteForm(!showInviteForm)}
          >
            {showInviteForm ? 'Cancel' : 'Invite New User'}
          </Button>
        </Box>
      </Box>
  
      {showInviteForm && (
        <Paper sx={{ p: 3, mb: 3 }}>
                    <InviteUserForm onSuccess={handleInviteSuccess} onCancel={() => setShowInviteForm(false)} />
        </Paper>
      )}
  
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="user management tabs">
          <Tab label={`Users (${users.users?.length || 0})`} id="users-tab" />
          <Tab label={`Invitations (${invitations.invitations?.length || 0})`} id="invitations-tab" />
        </Tabs>
  
        <Box sx={{ p: 2 }}>
          {tabValue === 0 && (
            <UserList 
              onRefresh={refreshData} 
              loading={usersLoading}
            />
          )}
          {tabValue === 1 && (
            <InvitationList 
              onRefresh={refreshData}
              loading={invitationsLoading}
            />
          )}
        </Box>
      </Paper>
    </Box>
  );
};
  
export default UserManagementDashboard;



// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Box, Button, Typography, Paper, Tab, Tabs, Alert, CircularProgress } from '@mui/material';
// import UserList from './UserList';
// import InvitationList from './InvitationList';
// import InviteUserForm from './InviteUserForm';
// import { fetchUsers } from '../../redux/actions/userActions';
// import { fetchInvitations } from '../../redux/actions/invitationActions';

// const UserManagementDashboard = () => {
//   const [tabValue, setTabValue] = useState(0);
//   const [showInviteForm, setShowInviteForm] = useState(false);
//   const [error, setError] = useState(null);
//   const dispatch = useDispatch();
  
//   // Add safe fallbacks with default values
//   const users = useSelector(state => state.users || {});
//   const invitations = useSelector(state => state.invitations || {});
  
//   const usersLoading = users.loading || false;
//   const usersError = users.error || null;
//   const invitationsLoading = invitations.loading || false;
//   const invitationsError = invitations.error || null;

//   useEffect(() => {
//     // Check if token and company code exist
//     const token = localStorage.getItem('token');
//     const companyCode = localStorage.getItem('companyCode');
    
//     if (!token || !companyCode) {
//         setError('Authentication information missing. Please log in again.');
//         return;
//     }
      
//     // Fetch data when component mounts
//     const fetchData = async () => {
//       try {
//         await dispatch(fetchUsers());
//         await dispatch(fetchInvitations());
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setError('Failed to load data. Please try refreshing the page.');
//       }
//     };
      
//     fetchData();
//   }, [dispatch]);
  
//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };
  
//   const handleInviteSuccess = () => {
//     setShowInviteForm(false);
//   };
  
//   const refreshData = () => {
//     dispatch(fetchUsers());
//     dispatch(fetchInvitations());
//   };
  
//   if (error) {
//     return (
//       <Box sx={{ p: 3 }}>
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//         <Button 
//           variant="contained" 
//           color="primary"
//           onClick={() => window.location.href = '/login'}
//         >
//           Return to Login
//         </Button>
//       </Box>
//     );
//   }
  
//   return (
//     <Box sx={{ p: 3 }}>
//       {(usersError || invitationsError) && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {usersError || invitationsError}
//         </Alert>
//       )}
      
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
//         <Typography variant="h4" component="h1">
//           User Management
//         </Typography>
//         <Button 
//           variant="contained" 
//           color="primary"
//           onClick={() => setShowInviteForm(!showInviteForm)}
//         >
//           {showInviteForm ? 'Cancel' : 'Invite New User'}
//         </Button>
//       </Box>
  
//       {showInviteForm && (
//         <Paper sx={{ p: 3, mb: 3 }}>
//           <InviteUserForm onSuccess={handleInviteSuccess} onCancel={() => setShowInviteForm(false)} />
//         </Paper>
//       )}
  
//       <Paper sx={{ width: '100%', mb: 2 }}>
//         <Tabs value={tabValue} onChange={handleTabChange} aria-label="user management tabs">
//           <Tab label="Users" id="users-tab" />
//           <Tab label="Invitations" id="invitations-tab" />
//         </Tabs>
  
//         <Box sx={{ p: 2 }}>
//           {tabValue === 0 && (
//             <UserList 
//               onRefresh={refreshData} 
//               loading={usersLoading}
//             />
//           )}
//           {tabValue === 1 && (
//             <InvitationList 
//               onRefresh={refreshData}
//               loading={invitationsLoading}
//             />
//           )}
//         </Box>
//       </Paper>
//     </Box>
//   );
// };
  
// export default UserManagementDashboard;
