// Token handling functions
export const setToken = (token) => {
  localStorage.setItem('auth_token', token);
};

// Get the token with expiration check
export const getToken = () => {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;
  
  // Check if token is expired
  try {
    const decoded = parseJwt(token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    
    if (decoded && decoded.exp && decoded.exp < currentTime) {
      // Token expired, clear it
      console.log('Token expired, clearing localStorage');
      clearTokens();
      return null;
    }
    
    return token;
  } catch (e) {
    console.error('Error parsing token:', e);
    return token; // Return token anyway to prevent login loops
  }
};

export const clearTokens = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
};

// User data handling
export const setUser = (userData) => {
  localStorage.setItem('user_data', JSON.stringify(userData));
};

export const getUser = () => {
  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Check if user has a specific role
export const hasRole = (role) => {
  const user = getUser();
  return user && user.role === role;
};

// Check if user is admin
export const isAdmin = () => {
  return hasRole('admin');
};

// Parse JWT to get user info
export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.error('Error parsing JWT:', e);
    return null;
  }
};

// Extract and store user info from token
export const processToken = (token) => {
  if (!token) {
    console.error('No token provided');
    return null;
  }
  
  setToken(token);
  const decodedToken = parseJwt(token);
  if (decodedToken) {
    const userData = {
      ID: decodedToken.ID || decodedToken.id || decodedToken.userId || decodedToken.sub,
      username: decodedToken.username || decodedToken.name,
      role: decodedToken.role || 'user',
      exp: decodedToken.exp
    };
    
    setUser(userData);
    return userData;
  }
  return null;
};