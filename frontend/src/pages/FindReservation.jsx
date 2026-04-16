import { motion } from 'framer-motion'
import FindReservationForm from '../components/booking/FindReservationForm'

const FindReservation = () => {
  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-playfair font-bold text-luxury-plum mb-2">
            Find Your Reservation
          </h1>
          <div className="w-24 h-px bg-luxury-plum mx-auto"></div>
          <p className="text-gray-600 mt-4">
            Enter your reservation code and email to view your booking details
          </p>
        </div>

        <FindReservationForm />
      </motion.div>
    </div>
  )
}

export default FindReservation