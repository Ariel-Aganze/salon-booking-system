import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import ServiceDetailsModal from '../../components/admin/ServiceDetailsModal'
import ServiceFilters from '../../components/admin/ServiceFilters'
import ServiceFormModal from '../../components/admin/ServiceFormModal'
import ServicesTable from '../../components/admin/ServicesTable'
import { serviceAdminService } from '../../services/serviceAdminService'

const ServicesManager = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    search: null
  })
  
  // Modal states
  const [selectedService, setSelectedService] = useState(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchServices()
  }, [filters])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const data = await serviceAdminService.getServices(filters)
      console.log('Fetched services data:', data)
      setServices(data)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch services:', err)
      setError(err.response?.data?.message || 'Failed to load services')
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
      search: null
    })
  }

  const handleViewDetails = (service) => {
    console.log('View details clicked for service:', service)
    setSelectedService(service)
    setDetailsModalOpen(true)
  }

  const handleAddService = () => {
    console.log('Opening add service modal')
    setIsEditing(false)
    setSelectedService(null)
    setFormModalOpen(true)
  }

  const handleEditService = (service) => {
    console.log('Edit service clicked:', service)
    setIsEditing(true)
    setSelectedService(service)
    setFormModalOpen(true)
  }

  const handleDeleteService = async (service) => {
    if (!window.confirm(`Are you sure you want to delete ${service.name}? This action cannot be undone.`)) {
      return
    }

    try {
      await serviceAdminService.deleteService(service.id)
      toast.success('Service deleted successfully')
      fetchServices()
    } catch (error) {
      console.error('Delete service error:', error)
      toast.error(error.response?.data?.message || 'Failed to delete service')
    }
  }

  const handleFormSuccess = () => {
    console.log('Form success, refreshing services')
    fetchServices()
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-luxury-plum mb-2">
              Services Management
            </h1>
            <p className="text-gray-600">Add, edit, and manage salon services</p>
          </div>
          <button
            onClick={handleAddService}
            className="px-4 py-2 bg-luxury-plum text-white rounded-lg hover:bg-black transition flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <ServiceFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onReset={handleResetFilters}
      />

      {/* Services Table */}
      <ServicesTable
        services={services}
        loading={loading}
        error={error}
        onViewDetails={handleViewDetails}
        onEdit={handleEditService}
        onDelete={handleDeleteService}
      />

      {/* Modals */}
      <ServiceDetailsModal
        service={selectedService}
        isOpen={detailsModalOpen}
        onClose={() => {
          console.log('Closing details modal')
          setDetailsModalOpen(false)
          setSelectedService(null)
        }}
      />

      <ServiceFormModal
        service={isEditing ? selectedService : null}
        isOpen={formModalOpen}
        onClose={() => {
          console.log('Closing form modal')
          setFormModalOpen(false)
          setSelectedService(null)
          setIsEditing(false)
        }}
        onSuccess={handleFormSuccess}
      />
    </div>
  )
}

export default ServicesManager