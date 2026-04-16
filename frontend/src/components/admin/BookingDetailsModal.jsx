
const BookingDetailsModal = ({ booking, isOpen, onClose }) => {
  if (!isOpen || !booking) return null

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '$0.00'
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    if (isNaN(numAmount)) return '$0.00'
    return `$${numAmount.toFixed(2)}`
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      partial: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pending Payment',
      partial: 'Deposit Paid',
      paid: 'Fully Paid',
      cancelled: 'Cancelled'
    }
    return texts[status] || status
  }

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Booking Details
                </h3>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-sm font-medium text-gray-500">Reservation Code</p>
                    <p className="text-sm text-gray-900 font-mono">{booking.reservation_code || booking.code}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-sm font-medium text-gray-500">Customer Name</p>
                    <p className="text-sm text-gray-900">{booking.full_name || booking.customer_name}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">{booking.email}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-sm text-gray-900">{booking.phone}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-sm font-medium text-gray-500">Service</p>
                    <p className="text-sm text-gray-900">{booking.service?.name || booking.service_name}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p className="text-sm text-gray-900">{booking.date}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-sm font-medium text-gray-500">Time Slot</p>
                    <p className="text-sm text-gray-900">{booking.time_slot}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-sm font-medium text-gray-500">Total Amount</p>
                    <p className="text-sm text-gray-900">{formatCurrency(booking.total_price)}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-sm font-medium text-gray-500">Amount Paid</p>
                    <p className="text-sm text-gray-900">{formatCurrency(booking.amount_paid)}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-sm font-medium text-gray-500">Payment Status</p>
                    <p className="text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.payment_status || booking.status)}`}>
                        {booking.payment_status === 'partial' ? 'Partial' : getStatusText(booking.status)}
                      </span>
                    </p>
                  </div>
                  
                  {booking.created_at && (
                    <div className="grid grid-cols-2 gap-2">
                      <p className="text-sm font-medium text-gray-500">Created At</p>
                      <p className="text-sm text-gray-900">{formatDate(booking.created_at)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingDetailsModal