import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { selectCartItems } from '../../store/slices/cartSlice';
import { FiShoppingCart, FiHeart, FiUser, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setMobileMenuOpen(false);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-3xl font-heading font-bold text-gold-600">
              Mateshwari
            </span>
            <span className="text-xs text-gray-500">Exports</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-gold-600 transition-colors">
              Home
            </Link>
            <Link to="/shop" className="text-gray-700 hover:text-gold-600 transition-colors">
              Shop
            </Link>
            <Link to="/virtual-showroom" className="text-gray-700 hover:text-gold-600 transition-colors">
              Virtual Showroom
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-gold-600 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-gold-600 transition-colors">
              Contact
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard/wishlist" className="relative p-2 text-gray-700 hover:text-gold-600 transition-colors">
                  <FiHeart className="text-xl" />
                </Link>
                <Link to="/checkout" className="relative p-2 text-gray-700 hover:text-gold-600 transition-colors">
                  <FiShoppingCart className="text-xl" />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-gold-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gold-600 transition-colors">
                    <FiUser className="text-xl" />
                    <span>{user?.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gold-50">
                      Dashboard
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gold-50">
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gold-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-gold-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-gold-600" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/shop" className="text-gray-700 hover:text-gold-600" onClick={() => setMobileMenuOpen(false)}>
                Shop
              </Link>
              <Link to="/virtual-showroom" className="text-gray-700 hover:text-gold-600" onClick={() => setMobileMenuOpen(false)}>
                Virtual Showroom
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-gold-600" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-gold-600" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard/wishlist" className="text-gray-700 hover:text-gold-600" onClick={() => setMobileMenuOpen(false)}>
                    Wishlist
                  </Link>
                  <Link to="/checkout" className="text-gray-700 hover:text-gold-600" onClick={() => setMobileMenuOpen(false)}>
                    Cart ({cartCount})
                  </Link>
                  <Link to="/dashboard" className="text-gray-700 hover:text-gold-600" onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="text-gray-700 hover:text-gold-600" onClick={() => setMobileMenuOpen(false)}>
                      Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout} className="text-left text-gray-700 hover:text-gold-600">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-gold-600" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary" onClick={() => setMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

