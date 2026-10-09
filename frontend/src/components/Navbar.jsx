import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  MapPin, 
  User, 
  LogOut, 
  Calendar, 
  Heart, 
  LayoutDashboard, 
  PlusCircle, 
  Menu, 
  X,
  Compass
} from 'lucide-react';

const CITIES = ['All Cities', 'Pune', 'Mumbai', 'Bangalore', 'Hyderabad', 'Delhi'];

export const Navbar = ({ selectedCity, setSelectedCity }) => {
  const { user, isAuthenticated, isOwner, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleCityChange = (e) => {
    const city = e.target.value;
    if (setSelectedCity) {
      setSelectedCity(city);
    }
    navigate(`/turfs?city=${city === 'All Cities' ? '' : city}`);
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & City Selector */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center shadow-md shadow-emerald-500/20">
                <span className="text-xl font-black text-slate-950 tracking-tighter">TB</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white flex items-center">
                  Turf<span className="text-emerald-400">Book</span>
                </span>
                <span className="text-[10px] text-slate-400 -mt-1 font-medium tracking-wide uppercase">
                  Sports Arena
                </span>
              </div>
            </Link>

            {/* City Dropdown Selector */}
            <div className="hidden md:flex items-center bg-slate-800/80 hover:bg-slate-800 text-slate-200 rounded-lg px-3 py-1.5 border border-slate-700/60 transition-colors">
              <MapPin className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
              <select
                value={selectedCity || 'All Cities'}
                onChange={handleCityChange}
                className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer text-slate-200"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c} className="bg-slate-900 text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/turfs"
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Explore Turfs</span>
            </Link>
            
            {isAuthenticated && !isOwner && (
              <>
                <Link
                  to="/my-bookings"
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
                >
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>My Bookings</span>
                </Link>
                <Link
                  to="/wishlist"
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
                >
                  <Heart className="w-4 h-4 text-pink-400" />
                  <span>Wishlist</span>
                </Link>
              </>
            )}

            {isAuthenticated && isOwner && (
              <Link
                to="/owner/dashboard"
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all border border-emerald-500/30"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Owner Dashboard</span>
              </Link>
            )}
          </div>

          {/* Right Action / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {!isOwner && (
              <Link
                to={isAuthenticated ? (isOwner ? "/owner/turfs/add" : "/owner/dashboard") : "/register?role=owner"}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 hover:bg-slate-800/50 transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>List Your Turf</span>
              </Link>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700/80 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-slate-700"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-slate-200">{user?.name?.split(' ')[0]}</span>
                  <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                    {user?.role}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1 z-50">
                    <div className="px-4 py-2 border-b border-slate-700/70">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">{user?.email}</p>
                    </div>

                    {isOwner ? (
                      <>
                        <Link
                          to="/owner/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-slate-200 hover:bg-slate-700"
                        >
                          <LayoutDashboard className="w-4 h-4 mr-2 text-emerald-400" />
                          Owner Dashboard
                        </Link>
                        <Link
                          to="/owner/turfs"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-slate-200 hover:bg-slate-700"
                        >
                          <Calendar className="w-4 h-4 mr-2 text-emerald-400" />
                          My Turfs
                        </Link>
                        <Link
                          to="/owner/bookings"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-slate-200 hover:bg-slate-700"
                        >
                          <Calendar className="w-4 h-4 mr-2 text-emerald-400" />
                          Player Bookings
                        </Link>
                        <Link
                          to="/owner/turfs/add"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-slate-200 hover:bg-slate-700"
                        >
                          <PlusCircle className="w-4 h-4 mr-2 text-emerald-400" />
                          Add Turf
                        </Link>
                        <Link
                          to="/my-bookings"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 border-t border-slate-700/50"
                        >
                          <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                          My Bookings
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/my-bookings"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-slate-200 hover:bg-slate-700"
                        >
                          <Calendar className="w-4 h-4 mr-2 text-emerald-400" />
                          My Bookings
                        </Link>
                        <Link
                          to="/wishlist"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-slate-200 hover:bg-slate-700"
                        >
                          <Heart className="w-4 h-4 mr-2 text-pink-400" />
                          Saved Turfs
                        </Link>
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-red-400 hover:bg-slate-700/70 border-t border-slate-700/50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-sm"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-400 hover:text-white p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/turfs"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 font-medium"
          >
            Explore Turfs
          </Link>
          {isAuthenticated ? (
            <>
              {isOwner ? (
                <>
                  <Link
                    to="/owner/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-emerald-400 font-semibold"
                  >
                    Owner Dashboard
                  </Link>
                  <Link
                    to="/owner/turfs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-slate-200 font-medium"
                  >
                    My Turfs
                  </Link>
                  <Link
                    to="/owner/bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-slate-200 font-medium"
                  >
                    Player Bookings
                  </Link>
                  <Link
                    to="/owner/turfs/add"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-slate-200 font-medium"
                  >
                    Add Turf
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/my-bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-slate-200 font-medium"
                  >
                    My Bookings
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-slate-200 font-medium"
                  >
                    Wishlist
                  </Link>
                </>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 text-red-400 font-medium"
              >
                Logout ({user?.name})
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 border border-slate-700 rounded-lg text-slate-200"
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 bg-emerald-500 text-slate-950 font-semibold rounded-lg"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
