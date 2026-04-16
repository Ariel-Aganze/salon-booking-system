import api from './api'

export const calendarAdminService = {
  // Get calendar bookings using the existing calendar endpoint
  getCalendarBookings: async (startDate, endDate, filters = {}) => {
    try {
      const params = new URLSearchParams()
      if (startDate) params.append('start_date', startDate)
      if (endDate) params.append('end_date', endDate)
      
      const response = await api.get(`/admin/calendar/?${params.toString()}`)
      let bookings = response.data
      
      // Apply additional filters client-side if needed
      if (filters.service) {
        bookings = bookings.filter(booking => booking.service?.id === parseInt(filters.service))
      }
      if (filters.status) {
        bookings = bookings.filter(booking => booking.status === filters.status)
      }
      
      return bookings
    } catch (error) {
      console.error('Error fetching calendar bookings:', error)
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

  // Reschedule booking - using the update endpoint
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
  }
}