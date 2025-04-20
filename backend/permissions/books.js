// permissions/books.js
module.exports = {
  // Check if user can create a book (only admins can create a book)
  create: (currentUser) => {
    return { granted: currentUser.role === 'admin' };  // Only admin can create books
  },

  // Check if user can update a book (admins can update any book, users can update their own book)
  update: (currentUser, book) => {
    if (currentUser.role === 'admin') {
      return { granted: true };  // Admins can update any book
    }
    // If the user is the author, they can update their own book
    if (currentUser.ID === book.authorID) {
      return { granted: true };  // Users can only update their own books
    }
    return { granted: false };
  },

  // Check if user can delete a book (only admins can delete books)
  delete: (currentUser) => {
    return { granted: currentUser.role === 'admin' };  // Only admin can delete books
  }
};
