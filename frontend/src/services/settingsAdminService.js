import api from './api'

// Local storage keys for settings persistence
const STORAGE_KEYS = {
  BUSINESS_HOURS: 'salon_business_hours',
  DEPOSIT: 'salon_deposit_settings',
  EMAIL_TEMPLATES: 'salon_email_templates',
  ADMIN_USERS: 'salon_admin_users',
  TIME_SLOTS: 'salon_time_slots'
}

export const settingsAdminService = {
  // Get business hours from localStorage
  getBusinessHours: async () => {
    const hours = localStorage.getItem(STORAGE_KEYS.BUSINESS_HOURS)
    if (hours) {
      return JSON.parse(hours)
    }
    return {
      monday: { is_open: true, open: '09:00', close: '17:00' },
      tuesday: { is_open: true, open: '09:00', close: '17:00' },
      wednesday: { is_open: true, open: '09:00', close: '17:00' },
      thursday: { is_open: true, open: '09:00', close: '17:00' },
      friday: { is_open: true, open: '09:00', close: '17:00' },
      saturday: { is_open: true, open: '08:00', close: '16:00' },
      sunday: { is_open: false, open: '09:00', close: '17:00' }
    }
  },

  // Get deposit percentage from backend (ALWAYS fetch fresh)
  getDepositPercentage: async () => {
    try {
      // ALWAYS fetch from backend first
      const response = await api.get('/admin/deposit-settings/')
      const percentage = response.data.deposit_percentage
      console.log('Fetched deposit percentage from backend:', percentage)
      
      // Update localStorage with the latest value
      localStorage.setItem(STORAGE_KEYS.DEPOSIT, JSON.stringify({ deposit_percentage: percentage }))
      
      return percentage
    } catch (error) {
      console.log('Backend deposit endpoint not available, using localStorage')
      const deposit = JSON.parse(localStorage.getItem(STORAGE_KEYS.DEPOSIT) || '{}')
      return deposit.deposit_percentage || 30
    }
  },

  // Get all settings for the Settings page
  getSettings: async () => {
    // Return only the settings we have
    return {
      business_hours: await settingsAdminService.getBusinessHours(),
      deposit: {
        deposit_percentage: await settingsAdminService.getDepositPercentage()
      },
      email_templates: JSON.parse(localStorage.getItem(STORAGE_KEYS.EMAIL_TEMPLATES)) || {
        booking_confirmation: '',
        payment_confirmation: '',
        cancellation_notification: ''
      },
      admin_users: JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_USERS)) || [
        {
          id: 1,
          username: 'maseya',
          email: 'maseyadaniel@gmail.com',
          role: 'super_admin',
          created_at: new Date().toISOString()
        }
      ]
    }
  },

  // Update business hours
  updateBusinessHours: async (data) => {
    console.log('Saving business hours to localStorage')
    localStorage.setItem(STORAGE_KEYS.BUSINESS_HOURS, JSON.stringify(data))
    return { success: true, message: 'Business hours saved locally' }
  },

  // Update deposit settings
  updateDepositSettings: async (data) => {
    try {
      const response = await api.patch('/admin/deposit-settings/', data)
      console.log('Deposit settings updated in backend:', response.data)
      
      // Update localStorage to keep in sync
      localStorage.setItem(STORAGE_KEYS.DEPOSIT, JSON.stringify(data))
      
      return response.data
    } catch (error) {
      console.log('Backend endpoint not available, saving to localStorage')
      localStorage.setItem(STORAGE_KEYS.DEPOSIT, JSON.stringify(data))
      return { success: true, message: 'Deposit settings saved locally' }
    }
  },

  // Update email templates
  updateEmailTemplates: async (data) => {
    console.log('Saving email templates to localStorage')
    localStorage.setItem(STORAGE_KEYS.EMAIL_TEMPLATES, JSON.stringify(data))
    return { success: true, message: 'Email templates saved locally' }
  },

  // Time Slot Management
  getTimeSlots: async (startDate, endDate) => {
    try {
      const response = await api.get(`/admin/timeslots/?start_date=${startDate}&end_date=${endDate}`)
      return response.data
    } catch (error) {
      console.log('Backend endpoint not available, using localStorage')
      const slots = JSON.parse(localStorage.getItem(STORAGE_KEYS.TIME_SLOTS) || '[]')
      return slots.filter(slot => slot.date >= startDate && slot.date <= endDate)
    }
  },

  generateTimeSlots: async (startDate, endDate, workingHours) => {
    try {
      const response = await api.post('/admin/timeslots/generate/', {
        start_date: startDate,
        end_date: endDate,
        working_hours: workingHours
      })
      return response.data
    } catch (error) {
      console.log('Backend endpoint not available, generating locally')
      
      const newSlots = []
      const start = new Date(startDate)
      const end = new Date(endDate)
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0]
        const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'lowercase' })
        const hours = workingHours[dayOfWeek]
        
        if (hours && hours.is_open) {
          const openHour = parseInt(hours.open.split(':')[0])
          const closeHour = parseInt(hours.close.split(':')[0])
          
          for (let hour = openHour; hour < closeHour; hour++) {
            const time = `${hour.toString().padStart(2, '0')}:00`
            newSlots.push({
              id: `${dateStr}-${time}`,
              date: dateStr,
              time: time,
              is_available: true
            })
          }
        }
      }
      
      const existingSlots = JSON.parse(localStorage.getItem(STORAGE_KEYS.TIME_SLOTS) || '[]')
      const existingMap = new Map(existingSlots.map(slot => [`${slot.date}-${slot.time}`, slot]))
      
      newSlots.forEach(slot => {
        const key = `${slot.date}-${slot.time}`
        if (!existingMap.has(key)) {
          existingMap.set(key, slot)
        }
      })
      
      const mergedSlots = Array.from(existingMap.values())
      localStorage.setItem(STORAGE_KEYS.TIME_SLOTS, JSON.stringify(mergedSlots))
      
      return { success: true, slots_created: newSlots.length, total_slots: mergedSlots.length }
    }
  },

  toggleTimeSlotAvailability: async (slotId, isAvailable) => {
    try {
      const response = await api.patch(`/admin/timeslots/${slotId}/`, { is_available: isAvailable })
      return response.data
    } catch (error) {
      console.log('Backend endpoint not available, toggling in localStorage')
      const slots = JSON.parse(localStorage.getItem(STORAGE_KEYS.TIME_SLOTS) || '[]')
      const updatedSlots = slots.map(slot => 
        slot.id === slotId ? { ...slot, is_available: isAvailable } : slot
      )
      localStorage.setItem(STORAGE_KEYS.TIME_SLOTS, JSON.stringify(updatedSlots))
      return { success: true }
    }
  },

  deleteTimeSlot: async (slotId) => {
    try {
      const response = await api.delete(`/admin/timeslots/${slotId}/`)
      return response.data
    } catch (error) {
      console.log('Backend endpoint not available, deleting from localStorage')
      const slots = JSON.parse(localStorage.getItem(STORAGE_KEYS.TIME_SLOTS) || '[]')
      const updatedSlots = slots.filter(slot => slot.id !== slotId)
      localStorage.setItem(STORAGE_KEYS.TIME_SLOTS, JSON.stringify(updatedSlots))
      return { success: true }
    }
  },

  // Admin Users Management
  addAdminUser: async (data) => {
    console.log('Saving admin user to localStorage')
    const existingUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_USERS)) || []
    const newUser = {
      id: Date.now(),
      ...data,
      created_at: new Date().toISOString()
    }
    const updatedUsers = [...existingUsers, newUser]
    localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(updatedUsers))
    return { success: true, data: newUser }
  },

  deleteAdminUser: async (userId) => {
    console.log('Deleting admin user from localStorage')
    const existingUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_USERS)) || []
    const updatedUsers = existingUsers.filter(user => user.id !== userId)
    localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(updatedUsers))
    return { success: true, message: 'Admin user deleted locally' }
  },

  getAdminUsers: async () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_USERS)) || []
  }
}