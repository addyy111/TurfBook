import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { ExploreTurfs } from './pages/ExploreTurfs';
import { TurfDetails } from './pages/TurfDetails';
import { BookingCheckout } from './pages/BookingCheckout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { CustomerBookings } from './pages/CustomerBookings';
import { Wishlist } from './pages/Wishlist';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { OwnerTurfs } from './pages/OwnerTurfs';
import { OwnerAddTurf } from './pages/OwnerAddTurf';
import { OwnerBookings } from './pages/OwnerBookings';

function App() {
  const [selectedCity, setSelectedCity] = useState('All Cities');

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
          <Navbar selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
          
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/turfs" element={<ExploreTurfs />} />
              <Route path="/turfs/:id" element={<TurfDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Customer Protected Routes */}
              <Route
                path="/booking/:id"
                element={
                  <ProtectedRoute>
                    <BookingCheckout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute>
                    <CustomerBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute>
                    <Wishlist />
                  </ProtectedRoute>
                }
              />

              {/* Owner Protected Routes */}
              <Route
                path="/owner/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['owner', 'admin']}>
                    <OwnerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/turfs"
                element={
                  <ProtectedRoute allowedRoles={['owner', 'admin']}>
                    <OwnerTurfs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/turfs/add"
                element={
                  <ProtectedRoute allowedRoles={['owner', 'admin']}>
                    <OwnerAddTurf />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/bookings"
                element={
                  <ProtectedRoute allowedRoles={['owner', 'admin']}>
                    <OwnerBookings />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
