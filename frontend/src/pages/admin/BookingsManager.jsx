import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import BookingDetailsModal from '../../components/admin/BookingDetailsModal'
import BookingFilters from '../../components/admin/BookingFilters'
import BookingsTable from '../../components/admin/BookingsTable'
import RescheduleBookingModal from '../../components/admin/RescheduleBookingModal'
import UpdateBookingStatusModal from '../../components/admin/UpdateBookingStatusModal'
import { bookingAdminService } from '../../services/bookingAdminService'

const BookingsManager = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    status: null,
    payment_status: null,
    date: null,
    service_id: null,
    search: null
  })
  
  // Modal states
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false)

  useEffect(() => {
    fetchBookings()
  }, [filters])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const data = await bookingAdminService.getBookings(filters)
      setBookings(data)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch bookings:', err)
      setError(err.response?.data?.message || 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleSearch = (searchTerm) => {
    setFilters({ ...filters, search: searchTerm })
  }

  const handleResetFilters = () => {
    setFilters({
      status: null,
      payment_status: null,
      date: null,
      service_id: null,
      search: null
    })
  }

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking)
    setDetailsModalOpen(true)
  }

  const handleUpdateStatus = (booking) => {
    setSelectedBooking(booking)
    setStatusModalOpen(true)
  }

  const handleReschedule = (booking) => {
    setSelectedBooking(booking)
    setRescheduleModalOpen(true)
  }

  const handleCancelBooking = async (booking) => {
    if (!window.confirm(`Are you sure you want to cancel booking ${booking.reservation_code || booking.code}?`)) {
      return
    }

    try {
      await bookingAdminService.cancelBooking(booking.id)
      toast.success('Booking cancelled successfully')
      fetchBookings()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking')
    }
  }

  const handleModalSuccess = () => {
    fetchBookings()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-playfair font-bold text-luxury-plum mb-2">
          Bookings Management
        </h1>
        <p className="text-gray-600">View and manage all salon appointments</p>
      </div>

      {/* Filters */}
      <BookingFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onReset={handleResetFilters}
      />

      {/* Bookings Table */}
      <BookingsTable
        bookings={bookings}
        loading={loading}
        error={error}
        onViewDetails={handleViewDetails}
        onUpdateStatus={handleUpdateStatus}
        onReschedule={handleReschedule}
        onCancel={handleCancelBooking}
      />

      {/* Modals */}
      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
      />

      <UpdateBookingStatusModal
        booking={selectedBooking}
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        onSuccess={handleModalSuccess}
      />

      <RescheduleBookingModal
        booking={selectedBooking}
        isOpen={rescheduleModalOpen}
        onClose={() => setRescheduleModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  )
}

export default BookingsManager