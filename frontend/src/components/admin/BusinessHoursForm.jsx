import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { settingsAdminService } from '../../services/settingsAdminService'

const daysOfWeek = [
  { id: 'monday', label: 'Monday', defaultOpen: '09:00', defaultClose: '17:00' },
  { id: 'tuesday', label: 'Tuesday', defaultOpen: '09:00', defaultClose: '17:00' },
  { id: 'wednesday', label: 'Wednesday', defaultOpen: '09:00', defaultClose: '17:00' },
  { id: 'thursday', label: 'Thursday', defaultOpen: '09:00', defaultClose: '17:00' },
  { id: 'friday', label: 'Friday', defaultOpen: '09:00', defaultClose: '17:00' },
  { id: 'saturday', label: 'Saturday', defaultOpen: '08:00', defaultClose: '16:00' },
  { id: 'sunday', label: 'Sunday', defaultOpen: '09:00', defaultClose: '17:00' }
]

const BusinessHoursForm = ({ settings, onUpdate }) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    if (settings?.business_hours) {
      setFormData(settings.business_hours)
    } else {
      // Initialize with default values
      const initialData = {}
      daysOfWeek.forEach(day => {
        initialData[day.id] = {
          is_open: day.id !== 'sunday',
          open: day.defaultOpen,
          close: day.defaultClose
        }
      })
      setFormData(initialData)
    }
  }, [settings])

  const handleToggleDay = (dayId) => {
    setFormData(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        is_open: !prev[dayId]?.is_open
      }
    }))
  }

  const handleTimeChange = (dayId, field, value) => {
    setFormData(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        [field]: value
      }
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await settingsAdminService.updateBusinessHours(formData)
      toast.success('Working hours saved successfully')
      if (onUpdate) onUpdate()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save working hours')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {daysOfWeek.map((day) => (
        <div key={day.id} className="border-b border-gray-100 pb-4 last:border-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData[day.id]?.is_open || false}
                onChange={() => handleToggleDay(day.id)}
                className="w-4 h-4 text-luxury-plum rounded focus:ring-luxury-plum"
                disabled={loading}
              />
              <label className="font-medium text-gray-700 w-24">{day.label}</label>
            </div>
          </div>
          
          {formData[day.id]?.is_open && (
            <div className="flex space-x-4 ml-9">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Open Time</label>
                <input
                  type="time"
                  value={formData[day.id]?.open || day.defaultOpen}
                  onChange={(e) => handleTimeChange(day.id, 'open', e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-plum"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Close Time</label>
                <input
                  type="time"
                  value={formData[day.id]?.close || day.defaultClose}
                  onChange={(e) => handleTimeChange(day.id, 'close', e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-plum"
                  disabled={loading}
                />
              </div>
              <div className="flex items-end">
                <span className="text-xs text-gray-400 ml-2">
                  (24-hour format)
                </span>
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-luxury-plum text-white rounded-lg hover:bg-black transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Working Hours'}
        </button>
      </div>
    </form>
  )
}

export default BusinessHoursForm