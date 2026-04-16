import { motion } from 'framer-motion'

const PaymentSummary = ({ bookingData, depositPercentage = 30 }) => {
  // Ensure we're working with numbers
  const totalPrice = parseFloat(bookingData.total_price) || 0
  const depositAmount = (totalPrice * depositPercentage) / 100
  const remainingAmount = totalPrice - depositAmount

  const formatCurrency = (amount) => {
    if (isNaN(amount)) return '$0.00'
    return `$${amount.toFixed(2)}`
  }

  const formatTime = (time) => {
    if (!time) return ''
    const [hour, minute] = time.split(':')
    const hourNum = parseInt(hour)
    const ampm = hourNum >= 12 ? 'PM' : 'AM'
    const hour12 = hourNum % 12 || 12
    return `${hour12}:${minute} ${ampm}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="bg-gradient-to-r from-luxury-plum to-purple-600 px-6 py-4">
        <h2 className="text-xl font-playfair font-bold text-white">
          Booking Summary
        </h2>
        <p className="text-purple-200 text-sm mt-1">
          Review your appointment details
        </p>
      </div>

      <div className="p-6 space-y-4">
        {/* Service */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600">Service</span>
          <span className="font-semibold text-gray-900">{bookingData.service_name || 'N/A'}</span>
        </div>

        {/* Date */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600">Date</span>
          <span className="font-semibold text-gray-900">{bookingData.date || 'N/A'}</span>
        </div>

        {/* Time */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600">Time</span>
          <span className="font-semibold text-gray-900">{formatTime(bookingData.time_slot)}</span>
        </div>

        {/* Customer Name */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600">Customer</span>
          <span className="font-semibold text-gray-900">{bookingData.full_name || 'N/A'}</span>
        </div>

        {/* Email */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600">Email</span>
          <span className="font-semibold text-gray-900">{bookingData.email || 'N/A'}</span>
        </div>

        {/* Phone */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600">Phone</span>
          <span className="font-semibold text-gray-900">{bookingData.phone || 'N/A'}</span>
        </div>

        {/* Notes if present */}
        {bookingData.notes && (
          <div className="flex justify-between items-start py-2 border-b border-gray-100">
            <span className="text-gray-600">Special Requests</span>
            <span className="font-semibold text-gray-900 text-right max-w-[60%]">{bookingData.notes}</span>
          </div>
        )}

        {/* Price Breakdown */}
        <div className="mt-4 pt-2">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Total Price</span>
            <span className="font-semibold text-gray-900">{formatCurrency(totalPrice)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-t border-gray-100 mt-2 pt-2">
            <span className="text-gray-600">Deposit Required ({depositPercentage}%)</span>
            <span className="font-semibold text-luxury-plum">{formatCurrency(depositAmount)}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Remaining Balance</span>
            <span className="font-semibold text-gray-900">{formatCurrency(remainingAmount)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Remaining balance due at appointment
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default PaymentSummary