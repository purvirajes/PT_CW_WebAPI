import React from 'react';
import { Container, Alert, Button, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaLock, FaHome, FaBookOpen, FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const UnauthorisedPage = () => {
  const { currentUser } = useAuth();

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow border-danger">
            <Card.Body className="text-center p-5">
              <FaLock size={60} className="text-danger mb-4" />
              <h1 className="mb-3">Access Denied</h1>
              
              <Alert variant="danger" className="mb-4">
                You don't have permission to access this page.
              </Alert>
              
              <p className="mb-4 lead">
                {currentUser ? (
                  <>
                    Your account doesn't have sufficient privileges to view this content. 
                    This area is restricted to administrators only.
                  </>
                ) : (
                  <>
                    You need to be logged in with the appropriate permissions to access this content.
                  </>
                )}
              </p>
              
              <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
                <Button as={Link} to="/" variant="primary" className="d-flex align-items-center justify-content-center gap-2">
                  <FaHome /> Return to Home
                </Button>
                
                <Button as={Link} to="/books" variant="outline-primary" className="d-flex align-items-center justify-content-center gap-2">
                  <FaBookOpen /> Browse Books
                </Button>
                
                {!currentUser && (
                  <Button as={Link} to="/login" variant="outline-secondary" className="d-flex align-items-center justify-content-center gap-2">
                    <FaSignInAlt /> Log In
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UnauthorisedPage;