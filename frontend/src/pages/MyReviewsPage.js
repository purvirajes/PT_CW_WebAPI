import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { bookService, reviewService } from '../utilities/api';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/common/Loading';
import RatingStars from '../components/books/RatingStars';
import { FaEdit, FaTrashAlt, FaBook } from 'react-icons/fa';

const MyReviewsPage = () => {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchUserReviews = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching reviews for user ID:", currentUser.ID);
        
        // First, fetch all books to get their data
        const booksResponse = await bookService.getAll();
        console.log("All books data:", booksResponse.data);
        const books = Array.isArray(booksResponse.data) ? booksResponse.data : [];
        
        // Create a map of book details by ID 
        const bookDetailsMap = {};
        books.forEach(book => {
          if (book && book.ID) {
            bookDetailsMap[book.ID] = book;
          }
        });
        

        const userReviews = [];
        
        
        for (const book of books) {
          if (!book || !book.ID) continue;
          
          try {
            const reviewsResponse = await bookService.getReviews(book.ID);
            const bookReviews = Array.isArray(reviewsResponse.data) ? reviewsResponse.data : [];
            
            // Filter for reviews by the current user
            const userBookReviews = bookReviews.filter(review => 
              review && review.userID === currentUser.ID
            );
            
            // Add book information to each review
            userBookReviews.forEach(review => {
              userReviews.push({
                ...review,
                bookTitle: book.title,
                bookID: book.ID,
                bookCover: book.imageURL
              });
            });
          } catch (err) {
            console.log(`Error fetching reviews for book ${book.ID}:`, err);
            // Continue with other books even if one fails
          }
        }
        
        console.log("User reviews found:", userReviews);
        setReviews(userReviews);
        setError(null);
      } catch (err) {
        console.error("Error fetching user reviews:", err);
        setError("Failed to load your reviews. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserReviews();
  }, [currentUser]);

  const handleDeleteReview = async (bookId, reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        console.log("Deleting review:", reviewId, "for book:", bookId);
        await reviewService.delete(bookId, reviewId);
        
        // Remove the review from the state
        setReviews(reviews.filter(review => review.ID !== reviewId));
        setSuccessMessage("Review deleted successfully");
      } catch (err) {
        console.error("Error deleting review:", err);
        setError("Failed to delete review. Please try again.");
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
  };

  if (loading) {
    return <Loading />;
  }

  if (!currentUser) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <Alert.Heading>Authentication Required</Alert.Heading>
          <p>You need to be logged in to view your reviews.</p>
          <div className="d-flex gap-2">
            <Button as={Link} to="/login" variant="primary">Login</Button>
            <Button as={Link} to="/register" variant="outline-primary">Register</Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Reviews</h1>
        <Button as={Link} to="/books" variant="outline-primary">
          <FaBook className="me-2" /> Browse Books
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && (
        <Alert variant="success" dismissible onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}

      {reviews.length === 0 ? (
        <Alert variant="info">
          <Alert.Heading>No Reviews Yet</Alert.Heading>
          <p>You haven't written any reviews yet. Browse our books and share your thoughts!</p>
          <div className="d-grid gap-2 d-md-flex justify-content-md-start">
            <Button as={Link} to="/books" variant="primary">
              Browse Books
            </Button>
          </div>
        </Alert>
      ) : (
        <Row>
          {reviews.map((review) => (
            <Col xs={12} key={review.ID} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <Row>
                    <Col md={3} className="mb-3 mb-md-0">
                      <Link to={`/books/${review.bookID}`}>
                        <img
                          src={review.bookCover || '/images/book-cover-placeholder.jpg'}
                          alt={review.bookTitle}
                          className="img-fluid rounded"
                          style={{ maxHeight: '150px', objectFit: 'cover' }}
                        />
                      </Link>
                    </Col>
                    <Col md={9}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <Link to={`/books/${review.bookID}`} className="text-decoration-none">
                            <h4 className="mb-1">{review.bookTitle || 'Unknown Book'}</h4>
                          </Link>
                          <div className="mb-2">
                            <RatingStars rating={review.rating || 0} />
                            <span className="ms-2 text-muted">
                              Reviewed on {formatDate(review.createdAt)}
                              {review.updatedAt && review.updatedAt !== review.createdAt && 
                                ` (updated ${formatDate(review.updatedAt)})`}
                            </span>
                          </div>
                          <p className="mb-0">{review.content}</p>
                        </div>
                        <div className="d-flex">
                          <Button
                            as={Link}
                            to={`/books/${review.bookID}`}
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                          >
                            <FaEdit /> Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteReview(review.bookID, review.ID)}
                          >
                            <FaTrashAlt /> Delete
                          </Button>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyReviewsPage;