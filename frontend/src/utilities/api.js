import axios from 'axios';
import { getToken, clearTokens } from './auth';

// Create an axios instance with default config
const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Don't auto-logout for edit forms or admin pages
    const isEditForm = window.location.pathname.includes('/edit') || 
                       window.location.pathname.includes('/new') ||
                       window.location.pathname.includes('/admin');
    
    // For any pages with auth errors, log out except admin pages
    if (!isEditForm && 
        error.response && 
        (error.response.status === 401 || error.response.status === 403)) {
      
      clearTokens();
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// API services for Books
export const bookService = {
  getAll: (page = 1, limit = 100) => {
    const timestamp = new Date().getTime();
    return api.get(`/books?page=${page}&limit=${limit}&t=${timestamp}`);
  },
  
  getById: (id) => {
    return api.get(`/books/${id}`);
  },
  
  create: (book) => {
    return api.post('/books', book);
  },
  
  update: (id, book) => {
    return api.put(`/books/${id}`, book);
  },
  
  delete: (id) => {
    return api.delete(`/books/${id}`);
  },
  
  getReviews: (id) => {
    return api.get(`/books/${id}/reviews`);
  },
  
  getAverageRating: (id) => {
    return api.get(`/books/${id}/average-rating`);
  }
};

export const authorService = {
  getAll: (limit = 100) => {
    const timestamp = new Date().getTime();
    return api.get(`/authors?limit=${limit}&t=${timestamp}`);
  },
  
  getById: (id) => {
    return api.get(`/authors/${id}`);
  },
  
  create: (author) => {
    return api.post('/authors', author);
  },
  
  update: (id, author) => {
    return api.put(`/authors/${id}`, author);
  },
  
  delete: (id) => {
    return api.delete(`/authors/${id}`);
  }
};

export const reviewService = {
  create: (bookId, review) => {
    return api.post(`/books/${bookId}/reviews`, review);
  },
  
  update: (bookId, reviewId, review) => {
    return api.put(`/books/${bookId}/reviews/${reviewId}`, review);
  },
  
  delete: (bookId, reviewId) => {
    return api.delete(`/books/${bookId}/reviews/${reviewId}`);
  }
};

export const userService = {
  getAll: () => {
    return api.get('/users');
  },
  
  getById: (id) => {
    return api.get(`/users/${id}`);
  },
  
  register: (user) => {
    return api.post('/users', user);
  },
  
  login: (credentials) => {
    return api.post('/users/login', credentials);
  },
  
  updateProfile: (id, userData) => {
    return api.put(`/users/${id}`, userData);
  },
  
  delete: (id) => {
    return api.delete(`/users/${id}`);
  }
};

export const genreService = {
  getAll: () => {
    return api.get('/genres');
  },
  
  getById: (id) => {
    return api.get(`/genres/${id}`);
  },
  
  create: (genre) => {
    return api.post('/genres', genre);
  },
  
  update: (id, genre) => {
    return api.put(`/genres/${id}`, genre);
  },
  
  delete: (id) => {
    return api.delete(`/genres/${id}`);
  }
};

export default api;