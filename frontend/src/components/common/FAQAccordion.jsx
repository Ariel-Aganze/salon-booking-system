import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import EmptyState from './EmptyState'
import ErrorState from './ErrorState'
import LoadingSpinner from './LoadingSpinner'

const FAQAccordion = ({ faqs, loading, error }) => {
  const [openIndex, setOpenIndex] = useState(null)

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorState message="Failed to load FAQs. Please try again later." />
  }

  if (!faqs || faqs.length === 0) {
    return <EmptyState message="No FAQs available at the moment." />
  }

  return (
    <div className="space-y-6">
      {faqs.map((faq, index) => (
        <motion.div
          key={faq.id || index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          viewport={{ once: true }}
          className="border-b border-gray-100 pb-5 last:border-0"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full text-left flex justify-between items-center gap-4 group"
          >
            <span className="text-gray-800 group-hover:text-luxury-plum transition-colors">
              {faq.question}
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-all duration-300 ${
                openIndex === index ? 'rotate-180' : ''
              } group-hover:text-luxury-plum`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="pt-4 text-gray-500 leading-relaxed">
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}

export default FAQAccordion