import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { FaSignInAlt } from 'react-icons/fa';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  
  const { login, error, successMessage, clearMessages, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the page the user was trying to access before being redirected to login
  const from = location.state?.from?.pathname || '/';

  // Clear auth context messages when component mounts or unmounts
  useEffect(() => {
    clearMessages();
    return () => clearMessages();
  }, [clearMessages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!username.trim()) {
      setLocalError('Username is required');
      return;
    }
    
    if (!password.trim()) {
      setLocalError('Password is required');
      return;
    }
    
    setLocalError('');
    
    try {
      console.log("Submitting login with:", { username });
      await login(username, password);
      console.log("Login successful, navigating to:", from);
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login submission error:", err);
      // Error is already set in auth context
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <div className="text-center mb-4">
                <FaSignInAlt size={40} className="text-primary mb-2" />
                <h2>Login</h2>
                <p className="text-muted">Sign in to access your account</p>
              </div>
              
              {localError && <Alert variant="danger">{localError}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              {successMessage && <Alert variant="success">{successMessage}</Alert>}
              {location.state?.message && (
                <Alert variant="info">{location.state.message}</Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group id="username" className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>
                
                <Form.Group id="password" className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                
                <Button
                  className="w-100 mb-3"
                  variant="primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
                
                <div className="text-center">
                  <p>Don't have an account? <Link to="/register">Register here</Link></p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;