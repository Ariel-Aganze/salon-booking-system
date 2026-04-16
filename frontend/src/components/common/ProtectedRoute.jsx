import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Loader from './Loader'

const ProtectedRoute = ({ children, requireAdmin = true }) => {
  const { isAuthenticated, loading, user } = useAuth()
  const location = useLocation()

  if (loading) {
    return <Loader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  // Check if user has admin/staff privileges
  if (requireAdmin && !user?.is_staff && !user?.is_superuser) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute