import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { bookingService } from '../../services/bookingService'

const findReservationSchema = z.object({
  reservation_code: z.string().min(3, 'Reservation code must be at least 3 characters'),
  email: z.string().email('Invalid email address')
})

const FindReservationForm = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(findReservationSchema),
    defaultValues: {
      reservation_code: '',
      email: ''
    }
  })

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const result = await bookingService.findReservation(
        data.reservation_code,
        data.email
      )
      
      if (result && result.reservation_code) {
        navigate(`/reservation/${result.reservation_code}`)
      } else {
        toast.error('Reservation not found')
      }
    } catch (error) {
      console.error('Find reservation error:', error)
      const errorMessage = error.response?.data?.error || 'No booking found with this code and email'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reservation Code *
        </label>
        <input
          {...register('reservation_code')}
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-plum focus:border-transparent"
          placeholder="e.g., SALON-8F3K92"
          disabled={loading}
        />
        {errors.reservation_code && (
          <p className="mt-1 text-sm text-red-600">{errors.reservation_code.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          {...register('email')}
          type="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-plum focus:border-transparent"
          placeholder="your@email.com"
          disabled={loading}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-luxury-plum text-white rounded-lg font-semibold hover:bg-black transition disabled:opacity-50"
      >
        {loading ? 'Searching...' : 'Find My Reservation'}
      </button>
    </form>
  )
}

export default FindReservationForm