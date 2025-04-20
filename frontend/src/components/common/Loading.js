import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '200px' }}>
      <Spinner animation="border" role="status" variant="primary" className="mb-2">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <p className="text-center text-muted">{message}</p>
    </div>
  );
};

export default Loading;