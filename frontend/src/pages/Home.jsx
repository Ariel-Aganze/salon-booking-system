import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-plum-50 to-cream py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-playfair font-bold text-gray-900 mb-6">
              Where Beauty Meets
              <span className="text-plum-600"> Elegance</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Experience luxury salon services tailored just for you. Book your appointment today and indulge in a world of beauty and relaxation.
            </p>
            <Link
              to="/booking"
              className="inline-block bg-plum-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-plum-700 transition-colors duration-200 transform hover:scale-105"
            >
              Book Your Appointment
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-playfair font-bold text-center text-gray-900 mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    icon: '💇‍♀️',
    title: 'Expert Stylists',
    description: 'Our team of experienced professionals stays updated with the latest trends and techniques.',
  },
  {
    icon: '✨',
    title: 'Premium Products',
    description: 'We use only the highest quality products to ensure the best results for your hair and skin.',
  },
  {
    icon: '🏆',
    title: 'Award Winning',
    description: 'Recognized for excellence in service and customer satisfaction.',
  },
]

export default Home