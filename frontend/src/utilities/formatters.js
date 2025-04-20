// Date formatters
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  
  try {
    return new Date(dateString).toLocaleDateString(undefined, options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  try {
    return new Date(dateString).toLocaleDateString(undefined, options);
  } catch (error) {
    console.error('Error formatting date time:', error);
    return dateString;
  }
};

export const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    // Less than a minute
    if (seconds < 60) {
      return 'just now';
    }
    
    // Less than an hour
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    
    // Less than a day
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
    
    // Less than a week
    const days = Math.floor(hours / 24);
    if (days < 7) {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
    
    // Less than a month
    if (days < 30) {
      const weeks = Math.floor(days / 7);
      return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
    }
    
    // Less than a year
    if (days < 365) {
      const months = Math.floor(days / 30);
      return `${months} month${months !== 1 ? 's' : ''} ago`;
    }
    
    // More than a year
    const years = Math.floor(days / 365);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
    
  } catch (error) {
    console.error('Error formatting time ago:', error);
    return dateString;
  }
};

// Text formatters
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return `${text.substring(0, maxLength).trim()}...`;
};

export const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const formatUsername = (username) => {
  if (!username) return 'Anonymous';
  
  return username;
};

// Rating formatters
export const formatRating = (rating) => {
  if (rating === null || rating === undefined) return 'No rating';
  
  const numRating = Number(rating);
  
  if (isNaN(numRating)) return 'Invalid rating';
  
  return `${numRating.toFixed(1)} / 5`;
};

export default {
  formatDate,
  formatDateTime,
  formatTimeAgo,
  truncateText,
  capitalizeFirstLetter,
  formatUsername,
  formatRating
};