import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { settingsAdminService } from '../../services/settingsAdminService'

const emailTemplateSchema = z.object({
  booking_confirmation: z.string().min(10, 'Template must be at least 10 characters'),
  payment_confirmation: z.string().min(10, 'Template must be at least 10 characters'),
  cancellation_notification: z.string().min(10, 'Template must be at least 10 characters')
})

const EmailTemplatesForm = ({ settings, onUpdate }) => {
  const [loading, setLoading] = useState(false)
  const [activeTemplate, setActiveTemplate] = useState('booking')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(emailTemplateSchema),
    defaultValues: {
      booking_confirmation: '',
      payment_confirmation: '',
      cancellation_notification: ''
    }
  })

  useEffect(() => {
    if (settings?.email_templates) {
      reset({
        booking_confirmation: settings.email_templates.booking_confirmation || '',
        payment_confirmation: settings.email_templates.payment_confirmation || '',
        cancellation_notification: settings.email_templates.cancellation_notification || ''
      })
    }
  }, [settings, reset])

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      await settingsAdminService.updateEmailTemplates(data)
      toast.success('Email templates updated successfully')
      if (onUpdate) onUpdate()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update email templates')
    } finally {
      setLoading(false)
    }
  }

  const templates = {
    booking: {
      name: 'Booking Confirmation',
      field: 'booking_confirmation',
      description: 'Sent to customers after they successfully book an appointment',
      preview: 'Dear {customer_name},\n\nYour appointment has been confirmed for {date} at {time}.\n\nService: {service_name}\nTotal: ${total_price}\nDeposit Paid: ${deposit_paid}\n\nThank you for choosing our salon!'
    },
    payment: {
      name: 'Payment Confirmation',
      field: 'payment_confirmation',
      description: 'Sent to customers after payment is processed',
      preview: 'Dear {customer_name},\n\nPayment of ${amount} has been received for your appointment on {date}.\n\nRemaining balance: ${remaining_balance}\n\nThank you for your payment!'
    },
    cancellation: {
      name: 'Cancellation Notification',
      field: 'cancellation_notification',
      description: 'Sent to customers when a booking is cancelled',
      preview: 'Dear {customer_name},\n\nYour appointment on {date} at {time} has been cancelled.\n\nIf you have any questions, please contact us.\n\nWe hope to see you soon!'
    }
  }

  const currentTemplate = templates[activeTemplate]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Template Selector */}
      <div className="flex space-x-2 border-b border-gray-200 pb-4">
        {Object.keys(templates).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTemplate(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTemplate === key
                ? 'bg-luxury-plum text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {templates[key].name}
          </button>
        ))}
      </div>

      {/* Template Editor */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {currentTemplate.name}
          </h3>
          <p className="text-sm text-gray-500">{currentTemplate.description}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Template
          </label>
          <textarea
            {...register(currentTemplate.field)}
            rows="10"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-plum font-mono text-sm"
            disabled={loading}
            placeholder="Enter your email template..."
          />
          {errors[currentTemplate.field] && (
            <p className="mt-1 text-sm text-red-600">{errors[currentTemplate.field]?.message}</p>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Available Variables:</p>
          <div className="flex flex-wrap gap-2 text-xs text-gray-600">
            <code className="px-2 py-1 bg-white rounded">{'{customer_name}'}</code>
            <code className="px-2 py-1 bg-white rounded">{'{date}'}</code>
            <code className="px-2 py-1 bg-white rounded">{'{time}'}</code>
            <code className="px-2 py-1 bg-white rounded">{'{service_name}'}</code>
            <code className="px-2 py-1 bg-white rounded">{'{total_price}'}</code>
            <code className="px-2 py-1 bg-white rounded">{'{deposit_paid}'}</code>
            <code className="px-2 py-1 bg-white rounded">{'{remaining_balance}'}</code>
            <code className="px-2 py-1 bg-white rounded">{'{amount}'}</code>
            <code className="px-2 py-1 bg-white rounded">{'{reservation_code}'}</code>
          </div>
        </div>

        {/* Preview Section */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => {
              const previewText = currentTemplate.preview
              const textarea = document.querySelector(`textarea[name="${currentTemplate.field}"]`)
              if (textarea && !textarea.value) {
                toast.success('Preview template loaded. You can edit it before saving.')
              }
            }}
            className="text-sm text-luxury-plum hover:underline"
          >
            Load Preview Template
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-luxury-plum text-white rounded-lg hover:bg-black transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Email Templates'}
        </button>
      </div>
    </form>
  )
}

export default EmailTemplatesForm