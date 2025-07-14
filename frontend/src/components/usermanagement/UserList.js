import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Chip, 
  Box, 
  Typography, 
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Tooltip
} from '@mui/material';
import { 
  Edit, 
  Block, 
  CheckCircle, 
  Delete, 
  VpnKey,
  Person 
} from '@mui/icons-material';
import { 
  updateUserRole, 
  updateUserStatus, 
  updateUserProfile,
  deleteUser,
  resetUserPassword 
} from '../../redux/actions/userActions';

const UserList = ({ onRefresh }) => {
  const dispatch = useDispatch();
  const { 
    users, 
    loading, 
    error, 
    updateLoading, 
    updateError,
    deleteLoading,
    deleteError,
    resetPasswordLoading 
  } = useSelector(state => state.users);
  
  const [editingUser, setEditingUser] = useState(null);
  const [editType, setEditType] = useState(null); // 'role', 'profile', 'delete'
  const [newRole, setNewRole] = useState('');
  const [profileData, setProfileData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: ''
  });
  const [dialogError, setDialogError] = useState(null);

  const handleEditRole = (user) => {
    setEditingUser(user);
    setEditType('role');
    setNewRole(user.role);
    setDialogError(null);
  };

  const handleEditProfile = (user) => {
    setEditingUser(user);
    setEditType('profile');
    setProfileData({
      firstName: user.firstName || '',
      middleName: user.middleName || '',
      lastName: user.lastName || '',
      email: user.email || ''
    });
    setDialogError(null);
  };

  const handleDeleteUser = (user) => {
    setEditingUser(user);
    setEditType('delete');
    setDialogError(null);
  };

  const handleCloseDialog = () => {
    setEditingUser(null);
    setEditType(null);
    setNewRole('');
    setProfileData({
      firstName: '',
      middleName: '',
      lastName: '',
      email: ''
    });
    setDialogError(null);
  };

  const handleRoleChange = (e) => {
    setNewRole(e.target.value);
  };

  const handleProfileChange = (field) => (e) => {
    setProfileData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleUpdateRole = async () => {
    if (!editingUser || !newRole) return;
    
    setDialogError(null);
    
    try {
      await dispatch(updateUserRole(editingUser._id, { role: newRole }));
      handleCloseDialog();
      if (onRefresh) onRefresh();
    } catch (err) {
      setDialogError(err.message || updateError || 'Failed to update user role');
    }
  };

  const handleUpdateProfile = async () => {
    if (!editingUser) return;
    
    setDialogError(null);
    
    try {
      await dispatch(updateUserProfile(editingUser._id, profileData));
      handleCloseDialog();
      if (onRefresh) onRefresh();
    } catch (err) {
      setDialogError(err.message || updateError || 'Failed to update user profile');
    }
  };

  const handleConfirmDelete = async () => {
    if (!editingUser) return;
    
    setDialogError(null);
    
    try {
      await dispatch(deleteUser(editingUser._id));
      handleCloseDialog();
      if (onRefresh) onRefresh();
    } catch (err) {
      setDialogError(err.message || deleteError || 'Failed to delete user');
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await dispatch(updateUserStatus(userId, { isActive: !currentStatus }));
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error updating user status:', err);
    }
  };

  const handleResetPassword = async (userId) => {
    try {
      const result = await dispatch(resetUserPassword(userId));
      // Show success message with temporary password
      alert(`Password reset successfully. Temporary password: ${result.temporaryPassword}`);
    } catch (err) {
      console.error('Error resetting password:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }} 
          onClick={onRefresh}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (!users || users.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1">No users found.</Typography>
      </Box>
    );
  }

  return (
    <>
            <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell component="th" scope="row">
                  {user.userId}
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.role.charAt(0).toUpperCase() + user.role.slice(1)} 
                    color={
                      user.role === 'admin' ? 'error' : 
                      user.role === 'hr' ? 'warning' : 
                      user.role === 'manager' ? 'info' : 'default'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.isActive ? 'Active' : 'Inactive'} 
                    color={user.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit Profile">
                    <IconButton 
                      aria-label="edit profile" 
                      onClick={() => handleEditProfile(user)}
                      size="small"
                      disabled={updateLoading}
                    >
                      <Person fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Edit Role">
                    <IconButton 
                      aria-label="edit role" 
                      onClick={() => handleEditRole(user)}
                      size="small"
                      disabled={updateLoading}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title={user.isActive ? 'Deactivate User' : 'Activate User'}>
                    <IconButton 
                      aria-label={user.isActive ? 'deactivate user' : 'activate user'} 
                      onClick={() => handleToggleStatus(user._id, user.isActive)}
                      color={user.isActive ? 'default' : 'success'}
                      size="small"
                      disabled={updateLoading}
                    >
                      {user.isActive ? <Block fontSize="small" /> : <CheckCircle fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Reset Password">
                    <IconButton 
                      aria-label="reset password" 
                      onClick={() => handleResetPassword(user._id)}
                      color="warning"
                      size="small"
                      disabled={resetPasswordLoading}
                    >
                      <VpnKey fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Delete User">
                    <IconButton 
                      aria-label="delete user" 
                      onClick={() => handleDeleteUser(user)}
                      color="error"
                      size="small"
                      disabled={deleteLoading}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Role Dialog */}
      <Dialog open={editType === 'role'} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Change User Role</DialogTitle>
        <DialogContent>
          {dialogError && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {dialogError}
            </Typography>
          )}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              User: {editingUser?.name} ({editingUser?.email})
            </Typography>
            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                id="role-select"
                value={newRole}
                label="Role"
                onChange={handleRoleChange}
              >
                <MenuItem value="employee">Employee</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="hr">HR</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={updateLoading}>Cancel</Button>
          <Button 
            onClick={handleUpdateRole} 
            variant="contained" 
            color="primary"
            disabled={updateLoading || !newRole || newRole === editingUser?.role}
          >
            {updateLoading ? 'Updating...' : 'Update Role'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={editType === 'profile'} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Edit User Profile</DialogTitle>
        <DialogContent>
          {dialogError && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {dialogError}
            </Typography>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                value={profileData.firstName}
                onChange={handleProfileChange('firstName')}
                disabled={updateLoading}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                id="middleName"
                label="Middle Name"
                name="middleName"
                value={profileData.middleName}
                onChange={handleProfileChange('middleName')}
                disabled={updateLoading}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                value={profileData.lastName}
                onChange={handleProfileChange('lastName')}
                disabled={updateLoading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleProfileChange('email')}
                disabled={updateLoading}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={updateLoading}>Cancel</Button>
          <Button 
            onClick={handleUpdateProfile} 
            variant="contained" 
            color="primary"
            disabled={updateLoading || !profileData.firstName || !profileData.lastName || !profileData.email}
          >
            {updateLoading ? 'Updating...' : 'Update Profile'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={editType === 'delete'} onClose={handleCloseDialog}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          {dialogError && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {dialogError}
            </Typography>
          )}
          <Typography variant="body1">
            Are you sure you want to delete user <strong>{editingUser?.name}</strong> ({editingUser?.email})?
          </Typography>
          <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={deleteLoading}>Cancel</Button>
          <Button 
            onClick={handleConfirmDelete} 
            variant="contained" 
            color="error"
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete User'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserList;


// import React, { useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { 
//   Table, 
//   TableBody, 
//   TableCell, 
//   TableContainer, 
//   TableHead, 
//   TableRow, 
//   Paper, 
//   IconButton, 
//   Chip, 
//   Box, 
//   Typography, 
//   CircularProgress,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem
// } from '@mui/material';
// import { Edit, Block, CheckCircle } from '@mui/icons-material';
// import { updateUserRole, updateUserStatus } from '../../redux/actions/userActions';

// const UserList = ({ onRefresh }) => {
//   const dispatch = useDispatch();
//   const { users, loading, error, updateLoading, updateError } = useSelector(state => state.users);
  
//   const [editingUser, setEditingUser] = useState(null);
//   const [newRole, setNewRole] = useState('');
//   const [dialogError, setDialogError] = useState(null);

//   const handleEditRole = (user) => {
//     setEditingUser(user);
//     setNewRole(user.role);
//     setDialogError(null);
//   };

//   const handleCloseDialog = () => {
//     setEditingUser(null);
//     setNewRole('');
//     setDialogError(null);
//   };

//   const handleRoleChange = (e) => {
//     setNewRole(e.target.value);
//   };

//   const handleUpdateRole = async () => {
//     if (!editingUser || !newRole) return;
    
//     setDialogError(null);
    
//     try {
//       await dispatch(updateUserRole(editingUser._id, { role: newRole }));
//       handleCloseDialog();
//       if (onRefresh) onRefresh();
//     } catch (err) {
//       setDialogError(err.message || updateError || 'Failed to update user role');
//     }
//   };

//   const handleToggleStatus = async (userId, currentStatus) => {
//     try {
//       await dispatch(updateUserStatus(userId, { isActive: !currentStatus }));
//       if (onRefresh) onRefresh();
//     } catch (err) {
//       console.error('Error updating user status:', err);
//     }
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ p: 3, textAlign: 'center' }}>
//         <Typography color="error">{error}</Typography>
//         <Button 
//           variant="contained" 
//           color="primary" 
//           sx={{ mt: 2 }} 
//           onClick={onRefresh}
//         >
//           Retry
//         </Button>
//       </Box>
//     );
//   }

//   if (!users || users.length === 0) {
//     return (
//       <Box sx={{ p: 3, textAlign: 'center' }}>
//         <Typography variant="body1">No users found.</Typography>
//       </Box>
//     );
//   }

//   return (
//     <>
//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 650 }} aria-label="users table">
//           <TableHead>
//             <TableRow>
//               <TableCell>User ID</TableCell>
//               <TableCell>Name</TableCell>
//               <TableCell>Email</TableCell>
//               <TableCell>Role</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell align="right">Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {users.map((user) => (
//               <TableRow key={user._id}>
//                 <TableCell component="th" scope="row">
//                   {user.userId}
//                 </TableCell>
//                 <TableCell>{user.name}</TableCell>
//                 <TableCell>{user.email}</TableCell>
//                 <TableCell>
//                   <Chip 
//                     label={user.role.charAt(0).toUpperCase() + user.role.slice(1)} 
//                     color={
//                       user.role === 'admin' ? 'error' : 
//                       user.role === 'hr' ? 'warning' : 
//                       user.role === 'manager' ? 'info' : 'default'
//                     }
//                     size="small"
//                   />
//                 </TableCell>
//                 <TableCell>
//                   <Chip 
//                     label={user.isActive ? 'Active' : 'Inactive'} 
//                     color={user.isActive ? 'success' : 'default'}
//                     size="small"
//                   />
//                 </TableCell>
//                 <TableCell align="right">
//                   <IconButton 
//                     aria-label="edit role" 
//                     onClick={() => handleEditRole(user)}
//                     size="small"
//                   >
//                     <Edit fontSize="small" />
//                   </IconButton>
//                   <IconButton 
//                     aria-label={user.isActive ? 'deactivate user' : 'activate user'} 
//                     onClick={() => handleToggleStatus(user._id, user.isActive)}
//                     color={user.isActive ? 'default' : 'success'}
//                     size="small"
//                   >
//                     {user.isActive ? <Block fontSize="small" /> : <CheckCircle fontSize="small" />}
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Edit Role Dialog */}
//       <Dialog open={!!editingUser} onClose={handleCloseDialog}>
//         <DialogTitle>Change User Role</DialogTitle>
//         <DialogContent>
//           {dialogError && (
//             <Typography color="error" variant="body2" sx={{ mb: 2 }}>
//               {dialogError}
//             </Typography>
//           )}
//           <Box sx={{ mt: 2 }}>
//             <Typography variant="body2" sx={{ mb: 1 }}>
//               User: {editingUser?.name} ({editingUser?.email})
//             </Typography>
//             <FormControl fullWidth sx={{ mt: 1 }}>
//               <InputLabel id="role-select-label">Role</InputLabel>
//               <Select
//                 labelId="role-select-label"
//                 id="role-select"
//                 value={newRole}
//                 label="Role"
//                 onChange={handleRoleChange}
//               >
//                 <MenuItem value="employee">Employee</MenuItem>
//                 <MenuItem value="manager">Manager</MenuItem>
//                 <MenuItem value="hr">HR</MenuItem>
//                 <MenuItem value="admin">Admin</MenuItem>
//               </Select>
//             </FormControl>
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog} disabled={updateLoading}>Cancel</Button>
//           <Button 
//             onClick={handleUpdateRole} 
//             variant="contained" 
//             color="primary"
//             disabled={updateLoading || !newRole || newRole === editingUser?.role}
//           >
//             {updateLoading ? 'Updating...' : 'Update Role'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default UserList;
