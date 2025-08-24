import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectIsAuthenticated,
  selectAuthLoading,
  logoutUser,
  selectUserRole,
  selectUserPermissions
} from '../redux/authSlice';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const PrivateRoute = ({ requiredRole = null, requiredPermission = null }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const role = useSelector(selectUserRole);
  const permissions = useSelector(selectUserPermissions);

  const location = useLocation();
  const dispatch = useDispatch();
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const companyCode = localStorage.getItem('companyCode');

    if (isAuthenticated && !token) {
      dispatch(logoutUser()).then(() => setShouldRedirect(true));
    } else if (!companyCode) {
      setAuthError('Company code is missing. Please log in again.');
      dispatch(logoutUser()).then(() => setShouldRedirect(true));
    } else {
      setIsChecking(false);
    }
  }, [isAuthenticated, dispatch]);

  if (loading || isChecking) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || shouldRedirect) {
    return (
      <Navigate
        to="/login"
        state={{ from: location, authError }}
        replace
      />
    );
  }

  if (
    (requiredRole && role !== requiredRole) ||
    (requiredPermission && !permissions.includes(requiredPermission))
  ) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;