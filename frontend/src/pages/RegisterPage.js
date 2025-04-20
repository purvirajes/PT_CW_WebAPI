import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUserPlus } from 'react-icons/fa';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [localError, setLocalError] = useState('');
  const { register, error, successMessage, clearMessages, loading } = useAuth();
  const navigate = useNavigate();

  // Clear auth context messages when component mounts or unmounts
  useEffect(() => {
    clearMessages();
    return () => clearMessages();
  }, [clearMessages]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 8) {
      setLocalError('Password must be at least 8 characters long');
      return;
    }
    
    setLocalError('');
    
    try {
      // Submit registration data (without confirmPassword)
      const { confirmPassword, ...registrationData } = formData;
      await register(registrationData);
      
      // After successful registration, redirect to login page
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Registration successful! Please log in with your credentials.' } 
        });
      }, 2000);
    } catch (err) {
      // Error is already set in auth context
      console.error('Registration error:', err);
    }
  };

  return (
    <Container className="py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <Card>
            <Card.Body>
              <div className="text-center mb-4">
                <FaUserPlus size={40} className="text-primary mb-2" />
                <h2>Register</h2>
                <p className="text-muted">Create your account to start using our services</p>
              </div>

              {localError && <Alert variant="danger">{localError}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              {successMessage && <Alert variant="success">{successMessage}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <Form.Text className="text-muted">
                    Password must be at least 8 characters long.
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                
                <Button className="w-100 mb-3" type="submit" disabled={loading}>
                  {loading ? 'Registering...' : 'Register'}
                </Button>
                
                <div className="text-center mt-3">
                  Already have an account? <Link to="/login">Log in</Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default RegisterPage;