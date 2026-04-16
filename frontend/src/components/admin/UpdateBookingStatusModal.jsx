import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { bookingAdminService } from '../../services/bookingAdminService'

const UpdateBookingStatusModal = ({ booking, isOpen, onClose, onSuccess }) => {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (booking) {
      setStatus(booking.status || '')
    }
  }, [booking])

  const statusOptions = [
    { value: 'pending', label: 'Pending Payment' },
    { value: 'partial', label: 'Deposit Paid' },
    { value: 'paid', label: 'Fully Paid' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!status || status === booking?.status) {
      toast.error('Please select a different status')
      return
    }

    try {
      setLoading(true)
      await bookingAdminService.updateBookingStatus(booking.id, status)
      toast.success('Booking status updated successfully')
      onSuccess()
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !booking) return null

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Update Booking Status
                  </h3>
                  
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Booking ID: <span className="font-mono font-semibold">{booking.reservation_code || booking.code}</span></p>
                    <p className="text-sm text-gray-600 mt-1">Customer: <span className="font-semibold">{booking.full_name || booking.customer_name}</span></p>
                    <p className="text-sm text-gray-600 mt-1">Current Status: 
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'partial' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'paid' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status === 'partial' ? 'Deposit Paid' : booking.status}
                      </span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-plum focus:border-transparent"
                      required
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-luxury-plum text-base font-medium text-white hover:bg-black focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Status'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UpdateBookingStatusModal