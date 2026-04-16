import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { settingsAdminService } from '../../services/settingsAdminService'

const generalSchema = z.object({
  salon_name: z.string().min(2, 'Salon name must be at least 2 characters'),
  salon_email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  currency: z.string(),
  timezone: z.string(),
  booking_policy: z.string().optional()
})

const SettingsForm = ({ settings, onUpdate }) => {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(generalSchema),
    defaultValues: {
      salon_name: '',
      salon_email: '',
      phone: '',
      address: '',
      currency: 'USD',
      timezone: 'UTC',
      booking_policy: ''
    }
  })

  useEffect(() => {
    if (settings?.general) {
      reset({
        salon_name: settings.general.salon_name || '',
        salon_email: settings.general.salon_email || '',
        phone: settings.general.phone || '',
        address: settings.general.address || '',
        currency: settings.general.currency || 'USD',
        timezone: settings.general.timezone || 'UTC',
        booking_policy: settings.general.booking_policy || ''
      })
    }
  }, [settings, reset])

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      await settingsAdminService.updateGeneralSettings(data)
      toast.success('General settings updated successfully')
      if (onUpdate) onUpdate()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Salon Name *
          </label>
          <input
            {...register('salon_name')}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-plum"
            disabled={loading}
          />
          {errors.salon_name && (
            <p className="mt-1 text-sm text-red-600">{errors.salon_name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Salon Email *
          </label>
          <input
            {...register('salon_email')}
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-plum"
            disabled={loading}
          />
          {errors.salon_email && (
            <p className="mt-1 text-sm text-red-600">{errors.salon_email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            {...register('phone')}
            type="tel"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-plum"
            disabled={loading}
            placeholder="+1234567890"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            {...register('currency')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-plum"
            disabled={loading}
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="RWF">RWF - Rwandan Franc</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <select
            {...register('timezone')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-plum"
            disabled={loading}
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="Africa/Kigali">Kigali</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address *
          </label>
          <textarea
            {...register('address')}
            rows="2"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-plum"
            disabled={loading}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Booking Policy
          </label>
          <textarea
            {...register('booking_policy')}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-plum"
            disabled={loading}
            placeholder="Enter your booking policies and notes for customers..."
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-luxury-plum text-white rounded-lg hover:bg-black transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}

export default SettingsForm