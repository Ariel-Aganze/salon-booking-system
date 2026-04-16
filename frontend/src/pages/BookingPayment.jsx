import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import PaymentSummary from '../components/booking/PaymentSummary'
import { bookingService } from '../services/bookingService'
import { settingsAdminService } from '../services/settingsAdminService'

const BookingPayment = () => {
  const navigate = useNavigate()
  const [bookingData, setBookingData] = useState(null)
  const [depositPercentage, setDepositPercentage] = useState(30)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    loadBookingData()
    fetchDepositPercentage()
  }, [])

  const fetchDepositPercentage = async () => {
    try {
      const percentage = await settingsAdminService.getDepositPercentage()
      console.log('Fetched deposit percentage:', percentage)
      setDepositPercentage(percentage)
    } catch (error) {
      console.error('Failed to fetch deposit percentage:', error)
    }
  }

  const loadBookingData = () => {
    const selectedService = sessionStorage.getItem('selectedService')
    const selectedDate = sessionStorage.getItem('selectedDate')
    const selectedTimeSlot = sessionStorage.getItem('selectedTimeSlot')
    const customerInfo = sessionStorage.getItem('customerInfo')

    console.log('Loaded data:', { selectedService, selectedDate, selectedTimeSlot, customerInfo })

    if (!selectedService || !selectedDate || !selectedTimeSlot || !customerInfo) {
      toast.error('Missing booking information. Please start over.')
      navigate('/booking')
      return
    }

    const service = JSON.parse(selectedService)
    const customer = JSON.parse(customerInfo)

    setBookingData({
      service_name: service.name,
      total_price: parseFloat(service.price),
      date: selectedDate,
      time_slot: selectedTimeSlot,
      full_name: customer.full_name,
      email: customer.email,
      phone: customer.phone,
      notes: customer.notes || '',
      service_id: service.id
    })
    setLoading(false)
  }

  // Function to create booking with retry logic
  const createBookingWithRetry = async (createBookingData, retries = 2) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`Creating booking - Attempt ${attempt}/${retries}`)
        
        // Use Promise.race to set a timeout
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), 30000)
        })
        
        const bookingPromise = bookingService.createBooking(createBookingData)
        const booking = await Promise.race([bookingPromise, timeoutPromise])
        
        return booking
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error.message)
        
        if (attempt === retries) {
          throw error
        }
        
        // Wait before retrying (exponential backoff)
        const waitTime = 2000 * attempt
        console.log(`Waiting ${waitTime}ms before retry...`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }
  }

  const handleCreateBookingAndPay = async () => {
    if (!bookingData) return

    setSubmitting(true)
    setError(null)

    try {
      // Prepare booking data
      const createBookingData = {
        full_name: bookingData.full_name,
        email: bookingData.email,
        phone: bookingData.phone,
        service: bookingData.service_id,
        date: bookingData.date,
        time_slot: bookingData.time_slot
      }

      console.log('Creating booking with data:', createBookingData)

      // Show loading toast
      const loadingToast = toast.loading('Creating your booking...')

      // Step 1: Create the booking with retry logic
      const booking = await createBookingWithRetry(createBookingData, 2)

      toast.dismiss(loadingToast)
      console.log('Booking created:', booking)
      console.log('Reservation code:', booking.reservation_code)

      if (!booking.reservation_code) {
        throw new Error('No reservation code received from server')
      }

      // Store the reservation code for the success page
      sessionStorage.setItem('reservationCode', booking.reservation_code)
      
      // Also store backup data
      sessionStorage.setItem('bookingData_backup', JSON.stringify({
        reservation_code: booking.reservation_code,
        service_name: bookingData.service_name,
        total_price: bookingData.total_price,
        date: bookingData.date,
        time_slot: bookingData.time_slot,
        full_name: bookingData.full_name,
        email: bookingData.email,
        phone: bookingData.phone
      }))

      // Show redirecting toast
      toast.loading('Redirecting to payment...', { duration: 2000 })

      // Step 2: Create Stripe checkout session
      const successUrl = `${window.location.origin}/payment/success?reservation_code=${booking.reservation_code}`
      const cancelUrl = `${window.location.origin}/payment/cancel`

      console.log('Success URL:', successUrl)

      const sessionResponse = await bookingService.createDepositSession(
        booking.id,
        successUrl,
        cancelUrl
      )

      console.log('Stripe session created:', sessionResponse)

      // Step 3: Redirect to Stripe checkout
      if (sessionResponse.checkout_url) {
        window.location.href = sessionResponse.checkout_url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (err) {
      console.error('Payment error:', err)
      
      let errorMessage = 'Failed to process payment. Please try again.'
      
      if (err.message === 'Request timeout') {
        errorMessage = 'The server is taking too long to respond. Please check your connection and try again.'
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Connection timeout. Please check your internet connection and try again.'
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error
      } else if (err.message && !err.message.includes('timeout')) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
      toast.error(errorMessage)
      setSubmitting(false)
    }
  }

  const handleBack = () => {
    navigate('/booking/info')
  }

  const handleRetry = () => {
    setError(null)
    setRetryCount(prev => prev + 1)
    handleCreateBookingAndPay()
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="animate-pulse text-gray-400">Loading payment details...</div>
      </div>
    )
  }

  if (!bookingData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-red-500">No booking information found. Please start over.</p>
        <button
          onClick={() => navigate('/booking')}
          className="mt-4 px-6 py-2 bg-luxury-plum text-white rounded-lg hover:bg-black transition"
        >
          Start Booking
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-playfair font-bold text-luxury-plum mb-4">
          Payment
        </h1>
        <div className="w-24 h-px bg-luxury-plum mx-auto"></div>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Secure your appointment with a deposit
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
            <div className="w-10 h-10 rounded-full bg-luxury-plum text-white flex items-center justify-center font-semibold">
              3
            </div>
            <div className="flex-1 h-1 bg-luxury-plum ml-2"></div>
          </div>
          <div className="ml-2">
            <div className="w-10 h-10 rounded-full bg-luxury-plum text-white flex items-center justify-center font-semibold">
              4
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Service</span>
          <span>Date & Time</span>
          <span>Details</span>
          <span className="text-luxury-plum font-medium">Payment</span>
        </div>
      </div>

      {/* Payment Content */}
      <div className="grid lg:grid-cols-2 gap-8">
        <PaymentSummary bookingData={bookingData} depositPercentage={depositPercentage} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Secure Payment</h3>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600 text-sm mb-2">{error}</p>
              <button
                onClick={handleRetry}
                className="text-sm text-red-700 font-medium hover:text-red-800 underline"
              >
                Try Again
              </button>
            </div>
          )}

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <svg className="w-6 h-6 text-luxury-plum" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6-4h12a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2zm10 6v-4H8v4a2 2 0 002 2h8a2 2 0 002-2z" />
                </svg>
                <span className="font-medium text-gray-700">Secure Payment via Stripe</span>
              </div>
              <p className="text-sm text-gray-500">
                You will be redirected to Stripe's secure payment page to enter your card details.
              </p>
            </div>

            <button
              onClick={handleCreateBookingAndPay}
              disabled={submitting}
              className={`
                w-full py-3 rounded-lg font-semibold transition duration-300
                ${submitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-luxury-plum text-white hover:bg-black'
                }
              `}
            >
              {submitting ? 'Processing...' : `Pay ${depositPercentage}% Deposit with Stripe`}
            </button>

            <p className="text-center text-xs text-gray-500">
              You will be redirected to Stripe secure payment gateway to enter your card details
            </p>
          </div>
        </motion.div>
      </div>

      <div className="mt-12 flex justify-between">
        <button
          onClick={handleBack}
          disabled={submitting}
          className="px-8 py-3 border border-luxury-plum text-luxury-plum rounded-lg font-semibold hover:bg-luxury-plum hover:text-white transition duration-300 disabled:opacity-50"
        >
          Back to Details
        </button>
      </div>
    </div>
  )
}

export default BookingPayment