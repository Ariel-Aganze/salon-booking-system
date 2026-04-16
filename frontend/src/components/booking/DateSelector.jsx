import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { blockedDatesService } from '../../services/blockedDatesService'

const DateSelector = ({ selectedDate, onSelectDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [blockedDates, setBlockedDates] = useState(new Set())
  const [loadingBlocked, setLoadingBlocked] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBlockedDates()
  }, [])

  const fetchBlockedDates = async () => {
    try {
      setLoadingBlocked(true)
      const blockedList = await blockedDatesService.getPublicBlockedDates()
      const blockedSet = new Set(blockedList.map(item => item.date))
      setBlockedDates(blockedSet)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch blocked dates:', err)
      setError(null)
    } finally {
      setLoadingBlocked(false)
    }
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }

  // FIXED: Format date without timezone issues
  const formatDateToYMD = (date) => {
    if (!date) return null
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const isDateBlocked = (date) => {
    if (!date) return false
    const dateStr = formatDateToYMD(date)
    return blockedDates.has(dateStr)
  }

  const isDateDisabled = (date) => {
    if (!date) return true
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (date < today) return true
    
    if (isDateBlocked(date)) return true
    
    return false
  }

  const isDateSelected = (date) => {
    if (!date || !selectedDate) return false
    return date.toDateString() === selectedDate.toDateString()
  }

  const getDisabledReason = (date) => {
    if (!date) return null
    
    if (isDateBlocked(date)) {
      return 'blocked'
    }
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (date < today) {
      return 'past'
    }
    
    return null
  }

  const handleDateClick = (date) => {
    if (!isDateDisabled(date)) {
      onSelectDate(date)
      setError(null)
    } else if (isDateBlocked(date)) {
      setError('This date is blocked. Bookings are not available. Please select another date.')
    } else {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (date < today) {
        setError('Cannot select a past date. Please choose a future date.')
      }
    }
  }

  const changeMonth = (increment) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + increment)
      return newDate
    })
    setError(null)
  }

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const days = getDaysInMonth(currentMonth)
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <p className="text-red-600 text-sm">{error}</p>
        </motion.div>
      )}

      {loadingBlocked && (
        <div className="mb-4 text-center">
          <p className="text-gray-400 text-xs">Loading calendar...</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => changeMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-lg font-semibold text-gray-900">
          {formatMonthYear(currentMonth)}
        </h3>
        <button
          onClick={() => changeMonth(1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square"></div>
          }
          
          const isDisabled = isDateDisabled(date)
          const isSelected = isDateSelected(date)
          const disabledReason = getDisabledReason(date)
          const isBlocked = disabledReason === 'blocked'
          const isPast = disabledReason === 'past'
          
          let buttonClass = "aspect-square rounded-lg text-sm font-medium transition-all "
          
          if (isSelected) {
            buttonClass += "bg-luxury-plum text-white shadow-md"
          } else if (isDisabled) {
            if (isBlocked) {
              buttonClass += "bg-red-50 text-red-400 cursor-not-allowed border border-red-200"
            } else if (isPast) {
              buttonClass += "bg-gray-50 text-gray-300 cursor-not-allowed"
            } else {
              buttonClass += "text-gray-300 cursor-not-allowed bg-gray-50"
            }
          } else {
            buttonClass += "text-gray-700 hover:bg-luxury-plum/10 hover:text-luxury-plum cursor-pointer"
          }
          
          return (
            <motion.button
              key={date.toISOString()}
              whileTap={{ scale: isDisabled ? 1 : 0.95 }}
              onClick={() => handleDateClick(date)}
              disabled={isDisabled}
              className={buttonClass}
              title={isBlocked ? "This date is blocked - no bookings available" : isPast ? "Past date - cannot book" : ""}
            >
              <div className="relative">
                {date.getDate()}
                {isBlocked && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </div>
            </motion.button>
          )
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex flex-wrap gap-4 justify-center text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-luxury-plum rounded"></div>
            <span className="text-gray-600">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-50 border border-red-200 rounded"></div>
            <span className="text-red-600">Blocked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-50 rounded"></div>
            <span className="text-gray-400">Past Date</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center">
        Select a date to view available time slots
      </p>
    </div>
  )
}

export default DateSelector