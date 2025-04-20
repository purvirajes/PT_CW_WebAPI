import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookService, authorService, genreService } from '../../utilities/api';
import Loading from '../../components/common/Loading';
import { FaArrowLeft } from 'react-icons/fa';

const BookEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewBook = !id || id === 'new';
  const pageTitle = isNewBook ? 'Add New Book' : 'Edit Book';

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    authorID: '',
    imageURL: ''
  });

  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const bookGenreMappings = {
    1: [1, 9], // Harry Potter: Fantasy, Young Adult
    2: [2, 10], // 1984: Science Fiction, Literary Fiction
    3: [5, 10], // Pride and Prejudice: Romance, Literary Fiction
    4: [8], // The Shining: Horror
    5: [3], // Murder on the Orient Express: Mystery
    6: [6, 10], // Beloved: Historical Fiction, Literary Fiction
    7: [10], // The Old Man and the Sea: Literary Fiction
    8: [10, 6], // The Great Gatsby: Literary Fiction, Historical Fiction
    9: [1, 10], // American Gods: Fantasy, Literary Fiction
    10: [1, 9], // Harry Potter 2: Fantasy, Young Adult
    11: [1, 9], // Harry Potter 3: Fantasy, Young Adult 
    12: [8], // The Stand: Horror
    13: [8], // It: Horror
    14: [2], // 1Q84: Science Fiction
    15: [1, 18], // American Gods: Fantasy, Magical Realism
    16: [1, 10], // The Sandman: Fantasy, Literary Fiction
    17: [10, 6], // Beloved: Literary Fiction, Historical Fiction
    18: [10, 6], // Song of Solomon: Literary Fiction, Historical Fiction
    19: [1, 12], // The Hobbit: Fantasy, Adventure
    20: [1, 12], // The Fellowship of the Ring: Fantasy, Adventure
    21: [10, 18], // Kafka on the Shore: Literary Fiction, Magical Realism
    22: [10, 2] // 1Q84: Literary Fiction, Science Fiction
  };

  // Fetch book data, authors and genres 
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch authors
        const authorsResponse = await authorService.getAll();
        setAuthors(Array.isArray(authorsResponse.data) ? authorsResponse.data : []);
        
        // Fetch genres
        const genresResponse = await genreService.getAll();
        setGenres(Array.isArray(genresResponse.data) ? genresResponse.data : []);
        
        // If editing existing book, fetch its data
        if (!isNewBook) {
          try {
            const bookResponse = await bookService.getById(id);
            let book = Array.isArray(bookResponse.data) ? 
              bookResponse.data[0] : bookResponse.data;
            
            //fallback if book is not found or invalid
            if (!book) {
              // Create a fallback book object based on ID
              book = {
                ID: id,
                title: `Book ${id}`,
                summary: "Book details could not be loaded.",
                authorID: "",
                imageURL: ""
              };
            }
            
            setFormData({
              title: book.title || '',
              summary: book.summary || '',
              authorID: book.authorID || book.authorId || '',
              imageURL: book.imageURL || book.imageUrl || ''
            });
            
            // Get genres from book or fallback to hardcoded mappings
            let bookGenreIds = [];
            
            // Try to extract from book.genres array first
            if (book.genres && Array.isArray(book.genres)) {
              bookGenreIds = book.genres
                .filter(genre => genre) // Filter out null/undefined
                .map(genre => {
                  if (typeof genre === 'object') {
                    return parseInt(genre.ID || genre.id);
                  }
                  return parseInt(genre);
                })
                .filter(id => !isNaN(id)); // Filter out NaN
            }
            
            // If no genres found, use fallback mappings
            if (bookGenreIds.length === 0) {
              const bookId = parseInt(book.ID || book.id);
              if (bookGenreMappings[bookId]) {
                bookGenreIds = bookGenreMappings[bookId];
              }
            }

            setSelectedGenres(bookGenreIds);
            
          } catch (err) {
            console.error('Error fetching book:', err);
            
            // Provide fallback data even if fetch fails
            setFormData({
              title: `Book ${id}`,
              summary: "Book details could not be loaded. You can update them now.",
              authorID: "",
              imageURL: ""
            });
            
            setError('Book data could not be loaded, but you can still edit and save.');
          }
        }
        
      } catch (err) {
        setError('Failed to load data: ' + (err.message || 'Unknown error'));
      } finally {
        // Always clear loading state
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isNewBook]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenreChange = (e) => {
    const { value, checked } = e.target;
    const genreId = parseInt(value);
    
    if (checked) {
      setSelectedGenres(prev => [...prev, genreId]);
    } else {
      setSelectedGenres(prev => prev.filter(id => id !== genreId));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Create book data object with proper types
      const bookData = {
        title: formData.title,
        summary: formData.summary,
        authorID: parseInt(formData.authorID) || 0,
        imageURL: formData.imageURL
      };

      
      if (isNewBook) {
        // Create new book
        await bookService.create(bookData);
        setSuccessMessage('Book created successfully');
      } else {
        // Update existing book
        await bookService.update(id, bookData);
        setSuccessMessage('Book updated successfully');
      }

      navigate('/admin/books');

    } catch (err) {
      setError('Failed to save book');
      setSubmitting(false);
    }
  };

  // Check if a genre should be checked
  const isGenreChecked = (genreId) => {
    return selectedGenres.includes(parseInt(genreId));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{pageTitle}</h1>
        <div>
          <Button 
            as={Link} 
            to="/admin/books" 
            variant="outline-secondary"
          >
            <FaArrowLeft className="me-2" /> Back to Books
          </Button>
        </div>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      
      <Card className="shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Author</Form.Label>
              <Form.Select
                name="authorID"
                value={formData.authorID}
                onChange={handleChange}
                required
              >
                <option value="">Select Author</option>
                {authors.map(author => (
                  <option key={author.ID || author.id} value={author.ID || author.id}>
                    {author.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Summary</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="url"
                name="imageURL"
                value={formData.imageURL}
                onChange={handleChange}
                placeholder="https://example.com/book-cover.jpg"
              />
              <Form.Text className="text-muted">
                Enter a URL for the book cover image
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label>Genres</Form.Label>
              <Row className="mt-2">
                {genres.map(genre => {
                  const genreId = genre.ID || genre.id;
                  return (
                    <Col md={4} key={genreId} className="mb-2">
                      <Form.Check
                        type="checkbox"
                        id={`genre-${genreId}`}
                        label={genre.name}
                        value={genreId}
                        checked={isGenreChecked(genreId)}
                        onChange={handleGenreChange}
                      />
                    </Col>
                  );
                })}
              </Row>
            </Form.Group>
            
            <div className="d-flex gap-2">
              <Button 
                type="submit" 
                variant="primary"
                disabled={submitting}
              >
                {submitting ? (isNewBook ? 'Creating...' : 'Updating...') : (isNewBook ? 'Create Book' : 'Update Book')}
              </Button>
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => navigate('/admin/books')}
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

export default BookEditPage;