import { motion } from 'framer-motion'
import Footer from '../components/common/Footer'
import Navbar from '../components/common/Navbar'

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      <motion.main 
        className="flex-grow pt-20"  // Add padding-top to account for fixed navbar
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  )
}

export default MainLayout