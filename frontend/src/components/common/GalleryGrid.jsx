import { motion } from 'framer-motion'
import { useState } from 'react'
import EmptyState from './EmptyState'
import ErrorState from './ErrorState'
import LoadingSpinner from './LoadingSpinner'

const GalleryGrid = ({ items, loading, error }) => {
  const [selectedImage, setSelectedImage] = useState(null)

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorState message="Failed to load gallery images. Please try again later." />
  }

  if (!items || items.length === 0) {
    return <EmptyState message="No gallery images available yet." />
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <motion.div
            key={item.id || index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer"
            onClick={() => setSelectedImage(item)}
          >
            <div className="aspect-square">
              <img
                src={item.image_url || item.image}
                alt={item.title || `Gallery image ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition duration-300">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            {item.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 group-hover:opacity-100 transition duration-300">
                <p className="text-white text-sm font-medium">{item.title}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <img
              src={selectedImage.image_url || selectedImage.image}
              alt={selectedImage.title || 'Gallery image'}
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            {selectedImage.title && (
              <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                <p className="text-lg font-medium">{selectedImage.title}</p>
                {selectedImage.description && (
                  <p className="text-sm text-gray-300">{selectedImage.description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default GalleryGrid