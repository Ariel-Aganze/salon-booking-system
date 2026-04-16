import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ServiceSelector from '../components/booking/ServiceSelector'
import { bookingService } from '../services/bookingService'

const BookingPage = () => {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const data = await bookingService.getServices()
      setServices(data)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch services:', err)
      setError('Unable to load services. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectService = (service) => {
    setSelectedService(service)
  }

  const handleContinue = () => {
    if (selectedService) {
      sessionStorage.setItem('selectedService', JSON.stringify(selectedService))
      navigate('/booking/date')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28 md:pt-32">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-playfair font-bold text-luxury-plum mb-4">
          Book Your Appointment
        </h1>
        <div className="w-24 h-px bg-luxury-plum mx-auto"></div>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Select the service you'd like to book
        </p>
      </div>

      {/* Progress Steps */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="flex items-center justify-between">
          <div className="flex-1 flex items-center">
            <div className="w-10 h-10 rounded-full bg-luxury-plum text-white flex items-center justify-center font-semibold">
              1
            </div>
            <div className="flex-1 h-1 bg-luxury-plum ml-2"></div>
          </div>
          <div className="flex-1 flex items-center ml-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-semibold">
              2
            </div>
            <div className="flex-1 h-1 bg-gray-200 ml-2"></div>
          </div>
          <div className="flex-1 flex items-center ml-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-semibold">
              3
            </div>
            <div className="flex-1 h-1 bg-gray-200 ml-2"></div>
          </div>
          <div className="ml-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-semibold">
              4
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span className="text-luxury-plum font-medium">Service</span>
          <span>Date & Time</span>
          <span>Details</span>
          <span>Payment</span>
        </div>
      </div>

      {/* Service Selection */}
      <ServiceSelector
        services={services}
        selectedService={selectedService}
        onSelectService={handleSelectService}
        loading={loading}
        error={error}
        onRetry={fetchServices}
      />

      {/* Continue Button */}
      <div className="mt-12 flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleContinue}
          disabled={!selectedService}
          className={`
            px-8 py-3 rounded-lg font-semibold transition duration-300
            ${selectedService 
              ? 'bg-luxury-plum text-white hover:bg-black' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          Continue to Date & Time
        </motion.button>
      </div>
    </div>
  )
}

export default BookingPage