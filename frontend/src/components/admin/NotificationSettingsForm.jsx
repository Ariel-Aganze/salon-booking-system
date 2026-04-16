import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { settingsAdminService } from '../../services/settingsAdminService'

const NotificationSettingsForm = ({ settings, onUpdate }) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email_enabled: true,
    admin_notifications: true,
    customer_confirmation: true,
    cancellation_notifications: true
  })

  useEffect(() => {
    if (settings?.notifications) {
      setFormData(settings.notifications)
    }
  }, [settings])

  const handleToggle = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await settingsAdminService.updateNotificationSettings(formData)
      toast.success('Notification settings updated successfully')
      if (onUpdate) onUpdate()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update notification settings')
    } finally {
      setLoading(false)
    }
  }

  const notificationOptions = [
    { id: 'email_enabled', label: 'Email Notifications', description: 'Enable all email notifications' },
    { id: 'admin_notifications', label: 'Admin Notifications', description: 'Send email to admin for new bookings' },
    { id: 'customer_confirmation', label: 'Customer Confirmations', description: 'Send confirmation email to customers' },
    { id: 'cancellation_notifications', label: 'Cancellation Notifications', description: 'Send notification for cancellations' }
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {notificationOptions.map((option) => (
        <div key={option.id} className="flex items-start justify-between py-3 border-b border-gray-100">
          <div className="flex-1">
            <p className="font-medium text-gray-700">{option.label}</p>
            <p className="text-sm text-gray-500">{option.description}</p>
          </div>
          <button
            type="button"
            onClick={() => handleToggle(option.id)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              formData[option.id] ? 'bg-luxury-plum' : 'bg-gray-200'
            }`}
            disabled={loading}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                formData[option.id] ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      ))}

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-luxury-plum text-white rounded-lg hover:bg-black transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  )
}

export default NotificationSettingsForm