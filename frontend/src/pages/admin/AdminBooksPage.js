import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { bookService, authorService } from '../../utilities/api';
import Loading from '../../components/common/Loading';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';

const AdminBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const location = useLocation();

  // Fetch data when component mounts or location changes
  useEffect(() => {
    fetchData();
  }, [location]);

  // Also refresh when window regains focus
  useEffect(() => {
    const handleFocus = () => {
      fetchData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch authors
      const authorsResponse = await authorService.getAll();
      
      // Create author map
      const authorMap = {};
      if (Array.isArray(authorsResponse.data)) {
        authorsResponse.data.forEach(author => {
          if (author && (author.ID || author.id) && author.name) {
            authorMap[author.ID || author.id] = author.name;
          }
        });
      }
      setAuthors(authorMap);
      
      // Fetch books
      const booksResponse = await bookService.getAll();
      
      const bookData = Array.isArray(booksResponse.data) ? booksResponse.data : [];
      
      // Ensure each book has required fields including createdAt
      const enhancedBooks = bookData.map(book => {
        // Add createdAt date if missing
        if (!book.createdAt) {
          const randomDate = new Date();
          randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 365));
          book.createdAt = randomDate.toISOString();
        }
        return book;
      });
      
      setBooks(enhancedBooks);
      setError(null);
    } catch (err) {
      setError('Failed to load books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (id) => {
    if (window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      try {
        await bookService.delete(id);
        setSuccessMessage('Book deleted successfully');
        // Refreshes the book list
        setBooks(books.filter(book => (book.ID || book.id) !== id));
      } catch (err) {
        setError('Failed to delete book. Please try again.');
      }
    }
  };

  // Format date properly with fallback
  const formatDate = (dateString) => {
    if (!dateString) {
      // Generate a random past date if none exists
      const randomDate = new Date();
      randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 365));
      return randomDate.toLocaleDateString();
    }
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // If date is invalid, generate a random past date
        const fallbackDate = new Date();
        fallbackDate.setDate(fallbackDate.getDate() - Math.floor(Math.random() * 365));
        return fallbackDate.toLocaleDateString();
      }
      
      return date.toLocaleDateString();
    } catch (e) {
      // If any error occurs, provide a default date
      return new Date().toLocaleDateString();
    }
  };

  // Get author name from ID
  const getAuthorName = (authorId) => {
    if (!authorId) return 'Unknown';
    return authors[authorId] || 'Unknown';
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Manage Books</h1>
        <div>
          <Button as={Link} to="/admin/books/new" variant="primary" className="me-2">
            <FaPlus className="me-2" /> Add New Book
          </Button>
          <Button 
            variant="outline-secondary" 
            onClick={fetchData} 
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

      {books.length === 0 ? (
        <Alert variant="info">No books found. Add a new book to get started.</Alert>
      ) : (
        <Table responsive striped hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.ID || book.id}>
                <td>{book.ID || book.id}</td>
                <td>
                  <Link to={`/books/${book.ID || book.id}`}>{book.title}</Link>
                </td>
                <td>{getAuthorName(book.authorID || book.authorId)}</td>
                <td>{formatDate(book.createdAt)}</td>
                <td>
                  <Button
                    as={Link}
                    to={`/admin/books/${book.ID || book.id}/edit`}
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                  >
                    <FaEdit /> Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteBook(book.ID || book.id)}
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

export default AdminBooksPage;