import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

const customerSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  notes: z.string().optional()
})

const BookingInfo = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      notes: ''
    }
  })

  const onSubmit = (data) => {
    setLoading(true)
    // Store customer information in session storage
    sessionStorage.setItem('customerInfo', JSON.stringify(data))
    setLoading(false)
    navigate('/booking/payment')
  }

  const handleBack = () => {
    navigate('/booking/date')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-playfair font-bold text-luxury-plum mb-4">
          Customer Information
        </h1>
        <p className="text-gray-600 mb-8">Please provide your contact details</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              {...register('full_name')}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-luxury-plum"
              placeholder="Enter your full name"
              disabled={loading}
            />
            {errors.full_name && (
              <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-luxury-plum"
              placeholder="your@email.com"
              disabled={loading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              {...register('phone')}
              type="tel"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-luxury-plum"
              placeholder="+1 317 372 7049"
              disabled={loading}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Requests (Optional)
            </label>
            <textarea
              {...register('notes')}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-luxury-plum"
              placeholder="Any specific requirements or preferences..."
              disabled={loading}
            />
          </div>
          
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handleBack}
              disabled={loading}
              className="px-8 py-3 border border-luxury-plum text-luxury-plum rounded-lg font-semibold hover:bg-luxury-plum hover:text-white transition disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-luxury-plum text-white rounded-lg font-semibold hover:bg-black transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Continue to Payment'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}

export default BookingInfo