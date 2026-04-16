import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

const GalleryPage = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')

  const galleryImages = [
    {
      id: 1,
      title: 'Knotless Braids with Curls',
      style: 'knotless',
      category: 'Braids',
      image: '/images/gallery/hair (1).jpeg',
      description: 'Beautiful knotless braids styled with elegant curls'
    },
    {
      id: 2,
      title: 'Classic Cornrows',
      style: 'cornrows',
      category: 'Braids',
      image: '/images/gallery/hair (3).jpeg',
      description: 'Clean and precise geometric cornrow patterns'
    },
    {
      id: 3,
      title: 'Box Braids with Beads',
      style: 'box',
      category: 'Braids',
      image: '/images/gallery/hair (4).jpeg',
      description: 'Classic box braids accessorized with decorative beads'
    },
    {
      id: 4,
      title: 'Senegalese Twists',
      style: 'senegalese',
      category: 'Twists',
      image: '/images/gallery/hair (5).jpeg',
      description: 'Elegant and lightweight Senegalese twists'
    },
    {
      id: 5,
      title: 'Faux Locs',
      style: 'faux',
      category: 'Locs',
      image: '/images/gallery/hair (1).jpeg',
      description: 'Trendy faux locs with a natural finish'
    },
    {
      id: 6,
      title: 'Crochet Braids',
      style: 'crochet',
      category: 'Crochet',
      image: '/images/gallery/hair (1).jpg',
      description: 'Versatile crochet styles for any occasion'
    },
    {
      id: 7,
      title: 'Tribal Braids',
      style: 'tribal',
      category: 'Braids',
      image: '/images/gallery/hair (1).webp',
      description: 'Intricate tribal braid patterns'
    },
    {
      id: 8,
      title: 'Stitch Braids',
      style: 'stitch',
      category: 'Braids',
      image: '/images/gallery/hair (2).jpg',
      description: 'Modern stitch braid designs'
    },
    {
      id: 9,
      title: 'Rope Twists',
      style: 'rope',
      category: 'Twists',
      image: '/images/gallery/hair (2).webp',
      description: 'Beautiful rope twist hairstyles'
    }
  ]

  const filters = [
    { id: 'all', label: 'All Work' },
    { id: 'knotless', label: 'Knotless Braids' },
    { id: 'cornrows', label: 'Cornrows' },
    { id: 'box', label: 'Box Braids' },
    { id: 'senegalese', label: 'Senegalese Twists' },
    { id: 'faux', label: 'Faux Locs' },
    { id: 'crochet', label: 'Crochet Styles' }
  ]

  const filteredImages = activeFilter === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.style === activeFilter)

  const openLightbox = (image) => {
    setSelectedImage(image)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    document.body.style.overflow = 'auto'
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-soft-cream via-white to-soft-cream py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-24 -right-24 w-96 h-96 border border-purple-100 rounded-full"></div>
          <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] border border-purple-100 rounded-full"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="uppercase tracking-[0.3em] text-xs sm:text-sm mb-4 block text-gray-500">
              Our Portfolio
            </span>
            <h1 className="text-4xl md:text-6xl font-playfair font-bold text-luxury-plum mb-4">
              Gallery
            </h1>
            <div className="w-24 h-px bg-luxury-plum mx-auto"></div>
            <p className="text-gray-600 mt-6 max-w-2xl mx-auto text-lg">
              Browse through our latest braiding styles and get inspired for your next look
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-3">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`
                  px-5 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${activeFilter === filter.id
                    ? 'bg-luxury-plum text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-luxury-plum/10 hover:text-luxury-plum'
                  }
                `}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-soft-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
                onClick={() => openLightbox(image)}
              >
                <div className="relative overflow-hidden rounded-xl shadow-lg bg-white">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={image.image}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-white font-semibold text-lg">{image.title}</h3>
                    <p className="text-gray-200 text-sm">{image.category}</p>
                  </div>
                  <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                    <svg className="w-4 h-4 text-luxury-plum" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No images found for this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/3 bg-gray-900">
                  <img
                    src={selectedImage.image}
                    alt={selectedImage.title}
                    className="w-full h-full object-contain max-h-[70vh]"
                  />
                </div>
                <div className="md:w-1/3 p-6 bg-white">
                  <h3 className="text-2xl font-playfair font-bold text-luxury-plum mb-2">
                    {selectedImage.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">{selectedImage.category}</p>
                  <p className="text-gray-600 leading-relaxed">{selectedImage.description}</p>
                  
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <button
                      onClick={() => window.location.href = '/booking'}
                      className="w-full bg-luxury-plum text-white py-2 rounded-lg font-semibold hover:bg-black transition"
                    >
                      Book This Style
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default GalleryPage