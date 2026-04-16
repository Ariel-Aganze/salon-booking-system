import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const ServiceCard = ({ service, index }) => {
  const navigate = useNavigate()

  const handleSelect = () => {
    navigate('/booking', { state: { selectedService: service } })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white p-6 sm:p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-transparent hover:border-purple-100 group"
    >
      <h3 className="font-playfair text-xl sm:text-2xl mb-3 text-luxury-plum">
        {service.name}
      </h3>
      <p className="text-gray-500 mb-4 text-sm leading-relaxed">
        {service.description}
      </p>
      <div className="flex justify-between items-center">
        <div>
          <span className="text-lg font-bold text-luxury-plum">
            ${service.price}
          </span>
          {service.duration && (
            <span className="text-sm text-gray-500 ml-2">
              ({service.duration} min)
            </span>
          )}
        </div>
        <button
          onClick={handleSelect}
          className="text-[10px] uppercase tracking-widest border-b border-luxury-plum pb-1 hover:text-luxury-plum transition-colors"
        >
          Book Now
        </button>
      </div>
    </motion.div>
  )
}

export default ServiceCard