import { AnimatePresence } from 'framer-motion'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminLayout from './components/admin/AdminLayout'
import ProtectedRoute from './components/common/ProtectedRoute'
import MainLayout from './layouts/MainLayout'
import AboutPage from './pages/AboutPage'
import BookingDate from './pages/BookingDate'
import BookingInfo from './pages/BookingInfo'
import BookingPage from './pages/BookingPage'
import BookingPayment from './pages/BookingPayment'
import ContactPage from './pages/ContactPage'
import FAQPage from './pages/FAQPage'
import FindReservation from './pages/FindReservation'
import GalleryPage from './pages/GalleryPage'
import LandingPage from './pages/LandingPage'
import PaymentCancel from './pages/PaymentCancel'
import PaymentSuccess from './pages/PaymentSuccess'
import ReservationDetails from './pages/ReservationDetails'
import AdminLogin from './pages/admin/AdminLogin'
import BookingsManager from './pages/admin/BookingsManager'
import CalendarView from './pages/admin/CalendarView'
import CustomersManager from './pages/admin/CustomersManager'
import Dashboard from './pages/admin/Dashboard'
import ServicesManager from './pages/admin/ServicesManager'
import Settings from './pages/admin/Settings'

function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
          <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
          <Route path="/gallery" element={<MainLayout><GalleryPage /></MainLayout>} />
          <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
          <Route path="/faq" element={<MainLayout><FAQPage /></MainLayout>} />
          <Route path="/booking" element={<MainLayout><BookingPage /></MainLayout>} />
          <Route path="/booking/date" element={<MainLayout><BookingDate /></MainLayout>} />
          <Route path="/booking/info" element={<MainLayout><BookingInfo /></MainLayout>} />
          <Route path="/booking/payment" element={<MainLayout><BookingPayment /></MainLayout>} />
          <Route path="/payment/success" element={<MainLayout><PaymentSuccess /></MainLayout>} />
          <Route path="/payment/cancel" element={<MainLayout><PaymentCancel /></MainLayout>} />
          <Route path="/reservation/find" element={<MainLayout><FindReservation /></MainLayout>} />
          <Route path="/reservation/:code" element={<MainLayout><ReservationDetails /></MainLayout>} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="bookings" element={<BookingsManager />} />
            <Route path="services" element={<ServicesManager />} />
            <Route path="calendar" element={<CalendarView />} />
            <Route path="customers" element={<CustomersManager />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  )
}

export default App