import api from './api'

export const bookingService = {
  // Get all services from backend
  getServices: async () => {
    try {
      const response = await api.get('/bookings/services/')
      return response.data
    } catch (error) {
      console.error('Error fetching services:', error)
      throw error
    }
  },

  // Get available time slots for a specific date
  getAvailableSlots: async (date) => {
    try {
      const response = await api.get(`/bookings/slots/?date=${date}`)
      return response.data
    } catch (error) {
      console.error('Error fetching available slots:', error)
      throw error
    }
  },

  // Create booking with increased timeout and retry logic
  createBooking: async (bookingData, retryCount = 0) => {
    const maxRetries = 2
    const timeout = 45000 // 45 seconds timeout
    
    try {
      const response = await api.post('/bookings/create/', bookingData, {
        timeout: timeout
      })
      return response.data
    } catch (error) {
      console.error(`Error creating booking (attempt ${retryCount + 1}/${maxRetries + 1}):`, error)
      
      // Retry on timeout or network errors
      if ((error.code === 'ECONNABORTED' || error.message?.includes('timeout') || error.code === 'ERR_NETWORK') 
          && retryCount < maxRetries) {
        console.log(`Retrying booking creation... (${retryCount + 1}/${maxRetries})`)
        // Wait 2 seconds before retry
        await new Promise(resolve => setTimeout(resolve, 2000))
        return bookingService.createBooking(bookingData, retryCount + 1)
      }
      
      throw error
    }
  },

  // Create Stripe checkout session for deposit
  createDepositSession: async (bookingId, successUrl, cancelUrl) => {
    try {
      const response = await api.post('/payments/deposit/', {
        booking_id: bookingId,
        success_url: successUrl,
        cancel_url: cancelUrl
      })
      return response.data
    } catch (error) {
      console.error('Error creating deposit session:', error)
      throw error
    }
  },

  // Find reservation by code and email
  findReservation: async (reservationCode, email) => {
    try {
      const response = await api.post('/reservations/find/', {
        reservation_code: reservationCode,
        email: email
      })
      return response.data
    } catch (error) {
      console.error('Error finding reservation:', error)
      throw error
    }
  },

  // Get reservation details by code (for public view)
  getBookingByCode: async (reservationCode) => {
    try {
      const response = await api.get(`/reservations/${reservationCode}/`)
      return response.data
    } catch (error) {
      console.error('Error fetching booking by code:', error)
      throw error
    }
  },

  // Get reservation details (alias for consistency)
  getReservationDetails: async (reservationCode) => {
    try {
      const response = await api.get(`/reservations/${reservationCode}/`)
      return response.data
    } catch (error) {
      console.error('Error fetching reservation details:', error)
      throw error
    }
  },

  // Pay remaining balance
  payRemainingBalance: async (reservationCode, successUrl, cancelUrl) => {
    try {
      const response = await api.post('/payments/remaining/', {
        reservation_code: reservationCode,
        success_url: successUrl,
        cancel_url: cancelUrl
      })
      return response.data
    } catch (error) {
      console.error('Error creating remaining payment session:', error)
      throw error
    }
  },

  // Cancel reservation
  cancelReservation: async (reservationCode) => {
    try {
      const response = await api.patch(`/admin/bookings/${reservationCode}/update/`, {
        status: 'cancelled'
      })
      return response.data
    } catch (error) {
      console.error('Error cancelling reservation:', error)
      throw error
    }
  }
}