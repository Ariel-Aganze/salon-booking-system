import api from './api'

export const bookingAdminService = {
  // Get all bookings with filters
  getBookings: async (filters = {}) => {
    try {
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.date) params.append('date', filters.date)
      
      const response = await api.get(`/admin/bookings/?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error fetching bookings:', error)
      throw error
    }
  },

  // Get single booking details
  getBookingDetails: async (id) => {
    try {
      const response = await api.get(`/admin/bookings/${id}/`)
      return response.data
    } catch (error) {
      console.error('Error fetching booking details:', error)
      throw error
    }
  },

  // Update booking status
  updateBookingStatus: async (id, status) => {
    try {
      const response = await api.patch(`/admin/bookings/${id}/update/`, { status })
      return response.data
    } catch (error) {
      console.error('Error updating booking status:', error)
      throw error
    }
  },

  // Reschedule booking
  rescheduleBooking: async (id, date, timeSlot) => {
    try {
      const response = await api.patch(`/admin/bookings/${id}/update/`, { 
        date, 
        time_slot: timeSlot 
      })
      return response.data
    } catch (error) {
      console.error('Error rescheduling booking:', error)
      throw error
    }
  },

  // Cancel booking
  cancelBooking: async (id) => {
    try {
      const response = await api.patch(`/admin/bookings/${id}/update/`, { status: 'cancelled' })
      return response.data
    } catch (error) {
      console.error('Error cancelling booking:', error)
      throw error
    }
  },

  // Get filter options
  getFilterOptions: async () => {
    try {
      const response = await api.get('/admin/bookings/filter-options/')
      return response.data
    } catch (error) {
      console.error('Error fetching filter options:', error)
      return {
        statuses: [
          { value: 'pending', label: 'Pending' },
          { value: 'partial', label: 'Partial' },
          { value: 'paid', label: 'Paid' },
          { value: 'cancelled', label: 'Cancelled' }
        ],
        payment_statuses: [
          { value: 'pending', label: 'Pending' },
          { value: 'partial', label: 'Partial' },
          { value: 'paid', label: 'Paid' }
        ],
        services: []
      }
    }
  },

  // Get available time slots for a specific date
  getAvailableSlots: async (date, serviceId = null) => {
    try {
      const params = new URLSearchParams()
      if (date) params.append('date', date)
      
      const response = await api.get(`/bookings/slots/?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error fetching available slots:', error)
      throw error
    }
  },

  // Generate time slots - using the correct endpoint
  generateTimeSlots: async (startDate, endDate, workingHours) => {
    try {
      const response = await api.post('/bookings/timeslots/generate/', {
        start_date: startDate,
        end_date: endDate,
        working_hours: workingHours
      })
      return response.data
    } catch (error) {
      console.error('Error generating time slots:', error)
      throw error
    }
  }
}