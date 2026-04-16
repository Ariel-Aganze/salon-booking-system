import api from './api'

// Static FAQ data
const staticFAQs = [
  {
    id: 1,
    question: 'How do I book an appointment?',
    answer: 'You can book an appointment by clicking the "Book Appointment" button on our homepage and following the simple 3-step booking process. Select your preferred service, choose a date and time, and complete your booking with a 30% deposit.'
  },
  {
    id: 2,
    question: 'What is your cancellation policy?',
    answer: 'Cancellations must be made at least 24 hours in advance to receive a full refund of your deposit. Cancellations within 24 hours will result in forfeiture of the deposit. You can cancel or reschedule through your reservation details page.'
  },
  {
    id: 3,
    question: 'Do I need to pay a deposit?',
    answer: 'Yes, we require a 30% deposit to secure your appointment. The remaining balance is due at the time of service. You can pay the deposit securely through Stripe during the booking process.'
  },
  {
    id: 4,
    question: 'How long do braids typically last?',
    answer: 'With proper care, your braids can last 4-8 weeks depending on the style, your hair type, and maintenance routine. We recommend regular moisturizing and sleeping with a silk scarf to extend longevity.'
  },
  {
    id: 5,
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), debit cards, and cash payments. Deposits are processed through our secure Stripe payment system.'
  },
  {
    id: 6,
    question: 'How early should I arrive for my appointment?',
    answer: 'Please arrive 10-15 minutes before your scheduled appointment time to complete any remaining paperwork and prepare for your service. Late arrivals may result in shortened service time.'
  },
  {
    id: 7,
    question: 'Can I bring my own hair extensions?',
    answer: 'Yes, you are welcome to bring your own hair extensions. Please inform us when booking so we can advise on the quantity and type needed for your chosen style.'
  },
  {
    id: 8,
    question: 'Do you offer children\'s services?',
    answer: 'Yes, we offer braiding services for children. Please contact us directly to discuss age requirements and pricing for children\'s styles.'
  }
]

// Static team members data
const staticTeam = [
  {
    id: 1,
    name: 'Nysha',
    role: 'Master Braider & Founder',
    image_url: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=400&fit=crop',
    bio: '10+ years of experience, specializing in traditional African braiding techniques.'
  },
  {
    id: 2,
    name: 'Sarah',
    role: 'Senior Stylist',
    image_url: 'https://images.unsplash.com/photo-1582793988951-9aed5509eb97?w=400&h=400&fit=crop',
    bio: 'Expert in knotless braids and creative styling.'
  },
  {
    id: 3,
    name: 'Michelle',
    role: 'Braid Specialist',
    image_url: 'https://images.unsplash.com/photo-1617997456909-efec2cf9d4b4?w=400&h=400&fit=crop',
    bio: 'Specializes in cornrows and intricate patterns.'
  }
]

export const publicService = {
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

  // Get featured services (using same endpoint)
  getFeaturedServices: async () => {
    try {
      const response = await api.get('/bookings/services/')
      return response.data
    } catch (error) {
      console.error('Error fetching featured services:', error)
      throw error
    }
  },

  // Get gallery items - not available in backend, return empty array
  getGalleryItems: async () => {
    console.log('Gallery endpoint not available')
    return []
  },

  // Get FAQs - returns static FAQ data
  getFAQs: async () => {
    // Since backend doesn't have a FAQs endpoint, return static FAQ data
    console.log('Using static FAQ data')
    return staticFAQs
  },

  // Get working hours from localStorage (where admin saves them)
  getWorkingHours: async () => {
    try {
      const localHours = localStorage.getItem('salon_business_hours')
      if (localHours) {
        const parsedHours = JSON.parse(localHours)
        return parsedHours
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
    } catch (error) {
      console.error('Error fetching working hours:', error)
      return {
        monday: { is_open: true, open: '09:00', close: '17:00' },
        tuesday: { is_open: true, open: '09:00', close: '17:00' },
        wednesday: { is_open: true, open: '09:00', close: '17:00' },
        thursday: { is_open: true, open: '09:00', close: '17:00' },
        friday: { is_open: true, open: '09:00', close: '17:00' },
        saturday: { is_open: true, open: '08:00', close: '16:00' },
        sunday: { is_open: false, open: '09:00', close: '17:00' }
      }
    }
  },

  // Get team members - returns static data
  getTeamMembers: async () => {
    return staticTeam
  }
}