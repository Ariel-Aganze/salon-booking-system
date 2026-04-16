import LoadingSpinner from '../common/LoadingSpinner'

const TimeSlotSelector = ({ slots, selectedSlot, onSelectSlot, loading, error, onRetry }) => {
  const formatTime = (time) => {
    if (!time) return ''
    const [hour, minute] = time.split(':')
    const hourNum = parseInt(hour)
    const ampm = hourNum >= 12 ? 'PM' : 'AM'
    const hour12 = hourNum % 12 || 12
    return `${hour12}:${minute} ${ampm}`
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-luxury-plum text-white rounded-lg hover:bg-black transition"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!slots || slots.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">No available time slots for this date</p>
          <p className="text-sm text-gray-400 mt-2">Please select another date</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Time Slots</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {slots.map((slot) => {
          const isSelected = selectedSlot?.id === slot.id || selectedSlot?.time === slot.time
          
          return (
            <button
              key={slot.id}
              onClick={() => onSelectSlot(slot)}
              className={`
                py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200
                ${isSelected
                  ? 'bg-luxury-plum text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-luxury-plum/20 hover:text-luxury-plum cursor-pointer'
                }
              `}
            >
              {formatTime(slot.time)}
            </button>
          )
        })}
      </div>
      <p className="text-xs text-gray-500 mt-4 text-center">
        Click on a time slot to select it
      </p>
    </div>
  )
}

export default TimeSlotSelector