import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Alert, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from './Loading';

/**
 * A wrapper component that checks authentication and permissions
 * Shows inline message for unauthorised access instead of redirecting
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser, loading, isAdmin } = useAuth();
  const location = useLocation();

  // If still loading auth state, show loading indicator
  if (loading) {
    return <Loading />;
  }

  // If not logged in, redirect to login with return path
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If admin route but user is not admin, show inline message
  if (adminOnly && !isAdmin) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Access Denied</Alert.Heading>
          <p>
            You don't have administrator privileges to access this page.
          </p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button as={Link} to="/" variant="outline-danger">
              Return to Home
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  // If authenticated (and admin if needed), render the protected component
  return children;
};

export default ProtectedRoute;