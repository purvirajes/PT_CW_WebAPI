// src/pages/AuthorsPage.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { authorService } from '../utilities/api';
import { FaSearch } from 'react-icons/fa';

const AuthorsPage = () => {
  const [authors, setAuthors] = useState([]);
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        setLoading(true);
        console.log(`Fetching authors (attempt ${retryCount + 1})`);
        
        const response = await authorService.getAll();
        console.log('Authors data:', response.data);
        
        if (Array.isArray(response.data)) {
          // No need to filter test data now as it's been removed from the database
          const validAuthors = response.data;
          
          setAuthors(validAuthors);
          setFilteredAuthors(validAuthors);
          setError(null);
        } else {
          console.error('Authors data is not an array:', response.data);
          setError('Received invalid data from server. Please try again.');
        }
      } catch (err) {
        console.error('Error fetching authors:', err);
        setError(`Failed to load authors: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, [retryCount]);

  // Filter authors when search term changes
  useEffect(() => {
    if (!authors.length) return;
    
    if (!searchTerm.trim()) {
      setFilteredAuthors(authors);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = authors.filter(author => 
        (author.name && author.name.toLowerCase().includes(term)) || 
        (author.bio && author.bio.toLowerCase().includes(term))
      );
      setFilteredAuthors(filtered);
    }
  }, [searchTerm, authors]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Authors</h1>
      
      {/* Search bar */}
      <Form className="mb-4">
        <InputGroup>
          <InputGroup.Text id="search-addon">
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search by author name or bio..."
            value={searchTerm}
            onChange={handleSearchChange}
            aria-label="Search authors"
            aria-describedby="search-addon"
          />
        </InputGroup>
      </Form>
      
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading authors...</p>
        </div>
      )}
      
      {error && (
        <Alert variant="danger">
          <Alert.Heading>Error loading authors</Alert.Heading>
          <p>{error}</p>
          <div className="d-flex justify-content-end">
            <Button onClick={handleRetry} variant="outline-danger">
              Try Again
            </Button>
          </div>
        </Alert>
      )}
      
      {!loading && !error && (
        <>
          {filteredAuthors.length === 0 ? (
            <Alert variant="info">
              {searchTerm ? 'No authors match your search.' : 'No authors available.'}
            </Alert>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {filteredAuthors.map((author) => (
                <Col key={author.ID || author.id}>
                  <Card className="h-100 shadow-sm hover-card">
                    <Card.Body>
                      <Card.Title className="mb-3">{author.name}</Card.Title>
                      <Card.Text className="text-muted">
                        {author.bio ? 
                          (author.bio.length > 150 ? `${author.bio.substring(0, 150)}...` : author.bio) : 
                          'No biography available'}
                      </Card.Text>
                      <div className="mt-auto">
                        <Button 
                          as={Link} 
                          to={`/authors/${author.ID || author.id}`} 
                          variant="outline-primary"
                          className="w-100 mt-2"
                        >
                          View Details
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
    </Container>
  );
};

export default AuthorsPage;