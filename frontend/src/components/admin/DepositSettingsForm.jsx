import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { settingsAdminService } from '../../services/settingsAdminService'

const depositSchema = z.object({
  deposit_percentage: z.number()
    .min(0, 'Deposit must be at least 0%')
    .max(100, 'Deposit cannot exceed 100%')
})

const DepositSettingsForm = ({ settings, onUpdate }) => {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      deposit_percentage: 30
    }
  })

  useEffect(() => {
    if (settings?.deposit) {
      reset({
        deposit_percentage: settings.deposit.deposit_percentage || 30
      })
    }
  }, [settings, reset])

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      await settingsAdminService.updateDepositSettings(data)
      toast.success('Deposit settings updated successfully')
      if (onUpdate) onUpdate()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update deposit settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Deposit Percentage
        </label>
        <div className="flex items-center space-x-2">
          <input
            {...register('deposit_percentage', { valueAsNumber: true })}
            type="number"
            step="5"
            className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-plum"
            disabled={loading}
          />
          <span className="text-gray-600">%</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Percentage of total price required as deposit to secure a booking
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Default: 30%
        </p>
        {errors.deposit_percentage && (
          <p className="mt-1 text-sm text-red-600">{errors.deposit_percentage.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-luxury-plum text-white rounded-lg hover:bg-black transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Deposit Settings'}
        </button>
      </div>
    </form>
  )
}

export default DepositSettingsForm