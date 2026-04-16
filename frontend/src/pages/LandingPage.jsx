import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ErrorState from '../components/common/ErrorState'
import LoadingSpinner from '../components/common/LoadingSpinner'
import SectionHeader from '../components/common/SectionHeader'
import { publicService } from '../services/publicService'

const LandingPage = () => {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [workingHours, setWorkingHours] = useState(null)
  const [loading, setLoading] = useState({
    services: true,
    hours: true
  })
  const [error, setError] = useState({
    services: null,
    hours: null
  })

  useEffect(() => {
    fetchServices()
    fetchWorkingHours()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(prev => ({ ...prev, services: true }))
      const data = await publicService.getServices()
      setServices(data)
      setError(prev => ({ ...prev, services: null }))
    } catch (err) {
      console.error('Failed to fetch services:', err)
      setError(prev => ({ ...prev, services: 'Unable to load services' }))
    } finally {
      setLoading(prev => ({ ...prev, services: false }))
    }
  }

  const fetchWorkingHours = async () => {
    try {
      setLoading(prev => ({ ...prev, hours: true }))
      const data = await publicService.getWorkingHours()
      setWorkingHours(data)
      setError(prev => ({ ...prev, hours: null }))
    } catch (err) {
      console.error('Failed to fetch working hours:', err)
      setError(prev => ({ ...prev, hours: 'Unable to load working hours' }))
    } finally {
      setLoading(prev => ({ ...prev, hours: false }))
    }
  }

  const handleBookNow = () => {
    navigate('/booking')
  }

  const formatTime = (time) => {
    if (!time) return '-'
    const [hour, minute] = time.split(':')
    const hourNum = parseInt(hour)
    const ampm = hourNum >= 12 ? 'PM' : 'AM'
    const hour12 = hourNum % 12 || 12
    return `${hour12}:${minute} ${ampm}`
  }

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ]

  // Static gallery preview images - USING LOCAL IMAGES
  const galleryPreviewImages = [
    { url: '/images/gallery/hair (1).jpeg', alt: 'Knotless Braids' },
    { url: '/images/gallery/hair (3).jpeg', alt: 'Cornrows' },
    { url: '/images/gallery/hair (4).jpeg', alt: 'Box Braids' },
    { url: '/images/gallery/hair (5).jpeg', alt: 'Senegalese Twists' },
    { url: '/images/gallery/hair (1).jpg', alt: 'Faux Locs' },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-soft-cream z-0">
          <div className="absolute -top-24 -right-24 w-96 h-96 border border-purple-100 rounded-full"></div>
          <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] border border-purple-100 rounded-full"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="uppercase tracking-[0.3em] text-xs sm:text-sm mb-4 block text-gray-500"
          >
            Excellence in Every Braid
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl mb-6 text-luxury-plum leading-tight"
          >
            Artistry, Tradition,<br />and <span className="italic">Modern Style.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto px-4"
          >
            Specializing in expertly crafted braid styles designed to enhance your natural beauty and confidence.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center px-4"
          >
            <button 
              onClick={handleBookNow}
              className="bg-luxury-plum text-white px-8 sm:px-10 py-3 sm:py-4 uppercase text-xs tracking-widest hover:bg-black transition duration-500 text-center"
            >
              Book Appointment
            </button>
            <a 
              href="#services" 
              className="border border-luxury-plum text-luxury-plum px-8 sm:px-10 py-3 sm:py-4 uppercase text-xs tracking-widest hover:bg-luxury-plum hover:text-white transition duration-500 text-center"
            >
              Explore Services
            </a>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a href="#about" className="text-luxury-plum">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative order-2 md:order-1"
          >
            <div className="aspect-[4/5] bg-gray-200 overflow-hidden shadow-2xl rounded-lg">
              <img 
                src="/images/gallery/hair (2).webp" 
                alt="Stylist at work" 
                className="w-full h-full object-cover hover:scale-105 transition duration-700"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-luxury-plum p-6 sm:p-8 text-white hidden lg:block rounded-lg shadow-xl">
              <p className="font-playfair text-2xl sm:text-3xl italic">10+ Years</p>
              <p className="uppercase text-[10px] tracking-widest mt-2">Professional Experience</p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="order-1 md:order-2"
          >
            <h2 className="text-3xl sm:text-4xl font-playfair mb-6 text-luxury-plum">Meet Nysha</h2>
            <div className="space-y-4 sm:space-y-6 text-gray-600 text-base sm:text-lg leading-relaxed">
              <p>Led by Nysha, a highly skilled braiding specialist, our salon is deeply rooted in traditional African braiding techniques and modern trends.</p>
              <p>Nysha and her team are recognized for their speed, precision, and consistently high-quality results. Whether you're looking for the tension-free comfort of knotless braids or a bold cultural statement, we bring your vision to life with skilled hands and an eye for detail.</p>
            </div>
            <div className="mt-8 border-l-2 border-purple-200 pl-6 italic text-gray-500">
              "Every style is neat, long‑lasting, and tailored specifically to you."
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 sm:py-24 bg-soft-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            title="Our Specialties"
            subtitle="Choose from our premium braiding services"
          />
          
          {loading.services && <LoadingSpinner />}
          
          {error.services && !loading.services && (
            <ErrorState message={error.services} onRetry={fetchServices} />
          )}
          
          {!loading.services && !error.services && services.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No services available at the moment. Please check back later.</p>
            </div>
          )}
          
          {!loading.services && !error.services && services.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 sm:p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-transparent hover:border-purple-100 group"
                >
                  <h3 className="font-playfair text-xl sm:text-2xl mb-3 text-luxury-plum">
                    {service.name}
                  </h3>
                  <div className="flex justify-between items-center mt-4">
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
                      onClick={() => navigate('/booking', { state: { selectedService: service } })}
                      className="text-[10px] uppercase tracking-widest border-b border-luxury-plum pb-1 hover:text-luxury-plum transition-colors"
                    >
                      Select
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            title="Why Choose Us"
            subtitle="Experience the difference at Nysha Hair Braiding"
          />
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-soft-cream rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-luxury-plum/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-luxury-plum" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-luxury-plum">Expert Stylists</h3>
              <p className="text-gray-600">Our team of experienced professionals stays updated with the latest trends and techniques.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-soft-cream rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-luxury-plum/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-luxury-plum" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-luxury-plum">Premium Products</h3>
              <p className="text-gray-600">We use only the highest quality products to ensure the best results for your hair.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-soft-cream rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-luxury-plum/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-luxury-plum" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-luxury-plum">Award Winning</h3>
              <p className="text-gray-600">Recognized for excellence in service and customer satisfaction.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Preview Section - USING LOCAL IMAGES */}
      <section id="gallery" className="py-16 sm:py-24 bg-soft-cream overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            title="Our Work"
            subtitle="Browse our latest braiding styles"
          />
        </div>
        
        <div className="relative mt-8">
          <div className="flex space-x-4 animate-scroll">
            {galleryPreviewImages.map((image, index) => (
              <div key={index} className="w-64 h-80 flex-shrink-0 overflow-hidden rounded-lg shadow-lg">
                <img 
                  src={image.url} 
                  className="w-full h-full object-cover hover:scale-110 transition duration-500" 
                  alt={image.alt}
                />
              </div>
            ))}
            {galleryPreviewImages.map((image, index) => (
              <div key={`dup-${index}`} className="w-64 h-80 flex-shrink-0 overflow-hidden rounded-lg shadow-lg">
                <img 
                  src={image.url} 
                  className="w-full h-full object-cover hover:scale-110 transition duration-500" 
                  alt={image.alt}
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Link 
            to="/gallery"
            className="inline-block border border-luxury-plum text-luxury-plum px-8 py-3 uppercase text-xs tracking-widest hover:bg-luxury-plum hover:text-white transition duration-500"
          >
            View Full Gallery
          </Link>
        </div>
      </section>

      {/* Working Hours Section - Beautiful Card Design */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-soft-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <SectionHeader
            title="Working Hours"
            subtitle="We look forward to welcoming you"
          />
          
          {loading.hours && <LoadingSpinner />}
          
          {error.hours && !loading.hours && (
            <ErrorState message={error.hours} onRetry={fetchWorkingHours} />
          )}
          
          {!loading.hours && !error.hours && !workingHours && (
            <div className="text-center py-12">
              <p className="text-gray-500">Working hours information coming soon.</p>
            </div>
          )}
          
          {!loading.hours && !error.hours && workingHours && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Decorative Elements */}
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-luxury-plum/5 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-200/30 rounded-full blur-2xl"></div>
              
              {/* Main Card */}
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header Gradient */}
                <div className="bg-gradient-to-r from-luxury-plum to-purple-600 px-6 py-5 sm:px-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-playfair font-bold text-white">
                        Salon Hours
                      </h3>
                      <p className="text-purple-200 text-sm mt-1">Book your appointment during these times</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Hours List */}
                <div className="p-6 sm:p-8">
                  <div className="space-y-3">
                    {daysOfWeek.map((day, index) => {
                      const hours = workingHours[day.key]
                      const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() === day.key
                      
                      return (
                        <motion.div
                          key={day.key}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          viewport={{ once: true }}
                          className={`group flex items-center justify-between py-3 px-4 rounded-xl transition-all duration-300 ${
                            isToday 
                              ? 'bg-luxury-plum/5 border-l-4 border-luxury-plum' 
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${hours?.is_open ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className={`font-medium text-gray-700 ${isToday ? 'text-luxury-plum font-semibold' : ''}`}>
                              {day.label}
                              {isToday && (
                                <span className="ml-2 text-xs text-luxury-plum font-normal">(Today)</span>
                              )}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            {hours?.is_open ? (
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1">
                                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="text-sm font-medium text-gray-900">{formatTime(hours.open)}</span>
                                </div>
                                <span className="text-gray-400">-</span>
                                <div className="flex items-center space-x-1">
                                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="text-sm font-medium text-gray-900">{formatTime(hours.close)}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span className="text-sm text-gray-500">Closed</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                  
                  {/* Divider */}
                  <div className="my-6 border-t border-gray-100"></div>
                  
                  {/* Additional Info */}
                  <div className="bg-soft-cream rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-luxury-plum" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Last appointment accepted 30 minutes before closing</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mt-2">
                      <svg className="w-5 h-5 text-luxury-plum" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>For inquiries, call us at +250 788 888 888</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Note */}
              <p className="text-center text-xs text-gray-400 mt-6">
                Hours are subject to change during holidays. Please contact us for special arrangements.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Booking CTA Section */}
      <section id="booking" className="py-16 sm:py-24 bg-luxury-plum text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-playfair font-bold mb-4">
            Ready to Transform Your Look?
          </h2>
          <p className="text-purple-200 mb-8">
            Book your appointment today and experience the luxury of expert braiding
          </p>
          <button 
            onClick={handleBookNow}
            className="bg-white text-luxury-plum px-8 py-3 rounded-lg font-semibold hover:bg-purple-100 transition"
          >
            Book Your Appointment
          </button>
          <p className="text-center text-xs text-purple-200 mt-4">
            * Secure your spot with a 30% deposit
          </p>
        </div>
      </section>

      {/* Contact Preview Section */}
      <section id="contact" className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-playfair text-luxury-plum mb-6">Visit Us</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-luxury-plum mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Address</p>
                    <p className="text-gray-600">217 South 47th Street, Philadelphia, PA</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-luxury-plum mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <p className="text-gray-600">+1 317 372 7049</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-luxury-plum mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-gray-600">aichetoudiah12@gmail.com </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-playfair text-luxury-plum mb-6">Send a Message</h2>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-luxury-plum transition"
                />
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-luxury-plum transition"
                />
                <textarea 
                  rows="3" 
                  placeholder="Your Message" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-luxury-plum transition"
                ></textarea>
                <Link 
                  to="/contact"
                  className="block w-full bg-luxury-plum text-white py-3 rounded-lg font-semibold hover:bg-black transition text-center"
                >
                  Go to Contact Page
                </Link>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Find Your Booking Section */}
      <section className="py-12 bg-soft-cream">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h3 className="font-playfair text-2xl text-luxury-plum mb-3">Already Booked?</h3>
          <p className="text-gray-600 mb-6">Check your reservation status or pay remaining balance</p>
          <Link 
            to="/reservation/find" 
            className="inline-block border border-luxury-plum text-luxury-plum px-8 py-3 uppercase text-xs tracking-widest hover:bg-luxury-plum hover:text-white transition duration-500"
          >
            Find My Booking
          </Link>
        </div>
      </section>
    </div>
  )
}

export default LandingPage