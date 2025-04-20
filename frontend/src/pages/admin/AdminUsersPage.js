import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Badge } from 'react-bootstrap';
import { userService } from '../../utilities/api';
import Loading from '../../components/common/Loading';
import { FaTrashAlt } from 'react-icons/fa';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log("Fetching all users");
      const response = await userService.getAll();
      console.log("Users response:", response.data);
      
      // Set users directly since test data has been removed
      const userData = Array.isArray(response.data) ? response.data : [];
      
      setUsers(userData);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        console.log(`Deleting user with ID: ${id}`);
        await userService.delete(id);
        setSuccessMessage('User deleted successfully');
        // Refresh the user list
        setUsers(users.filter(user => (user.ID || user.id) !== id));
      } catch (err) {
        console.error('Error deleting user:', err);
        setError('Failed to delete user. Please try again.');
      }
    }
  };

  // Format date properly, handling invalid dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'N/A';
    }
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">Manage Users</h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && (
        <Alert variant="success" dismissible onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}

      {users.length === 0 ? (
        <Alert variant="info">No users found.</Alert>
      ) : (
        <Table responsive striped hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.ID || user.id}>
                <td>{user.ID || user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <Badge bg={user.role === 'admin' ? 'danger' : 'primary'}>
                    {user.role || 'user'}
                  </Badge>
                </td>
                <td>{formatDate(user.createdAt)}</td>
                <td>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteUser(user.ID || user.id)}
                    disabled={user.role === 'admin'} // Prevent deleting admin users
                  >
                    <FaTrashAlt /> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AdminUsersPage;