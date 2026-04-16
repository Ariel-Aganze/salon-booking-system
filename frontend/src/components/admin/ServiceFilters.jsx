import { useState } from 'react'

const ServiceFilters = ({ filters, onFilterChange, onSearch, onReset }) => {
  const [localSearch, setLocalSearch] = useState(filters.search || '')

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    onSearch(localSearch)
  }

  const handleReset = () => {
    setLocalSearch('')
    onReset()
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search Input */}
        <div>
          <form onSubmit={handleSearchSubmit} className="flex">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search by service name..."
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

        {/* Reset Button */}
        <div className="flex justify-end">
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  )
}

export default ServiceFilters