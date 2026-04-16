import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { bookingAdminService } from '../../services/bookingAdminService'

const TimeSlotManager = ({ settings }) => {
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [timeSlots, setTimeSlots] = useState([])
  const [dateRange, setDateRange] = useState({
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchTimeSlots()
  }, [dateRange])

  const fetchTimeSlots = async () => {
    try {
      setLoading(true)
      // Fetch slots from backend for the date range
      const slots = []
      const start = new Date(dateRange.start_date)
      const end = new Date(dateRange.end_date)
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0]
        const slotsForDate = await bookingAdminService.getAvailableSlots(dateStr)
        slots.push(...slotsForDate)
      }
      setTimeSlots(slots)
    } catch (error) {
      console.error('Failed to fetch time slots:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateTimeSlots = async () => {
    if (!settings?.business_hours) {
      toast.error('Please configure working hours first')
      return
    }

    setGenerating(true)
    try {
      const result = await bookingAdminService.generateTimeSlots(
        dateRange.start_date,
        dateRange.end_date,
        settings.business_hours
      )
      toast.success(result.message || 'Time slots generated successfully')
      fetchTimeSlots()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate time slots')
    } finally {
      setGenerating(false)
    }
  }

  const formatTime = (time) => {
    if (!time) return ''
    const [hour, minute] = time.split(':')
    const hourNum = parseInt(hour)
    const ampm = hourNum >= 12 ? 'PM' : 'AM'
    const hour12 = hourNum % 12 || 12
    return `${hour12}:${minute} ${ampm}`
  }

  const groupSlotsByDate = () => {
    const grouped = {}
    timeSlots.forEach(slot => {
      if (!grouped[slot.date]) {
        grouped[slot.date] = []
      }
      grouped[slot.date].push(slot)
    })
    return grouped
  }

  const groupedSlots = groupSlotsByDate()

  return (
    <div className="space-y-6">
      {/* Generation Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-md font-semibold text-gray-900 mb-3">Generate Time Slots</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.start_date}
              onChange={(e) => setDateRange({ ...dateRange, start_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-plum"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.end_date}
              onChange={(e) => setDateRange({ ...dateRange, end_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-plum"
            />
          </div>
        </div>
        <button
          onClick={generateTimeSlots}
          disabled={generating}
          className="px-4 py-2 bg-luxury-plum text-white rounded-lg hover:bg-black transition disabled:opacity-50"
        >
          {generating ? 'Generating...' : 'Generate Time Slots'}
        </button>
        <p className="text-xs text-gray-500 mt-2">
          This will create time slots in the database based on your configured working hours
        </p>
      </div>

      {/* Time Slots List */}
      <div>
        <h3 className="text-md font-semibold text-gray-900 mb-3">Time Slots in Database</h3>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-pulse text-gray-400">Loading time slots...</div>
          </div>
        ) : Object.keys(groupedSlots).length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No time slots found in the database for the selected date range.</p>
            <p className="text-sm text-gray-400 mt-2">Use the "Generate Time Slots" button to create slots.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(groupedSlots).map(([date, slots]) => (
              <div key={date} className="bg-white rounded-lg shadow p-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  {new Date(date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {slots.sort((a, b) => a.time.localeCompare(b.time)).map((slot) => (
                    <div
                      key={slot.id}
                      className={`
                        px-3 py-2 rounded-lg text-sm font-medium text-center
                        ${slot.is_available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                        }
                      `}
                    >
                      {formatTime(slot.time)}
                      {!slot.is_available && (
                        <span className="block text-xs mt-1">Booked</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TimeSlotManager