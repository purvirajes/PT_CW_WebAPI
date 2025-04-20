import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { authorService, bookService } from '../utilities/api';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/common/Loading';
import BookCard from '../components/books/BookCard';
import { FaEdit, FaTrashAlt, FaArrowLeft } from 'react-icons/fa';

const AuthorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  const [author, setAuthor] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuthorAndBooks = async () => {
      try {
        setLoading(true);
        console.log("Fetching author with ID:", id);
        
        // Get author details
        const authorResponse = await authorService.getById(id);
        console.log("Author data:", authorResponse.data);
        
        // Handle both array response and direct object response
        const authorData = Array.isArray(authorResponse.data) ? 
          authorResponse.data[0] : authorResponse.data;
        
        if (!authorData) {
          throw new Error("Author not found");
        }
        
        setAuthor(authorData);
        
        // Get books by this author
        const booksResponse = await bookService.getAll();
        console.log("All books:", booksResponse.data);

        const authorBooks = booksResponse.data
          .filter(book => book.authorID === parseInt(id) || book.authorID === id);
          
        console.log("Author's filtered books:", authorBooks);
        setBooks(authorBooks);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching author details:', err);
        setError('Failed to load author details: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorAndBooks();
  }, [id]);

  const handleDeleteAuthor = async () => {
    if (window.confirm('Are you sure you want to delete this author? This will also delete all their books!')) {
      try {
        await authorService.delete(id);
        navigate('/authors');
      } catch (err) {
        console.error('Error deleting author:', err);
        setError('Failed to delete author. Please try again.');
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !author) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error || 'Author not found'}
        </Alert>
        <Button as={Link} to="/authors" variant="primary">
          <FaArrowLeft className="me-2" /> Back to Authors
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Button
        as={Link}
        to="/authors"
        variant="outline-secondary"
        className="mb-4"
      >
        <FaArrowLeft className="me-2" /> Back to Authors
      </Button>
      
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row>
            <Col md={8}>
              <h1 className="mb-3">{author.name}</h1>
              
              {/* Biography */}
              <h5 className="text-muted mb-3">Biography</h5>
              <p>{author.bio || 'No biography available for this author.'}</p>
            </Col>
            
            <Col md={4} className="d-flex flex-column justify-content-between">
              {/* Admin Actions */}
              {isAdmin && (
                <div className="d-flex justify-content-end gap-2 mb-3">
                  <Button 
                    as={Link} 
                    to={`/admin/authors/${id}/edit`} 
                    variant="outline-primary"
                  >
                    <FaEdit className="me-2" /> Edit
                  </Button>
                  <Button 
                    onClick={handleDeleteAuthor} 
                    variant="outline-danger"
                  >
                    <FaTrashAlt className="me-2" /> Delete
                  </Button>
                </div>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* Author's Books */}
      <h2 className="mb-3">Books by {author.name}</h2>
      {books.length === 0 ? (
        <Alert variant="info">No books found for this author.</Alert>
      ) : (
        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          {books.map((book) => (
            <Col key={book.ID || book.id}>
              <BookCard book={book} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default AuthorDetailPage;