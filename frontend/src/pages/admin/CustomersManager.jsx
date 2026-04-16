import { useEffect, useState } from 'react'
import CustomerDetailsModal from '../../components/admin/CustomerDetailsModal'
import CustomerFilters from '../../components/admin/CustomerFilters'
import CustomersTable from '../../components/admin/CustomersTable'
import { customerAdminService } from '../../services/customerAdminService'

const CustomersManager = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    search: null,
    status: null
  })
  
  // Modal states
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)

  useEffect(() => {
    fetchCustomers()
  }, [filters])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const data = await customerAdminService.getCustomers(filters)
      setCustomers(data)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch customers:', err)
      setError(err.response?.data?.message || 'Failed to load customers')
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
      search: null,
      status: null
    })
  }

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer)
    setDetailsModalOpen(true)
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-luxury-plum mb-2">
              Customers Management
            </h1>
            <p className="text-gray-600">View and manage customer information</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <CustomerFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onReset={handleResetFilters}
      />

      {/* Customers Table */}
      <CustomersTable
        customers={customers}
        loading={loading}
        error={error}
        onViewDetails={handleViewDetails}
      />

      {/* Customer Details Modal */}
      <CustomerDetailsModal
        customer={selectedCustomer}
        isOpen={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false)
          setSelectedCustomer(null)
        }}
      />
    </div>
  )
}

export default CustomersManager