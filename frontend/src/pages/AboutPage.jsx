import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../components/common/LoadingSpinner'
import SectionHeader from '../components/common/SectionHeader'
import { publicService } from '../services/publicService'

const AboutPage = () => {
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeam()
  }, [])

  const fetchTeam = async () => {
    try {
      setLoading(true)
      const data = await publicService.getTeamMembers()
      // Use local images for team members (same pattern as gallery)
      const updatedTeam = data.map((member, index) => ({
        ...member,
        image_url: `/images/gallery/hair (${(index % 5) + 1}).jpeg`
      }))
      setTeam(updatedTeam)
    } catch (err) {
      console.error('Failed to fetch team:', err)
      // Set default team with local images if API fails
      setTeam([
        { id: 1, name: 'Nysha', role: 'Master Braider', bio: '10+ years of experience', image_url: '/images/gallery/hair (1).jpeg' },
        { id: 2, name: 'Sarah', role: 'Senior Stylist', bio: 'Expert in knotless braids', image_url: '/images/gallery/hair (3).jpeg' },
        { id: 3, name: 'Michelle', role: 'Creative Director', bio: 'Specializes in custom designs', image_url: '/images/gallery/hair (4).jpeg' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const values = [
    {
      icon: (
        <svg className="w-8 h-8 text-luxury-plum" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Excellence',
      description: 'We strive for perfection in every braid, ensuring the highest quality results.'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-luxury-plum" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: 'Care',
      description: 'Your hair health and comfort are our top priorities.'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-luxury-plum" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: 'Innovation',
      description: 'We continuously learn and adapt to bring you the latest styles and techniques.'
    }
  ]

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
              Welcome to Our Salon
            </span>
            <h1 className="text-4xl md:text-6xl font-playfair font-bold text-luxury-plum mb-4">
              About Nysha Hair Braiding
            </h1>
            <div className="w-24 h-px bg-luxury-plum mx-auto"></div>
            <p className="text-gray-600 mt-6 max-w-2xl mx-auto text-lg">
              Discover the artistry, passion, and dedication behind every braid
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] bg-gray-200 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/gallery/hair (2).webp"
                  alt="Nysha at work"
                  className="w-full h-full object-cover hover:scale-105 transition duration-700"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/gallery/hair (1).jpeg';
                  }}
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-luxury-plum p-4 sm:p-6 text-white rounded-lg shadow-xl">
                <p className="font-playfair text-2xl sm:text-3xl italic">10+ Years</p>
                <p className="uppercase text-[10px] tracking-widest mt-1">Professional Experience</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-playfair text-luxury-plum mb-6">Our Story</h2>
              <div className="space-y-5 text-gray-600 leading-relaxed">
                <p>
                  Led by Nysha, a highly skilled braiding specialist with over 10 years of experience, 
                  our salon is deeply rooted in traditional African braiding techniques and modern trends.
                </p>
                <p>
                  Nysha discovered her passion for hair braiding at a young age, learning the art from 
                  her grandmother. Today, she combines that heritage with contemporary styles to create 
                  unique, personalized looks for every client.
                </p>
                <p>
                  Our team is recognized for speed, precision, and consistently high-quality results. 
                  Whether you're looking for the tension-free comfort of knotless braids or a bold 
                  cultural statement, we bring your vision to life with skilled hands and an eye for detail.
                </p>
              </div>
              <div className="mt-8 border-l-4 border-luxury-plum pl-6 italic text-gray-500">
                "Every style is neat, long‑lasting, and tailored specifically to you."
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="py-20 bg-gradient-to-b from-white to-soft-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            title="Our Mission & Values"
            subtitle="What drives us every day"
          />
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-purple-100"
              >
                <div className="w-20 h-20 mx-auto mb-5 bg-luxury-plum/10 rounded-2xl flex items-center justify-center group-hover:bg-luxury-plum/20 transition-colors duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-luxury-plum mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      {!loading && team.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SectionHeader
              title="Meet Our Team"
              subtitle="The talented stylists behind your transformation"
            />
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {team.map((member, index) => (
                <motion.div
                  key={member.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group text-center"
                >
                  <div className="relative w-48 h-48 mx-auto mb-5">
                    <div className="w-48 h-48 rounded-full overflow-hidden shadow-lg ring-4 ring-luxury-plum/20 group-hover:ring-luxury-plum/40 transition-all duration-300">
                      <img
                        src={member.image_url}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/gallery/hair (1).jpeg';
                        }}
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-luxury-plum mb-1">{member.name}</h3>
                  <p className="text-gray-500 text-sm mb-2">{member.role}</p>
                  {member.bio && (
                    <p className="text-sm text-gray-500 max-w-xs mx-auto">{member.bio}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {loading && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <LoadingSpinner />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-luxury-plum text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-24 -right-24 w-96 h-96 border border-purple-300 rounded-full opacity-20"></div>
          <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] border border-purple-300 rounded-full opacity-20"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-playfair font-bold mb-4">
            Ready to Transform Your Look?
          </h2>
          <p className="text-purple-200 mb-8 text-lg">
            Book your appointment today and experience the luxury of expert braiding
          </p>
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 bg-white text-luxury-plum px-8 py-3 rounded-lg font-semibold hover:bg-purple-100 transition-all duration-300 transform hover:scale-105"
          >
            <span>Book Your Appointment</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default AboutPage