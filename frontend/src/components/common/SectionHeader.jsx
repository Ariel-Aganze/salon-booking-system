import { motion } from 'framer-motion'

const SectionHeader = ({ title, subtitle, centered = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mb-12 ${centered ? 'text-center' : ''}`}
    >
      <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-luxury-plum mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
      )}
      <div className={`w-24 h-px bg-luxury-plum mt-4 ${centered ? 'mx-auto' : ''}`}></div>
    </motion.div>
  )
}

export default SectionHeader