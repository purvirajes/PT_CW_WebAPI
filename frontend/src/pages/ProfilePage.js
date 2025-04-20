// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../utilities/api';
import Loading from '../components/common/Loading';
import { FaEdit, FaUserCircle, FaBookOpen } from 'react-icons/fa';

const ProfilePage = () => {
  const { currentUser, updateProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    role: ''
  });
  const [originalData, setOriginalData] = useState({
    username: '',
    email: '',
    role: ''
  });

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching profile for user ID:", currentUser.ID);
        const response = await userService.getById(currentUser.ID);
        console.log("User data response:", response.data);
        
        const user = Array.isArray(response.data) ? response.data[0] : response.data;
        
        if (!user) {
          throw new Error("User data not found");
        }
        
        const userData = {
          username: user.username || '',
          email: user.email || '',
          role: user.role || 'user'
        };
        
        console.log("Setting user data:", userData);
        setUserData(userData);
        setOriginalData(JSON.parse(JSON.stringify(userData))); // Deep copy
        
        setError(null);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load your profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Reset form to original data - using the deep copy made earlier
    console.log("Cancelling edit, resetting to:", originalData);
    setUserData({...originalData});
    setIsEditing(false);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to update your profile');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);
      
      console.log("Updating profile for user ID:", currentUser.ID);
      console.log("New profile data:", userData);
      
      // Create update object with only the fields that can be updated
      const updateData = {
        username: userData.username,
        email: userData.email
      };
      
      const response = await userService.updateProfile(currentUser.ID, updateData);
      console.log("Profile update response:", response.data);
      
      // Save the updated data as the new original data
      setOriginalData({...userData});
      
      // Update auth context
      if (updateProfile) {
        await updateProfile(currentUser.ID, updateData);
      }
      
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile: ' + (err.response?.data?.error || err.message || 'Please try again.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!currentUser) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <Alert.Heading>Authentication Required</Alert.Heading>
          <p>You must be logged in to view your profile.</p>
          <div className="d-flex gap-2">
            <Button as={Link} to="/login" variant="primary">Login</Button>
            <Button as={Link} to="/register" variant="outline-primary">Register</Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col lg={8} className="mx-auto">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>My Profile</h1>
            <div>
              <Button as={Link} to="/my-reviews" variant="outline-primary" className="me-2">
                <FaBookOpen className="me-2" /> My Reviews
              </Button>
            </div>
          </div>
          
          {error && <Alert variant="danger">{error}</Alert>}
          {successMessage && <Alert variant="success" dismissible onClose={() => setSuccessMessage(null)}>{successMessage}</Alert>}
          
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <div className="d-flex align-items-center">
                <FaUserCircle size={24} className="me-2" />
                <h5 className="mb-0">Profile Information</h5>
              </div>
            </Card.Header>
            <Card.Body>
              {isEditing ? (
                <Form onSubmit={handleSubmit}>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3}>Username</Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="text"
                        name="username"
                        value={userData.username}
                        onChange={handleChange}
                        required
                      />
                    </Col>
                  </Form.Group>
                  
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3}>Email</Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        required
                      />
                    </Col>
                  </Form.Group>
                  
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3}>Role</Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        plaintext
                        readOnly
                        value={userData.role || 'user'}
                      />
                      <Form.Text className="text-muted">
                        Your account role cannot be changed.
                      </Form.Text>
                    </Col>
                  </Form.Group>
                  
                  <div className="d-flex justify-content-end gap-2">
                    <Button variant="secondary" onClick={handleCancel} disabled={saving}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </Form>
              ) : (
                <>
                  <Row className="mb-3">
                    <Col sm={3} className="fw-bold">Username:</Col>
                    <Col sm={9}>{userData.username}</Col>
                  </Row>
                  
                  <Row className="mb-3">
                    <Col sm={3} className="fw-bold">Email:</Col>
                    <Col sm={9}>{userData.email}</Col>
                  </Row>
                  
                  <Row className="mb-3">
                    <Col sm={3} className="fw-bold">Role:</Col>
                    <Col sm={9}>{userData.role || 'user'}</Col>
                  </Row>
                  
                  <div className="d-flex justify-content-end">
                    <Button variant="primary" onClick={handleEdit}>
                      <FaEdit className="me-2" /> Edit Profile
                    </Button>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;