import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { bookingAdminService } from '../../services/bookingAdminService'

const RescheduleBookingModal = ({ booking, isOpen, onClose, onSuccess }) => {
  const [date, setDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [availableSlots, setAvailableSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [slotsLoading, setSlotsLoading] = useState(false)

  useEffect(() => {
    if (booking && isOpen) {
      console.log('Reschedule modal opened with booking:', booking)
      setDate('')
      setTimeSlot('')
      setAvailableSlots([])
    }
  }, [booking, isOpen])

  useEffect(() => {
    if (date && booking) {
      fetchAvailableSlots()
    } else {
      setAvailableSlots([])
    }
  }, [date, booking])

  const fetchAvailableSlots = async () => {
    try {
      setSlotsLoading(true)
      console.log('Fetching slots for date:', date, 'service:', booking?.service?.id || booking?.service_id)
      const slots = await bookingAdminService.getAvailableSlots(date, booking?.service?.id || booking?.service_id)
      setAvailableSlots(slots)
    } catch (error) {
      console.error('Failed to load slots:', error)
      toast.error('Failed to load available time slots')
    } finally {
      setSlotsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!date || !timeSlot) {
      toast.error('Please select both date and time slot')
      return
    }

    try {
      setLoading(true)
      await bookingAdminService.rescheduleBooking(booking.id, date, timeSlot)
      toast.success('Booking rescheduled successfully')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Reschedule error:', error)
      toast.error(error.response?.data?.message || 'Failed to reschedule booking')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (time) => {
    if (!time) return ''
    const [hour, minute] = time.split(':')
    const hourNum = parseInt(hour)
    const ampm = hourNum >= 12 ? 'PM' : 'AM'
    const hour12 = hourNum % 12 || 12
    return `${hour12}:${minute} ${ampm}`
  }

  const minDate = new Date().toISOString().split('T')[0]

  if (!isOpen || !booking) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
              onClick={onClose}
            />

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Reschedule Booking
                      </h3>
                      
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Booking ID: <span className="font-mono font-semibold">{booking.reservation_code || booking.code}</span></p>
                        <p className="text-sm text-gray-600 mt-1">Current Date: <span className="font-semibold">{booking.date}</span></p>
                        <p className="text-sm text-gray-600 mt-1">Current Time: <span className="font-semibold">{formatTime(booking.time_slot)}</span></p>
                        <p className="text-sm text-gray-600 mt-1">Service: <span className="font-semibold">{booking.service?.name || booking.service_name}</span></p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Date *
                          </label>
                          <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            min={minDate}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-plum"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Time Slot *
                          </label>
                          {slotsLoading ? (
                            <div className="text-center py-4 text-gray-500">
                              <div className="animate-pulse">Loading available slots...</div>
                            </div>
                          ) : availableSlots.length > 0 ? (
                            <div className="grid grid-cols-3 gap-2">
                              {availableSlots.map((slot) => (
                                <button
                                  key={slot.time}
                                  type="button"
                                  onClick={() => setTimeSlot(slot.time)}
                                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                                    timeSlot === slot.time
                                      ? 'bg-luxury-plum text-white border-luxury-plum'
                                      : 'border-gray-300 text-gray-700 hover:border-luxury-plum hover:bg-luxury-plum/5'
                                  }`}
                                >
                                  {formatTime(slot.time)}
                                </button>
                              ))}
                            </div>
                          ) : date ? (
                            <div className="text-center py-4 bg-yellow-50 rounded-lg">
                              <p className="text-yellow-600">No available time slots for this date</p>
                              <p className="text-sm text-gray-500 mt-1">Please select another date</p>
                            </div>
                          ) : (
                            <div className="text-center py-4 text-gray-500">
                              Select a date to view available time slots
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={loading || !date || !timeSlot}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-luxury-plum text-base font-medium text-white hover:bg-black focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Rescheduling...' : 'Confirm Reschedule'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default RescheduleBookingModal