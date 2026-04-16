import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
// import ChatBot from '../components/common/ChatBot'
import FAQAccordion from '../components/common/FAQAccordion'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { publicService } from '../services/publicService'

const FAQPage = () => {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchFAQs()
  }, [])

  const fetchFAQs = async () => {
    try {
      setLoading(true)
      const data = await publicService.getFAQs()
      setFaqs(data)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch FAQs:', err)
      setError('Failed to load FAQs')
    } finally {
      setLoading(false)
    }
  }

  const openChat = () => {
    if (window.openChat) {
      window.openChat()
    }
  }

  const categories = [
    {
      title: 'Booking & Payment',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      description: 'Learn about our booking process and payment options'
    },
    {
      title: 'Services & Pricing',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
      ),
      description: 'Explore our services and pricing structure'
    },
    {
      title: 'Policies & Care',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      description: 'Understand our policies and aftercare instructions'
    }
  ]

  return (
    <>
      <div>
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl font-playfair font-bold text-luxury-plum mb-4">
                  Frequently Asked Questions
                </h1>
                <div className="w-16 h-px bg-luxury-plum mx-auto mb-6"></div>
                <p className="text-gray-600 text-lg">
                  Everything you need to know about our services, booking process, and salon policies
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Category Cards */}
        <section className="py-12 bg-soft-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                >
                  <div className="w-14 h-14 bg-luxury-plum/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-luxury-plum">{category.icon}</div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.title}</h3>
                  <p className="text-gray-500 text-sm">{category.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-playfair text-luxury-plum mb-3">Common Questions</h2>
              <p className="text-gray-500">Find quick answers to your questions below</p>
            </div>

            {loading && <LoadingSpinner />}
            {error && !loading && (
              <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
                <button
                  onClick={fetchFAQs}
                  className="mt-4 px-4 py-2 bg-luxury-plum text-white rounded-lg hover:bg-black transition"
                >
                  Try Again
                </button>
              </div>
            )}
            {!loading && !error && faqs.length > 0 && (
              <FAQAccordion faqs={faqs} loading={loading} error={error} />
            )}
            {!loading && !error && faqs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No FAQs available at the moment.</p>
              </div>
            )}
          </div>
        </section>

        {/* Help Section with Live Chat */}
        <section className="py-20 bg-soft-cream">
          {/* <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="p-8 md:p-10">
                  <h2 className="text-2xl font-playfair text-luxury-plum mb-3">
                    Still have questions?
                  </h2>
                  <p className="text-gray-600 mb-6">
                    We're here to help. Contact us directly and we'll get back to you as soon as possible.
                  </p>
                  <div className="space-y-3">
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 text-luxury-plum font-medium hover:text-black transition"
                    >
                      <span>Contact our team</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    <div className="flex items-center gap-3 text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>+1 317 372 7049</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>aichetoudiah12@gmail.com</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-luxury-plum to-purple-700 p-8 md:p-10 flex flex-col justify-center">
                  <div className="text-white">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-playfair mb-2">Live Chat Support</h3>
                    <p className="text-purple-200 text-sm mb-6">
                      Chat with our AI assistant in real-time for immediate assistance
                    </p>
                    <button
                      onClick={openChat}
                      className="inline-flex items-center gap-2 bg-white text-luxury-plum px-6 py-3 rounded-lg font-medium hover:bg-purple-100 transition-all duration-300 transform hover:scale-105"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>Start Live Chat</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </section>
      </div>

      {/* Chat Bot Component */}
      {/* <ChatBot /> */}
    </>
  )
}

export default FAQPage