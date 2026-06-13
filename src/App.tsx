import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import SearchPage from './pages/SearchPage';
import MoviesPage from './pages/MoviesPage';
import AboutPage from './pages/AboutPage';
import RequestPage from './pages/RequestPage';
import DonatePage from './pages/DonatePage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import GrainyDotsBackground from './components/GrainyDotsBackground';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-gray-950 via-black to-black text-white">
          {/* Global interactive mouse-tracking dot background */}
          <GrainyDotsBackground 
            position="fixed"
            dotColor="rgba(239, 68, 68, 0.2)" 
            interactionRadius={150} 
            density={36} 
            grainIntensity={0.06} 
          />
          <Header />
          <main className="flex-grow relative z-10">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Routes for regular logged-in users */}
              <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/movie/:id" element={<ProtectedRoute><MovieDetailsPage /></ProtectedRoute>} />
              <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
              <Route path="/movies" element={<ProtectedRoute><MoviesPage /></ProtectedRoute>} />
              <Route path="/about" element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
              <Route path="/request" element={<ProtectedRoute><RequestPage /></ProtectedRoute>} />
              <Route path="/donate" element={<ProtectedRoute><DonatePage /></ProtectedRoute>} />

              {/* Admin-only Protected Route */}
              <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;