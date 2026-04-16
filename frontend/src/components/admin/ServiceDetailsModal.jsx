import { AnimatePresence, motion } from 'framer-motion'

const ServiceDetailsModal = ({ service, isOpen, onClose }) => {
  if (!isOpen || !service) return null

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '-'
    return `$${amount}`
  }

  const formatDuration = (minutes) => {
    if (!minutes) return '-'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins} minutes`
    if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`
    return `${hours} hour${hours > 1 ? 's' : ''} ${mins} minutes`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={{ zIndex: 9999 }}>
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
              onClick={onClose}
              style={{ zIndex: 1 }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              style={{ zIndex: 2, position: 'relative' }}
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Service Details
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm font-medium text-gray-500">Service Name</p>
                        <p className="text-sm text-gray-900">{service.name || '-'}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm font-medium text-gray-500">Price</p>
                        <p className="text-sm text-gray-900 font-semibold text-luxury-plum">
                          {formatCurrency(service.price)}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm font-medium text-gray-500">Duration</p>
                        <p className="text-sm text-gray-900">{formatDuration(service.duration)}</p>
                      </div>
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
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ServiceDetailsModal