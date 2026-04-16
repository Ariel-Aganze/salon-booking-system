import { motion } from 'framer-motion'

const ServiceSelector = ({ services, selectedService, onSelectService, loading, error, onRetry }) => {
  const formatDuration = (minutes) => {
    if (!minutes) return ''
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins} min`
    if (mins === 0) return `${hours} hr`
    return `${hours} hr ${mins} min`
  }

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white p-6 sm:p-8 rounded-lg shadow-lg animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="flex justify-between items-center">
              <div className="h-6 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-lg">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-luxury-plum text-white rounded-lg hover:bg-black transition"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!services || services.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-lg">
        <p className="text-gray-500">No services available at the moment. Please check back later.</p>
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {services.map((service, index) => (
        <motion.div
          key={service.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={`
            bg-white p-6 sm:p-8 rounded-xl shadow-lg cursor-pointer transition-all duration-300
            border-2 ${selectedService?.id === service.id 
              ? 'border-luxury-plum shadow-xl' 
              : 'border-transparent hover:border-purple-200 hover:shadow-xl'
            }
          `}
          onClick={() => onSelectService(service)}
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-playfair text-xl sm:text-2xl text-luxury-plum">
              {service.name}
            </h3>
            {selectedService?.id === service.id && (
              <div className="w-6 h-6 bg-luxury-plum rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-luxury-plum" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-lg font-bold text-luxury-plum">${service.price}</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-gray-500">{formatDuration(service.duration)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default ServiceSelector