import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import ReservationDetailsCard from '../components/booking/ReservationDetailsCard'
import { bookingService } from '../services/bookingService'

const ReservationDetails = () => {
  const { code } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (code) {
      fetchReservationDetails()
    }
  }, [code])

  const fetchReservationDetails = async () => {
    try {
      setLoading(true)
      const data = await bookingService.getReservationDetails(code)
      setBooking(data)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch reservation:', err)
      setError(err.response?.data?.error || 'Reservation not found')
    } finally {
      setLoading(false)
    }
  }

  const handlePayRemaining = async () => {
    if (!booking) return

    setActionLoading(true)
    try {
      const successUrl = `${window.location.origin}/payment/success?reservation_code=${booking.reservation_code}`
      const cancelUrl = `${window.location.origin}/payment/cancel`

      const sessionResponse = await bookingService.payRemainingBalance(
        booking.reservation_code,
        successUrl,
        cancelUrl
      )

      if (sessionResponse.checkout_url) {
        window.location.href = sessionResponse.checkout_url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (err) {
      console.error('Payment error:', err)
      const errorMessage = err.response?.data?.message || 'Failed to process payment. Please try again.'
      toast.error(errorMessage)
      setActionLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!booking) return

    const confirmed = window.confirm(
      'Are you sure you want to cancel this booking? This action cannot be undone.'
    )

    if (!confirmed) return

    setActionLoading(true)
    try {
      await bookingService.cancelReservation(booking.reservation_code)
      toast.success('Booking cancelled successfully')
      fetchReservationDetails()
    } catch (err) {
      console.error('Cancel error:', err)
      const errorMessage = err.response?.data?.message || 'Failed to cancel booking'
      toast.error(errorMessage)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="animate-pulse text-gray-400">Loading reservation details...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-4">
            Reservation Not Found
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/reservation/find')}
            className="px-6 py-2 bg-luxury-plum text-white rounded-lg hover:bg-black transition"
          >
            Find My Reservation
          </button>
        </div>
      </div>
    )
  }

  if (!booking) {
    return null
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ReservationDetailsCard
        booking={booking}
        onPayRemaining={handlePayRemaining}
        onCancel={handleCancel}
        loading={actionLoading}
      />
    </div>
  )
}

export default ReservationDetails