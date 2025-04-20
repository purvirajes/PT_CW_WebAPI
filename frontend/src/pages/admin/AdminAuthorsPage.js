import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { authorService } from '../../utilities/api';
import Loading from '../../components/common/Loading';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';

const AdminAuthorsPage = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const location = useLocation();

  // Fetch authors when component mounts or location changes
  useEffect(() => {
    fetchAuthors();
  }, [location]);

  // Also refresh when window regains focus
  useEffect(() => {
    const handleFocus = () => {
      fetchAuthors();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchAuthors = async () => {
  try {
    setLoading(true);
    const response = await authorService.getAll(100); // Pass 100 as the limit
    setAuthors(Array.isArray(response.data) ? response.data : []);
    setError(null);
  } catch (err) {
    setError('Failed to load authors. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const handleDeleteAuthor = async (id) => {
    if (window.confirm('Are you sure you want to delete this author? This action cannot be undone.')) {
      try {
        await authorService.delete(id);
        setSuccessMessage('Author deleted successfully');
        // Refresh the author list
        fetchAuthors();
      } catch (err) {
        setError('Failed to delete author. Please try again.');
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Manage Authors</h1>
        <div>
          <Button 
            as={Link} 
            to="/admin/authors/new" 
            variant="primary"
            className="me-2"
          >
            <FaPlus className="me-2" /> Add New Author
          </Button>
          <Button 
            variant="outline-secondary" 
            onClick={fetchAuthors} 
            size="sm"
          >
            Refresh List
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && (
        <Alert variant="success" dismissible onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}

      {authors.length === 0 ? (
        <Alert variant="info">No authors found. Add a new author to get started.</Alert>
      ) : (
        <Table responsive striped hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Biography</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {authors.map((author) => (
              <tr key={author.ID || author.id}>
                <td>{author.ID || author.id}</td>
                <td>
                  <Link to={`/authors/${author.ID || author.id}`}>{author.name}</Link>
                </td>
                <td>{author.bio ? `${author.bio.substring(0, 50)}...` : 'No biography'}</td>
                <td>
                  <Button
                    as={Link}
                    to={`/admin/authors/${author.ID || author.id}/edit`}
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                  >
                    <FaEdit /> Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteAuthor(author.ID || author.id)}
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

export default AdminAuthorsPage;