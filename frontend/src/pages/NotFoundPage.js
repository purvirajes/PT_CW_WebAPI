import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    <Container className="text-center py-5">
      <FaExclamationTriangle size={60} className="text-warning mb-3" />
      <h1 className="mb-3">404 - Page Not Found</h1>
      <Alert variant="warning" className="mb-4">
        The page you're looking for doesn't exist or has been moved.
      </Alert>
      <p className="mb-4">
        Please check the URL or navigate back to a working page using the links below.
      </p>
      <div className="d-flex justify-content-center gap-3">
        <Button as={Link} to="/" variant="primary">
          Return to Home
        </Button>
        <Button as={Link} to="/books" variant="outline-primary">
          Browse Books
        </Button>
      </div>
    </Container>
  );
};

export default NotFoundPage;