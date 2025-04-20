import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row>
          <Col md={4} className="mb-3 mb-md-0">
            <h5>Book Review App</h5>
            <p className="text-muted">
              Discover, read, and review your favorite books.
            </p>
          </Col>
          <Col md={4} className="mb-3 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
              <li><Link to="/books" className="text-decoration-none text-muted">Books</Link></li>
              <li><Link to="/authors" className="text-decoration-none text-muted">Authors</Link></li>
              <li><Link to="/register" className="text-decoration-none text-muted">Join Us</Link></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Connect With Us</h5>
            <div className="d-flex gap-3">
              <a href="https://facebook.com" className="text-decoration-none text-muted">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://twitter.com" className="text-decoration-none text-muted">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="https://instagram.com" className="text-decoration-none text-muted">
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </Col>
        </Row>
        <hr className="my-3 bg-secondary" />
        <Row>
          <Col className="text-center text-muted">
            <small>&copy; {new Date().getFullYear()} Book Review App. All rights reserved.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;