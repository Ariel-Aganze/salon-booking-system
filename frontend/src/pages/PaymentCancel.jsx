import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const PaymentCancel = () => {
  const navigate = useNavigate()

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-8 text-center"
      >
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-4">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment was not completed. Your booking has not been confirmed.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          If you encountered any issues, please contact us for assistance.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/booking')}
            className="w-full sm:w-auto px-8 py-3 bg-luxury-plum text-white rounded-lg font-semibold hover:bg-black transition"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-8 py-3 border border-luxury-plum text-luxury-plum rounded-lg font-semibold hover:bg-luxury-plum hover:text-white transition ml-0 sm:ml-3"
          >
            Return to Home
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default PaymentCancel