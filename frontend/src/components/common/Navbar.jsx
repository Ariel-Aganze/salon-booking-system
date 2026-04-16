import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/booking' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
  ]

  return (
    <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-luxury-plum overflow-hidden bg-gray-100 flex items-center justify-center">
              <span className="text-luxury-plum font-bold text-xl">N</span>
            </div>
            <span className="font-playfair text-xl sm:text-2xl tracking-widest uppercase font-semibold text-luxury-plum">
              Nysha
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 uppercase text-xs tracking-widest font-semibold">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="hover:text-luxury-plum transition duration-300 text-gray-700"
              >
                {link.name}
              </Link>
            ))}
            
            {isAuthenticated && (
              <>
                <Link
                  to="/admin/dashboard"
                  className="hover:text-luxury-plum transition duration-300 text-luxury-plum"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-luxury-plum text-white px-4 py-2 rounded-lg hover:bg-black transition duration-300 text-xs tracking-widest"
                >
                  Logout
                </button>
              </>
            )}
            
            {!isAuthenticated && (
              <Link
                to="/admin/login"
                className="bg-luxury-plum text-white px-4 py-2 rounded-lg hover:bg-black transition duration-300 text-xs tracking-widest"
              >
                Admin Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-luxury-plum focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-3 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block uppercase text-xs tracking-widest font-semibold hover:text-luxury-plum transition text-gray-700"
                >
                  {link.name}
                </Link>
              ))}
              
              {isAuthenticated && (
                <>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block uppercase text-xs tracking-widest font-semibold hover:text-luxury-plum transition text-luxury-plum"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                    className="w-full text-left uppercase text-xs tracking-widest font-semibold hover:text-luxury-plum transition text-luxury-plum"
                  >
                    Logout
                  </button>
                </>
              )}
              
              {!isAuthenticated && (
                <Link
                  to="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className="block uppercase text-xs tracking-widest font-semibold hover:text-luxury-plum transition text-luxury-plum"
                >
                  Admin Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar