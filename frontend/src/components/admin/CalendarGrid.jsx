import CalendarBookingCard from './CalendarBookingCard'

const CalendarGrid = ({ view, currentDate, bookings, loading, onBookingClick }) => {
  const getDayView = () => {
    const hours = []
    for (let i = 8; i <= 20; i++) {
      const hour = i > 12 ? i - 12 : i
      const ampm = i >= 12 ? 'PM' : 'AM'
      const timeLabel = `${hour}:00 ${ampm}`
      
      const bookingsAtHour = bookings.filter(booking => {
        const bookingHour = parseInt(booking.time_slot.split(':')[0])
        return bookingHour === i
      })
      
      hours.push(
        <div key={i} className="grid grid-cols-12 border-b border-gray-100 min-h-[80px]">
          <div className="col-span-2 py-2 pr-4 text-right text-sm text-gray-500">
            {timeLabel}
          </div>
          <div className="col-span-10 py-2 pl-4 border-l border-gray-200">
            {bookingsAtHour.map(booking => (
              <CalendarBookingCard
                key={booking.id}
                booking={booking}
                onClick={onBookingClick}
              />
            ))}
          </div>
        </div>
      )
    }
    return hours
  }

  const getWeekView = () => {
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const startOfWeek = new Date(currentDate)
    const dayOfWeek = currentDate.getDay()
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    startOfWeek.setDate(currentDate.getDate() + diffToMonday)
    
    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      weekDates.push(date)
    }
    
    const hours = []
    for (let hour = 8; hour <= 20; hour++) {
      const timeLabel = hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`
      
      hours.push(
        <div key={hour} className="grid grid-cols-8 border-b border-gray-100 min-h-[80px]">
          <div className="col-span-1 py-2 pr-4 text-right text-sm text-gray-500">
            {timeLabel}
          </div>
          {weekDates.map((date, index) => {
            const dateStr = date.toISOString().split('T')[0]
            const bookingsAtSlot = bookings.filter(booking => 
              booking.date === dateStr && parseInt(booking.time_slot.split(':')[0]) === hour
            )
            
            return (
              <div key={index} className="col-span-1 py-2 pl-2 border-l border-gray-200 min-h-[80px]">
                {bookingsAtSlot.map(booking => (
                  <CalendarBookingCard
                    key={booking.id}
                    booking={booking}
                    onClick={onBookingClick}
                  />
                ))}
              </div>
            )
          })}
        </div>
      )
    }
    
    return (
      <>
        <div className="grid grid-cols-8 border-b border-gray-200 pb-2 mb-2">
          <div className="col-span-1"></div>
          {weekDates.map((date, index) => (
            <div key={index} className="col-span-1 text-center">
              <div className="font-semibold text-gray-700">{weekDays[index]}</div>
              <div className="text-sm text-gray-500">{date.getDate()}</div>
            </div>
          ))}
        </div>
        {hours}
      </>
    )
  }

  const getMonthView = () => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    const startDate = new Date(startOfMonth)
    startDate.setDate(startDate.getDate() - startDate.getDay())
    
    const weeks = []
    let currentWeek = []
    let currentDateIterator = new Date(startDate)
    
    while (currentDateIterator <= endOfMonth || currentWeek.length > 0) {
      const dateStr = currentDateIterator.toISOString().split('T')[0]
      const bookingsForDay = bookings.filter(booking => booking.date === dateStr)
      const isCurrentMonth = currentDateIterator.getMonth() === currentDate.getMonth()
      
      currentWeek.push(
        <div
          key={dateStr}
          className={`min-h-[100px] p-2 border border-gray-100 ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}`}
        >
          <div className={`text-sm font-medium mb-1 ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
            {currentDateIterator.getDate()}
          </div>
          <div className="space-y-1">
            {bookingsForDay.slice(0, 3).map(booking => (
              <CalendarBookingCard
                key={booking.id}
                booking={booking}
                onClick={onBookingClick}
              />
            ))}
            {bookingsForDay.length > 3 && (
              <div className="text-xs text-gray-500 text-center">
                +{bookingsForDay.length - 3} more
              </div>
            )}
          </div>
        </div>
      )
      
      currentDateIterator.setDate(currentDateIterator.getDate() + 1)
      
      if (currentWeek.length === 7) {
        weeks.push(
          <div key={currentWeek[0].key} className="grid grid-cols-7">
            {currentWeek}
          </div>
        )
        currentWeek = []
      }
    }
    
    return (
      <>
        <div className="grid grid-cols-7 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center py-2 font-semibold text-gray-600 text-sm">
              {day}
            </div>
          ))}
        </div>
        {weeks}
      </>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-center items-center h-96">
          <div className="animate-pulse text-gray-400">Loading calendar data...</div>
        </div>
      </div>
    )
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center py-12">
          <p className="text-gray-500">No bookings found for this period</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-4">
        {view === 'day' && getDayView()}
        {view === 'week' && getWeekView()}
        {view === 'month' && getMonthView()}
      </div>
    </div>
  )
}

export default CalendarGrid