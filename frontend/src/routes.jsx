import { Navigate } from 'react-router-dom'

// Public Pages
import About from './pages/AboutPage'
import BookingDate from './pages/BookingDate'
import BookingInfo from './pages/BookingInfo'
import Booking from './pages/BookingPage'
import BookingPayment from './pages/BookingPayment'
import Contact from './pages/ContactPage'
import FAQ from './pages/FAQPage'
import Gallery from './pages/GalleryPage'
import Home from './pages/Home'
import PaymentCancel from './pages/PaymentCancel'
import PaymentSuccess from './pages/PaymentSuccess'
import ReservationDetails from './pages/ReservationDetails'
import ReservationFind from './pages/ReservationFind'

// Admin Pages
import AdminBookings from './pages/admin/AdminBookings'
import AdminCalendar from './pages/admin/AdminCalendar'
import AdminCustomers from './pages/admin/AdminCustomers'
import AdminLogin from './pages/admin/AdminLogin'
import AdminServices from './pages/admin/AdminServices'
import AdminSettings from './pages/admin/AdminSettings'
import AdminDashboard from './pages/admin/Dashboard'

// Protected Route Component
import ProtectedRoute from './components/common/ProtectedRoute'

const routes = [
  // Public Routes
  { path: '/', element: <Home />, layout: 'main' },
  { path: '/booking', element: <Booking />, layout: 'main' },
  { path: '/booking/date', element: <BookingDate />, layout: 'main' },
  { path: '/booking/info', element: <BookingInfo />, layout: 'main' },
  { path: '/booking/payment', element: <BookingPayment />, layout: 'main' },
  { path: '/payment/success', element: <PaymentSuccess />, layout: 'main' },
  { path: '/payment/cancel', element: <PaymentCancel />, layout: 'main' },
  { path: '/reservation/find', element: <ReservationFind />, layout: 'main' },
  { path: '/reservation/:code', element: <ReservationDetails />, layout: 'main' },
  { path: '/contact', element: <Contact />, layout: 'main' },
  { path: '/gallery', element: <Gallery />, layout: 'main' },
  { path: '/about', element: <About />, layout: 'main' },
  { path: '/faq', element: <FAQ />, layout: 'main' },
  
  // Admin Routes
  { path: '/admin/login', element: <AdminLogin />, layout: 'none' },
  { 
    path: '/admin/dashboard', 
    element: <ProtectedRoute><AdminDashboard /></ProtectedRoute>, 
    layout: 'main' 
  },
  { 
    path: '/admin/bookings', 
    element: <ProtectedRoute><AdminBookings /></ProtectedRoute>, 
    layout: 'main' 
  },
  { 
    path: '/admin/services', 
    element: <ProtectedRoute><AdminServices /></ProtectedRoute>, 
    layout: 'main' 
  },
  { 
    path: '/admin/calendar', 
    element: <ProtectedRoute><AdminCalendar /></ProtectedRoute>, 
    layout: 'main' 
  },
  { 
    path: '/admin/customers', 
    element: <ProtectedRoute><AdminCustomers /></ProtectedRoute>, 
    layout: 'main' 
  },
  { 
    path: '/admin/settings', 
    element: <ProtectedRoute><AdminSettings /></ProtectedRoute>, 
    layout: 'main' 
  },
  
  // Redirect
  { path: '*', element: <Navigate to="/" replace />, layout: 'none' },
]

export default routes