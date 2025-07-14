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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import { Refresh, Delete } from '@mui/icons-material';
import { resendInvitation, cancelInvitation } from '../../redux/actions/invitationActions';
import { format, isAfter } from 'date-fns';

const InvitationList = ({ onRefresh }) => {
  const dispatch = useDispatch();
  const { invitations, loading, error, actionLoading, actionError } = useSelector(state => state.invitations);
  
  const [selectedInvitation, setSelectedInvitation] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [dialogError, setDialogError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleResendClick = (invitation) => {
    setSelectedInvitation(invitation);
    setActionType('resend');
    setDialogError(null);
  };

  const handleCancelClick = (invitation) => {
    setSelectedInvitation(invitation);
    setActionType('cancel');
    setDialogError(null);
  };

  const handleCloseDialog = () => {
    setSelectedInvitation(null);
    setActionType(null);
    setDialogError(null);
    setIsProcessing(false);
  };

  const handleConfirmAction = async () => {
    if (!selectedInvitation || isProcessing) return;
    
    setDialogError(null);
    setIsProcessing(true);
    
    try {
      if (actionType === 'resend') {
        await dispatch(resendInvitation(selectedInvitation._id));
      } else if (actionType === 'cancel') {
        await dispatch(cancelInvitation(selectedInvitation._id));
      }
      
      handleCloseDialog();
      // Refresh data after successful action
      if (onRefresh) {
        setTimeout(() => {
          onRefresh();
        }, 500);
      }
    } catch (err) {
      console.error(`Error ${actionType}ing invitation:`, err);
      setDialogError(err.response?.data?.message || err.message || `Failed to ${actionType} invitation`);
    } finally {
      setIsProcessing(false);
    }
  };

  const getInvitationStatus = (invitation) => {
    if (invitation.status === 'accepted') {
      return { label: 'Accepted', color: 'success' };
    }
    
    if (invitation.status === 'cancelled') {
      return { label: 'Cancelled', color: 'default' };
    }
    
    if (invitation.status === 'expired' || isAfter(new Date(), new Date(invitation.expiresAt))) {
      return { label: 'Expired', color: 'error' };
    }
    
    return { label: 'Pending', color: 'warning' };
  };

  const canResend = (invitation) => {
    return invitation.status === 'pending' || invitation.status === 'expired';
  };

  const canCancel = (invitation) => {
    return invitation.status === 'pending';
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
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={onRefresh}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (!invitations || invitations.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1">No invitations found.</Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="invitations table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invitations.map((invitation) => {
              const status = getInvitationStatus(invitation);
              return (
                <TableRow key={invitation._id}>
                  <TableCell>
                    {`${invitation.firstName} ${invitation.middleName ? invitation.middleName + ' ' : ''}${invitation.lastName}`}
                  </TableCell>
                  <TableCell>{invitation.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)} 
                      color={
                        invitation.role === 'admin' ? 'error' : 
                        invitation.role === 'hr' ? 'warning' : 
                        invitation.role === 'manager' ? 'info' : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={status.label} 
                      color={status.color}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {format(new Date(invitation.expiresAt), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      aria-label="resend invitation" 
                      onClick={() => handleResendClick(invitation)}
                      disabled={!canResend(invitation) || actionLoading || isProcessing}
                      size="small"
                      title={canResend(invitation) ? "Resend invitation" : "Cannot resend this invitation"}
                    >
                      <Refresh fontSize="small" />
                    </IconButton>
                    <IconButton 
                      aria-label="cancel invitation" 
                      onClick={() => handleCancelClick(invitation)}
                      color="error"
                      disabled={!canCancel(invitation) || actionLoading || isProcessing}
                      size="small"
                      title={canCancel(invitation) ? "Cancel invitation" : "Cannot cancel this invitation"}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog */}
      <Dialog open={!!selectedInvitation} onClose={handleCloseDialog}>
        <DialogTitle>
          {actionType === 'resend' ? 'Resend Invitation' : 'Cancel Invitation'}
        </DialogTitle>
        <DialogContent>
          {dialogError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {dialogError}
            </Alert>
          )}
          <Typography variant="body1">
            {actionType === 'resend' 
              ? `Are you sure you want to resend the invitation to ${selectedInvitation?.email}? This will generate a new password and extend the expiry date.`
              : `Are you sure you want to cancel the invitation to ${selectedInvitation?.email}? This action cannot be undone.`
            }
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isProcessing}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmAction} 
            variant="contained" 
            color={actionType === 'cancel' ? 'error' : 'primary'}
            disabled={isProcessing}
            startIcon={isProcessing ? <CircularProgress size={16} /> : null}
          >
            {isProcessing 
              ? (actionType === 'resend' ? 'Resending...' : 'Cancelling...') 
              : (actionType === 'resend' ? 'Resend' : 'Cancel Invitation')
            }
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InvitationList;

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
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions
// } from '@mui/material';
// import { Refresh, Delete } from '@mui/icons-material';
// import { resendInvitation, cancelInvitation } from '../../redux/actions/invitationActions';
// import { format, isAfter } from 'date-fns';

// const InvitationList = ({ onRefresh }) => {
//   const dispatch = useDispatch();
//   const { invitations, loading, error, actionLoading, actionError } = useSelector(state => state.invitations);
  
//   const [selectedInvitation, setSelectedInvitation] = useState(null);
//   const [actionType, setActionType] = useState(null);
//   const [dialogError, setDialogError] = useState(null);

//   const handleResendClick = (invitation) => {
//     setSelectedInvitation(invitation);
//     setActionType('resend');
//     setDialogError(null);
//   };

//   const handleCancelClick = (invitation) => {
//     setSelectedInvitation(invitation);
//     setActionType('cancel');
//     setDialogError(null);
//   };

//   const handleCloseDialog = () => {
//     setSelectedInvitation(null);
//     setActionType(null);
//     setDialogError(null);
//   };

//   const handleConfirmAction = async () => {
//     if (!selectedInvitation) return;
    
//     setDialogError(null);
    
//     try {
//       if (actionType === 'resend') {
//         await dispatch(resendInvitation(selectedInvitation._id));
//       } else if (actionType === 'cancel') {
//         await dispatch(cancelInvitation(selectedInvitation._id));
//       }
      
//       handleCloseDialog();
//       if (onRefresh) onRefresh();
//     } catch (err) {
//       setDialogError(err.message || actionError || `Failed to ${actionType} invitation`);
//     }
//   };

//   const getInvitationStatus = (invitation) => {
//     if (invitation.status === 'accepted') {
//       return { label: 'Accepted', color: 'success' };
//     }
    
//     if (invitation.status === 'expired' || isAfter(new Date(), new Date(invitation.expiresAt))) {
//       return { label: 'Expired', color: 'error' };
//     }
    
//     return { label: 'Pending', color: 'warning' };
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

//   if (!invitations || invitations.length === 0) {
//     return (
//       <Box sx={{ p: 3, textAlign: 'center' }}>
//         <Typography variant="body1">No invitations found.</Typography>
//       </Box>
//     );
//   }

//   return (
//     <>
//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 650 }} aria-label="invitations table">
//           <TableHead>
//             <TableRow>
//               <TableCell>Name</TableCell>
//               <TableCell>Email</TableCell>
//               <TableCell>Role</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Expires</TableCell>
//               <TableCell align="right">Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {invitations.map((invitation) => {
//               const status = getInvitationStatus(invitation);
//               return (
//                 <TableRow key={invitation._id}>
//                   <TableCell>
//                     {`${invitation.firstName} ${invitation.middleName ? invitation.middleName + ' ' : ''}${invitation.lastName}`}
//                   </TableCell>
//                   <TableCell>{invitation.email}</TableCell>
//                   <TableCell>
//                     <Chip 
//                       label={invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)} 
//                       color={
//                         invitation.role === 'admin' ? 'error' : 
//                         invitation.role === 'hr' ? 'warning' : 
//                         invitation.role === 'manager' ? 'info' : 'default'
//                       }
//                       size="small"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Chip 
//                       label={status.label} 
//                       color={status.color}
//                       size="small"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     {format(new Date(invitation.expiresAt), 'MMM dd, yyyy')}
//                   </TableCell>
//                   <TableCell align="right">
//                     <IconButton 
//                       aria-label="resend invitation" 
//                       onClick={() => handleResendClick(invitation)}
//                       disabled={invitation.status === 'accepted' || actionLoading}
//                       size="small"
//                     >
//                       <Refresh fontSize="small" />
//                     </IconButton>
//                     <IconButton 
//                       aria-label="cancel invitation" 
//                       onClick={() => handleCancelClick(invitation)}
//                       color="error"
//                       disabled={actionLoading}
//                       size="small"
//                     >
//                       <Delete fontSize="small" />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Confirmation Dialog */}
//       <Dialog open={!!selectedInvitation} onClose={handleCloseDialog}>
//         <DialogTitle>
//           {actionType === 'resend' ? 'Resend Invitation' : 'Cancel Invitation'}
//         </DialogTitle>
//         <DialogContent>
//           {dialogError && (
//             <Typography color="error" variant="body2" sx={{ mb: 2 }}>
//               {dialogError}
//             </Typography>
//           )}
//           <Typography variant="body1">
//             {actionType === 'resend' 
//               ? `Are you sure you want to resend the invitation to ${selectedInvitation?.email}? This will generate a new password.`
//               : `Are you sure you want to cancel the invitation to ${selectedInvitation?.email}? This action cannot be undone.`
//             }
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog} disabled={actionLoading}>Cancel</Button>
//           <Button 
//             onClick={handleConfirmAction} 
//             variant="contained" 
//             color={actionType === 'cancel' ? 'error' : 'primary'}
//             disabled={actionLoading}
//           >
//             {actionLoading 
//               ? (actionType === 'resend' ? 'Resending...' : 'Cancelling...') 
//               : (actionType === 'resend' ? 'Resend' : 'Cancel Invitation')
//             }
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default InvitationList;

