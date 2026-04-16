import api from './api'

export const customerAdminService = {
  // Get all customers (derived from bookings)
  getCustomers: async (filters = {}) => {
    try {
      const response = await api.get('/admin/bookings/')
      const bookings = response.data
      
      // Group bookings by customer email to create unique customers
      const customersMap = new Map()
      
      bookings.forEach(booking => {
        const email = booking.email
        if (!customersMap.has(email)) {
          customersMap.set(email, {
            id: email,
            full_name: booking.full_name,
            email: booking.email,
            phone: booking.phone,
            total_bookings: 1,
            total_amount_paid: parseFloat(booking.amount_paid) || 0,
            joined_date: booking.created_at,
            status: 'active',
            last_booking_date: booking.date,
            bookings: [booking]
          })
        } else {
          const customer = customersMap.get(email)
          customer.total_bookings += 1
          customer.total_amount_paid += parseFloat(booking.amount_paid) || 0
          customer.bookings.push(booking)
          if (booking.date > customer.last_booking_date) {
            customer.last_booking_date = booking.date
          }
        }
      })
      
      let customers = Array.from(customersMap.values())
      
      // Apply filters
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        customers = customers.filter(c => 
          c.full_name.toLowerCase().includes(searchLower) ||
          c.email.toLowerCase().includes(searchLower) ||
          c.phone.includes(searchLower)
        )
      }
      
      if (filters.status) {
        customers = customers.filter(c => c.status === filters.status)
      }
      
      return customers
    } catch (error) {
      console.error('Error fetching customers:', error)
      throw error
    }
  },

  // Get customer details with full history
  getCustomerDetails: async (email) => {
    try {
      const response = await api.get('/admin/bookings/')
      const bookings = response.data.filter(b => b.email === email)
      
      if (bookings.length === 0) {
        throw new Error('Customer not found')
      }
      
      const firstBooking = bookings[0]
      const customer = {
        id: email,
        full_name: firstBooking.full_name,
        email: firstBooking.email,
        phone: firstBooking.phone,
        total_bookings: bookings.length,
        total_amount_paid: bookings.reduce((sum, b) => sum + (parseFloat(b.amount_paid) || 0), 0),
        joined_date: firstBooking.created_at,
        status: 'active',
        last_booking_date: bookings.reduce((latest, b) => b.date > latest ? b.date : latest, bookings[0].date),
        bookings: bookings.sort((a, b) => new Date(b.date) - new Date(a.date))
      }
      
      return customer
    } catch (error) {
      console.error('Error fetching customer details:', error)
      throw error
    }
  },

  // Get customer booking history
  getCustomerBookingHistory: async (email) => {
    try {
      const response = await api.get('/admin/bookings/')
      const bookings = response.data
        .filter(b => b.email === email)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
      
      return bookings
    } catch (error) {
      console.error('Error fetching customer booking history:', error)
      throw error
    }
  },

  // Get customer payment history
  getCustomerPaymentHistory: async (email) => {
    try {
      const response = await api.get('/admin/bookings/')
      const payments = response.data
        .filter(b => b.email === email && (parseFloat(b.amount_paid) > 0))
        .map(b => ({
          id: b.id,
          reservation_code: b.reservation_code,
          date: b.date,
          amount: b.amount_paid,
          status: b.status,
          service_name: b.service_name
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
      
      return payments
    } catch (error) {
      console.error('Error fetching customer payment history:', error)
      throw error
    }
  },

  // Toggle customer status (if backend supports it)
  toggleCustomerStatus: async (email, isActive) => {
    // Since backend doesn't have customer status, we'll simulate
    console.log('Toggle customer status not implemented in backend')
    return { success: true, message: 'Status toggled (simulated)' }
  }
}