import { createContext, useContext, useEffect, useReducer } from 'react'
import toast from 'react-hot-toast'
import { adminAPI, authAPI } from '../services/api'

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
}

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null,
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      }
    default:
      return state
  }
}

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token')
    const user = localStorage.getItem('user')
    
    console.log('Checking auth - Token exists:', !!token, 'User exists:', !!user)
    
    if (token && user) {
      try {
        // Get current user to verify token is valid
        const response = await adminAPI.getCurrentUser()
        if (response.data) {
          console.log('Auth verified, user:', response.data.username)
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user: response.data },
          })
          localStorage.setItem('user', JSON.stringify(response.data))
        } else {
          console.log('No user data from API')
          dispatch({ type: 'LOGOUT' })
        }
      } catch (error) {
        console.error('Auth check failed:', error.response?.status, error.response?.data)
        // If token is invalid, clear it
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        dispatch({ type: 'LOGOUT' })
      }
    } else {
      console.log('No stored credentials')
      dispatch({ type: 'LOGOUT' })
    }
  }

  const login = async (username, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      console.log('Attempting login with username:', username)
      
      const response = await authAPI.login(username, password)
      const { access, refresh } = response.data
      
      console.log('Login successful, received tokens')
      
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
      
      // Get user details
      const userResponse = await adminAPI.getCurrentUser()
      const user = userResponse.data
      
      console.log('User details retrieved:', user.username)
      
      localStorage.setItem('user', JSON.stringify(user))
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user },
      })
      
      toast.success(`Welcome back, ${user.username}!`)
      return { success: true }
    } catch (error) {
      console.error('Login error:', error.response?.status, error.response?.data)
      
      let errorMessage = 'Login failed. Please check your credentials.'
      
      if (error.response?.status === 401) {
        errorMessage = 'Invalid username or password'
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail
      } else if (error.response?.data?.non_field_errors) {
        errorMessage = error.response.data.non_field_errors[0]
      }
      
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage,
      })
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const logout = () => {
    console.log('Logging out')
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    dispatch({ type: 'LOGOUT' })
    toast.success('Logged out successfully')
  }

  const value = {
    ...state,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}