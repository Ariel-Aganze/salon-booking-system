import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { settingsAdminService } from '../../services/settingsAdminService'

const paymentSchema = z.object({
  deposit_percentage: z.number().min(0, 'Deposit must be at least 0%').max(100, 'Deposit cannot exceed 100%'),
  partial_payment_enabled: z.boolean()
})

const PaymentSettingsForm = ({ settings, onUpdate }) => {
  const [loading, setLoading] = useState(false)
  const [stripeKey, setStripeKey] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      deposit_percentage: 30,
      partial_payment_enabled: true
    }
  })

  useEffect(() => {
    if (settings?.payment) {
      reset({
        deposit_percentage: settings.payment.deposit_percentage || 30,
        partial_payment_enabled: settings.payment.partial_payment_enabled !== false
      })
      setStripeKey(settings.payment.stripe_public_key || '')
    }
  }, [settings, reset])

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      await settingsAdminService.updatePaymentSettings(data)
      toast.success('Payment settings updated successfully')
      if (onUpdate) onUpdate()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update payment settings')
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
        <p className="text-sm text-gray-500 mt-1">Percentage required to secure an appointment</p>
        {errors.deposit_percentage && (
          <p className="mt-1 text-sm text-red-600">{errors.deposit_percentage.message}</p>
        )}
      </div>

      <div className="flex items-start justify-between py-3 border-t border-gray-100">
        <div className="flex-1">
          <p className="font-medium text-gray-700">Partial Payments</p>
          <p className="text-sm text-gray-500">Allow customers to pay remaining balance after deposit</p>
        </div>
        <button
          type="button"
          onClick={() => {
            const currentValue = document.querySelector('input[name="partial_payment_enabled"]')?.value === 'true'
            const input = document.querySelector('input[name="partial_payment_enabled"]')
            if (input) {
              input.value = (!currentValue).toString()
              input.dispatchEvent(new Event('change', { bubbles: true }))
            }
          }}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            register('partial_payment_enabled').value ? 'bg-luxury-plum' : 'bg-gray-200'
          }`}
          disabled={loading}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              register('partial_payment_enabled').value ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        <input type="hidden" {...register('partial_payment_enabled')} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Stripe Public Key (View Only)
        </label>
        <input
          type="text"
          value={stripeKey}
          readOnly
          className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg cursor-not-allowed"
          disabled
        />
        <p className="text-sm text-gray-500 mt-1">This key is configured in the backend</p>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-luxury-plum text-white rounded-lg hover:bg-black transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Payment Settings'}
        </button>
      </div>
    </form>
  )
}

export default PaymentSettingsForm