import { useState } from 'react'

const BookingFilters = ({ filters, onFilterChange, onSearch, onReset }) => {
  const [localSearch, setLocalSearch] = useState(filters.search || '')

  // Static filter options since backend doesn't have filter-options endpoint
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'partial', label: 'Deposit Paid' },
    { value: 'paid', label: 'Fully Paid' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  const paymentStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'partial', label: 'Partial' },
    { value: 'paid', label: 'Paid' }
  ]

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    onSearch(localSearch)
  }

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value })
  }

  const handleReset = () => {
    setLocalSearch('')
    onReset()
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search Input */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSearchSubmit} className="flex">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search by name, email, or reservation code..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-luxury-plum"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-luxury-plum text-white rounded-r-lg hover:bg-black transition"
            >
              Search
            </button>
          </form>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value || null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-luxury-plum"
          >
            <option value="">All Statuses</option>
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Status Filter - maps to status */}
        <div>
          <select
            value={filters.payment_status || ''}
            onChange={(e) => handleFilterChange('payment_status', e.target.value || null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-luxury-plum"
          >
            <option value="">All Payment Statuses</option>
            {paymentStatusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <input
            type="date"
            value={filters.date || ''}
            onChange={(e) => handleFilterChange('date', e.target.value || null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-luxury-plum"
          />
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          Reset Filters
        </button>
      </div>
    </div>
  )
}

export default BookingFilters