import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import CalendarBookingDetailsModal from '../../components/admin/CalendarBookingDetailsModal'
import CalendarGrid from '../../components/admin/CalendarGrid'
import CalendarToolbar from '../../components/admin/CalendarToolbar'
import { calendarAdminService } from '../../services/calendarAdminService'

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState('week')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)

  useEffect(() => {
    fetchCalendarBookings()
  }, [currentDate, view])

  const fetchCalendarBookings = async () => {
    try {
      setLoading(true)
      
      let startDate, endDate
      
      if (view === 'day') {
        startDate = currentDate.toISOString().split('T')[0]
        endDate = startDate
      } else if (view === 'week') {
        const startOfWeek = new Date(currentDate)
        const dayOfWeek = currentDate.getDay()
        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
        startOfWeek.setDate(currentDate.getDate() + diffToMonday)
        startOfWeek.setHours(0, 0, 0, 0)
        
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        endOfWeek.setHours(23, 59, 59, 999)
        
        startDate = startOfWeek.toISOString().split('T')[0]
        endDate = endOfWeek.toISOString().split('T')[0]
      } else {
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
        
        startDate = startOfMonth.toISOString().split('T')[0]
        endDate = endOfMonth.toISOString().split('T')[0]
      }
      
      const data = await calendarAdminService.getCalendarBookings(startDate, endDate)
      setBookings(data)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch calendar bookings:', err)
      setError(err.response?.data?.message || 'Failed to load calendar data')
    } finally {
      setLoading(false)
    }
  }

  const handleNavigate = (direction) => {
    const newDate = new Date(currentDate)
    
    if (view === 'day') {
      if (direction === 'prev') newDate.setDate(currentDate.getDate() - 1)
      if (direction === 'next') newDate.setDate(currentDate.getDate() + 1)
    } else if (view === 'week') {
      if (direction === 'prev') newDate.setDate(currentDate.getDate() - 7)
      if (direction === 'next') newDate.setDate(currentDate.getDate() + 7)
    } else {
      if (direction === 'prev') newDate.setMonth(currentDate.getMonth() - 1)
      if (direction === 'next') newDate.setMonth(currentDate.getMonth() + 1)
    }
    
    setCurrentDate(newDate)
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleViewChange = (newView) => {
    setView(newView)
  }

  const handleBookingClick = async (booking) => {
    try {
      const details = await calendarAdminService.getBookingDetails(booking.id)
      setSelectedBooking(details)
      setDetailsModalOpen(true)
    } catch (err) {
      console.error('Failed to fetch booking details:', err)
      toast.error('Failed to load booking details')
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-playfair font-bold text-luxury-plum mb-2">
          Calendar View
        </h1>
        <p className="text-gray-600">Visual overview of appointments by date</p>
      </div>

      <CalendarToolbar
        currentDate={currentDate}
        view={view}
        onViewChange={handleViewChange}
        onNavigate={handleNavigate}
        onToday={handleToday}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      )}

      <CalendarGrid
        view={view}
        currentDate={currentDate}
        bookings={bookings}
        loading={loading}
        onBookingClick={handleBookingClick}
      />

      <CalendarBookingDetailsModal
        booking={selectedBooking}
        isOpen={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false)
          setSelectedBooking(null)
        }}
      />
    </div>
  )
}

export default CalendarView