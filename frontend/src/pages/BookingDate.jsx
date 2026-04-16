import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DateSelector from '../components/booking/DateSelector'
import TimeSlotSelector from '../components/booking/TimeSlotSelector'
import { blockedDatesService } from '../services/blockedDatesService'
import { bookingService } from '../services/bookingService'

const BookingDate = () => {
  const navigate = useNavigate()
  const [selectedService, setSelectedService] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [availableSlots, setAvailableSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [blockedDates, setBlockedDates] = useState(new Set())
  const [isDateBlocked, setIsDateBlocked] = useState(false)

  useEffect(() => {
    // Get selected service from session storage
    const storedService = sessionStorage.getItem('selectedService')
    if (storedService) {
      setSelectedService(JSON.parse(storedService))
    } else {
      // No service selected, redirect back to service selection
      navigate('/booking')
    }
    
    // Fetch blocked dates using PUBLIC endpoint
    fetchBlockedDates()
  }, [navigate])

  const fetchBlockedDates = async () => {
    try {
      const blockedList = await blockedDatesService.getPublicBlockedDates()
      const blockedSet = new Set(blockedList.map(item => item.date))
      setBlockedDates(blockedSet)
    } catch (err) {
      console.error('Failed to fetch blocked dates:', err)
    }
  }

  const fetchAvailableSlots = useCallback(async (date) => {
    if (!date) return
    
    try {
      setLoading(true)
      setError(null)
      const dateStr = date.toISOString().split('T')[0]
      
      const slots = await bookingService.getAvailableSlots(dateStr)
      setAvailableSlots(slots)
      setSelectedSlot(null)
    } catch (err) {
      console.error('Failed to fetch available slots:', err)
      
      if (err.response?.data?.error?.toLowerCase().includes('blocked')) {
        setIsDateBlocked(true)
        setError('This date is blocked. Bookings are not available. Please select another date.')
        setAvailableSlots([])
      } else if (err.response?.status === 401) {
        setError('Authentication required. Please log in.')
      } else if (err.response?.status === 404) {
        setError('No time slots available for this date. Please select another date.')
      } else {
        setError('Unable to load available time slots. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // Effect to check if selected date is blocked and fetch slots
  useEffect(() => {
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0]
      const isBlocked = blockedDates.has(dateStr)
      
      console.log(`Checking date ${dateStr}: isBlocked = ${isBlocked}`) // Debug log
      
      if (isBlocked) {
        setIsDateBlocked(true)
        setError('This date is blocked. Bookings are not available. Please select another date.')
        setAvailableSlots([])
        setSelectedSlot(null)
      } else {
        setIsDateBlocked(false)
        setError(null)
        // Only fetch slots if date is not blocked
        fetchAvailableSlots(selectedDate)
      }
    }
  }, [selectedDate, blockedDates, fetchAvailableSlots])

  const handleDateSelect = (date) => {
    console.log('New date selected:', date) // Debug log
    
    // CRITICAL: Reset all states when new date is selected
    setError(null)
    setSelectedSlot(null)
    setAvailableSlots([])
    setIsDateBlocked(false) // This is the key fix - reset blocked status
    setSelectedDate(date) // This will trigger the useEffect above
  }

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot)
    setError(null)
  }

  const handleContinue = () => {
    // Validate date is not blocked before proceeding
    if (!selectedDate || !selectedSlot) {
      setError('Please select both a date and time slot')
      return
    }
    
    const dateStr = selectedDate.toISOString().split('T')[0]
    
    // Final check to ensure date is not blocked
    if (blockedDates.has(dateStr)) {
      setError('This date is blocked. Bookings are not available. Please select another date.')
      return
    }
    
    // Store selected date and time in session storage
    sessionStorage.setItem('selectedDate', dateStr)
    sessionStorage.setItem('selectedTimeSlot', selectedSlot.time)
    navigate('/booking/info')
  }

  const handleRetry = () => {
    if (selectedDate && !isDateBlocked) {
      fetchAvailableSlots(selectedDate)
    }
  }

  const handleBack = () => {
    navigate('/booking')
  }

  if (!selectedService) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-playfair font-bold text-luxury-plum mb-4">
          Select Date & Time
        </h1>
        <div className="w-24 h-px bg-luxury-plum mx-auto"></div>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Choose your preferred appointment date and time
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
            <div className="w-10 h-10 rounded-full bg-luxury-plum text-white flex items-center justify-center font-semibold">
              2
            </div>
            <div className="flex-1 h-1 bg-luxury-plum ml-2"></div>
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
          <span>Service</span>
          <span className="text-luxury-plum font-medium">Date & Time</span>
          <span>Details</span>
          <span>Payment</span>
        </div>
      </div>

      {/* Selected Service Summary */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="bg-soft-cream rounded-lg p-4">
          <p className="text-sm text-gray-600">Selected Service</p>
          <p className="font-semibold text-luxury-plum">{selectedService.name}</p>
          <p className="text-sm text-gray-500">${selectedService.price} · {selectedService.duration} min</p>
        </div>
      </div>

      {/* Date and Time Selection Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Date Selector */}
        <DateSelector
          selectedDate={selectedDate}
          onSelectDate={handleDateSelect}
        />

        {/* Time Slot Selector - Only show if date is selected and not blocked */}
        {selectedDate && !isDateBlocked && (
          <TimeSlotSelector
            slots={availableSlots}
            selectedSlot={selectedSlot}
            onSelectSlot={handleSlotSelect}
            loading={loading}
            error={error}
            onRetry={handleRetry}
          />
        )}
        
        {/* Show blocked message when date is blocked */}
        {selectedDate && isDateBlocked && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-red-700 mb-2">Date Blocked</h3>
            <p className="text-red-600">
              This date is blocked. Bookings are not available. Please select another date.
            </p>
          </div>
        )}
      </div>

      {/* Error Alert - Only show for non-blocked date errors */}
      {error && !isDateBlocked && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-12 flex justify-between">
        <button
          onClick={handleBack}
          className="px-8 py-3 border border-luxury-plum text-luxury-plum rounded-lg font-semibold hover:bg-luxury-plum hover:text-white transition duration-300"
        >
          Back to Services
        </button>
        <button
          onClick={handleContinue}
          disabled={!selectedDate || !selectedSlot || isDateBlocked}
          className={`
            px-8 py-3 rounded-lg font-semibold transition duration-300
            ${selectedDate && selectedSlot && !isDateBlocked
              ? 'bg-luxury-plum text-white hover:bg-black'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          Continue to Details
        </button>
      </div>
    </div>
  )
}

export default BookingDate