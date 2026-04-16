import { motion } from 'framer-motion'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const AdminLogin = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!username || !password) {
      toast.error('Please enter both username and password')
      return
    }
    
    setLoading(true)
    const result = await login(username, password)
    if (result.success) {
      navigate('/admin/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-cream to-luxury-plum/10 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-luxury-plum/10 flex items-center justify-center">
            <span className="text-2xl font-playfair font-bold text-luxury-plum">N</span>
          </div>
          <h2 className="text-3xl font-playfair font-bold text-luxury-plum">Admin Login</h2>
          <p className="text-gray-600 mt-2">Access the salon management dashboard</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-luxury-plum transition"
              placeholder="Enter your username"
              required
              autoComplete="username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-luxury-plum transition"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-luxury-plum text-white py-3 rounded-lg font-semibold hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-luxury-plum hover:underline">
            ← Back to Home
          </Link>
        </div>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            <strong>Your Credentials:</strong><br />
            Username: <span className="font-mono font-semibold">maseya</span><br />
            Password: [the password you set when creating superuser]
          </p>
          <p className="text-xs text-gray-400 text-center mt-2">
            If you forgot your password, reset it using Django shell:
            <code className="block text-xs bg-gray-100 p-1 rounded mt-1">
              python manage.py changepassword maseya
            </code>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLogin