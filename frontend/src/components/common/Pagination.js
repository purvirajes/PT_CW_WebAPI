import React from 'react';
import { Pagination as BsPagination } from 'react-bootstrap';

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  // Calculate the total number of pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // If there's only one page or no items, don't show pagination
  if (totalPages <= 1) {
    return null;
  }

  // Calculate which page numbers to show
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Always show first page
    pageNumbers.push(1);
    
    // Calculate the range of pages to show around the current page
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis after page 1 if needed
    if (startPage > 2) {
      pageNumbers.push('...');
    }
    
    // Add the range of pages
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pageNumbers.push('...');
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <div className="d-flex justify-content-center mt-4">
      <BsPagination>
        {/* Previous button */}
        <BsPagination.Prev
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        
        {/* Page numbers */}
        {getPageNumbers().map((page, index) => {
          // For ellipsis, render a disabled item
          if (page === '...') {
            return <BsPagination.Ellipsis key={`ellipsis-${index}`} disabled />;
          }
          
          // For page numbers, render a clickable item
          return (
            <BsPagination.Item
              key={page}
              active={page === currentPage}
              onClick={() => onPageChange(page)}
            >
              {page}
            </BsPagination.Item>
          );
        })}
        
        {/* Next button */}
        <BsPagination.Next
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </BsPagination>
    </div>
  );
};

export default Pagination;