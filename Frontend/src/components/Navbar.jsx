import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Function to check login status
  const checkLoginStatus = () => {
    const token = localStorage.getItem('authToken')
    setIsLoggedIn(!!token)
  }

  // Check if user is logged in on component mount and location change
  useEffect(() => {
    checkLoginStatus()
  }, [location])

  // Listen for storage changes (for multi-tab support)
  useEffect(() => {
    window.addEventListener('storage', checkLoginStatus)
    return () => window.removeEventListener('storage', checkLoginStatus)
  }, [])

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    setIsLoggedIn(false)
    setIsMobileMenuOpen(false)
    // Redirect to home page
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">UAP</span>
                </div>
                <span className="ml-3 text-xl font-bold text-gray-800">CSE Alumni Connect</span>
              </Link>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-medium transition-colors ${
                isActive('/') ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/alumni-directory" 
              className={`font-medium transition-colors ${
                isActive('/alumni-directory') ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Alumni Directory
            </Link>

            { <Link 
              to="/job-opportunities" 
              className={`font-medium transition-colors ${
                isActive('/job-opportunities') ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Jobs
            </Link> }


            <Link 
              to="/events" 
              className={`font-medium transition-colors ${
                isActive('/events') ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Events
            </Link>
            <Link 
              to="/community" 
              className={`font-medium transition-colors ${
                isActive('/community') ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Community
            </Link>
            <Link 
              to="/mentorship" 
              className={`font-medium transition-colors ${
                isActive('/mentorship') ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Mentorship
            </Link>
            <Link 
              to="/resources" 
              className={`font-medium transition-colors ${
                isActive('/resources') ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Resources
            </Link>
            
            {/* Show Login or Logout button based on auth state */}
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link 
                to="/login" 
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-purple-600"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link 
                to="/" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/') ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/alumni-directory" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/alumni-directory') ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Alumni Directory
              </Link>
              <Link 
                to="/job-opportunities" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/job-opportunities') ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Jobs
              </Link>
              <Link 
                to="/events" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/events') ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Events
              </Link>
              <Link 
                to="/community" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/community') ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Community
              </Link>
              <Link 
                to="/mentorship" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/mentorship') ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Mentorship
              </Link>
              <Link 
                to="/resources" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/resources') ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Resources
              </Link>
              
              {/* Show Login or Logout button in mobile menu */}
              {isLoggedIn ? (
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-600 text-white hover:bg-red-700"
                >
                  Logout
                </button>
              ) : (
                <Link 
                  to="/login" 
                  className="block px-3 py-2 rounded-md text-base font-medium bg-purple-600 text-white hover:bg-purple-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar