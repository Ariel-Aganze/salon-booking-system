import api from './api'

export const serviceAdminService = {
  // Get all services
  getServices: async (filters = {}) => {
    try {
      const response = await api.get('/admin/services/')
      let services = response.data
      
      console.log('Raw services from backend:', services)
      
      // Apply filters client-side
      if (filters.status !== undefined && filters.status !== null) {
        // Since backend doesn't have is_active, we'll just filter by availability in frontend
        // For now, we'll skip status filtering or add a custom field
        services = services
      }
      if (filters.search) {
        services = services.filter(s => 
          s.name.toLowerCase().includes(filters.search.toLowerCase())
        )
      }
      if (filters.category) {
        // Since backend doesn't have category, we'll skip this filter
        services = services
      }
      
      return services
    } catch (error) {
      console.error('Error fetching services:', error)
      throw error
    }
  },

  // Create new service
  createService: async (data) => {
    try {
      const submitData = {
        name: data.name.trim(),
        price: parseFloat(data.price),
        duration: parseInt(data.duration)
      }
      console.log('Creating service with data:', submitData)
      const response = await api.post('/admin/services/', submitData)
      return response.data
    } catch (error) {
      console.error('Error creating service:', error)
      throw error
    }
  },

  // Update service
  updateService: async (id, data) => {
    try {
      const submitData = {
        id: parseInt(id),
        name: data.name.trim(),
        price: parseFloat(data.price),
        duration: parseInt(data.duration)
      }
      console.log('Updating service with data:', submitData)
      const response = await api.put('/admin/services/', submitData)
      return response.data
    } catch (error) {
      console.error('Error updating service:', error)
      throw error
    }
  },

  // Toggle service status - since backend doesn't have is_active, we'll just simulate
  toggleServiceStatus: async (id, isActive) => {
    // Since backend doesn't have is_active field, we'll just show a message
    console.log('Status toggle not available in backend')
    toast.error('Status toggle is not available in the backend')
    throw new Error('Status toggle not supported')
  },

  // Delete service
  deleteService: async (id) => {
    try {
      const response = await api.delete('/admin/services/', { data: { id: parseInt(id) } })
      return response.data
    } catch (error) {
      console.error('Error deleting service:', error)
      throw error
    }
  },

  // Get service categories - not available in backend
  getServiceCategories: async () => {
    return []
  }
}