import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  isAuthenticated, 
  getUser, 
  processToken, 
  clearTokens 
} from '../utilities/auth';
import { userService } from '../utilities/api';

// Create the context
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Check if user is already logged in on page load
  useEffect(() => {
    const checkLoggedIn = () => {
      if (isAuthenticated()) {
        const userData = getUser();
        if (userData) {
          setCurrentUser(userData);
          console.log("User is authenticated:", userData);
        } else {
          console.log("Auth token exists but user data is missing");
          clearTokens(); // Clear invalid tokens
        }
      } else {
        console.log("No user authenticated");
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = useCallback(async (username, password) => {
    try {
      setError(null);
      setSuccessMessage(null);
      setLoading(true);
      console.log("Attempting login with:", { username });

      const response = await userService.login({ username, password });
      
      if (response.data && response.data.token) {
        const userData = processToken(response.data.token);
        console.log("Processed user data:", userData);
        
        if (userData) {
          setCurrentUser(userData);
          setSuccessMessage("Login successful!");
          return userData;
        } else {
          throw new Error("Failed to process authentication token");
        }
      } else {
        throw new Error("No token received from server");
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.error || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (userData) => {
    try {
      setError(null);
      setSuccessMessage(null);
      setLoading(true);
      console.log("Registering with:", userData);
      
      const response = await userService.register(userData);
      console.log("Registration response:", response.data);
      
      setSuccessMessage("Registration successful! You can now log in.");
      return response.data;
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = err.response?.data?.error || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    clearTokens();
    setCurrentUser(null);
    setSuccessMessage("You have been logged out successfully.");
  }, []);

  // Update user profile
  const updateProfile = useCallback(async (id, userData) => {
    try {
      setError(null);
      setSuccessMessage(null);
      setLoading(true);
      
      const response = await userService.updateProfile(id, userData);
      console.log("Profile update response:", response.data);
      
      // Update current user data if it was successful
      if (currentUser && currentUser.ID === id) {
        // Create a new user object with updated data but maintain existing properties
        const updatedUser = { 
          ...currentUser, 
          ...userData 
        };
        
        // Update user data in local storage
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
        
        // Update state
        setCurrentUser(updatedUser);
      }
      
      setSuccessMessage("Profile updated successfully!");
      return response.data;
    } catch (err) {
      console.error("Profile update error:", err);
      const errorMessage = err.response?.data?.error || 'Update failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Clear messages
  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  // Memoize the value to prevent unnecessary rerenders
  const value = {
    currentUser,
    loading,
    error,
    successMessage,
    login,
    register,
    logout,
    updateProfile,
    clearMessages,
    isAdmin: currentUser?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};