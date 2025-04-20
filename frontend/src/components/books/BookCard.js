import React, { useState, useEffect } from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import RatingStars from './RatingStars';
import { bookService, authorService } from '../../utilities/api';

const BookCard = ({ book }) => {
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [authorInfo, setAuthorInfo] = useState(null);

  // Fetch book rating and author info when component mounts
  useEffect(() => {
    if (!book) return;
    
    const bookId = book.ID || book.id;
    
    // Fetch book rating
    if (bookId) {
      setLoading(true);
      
      bookService.getAverageRating(bookId)
        .then(response => {
          // Handle different response formats
          const ratingValue = 
            typeof response.data === 'number' ? response.data :
            response.data?.rating !== undefined ? response.data.rating :
            response.data?.averageRating !== undefined ? response.data.averageRating :
            response.data?.average !== undefined ? response.data.average : 
            0; // Default rating
          
          setRating(ratingValue);
        })
        .catch(error => {
          console.error('Error fetching book rating:', error);
          setRating(0);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    
    // Fetch author info if needed
    const authorId = book.authorID || book.authorId;
    if (authorId) {
      authorService.getById(authorId)
        .then(response => {
          const authorData = Array.isArray(response.data) ? response.data[0] : response.data;
          if (authorData && authorData.name) {
            setAuthorInfo(authorData);
          }
        })
        .catch(error => {
          console.error('Error fetching author details:', error);
        });
    }
  }, [book]);

  if (!book) {
    return null;
  }

  const defaultImage = '/images/book-cover-placeholder.jpg';
  
  // Handle both uppercase and lowercase ID properties
  const bookId = book.ID || book.id;
  
  // Get proper author ID
  const getAuthorId = () => {
    return book.authorID || book.authorId || 
           (book.author && (book.author.ID || book.author.id)) ||
           (authorInfo && (authorInfo.ID || authorInfo.id));
  };
  
  // Get author name with proper priority to ensure accuracy
  const getAuthorName = () => {
    // First priority: fetched author info (most accurate)
    if (authorInfo && authorInfo.name) {
      return authorInfo.name;
    }
    
    // Second priority: book's authorName field
    if (book.authorName) {
      return book.authorName;
    }
    
    // Third priority: author object with name
    if (book.author && typeof book.author === 'object' && book.author.name) {
      return book.author.name;
    }
    
    // Fourth priority: author as string
    if (book.author && typeof book.author === 'string') {
      return book.author;
    }
    
    // Fallback to unknown
    return 'Unknown Author';
  };
  
  // Safely handle genres in different formats
  const renderGenres = () => {
    if (!book.genres || !Array.isArray(book.genres) || book.genres.length === 0) {
      return null;
    }
    
    return (
      <div className="mb-2">
        {book.genres.map((genre, index) => {
          let genreName = '';
          
          if (typeof genre === 'object' && genre !== null) {
            genreName = genre.name || 'Unknown';
          } else if (typeof genre === 'string') {
            genreName = genre;
          } else if (typeof genre === 'number') {
            // If genre is just an ID number, return a generic label
            genreName = `Genre ${genre}`;
          }
          
          return (
            <Badge bg="secondary" className="me-1 mb-1" key={index}>
              {genreName}
            </Badge>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="h-100 shadow-sm book-card">
      <Link to={`/books/${bookId}`} className="text-decoration-none">
        <Card.Img 
          variant="top" 
          src={book.imageURL || book.imageUrl || defaultImage} 
          alt={book.title || 'Book Cover'}
          style={{ height: '200px', objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = defaultImage;
            e.target.onerror = null;
          }}
        />
      </Link>
      <Card.Body className="d-flex flex-column">
        <Link to={`/books/${bookId}`} className="text-decoration-none text-dark">
          <Card.Title className="fs-5 text-truncate">{book.title || 'Unknown Title'}</Card.Title>
        </Link>
        
        {/* Author name with proper author data */}
        <Card.Subtitle className="mb-2 text-muted small">
          by <Link to={`/authors/${getAuthorId()}`} className="text-decoration-none text-muted">{getAuthorName()}</Link>
        </Card.Subtitle>
        
        {/* Abbreviated summary */}
        {book.summary && (
          <Card.Text className="small text-muted mb-2" style={{ 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            display: '-webkit-box', 
            WebkitLineClamp: 3, 
            WebkitBoxOrient: 'vertical' 
          }}>
            {book.summary}
          </Card.Text>
        )}
        
        {/* Rating stars */}
        <div className="mt-auto mb-2 d-flex align-items-center">
          <RatingStars rating={loading ? 0 : rating} size="sm" />
          
          {/* Add the numeric rating */}
          <span className="ms-1 small text-muted">
            {loading ? '(0)' : `(${rating.toFixed(1)})`}
          </span>
        </div>
        
        {/* Genres if available */}
        {renderGenres()}
        
        <Link to={`/books/${bookId}`} className="btn btn-sm btn-outline-primary mt-auto">
          View Details
        </Link>
      </Card.Body>
    </Card>
  );
};

export default BookCard;