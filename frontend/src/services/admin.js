import api from './api'

export const adminService = {
  // Get dashboard statistics - using existing endpoint
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/dashboard/')
      return response.data
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw error
    }
  },

  // Get all bookings for the bookings table
  getAllBookings: async (status = null, date = null) => {
    try {
      const params = {}
      if (status) params.status = status
      if (date) params.date = date
      const response = await api.get('/admin/bookings/', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching bookings:', error)
      throw error
    }
  },

  // Get recent bookings (limit to 5 for dashboard)
  getRecentBookings: async () => {
    try {
      const response = await api.get('/admin/bookings/')
      // Return only the first 5 bookings for the dashboard
      const recentBookings = response.data.slice(0, 5)
      return recentBookings
    } catch (error) {
      console.error('Error fetching recent bookings:', error)
      throw error
    }
  },

  // Get charts data - since this endpoint doesn't exist, we'll derive from bookings
  getDashboardCharts: async () => {
    try {
      // Fetch all bookings to generate chart data
      const response = await api.get('/admin/bookings/')
      const bookings = response.data
      
      // Generate booking trends (group by date)
      const bookingTrends = {}
      bookings.forEach(booking => {
        const date = booking.date
        if (!bookingTrends[date]) {
          bookingTrends[date] = 0
        }
        bookingTrends[date]++
      })
      
      // Convert to array format for chart
      const bookingTrendsArray = Object.entries(bookingTrends)
        .map(([period, bookings]) => ({ period, bookings }))
        .slice(-7) // Last 7 days
        .sort((a, b) => a.period.localeCompare(b.period))
      
      // Generate revenue overview
      const revenueOverview = {}
      bookings.forEach(booking => {
        const date = booking.date
        if (!revenueOverview[date]) {
          revenueOverview[date] = 0
        }
        revenueOverview[date] += booking.amount_paid || 0
      })
      
      const revenueOverviewArray = Object.entries(revenueOverview)
        .map(([period, revenue]) => ({ period, revenue }))
        .slice(-7)
        .sort((a, b) => a.period.localeCompare(b.period))
      
      return {
        booking_trends: bookingTrendsArray,
        revenue_overview: revenueOverviewArray
      }
    } catch (error) {
      console.error('Error generating charts data:', error)
      throw error
    }
  }
}