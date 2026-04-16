// frontend/src/services/api.js
import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 30000, // Increase from 10000 to 30000 (30 seconds)
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const response = await axios.post(`${api.defaults.baseURL}/token/refresh/`, {
            refresh: refreshToken
          })
          
          const { access } = response.data
          localStorage.setItem('access_token', access)
          
          originalRequest.headers.Authorization = `Bearer ${access}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        if (!window.location.pathname.includes('/admin/login')) {
          window.location.href = '/admin/login'
          toast.error('Session expired. Please login again.')
        }
      }
    }
    
    if (error.response?.status === 404) {
      console.warn('API endpoint not found:', error.config?.url)
    }
    
    return Promise.reject(error)
  }
)

// API Service Methods
export const bookingAPI = {
  // Get all services
  getServices: async () => {
    const response = await api.get('/bookings/services/')
    return response
  },
  
  // Get available time slots
  getAvailableSlots: async (date) => {
    const response = await api.get('/bookings/slots/', { params: { date } })
    return response
  },
  
  // Create a new booking with longer timeout
  createBooking: async (bookingData) => {
    // Use a longer timeout specifically for booking creation
    const response = await api.post('/bookings/create/', bookingData, {
      timeout: 60000 // 60 seconds for booking creation
    })
    return response
  },
}

export const paymentAPI = {
  // Create deposit payment session
  createDepositSession: async (bookingId, successUrl, cancelUrl) => {
    const response = await api.post('/payments/deposit/', {
      booking_id: bookingId,
      success_url: successUrl,
      cancel_url: cancelUrl
    })
    return response
  },
  
  // Create remaining payment session
  createRemainingSession: async (reservationCode, successUrl, cancelUrl) => {
    const response = await api.post('/payments/remaining/', {
      reservation_code: reservationCode,
      success_url: successUrl,
      cancel_url: cancelUrl
    })
    return response
  },
}

export const reservationAPI = {
  // Find reservation by code and email
  findReservation: async (reservationCode, email) => {
    const response = await api.post('/reservations/find/', {
      reservation_code: reservationCode,
      email: email
    })
    return response
  },
  
  // Get reservation details by code
  getReservationDetails: async (code) => {
    const response = await api.get(`/reservations/${code}/`)
    return response
  },
}

export const adminAPI = {
  // Dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/')
    return response
  },
  
  // All bookings
  getAllBookings: async (status = null, date = null) => {
    const params = {}
    if (status) params.status = status
    if (date) params.date = date
    const response = await api.get('/admin/bookings/', { params })
    return response
  },
  
  // Single booking detail
  getBookingDetail: async (id) => {
    const response = await api.get(`/admin/bookings/${id}/`)
    return response
  },
  
  // Update booking status
  updateBookingStatus: async (id, status) => {
    const response = await api.patch(`/admin/bookings/${id}/update/`, { status })
    return response
  },
  
  // Manage services
  getServices: async () => {
    const response = await api.get('/admin/services/')
    return response
  },
  
  createService: async (serviceData) => {
    const response = await api.post('/admin/services/', serviceData)
    return response
  },
  
  updateService: async (id, serviceData) => {
    const response = await api.put('/admin/services/', { id, ...serviceData })
    return response
  },
  
  deleteService: async (id) => {
    const response = await api.delete('/admin/services/', { data: { id } })
    return response
  },
  
  // Calendar view
  getCalendarView: async (startDate, endDate) => {
    const response = await api.get('/admin/calendar/', { params: { start_date: startDate, end_date: endDate } })
    return response
  },
  
  // Current user
  getCurrentUser: async () => {
    const response = await api.get('/admin/me/')
    return response
  },
}

// Auth endpoints using JWT
export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/token/', { username, password })
    return response
  },
  
  refresh: async (refresh) => {
    const response = await api.post('/token/refresh/', { refresh })
    return response
  },
  
  verify: async (token) => {
    const response = await api.post('/token/verify/', { token })
    return response
  },
}

export default api