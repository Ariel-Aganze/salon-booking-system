import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { serviceAdminService } from '../../services/serviceAdminService'

const serviceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  price: z.number().min(0, 'Price must be positive').or(z.string().transform(Number)),
  duration: z.number().min(5, 'Duration must be at least 5 minutes').or(z.string().transform(Number))
})

const ServiceFormModal = ({ service, isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const isEditing = !!service

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      price: 0,
      duration: 30
    }
  })

  useEffect(() => {
    if (isOpen) {
      if (service && isEditing) {
        setValue('name', service.name || '')
        setValue('price', parseFloat(service.price) || 0)
        setValue('duration', parseInt(service.duration) || 30)
      } else {
        reset({
          name: '',
          price: 0,
          duration: 30
        })
      }
    }
  }, [isOpen, service, isEditing, setValue, reset])

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      
      const submitData = {
        name: data.name.trim(),
        price: parseFloat(data.price),
        duration: parseInt(data.duration)
      }
      
      console.log('Submitting service data:', submitData)
      
      if (isEditing) {
        await serviceAdminService.updateService(service.id, submitData)
        toast.success('Service updated successfully')
      } else {
        await serviceAdminService.createService(submitData)
        toast.success('Service created successfully')
      }
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Save error:', error)
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to save service'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ zIndex: 9999 }}>
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
          onClick={onClose}
          style={{ zIndex: 1 }}
        />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" style={{ zIndex: 2, position: 'relative' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {isEditing ? 'Edit Service' : 'Add New Service'}
                  </h3>

                  <div className="space-y-4">
                    {/* Service Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Name *
                      </label>
                      <input
                        {...register('name')}
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-plum focus:border-transparent"
                        placeholder="e.g., Knotless Braids"
                        disabled={loading}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price ($) *
                      </label>
                      <input
                        {...register('price')}
                        type="number"
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-plum focus:border-transparent"
                        placeholder="0.00"
                        disabled={loading}
                      />
                      {errors.price && (
                        <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                      )}
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (minutes) *
                      </label>
                      <input
                        {...register('duration')}
                        type="number"
                        step="5"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-plum focus:border-transparent"
                        placeholder="30"
                        disabled={loading}
                      />
                      {errors.duration && (
                        <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-luxury-plum text-base font-medium text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-luxury-plum sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Service' : 'Create Service')}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-luxury-plum sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
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

export default ServiceFormModal