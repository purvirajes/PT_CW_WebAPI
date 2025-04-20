import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authorService } from '../../utilities/api';
import Loading from '../../components/common/Loading';
import { FaArrowLeft } from 'react-icons/fa';

const AuthorEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewAuthor = !id || id === 'new';
  const pageTitle = isNewAuthor ? 'Add New Author' : 'Edit Author';

  const [formData, setFormData] = useState({
    name: '',
    bio: ''
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch author data on component mount if editing
  useEffect(() => {
    const fetchData = async () => {
      if (isNewAuthor) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const authorResponse = await authorService.getById(id);
        const author = authorResponse.data;
        
        setFormData({
          name: author.name || '',
          bio: author.bio || ''
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching author:', err);
        setError('Failed to load author data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isNewAuthor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setSubmitting(true);
    setError(null);

    if (!formData.name.trim()) {
      setError('Author name is required');
      setSubmitting(false);
      return;
    }

    const cleanData = {
      name: formData.name.trim(),
      bio: formData.bio?.trim() || ''
    };

    if (isNewAuthor) {
      console.log('Creating author with data:', cleanData); 
      const response = await authorService.create(cleanData);
      console.log('Author creation response:', response);

      setTimeout(() => {
        navigate('/admin/authors', {
          state: { message: 'Author created successfully' }
        });
      }, 100);
    } else {
      console.log('Updating author:', id, cleanData);
      const response = await authorService.update(id, cleanData);
      console.log('Author update response:', response);

      setTimeout(() => {
        navigate('/admin/authors', {
          state: { message: 'Author updated successfully' }
        });
      }, 100);
    }
  } catch (err) {
    console.error('Author save error:', err);
    const backendMessage = err.response?.data?.message || err.message || 'Unknown error';
    setError(`Failed to save author: ${backendMessage}`);
    setSubmitting(false);
  }
};


  if (loading) {
    return <Loading />;
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{pageTitle}</h1>
        <Button 
          as={Link}
          to="/admin/authors/new"
          variant="outline-secondary"
        >
          <FaArrowLeft className="me-2" /> Back to Authors
        </Button>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card className="shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter author name"
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label>Biography</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Enter author's biography (optional)"
              />
            </Form.Group>
            
            <div className="d-flex gap-2">
              <Button 
                type="submit" 
                variant="primary"
                disabled={submitting}
              >
                {submitting ? 
                  (isNewAuthor ? 'Creating...' : 'Updating...') : 
                  (isNewAuthor ? ' Author' : 'Update Author')}
              </Button>
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => navigate('/admin/authors')}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AuthorEditPage;