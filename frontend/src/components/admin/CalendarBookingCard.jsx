import { motion } from 'framer-motion'

const CalendarBookingCard = ({ booking, onClick }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'border-l-yellow-500 bg-yellow-50',
      partial: 'border-l-blue-500 bg-blue-50',
      paid: 'border-l-green-500 bg-green-50',
      cancelled: 'border-l-red-500 bg-red-50'
    }
    return colors[status] || 'border-l-gray-500 bg-gray-50'
  }

  const formatTime = (timeSlot) => {
    return timeSlot
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => onClick(booking)}
      className={`cursor-pointer rounded-lg p-2 mb-1 border-l-4 ${getStatusColor(booking.status)} hover:shadow-md transition`}
    >
      <div className="text-xs font-semibold text-gray-800 truncate">
        {booking.full_name || booking.customer_name}
      </div>
      <div className="text-xs text-gray-600">
        {booking.service?.name || booking.service_name}
      </div>
      <div className="text-xs text-gray-500">
        {formatTime(booking.time_slot)}
      </div>
    </motion.div>
  )
}

export default CalendarBookingCard