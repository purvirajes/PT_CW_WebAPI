import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { bookService } from '../utilities/api';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/common/Loading';
import BookCard from '../components/books/BookCard';

const HomePage = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser, isAdmin } = useAuth();

    useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        setLoading(true);
        const response = await bookService.getAll(1, 4); // Get first 4 books for featured section
        
        // Set featured books directly since test data has been removed
        const bookData = Array.isArray(response.data) ? response.data : [];
        const filteredBooks = bookData.slice(0, 4); // Ensure we only get 4 max
        
        setFeaturedBooks(filteredBooks);
        setError(null);
      } catch (err) {
        console.error('Error fetching featured books:', err);
        setError('Failed to load featured books');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBooks();
  }, []);

  return (
    <Container>
      {/* Hero Section */}
      <Row className="py-5 mb-5 bg-light rounded">
        <Col md={6} className="d-flex flex-column justify-content-center">
          <h1 className="display-4 fw-bold">Discover Your Next Favorite Book</h1>
          <p className="lead my-3">
            Browse through our collection of books, read reviews, and share your thoughts with our community.
          </p>
          <div className="d-flex gap-2">
            <Button as={Link} to="/books" variant="primary" size="lg">
              Browse Books
            </Button>
            {!currentUser && (
              <Button as={Link} to="/register" variant="outline-secondary" size="lg">
                Join Now
              </Button>
            )}
          </div>
        </Col>
        <Col md={6} className="d-flex align-items-center justify-content-center">
          <div className="bg-secondary p-4 rounded" style={{ width: '100%', maxWidth: '400px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="text-white text-center">
              <h3>Book Collection</h3>
              <p>Discover amazing literature from our collection</p>
              {!currentUser && (
                <Button as={Link} to="/login" variant="light" size="sm" className="mt-2">
                  Log in to add reviews
                </Button>
              )}
            </div>
          </div>
        </Col>
      </Row>

      {/* Featured Books Section */}
      <h2 className="mb-4">Featured Books</h2>
      {loading ? (
        <Loading />
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : featuredBooks.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-muted">No books available yet. Check back soon!</p>
          {isAdmin && (
            <Button as={Link} to="/admin/books/new" variant="primary" className="mt-2">
              Add Your First Book
            </Button>
          )}
        </div>
      ) : (
        <Row xs={1} md={2} lg={4} className="g-4 mb-5">
          {featuredBooks.map((book) => (
            <Col key={book.ID || book.id}>
              <BookCard book={book} />
            </Col>
          ))}
        </Row>
      )}

      {/* Features Section */}
      <h2 className="mb-4">Why Join Our Community?</h2>
      <Row xs={1} md={3} className="g-4 mb-5">
        <Col>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center p-4">
              <div className="mb-3 text-primary" style={{ fontSize: "2rem" }}>
                📚
              </div>
              <Card.Title>Discover New Books</Card.Title>
              <Card.Text>
                Find new authors and genres that match your interests.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center p-4">
              <div className="mb-3 text-primary" style={{ fontSize: "2rem" }}>
                ⭐
              </div>
              <Card.Title>Read & Write Reviews</Card.Title>
              <Card.Text>
                Share your thoughts and see what others think about books.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center p-4">
              <div className="mb-3 text-primary" style={{ fontSize: "2rem" }}>
                👥
              </div>
              <Card.Title>Join the Community</Card.Title>
              <Card.Text>
                Connect with fellow book lovers and discuss your favorite reads.
                {!currentUser && (
                  <div className="mt-3">
                    <Button as={Link} to="/register" variant="outline-primary" size="sm">Register</Button>
                  </div>
                )}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Admin Account Information - ONLY show when NOT logged in */}
      {!currentUser && (
        <Card className="mb-5 bg-light">
          <Card.Body>
            <h5>How to Access Admin Features</h5>
            <p>
              For testing purposes, you can access admin features with these credentials:
            </p>
            <ul>
              <li><strong>Username:</strong> admin</li>
              <li><strong>Password:</strong> admin123</li>
            </ul>
            <p className="mb-0 small text-muted">
              Note: In a production environment, admin accounts would be created by system administrators, not through the regular registration process.
            </p>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default HomePage;