import { motion } from 'framer-motion'

const ReservationDetailsCard = ({ booking, onPayRemaining, onCancel, loading }) => {
  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (time) => {
    if (!time) return ''
    const [hour, minute] = time.split(':')
    const hourNum = parseInt(hour)
    const ampm = hourNum >= 12 ? 'PM' : 'AM'
    const hour12 = hourNum % 12 || 12
    return `${hour12}:${minute} ${ampm}`
  }

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '$0.00'
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    if (isNaN(numAmount)) return '$0.00'
    return `$${numAmount.toFixed(2)}`
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      partial: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pending Payment',
      partial: 'Deposit Paid',
      paid: 'Fully Paid',
      cancelled: 'Cancelled'
    }
    return texts[status] || status
  }

  const totalPrice = parseFloat(booking.total_price) || 0
  const amountPaid = parseFloat(booking.amount_paid) || 0
  const remainingAmount = totalPrice - amountPaid
  const isCancellable = booking.status !== 'cancelled' && booking.status !== 'paid'
  const hasRemainingBalance = remainingAmount > 0 && booking.status !== 'cancelled' && booking.status !== 'paid'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="bg-gradient-to-r from-luxury-plum to-purple-600 px-6 py-4">
        <h2 className="text-xl font-playfair font-bold text-white">
          Reservation Details
        </h2>
        <p className="text-purple-200 text-sm mt-1">
          Your booking information
        </p>
      </div>

      <div className="p-6 space-y-4">
        {/* Reservation Code */}
        <div className="bg-soft-cream rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 mb-1">Reservation Code</p>
          <p className="text-2xl font-mono font-bold text-luxury-plum">
            {booking.reservation_code}
          </p>
        </div>

        {/* Status */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600">Status</span>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
            {getStatusText(booking.status)}
          </span>
        </div>

        {/* Service */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600">Service</span>
          <span className="font-semibold text-gray-900">{booking.service_name}</span>
        </div>

        {/* Date */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600">Date</span>
          <span className="font-semibold text-gray-900">{formatDate(booking.date)}</span>
        </div>

        {/* Time */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600">Time</span>
          <span className="font-semibold text-gray-900">{formatTime(booking.time_slot)}</span>
        </div>

        {/* Customer Name */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600">Customer Name</span>
          <span className="font-semibold text-gray-900">{booking.full_name}</span>
        </div>

        {/* Email */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600">Email</span>
          <span className="font-semibold text-gray-900">{booking.email}</span>
        </div>

        {/* Phone */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600">Phone</span>
          <span className="font-semibold text-gray-900">{booking.phone}</span>
        </div>

        {/* Payment Details */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Total Amount</span>
            <span className="font-semibold text-gray-900">{formatCurrency(totalPrice)}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Amount Paid</span>
            <span className="font-semibold text-green-600">{formatCurrency(amountPaid)}</span>
          </div>
          {remainingAmount > 0 && (
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Remaining Balance</span>
              <span className="font-semibold text-orange-600">{formatCurrency(remainingAmount)}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          {hasRemainingBalance && (
            <button
              onClick={onPayRemaining}
              disabled={loading}
              className="w-full py-3 bg-luxury-plum text-white rounded-lg font-semibold hover:bg-black transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Pay Remaining Balance'}
            </button>
          )}

          {isCancellable && (
            <button
              onClick={onCancel}
              disabled={loading}
              className="w-full py-3 border border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition disabled:opacity-50"
            >
              Cancel Booking
            </button>
          )}
        </div>

        {/* Note */}
        {remainingAmount > 0 && booking.status !== 'cancelled' && (
          <p className="text-xs text-gray-500 text-center mt-4">
            Remaining balance must be paid before your appointment
          </p>
        )}
      </div>
    </motion.div>
  )
}

export default ReservationDetailsCard