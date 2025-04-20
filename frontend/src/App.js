import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Layout
import Layout from './components/layout/Layout';

// Page components
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import BookDetailPage from './pages/BookDetailPage';
import AuthorsPage from './pages/AuthorsPage';
import AuthorDetailPage from './pages/AuthorDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import MyReviewsPage from './pages/MyReviewsPage';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorisedPage from './pages/UnauthorisedPage';

// Admin Pages
import AdminBooksPage from './pages/admin/AdminBooksPage';
import AdminAuthorsPage from './pages/admin/AdminAuthorsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import BookEditPage from './pages/admin/BookEditPage';
import AuthorEditPage from './pages/admin/AuthorEditPage';

// Protected route component
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public routes */}
            <Route index element={<HomePage />} />
            <Route path="books" element={<BooksPage />} />
            <Route path="books/:id" element={<BookDetailPage />} />
            <Route path="authors" element={<AuthorsPage />} />
            <Route path="authors/:id" element={<AuthorDetailPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            
            {/* Protected routes */}
            <Route 
              path="profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="my-reviews" 
              element={
                <ProtectedRoute>
                  <MyReviewsPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin routes */}
            <Route 
              path="admin/books" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminBooksPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="admin/books/new" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <BookEditPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="admin/books/:id/edit" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <BookEditPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="admin/authors" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminAuthorsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="admin/authors/new" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AuthorEditPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="admin/authors/:id/edit" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AuthorEditPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="admin/users" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminUsersPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Special pages */}
            <Route path="unauthorized" element={<UnauthorisedPage />} />
            <Route path="404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;