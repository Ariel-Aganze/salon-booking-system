import { useEffect, useState } from 'react'
import { customerAdminService } from '../../services/customerAdminService'

const CustomerDetailsModal = ({ customer, isOpen, onClose }) => {
  const [bookingHistory, setBookingHistory] = useState([])
  const [paymentHistory, setPaymentHistory] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  useEffect(() => {
    if (isOpen && customer) {
      fetchCustomerHistory()
    }
  }, [isOpen, customer])

  const fetchCustomerHistory = async () => {
    try {
      setLoadingHistory(true)
      const [bookings, payments] = await Promise.all([
        customerAdminService.getCustomerBookingHistory(customer.email),
        customerAdminService.getCustomerPaymentHistory(customer.email)
      ])
      setBookingHistory(bookings)
      setPaymentHistory(payments)
    } catch (error) {
      console.error('Failed to fetch customer history:', error)
    } finally {
      setLoadingHistory(false)
    }
  }

  if (!isOpen || !customer) return null

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '-'
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    if (isNaN(numAmount)) return '$0.00'
    return `$${numAmount.toFixed(2)}`
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString()
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

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Customer Details
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Customer Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Full Name</p>
                      <p className="text-sm text-gray-900">{customer.full_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-sm text-gray-900">{customer.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-sm text-gray-900">{customer.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Joined Date</p>
                      <p className="text-sm text-gray-900">{formatDate(customer.joined_date)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                      <p className="text-sm text-gray-900">{customer.total_bookings}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Spent</p>
                      <p className="text-sm text-gray-900 font-semibold text-luxury-plum">
                        {formatCurrency(customer.total_amount_paid)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Booking History */}
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Booking History</h4>
                  {loadingHistory ? (
                    <div className="text-center py-4">
                      <div className="animate-pulse text-gray-400">Loading booking history...</div>
                    </div>
                  ) : bookingHistory.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No booking history found</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Service</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Time</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Amount</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {bookingHistory.map((booking) => (
                            <tr key={booking.id}>
                              <td className="px-4 py-2 text-sm text-gray-900">{booking.date}</td>
                              <td className="px-4 py-2 text-sm text-gray-900">{booking.service_name}</td>
                              <td className="px-4 py-2 text-sm text-gray-900">{booking.time_slot}</td>
                              <td className="px-4 py-2 text-sm text-gray-900">{formatCurrency(booking.total_price)}</td>
                              <td className="px-4 py-2">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                                  {booking.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Payment History */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Payment History</h4>
                  {loadingHistory ? (
                    <div className="text-center py-4">
                      <div className="animate-pulse text-gray-400">Loading payment history...</div>
                    </div>
                  ) : paymentHistory.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No payment history found</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Service</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Amount Paid</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {paymentHistory.map((payment) => (
                            <tr key={payment.id}>
                              <td className="px-4 py-2 text-sm text-gray-900">{payment.date}</td>
                              <td className="px-4 py-2 text-sm text-gray-900">{payment.service_name}</td>
                              <td className="px-4 py-2 text-sm text-gray-900">{formatCurrency(payment.amount)}</td>
                              <td className="px-4 py-2">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                                  {payment.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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

export default CustomerDetailsModal