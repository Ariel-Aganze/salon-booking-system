import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { bookingService } from '../services/bookingService'

const PaymentSuccess = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    verifyPaymentAndGetBooking()
  }, [])

  const verifyPaymentAndGetBooking = async () => {
    try {
      setLoading(true)
      
      let reservationCode = searchParams.get('reservation_code')
      
      console.log('Reservation code from URL:', reservationCode)
      
      if (!reservationCode) {
        reservationCode = sessionStorage.getItem('reservationCode')
        console.log('Reservation code from sessionStorage:', reservationCode)
      }
      
      if (!reservationCode) {
        setError('No booking information found')
        setLoading(false)
        return
      }
      
      const bookingData = await bookingService.getBookingByCode(reservationCode)
      
      if (!bookingData) {
        setError('Booking not found')
        setLoading(false)
        return
      }
      
      // Ensure total_price is a number
      if (bookingData.total_price) {
        bookingData.total_price = parseFloat(bookingData.total_price)
      }
      if (bookingData.amount_paid) {
        bookingData.amount_paid = parseFloat(bookingData.amount_paid)
      }
      
      setBooking(bookingData)
      
      sessionStorage.removeItem('selectedService')
      sessionStorage.removeItem('selectedDate')
      sessionStorage.removeItem('selectedTimeSlot')
      sessionStorage.removeItem('customerInfo')
      sessionStorage.removeItem('bookingId')
      sessionStorage.removeItem('reservationCode')
      
    } catch (err) {
      console.error('Failed to verify payment:', err)
      setError('Unable to verify payment. Please check your email for confirmation.')
    } finally {
      setLoading(false)
    }
  }

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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full"></div>
            <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
          </div>
          <p className="text-gray-500 mt-4">Verifying your payment...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-4">
            Verification Failed
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-6 py-2 bg-luxury-plum text-white rounded-lg hover:bg-black transition"
            >
              Return to Home
            </button>
            <button
              onClick={() => navigate('/reservation/find')}
              className="w-full sm:w-auto px-6 py-2 border border-luxury-plum text-luxury-plum rounded-lg hover:bg-luxury-plum hover:text-white transition"
            >
              Find My Reservation
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!booking) {
    return null
  }

  const totalPrice = parseFloat(booking.total_price) || 0
  const depositAmount = booking.amount_paid ? parseFloat(booking.amount_paid) : (totalPrice * 0.3)
  const remainingAmount = totalPrice - depositAmount

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-playfair font-bold text-luxury-plum mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600 text-lg">
          Your appointment has been confirmed.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
      >
        <div className="bg-gradient-to-r from-luxury-plum to-purple-600 px-6 py-4">
          <h2 className="text-xl font-playfair font-bold text-white">
            Booking Confirmation
          </h2>
          <p className="text-purple-200 text-sm mt-1">
            Your appointment has been confirmed
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-soft-cream rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Reservation Code</p>
            <p className="text-2xl font-mono font-bold text-luxury-plum">
              {booking.reservation_code}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Please save this code for future reference
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-b border-gray-100 pb-3">
              <p className="text-xs text-gray-500 mb-1">Service</p>
              <p className="font-semibold text-gray-900">{booking.service_name}</p>
            </div>
            <div className="border-b border-gray-100 pb-3">
              <p className="text-xs text-gray-500 mb-1">Date</p>
              <p className="font-semibold text-gray-900">{formatDate(booking.date)}</p>
            </div>
            <div className="border-b border-gray-100 pb-3">
              <p className="text-xs text-gray-500 mb-1">Time</p>
              <p className="font-semibold text-gray-900">{formatTime(booking.time_slot)}</p>
            </div>
            <div className="border-b border-gray-100 pb-3">
              <p className="text-xs text-gray-500 mb-1">Customer</p>
              <p className="font-semibold text-gray-900">{booking.full_name}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Total Amount</span>
              <span className="font-semibold text-gray-900">{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Deposit Paid</span>
              <span className="font-semibold text-green-600">{formatCurrency(depositAmount)}</span>
            </div>
            {remainingAmount > 0 && (
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Remaining Balance</span>
                <span className="font-semibold text-gray-900">{formatCurrency(remainingAmount)}</span>
              </div>
            )}
            {remainingAmount > 0 && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                Remaining balance due at appointment
              </p>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-luxury-plum/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-luxury-plum text-sm font-semibold">1</span>
            </div>
            <p className="text-gray-600">Check your email for a confirmation message with all booking details</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-luxury-plum/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-luxury-plum text-sm font-semibold">2</span>
            </div>
            <p className="text-gray-600">Save your reservation code to check your booking status later</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-luxury-plum/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-luxury-plum text-sm font-semibold">3</span>
            </div>
            <p className="text-gray-600">Arrive 10 minutes before your appointment time</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-luxury-plum text-white rounded-lg font-semibold hover:bg-black transition"
        >
          Return to Home
        </button>
        <button
          onClick={() => navigate(`/reservation/${booking.reservation_code}`)}
          className="px-8 py-3 border border-luxury-plum text-luxury-plum rounded-lg font-semibold hover:bg-luxury-plum hover:text-white transition"
        >
          View My Reservation
        </button>
      </motion.div>
    </div>
  )
}

export default PaymentSuccess