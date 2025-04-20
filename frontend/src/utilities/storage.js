// Local storage utility functions

// Set an item in local storage
export const setItem = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error setting localStorage item:', error);
  }
};

// Get an item from local storage
export const getItem = (key) => {
  try {
    const serializedValue = localStorage.getItem(key);
    return serializedValue ? JSON.parse(serializedValue) : null;
  } catch (error) {
    console.error('Error getting localStorage item:', error);
    return null;
  }
};

// Remove an item from local storage
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing localStorage item:', error);
  }
};

// Clear all items from local storage
export const clearAll = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// Store recent books viewed
export const addRecentBook = (book) => {
  try {
    const recentBooks = getItem('recentBooks') || [];
    
    // Remove if already exists
    const filteredBooks = recentBooks.filter(b => b.ID !== book.ID);
    
    // Add to the beginning of the array
    filteredBooks.unshift({
      ID: book.ID,
      title: book.title,
      imageURL: book.imageURL,
      timestamp: new Date().toISOString()
    });
    
    // Keep only the most recent 5 books
    const limitedBooks = filteredBooks.slice(0, 5);
    
    setItem('recentBooks', limitedBooks);
  } catch (error) {
    console.error('Error storing recent book:', error);
  }
};

// Get recent books viewed
export const getRecentBooks = () => {
  return getItem('recentBooks') || [];
};

// Store search history
export const addSearchTerm = (term) => {
  if (!term.trim()) return;
  
  try {
    const searchHistory = getItem('searchHistory') || [];
    
    // Remove if already exists
    const filteredHistory = searchHistory.filter(item => 
      item.term.toLowerCase() !== term.toLowerCase()
    );
    
    // Add to the beginning of the array
    filteredHistory.unshift({
      term,
      timestamp: new Date().toISOString()
    });
    
    // Keep only the most recent 10 searches
    const limitedHistory = filteredHistory.slice(0, 10);
    
    setItem('searchHistory', limitedHistory);
  } catch (error) {
    console.error('Error storing search term:', error);
  }
};

// Get search history
export const getSearchHistory = () => {
  return getItem('searchHistory') || [];
};

// Clear search history
export const clearSearchHistory = () => {
  removeItem('searchHistory');
};

export default {
  setItem,
  getItem,
  removeItem,
  clearAll,
  addRecentBook,
  getRecentBooks,
  addSearchTerm,
  getSearchHistory,
  clearSearchHistory
};