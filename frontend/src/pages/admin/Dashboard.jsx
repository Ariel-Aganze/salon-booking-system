import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import BookingsTable from '../../components/admin/BookingsTable'
import StatsCard from '../../components/admin/StatsCard'
import { adminService } from '../../services/admin'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [chartsData, setChartsData] = useState(null)
  const [recentBookings, setRecentBookings] = useState(null)
  const [loading, setLoading] = useState({
    stats: true,
    charts: true,
    bookings: true
  })
  const [errors, setErrors] = useState({
    stats: null,
    charts: null,
    bookings: null
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    await Promise.all([
      fetchStats(),
      fetchCharts(),
      fetchRecentBookings()
    ])
  }

  const fetchStats = async () => {
    try {
      setLoading(prev => ({ ...prev, stats: true }))
      const data = await adminService.getDashboardStats()
      setStats(data)
      setErrors(prev => ({ ...prev, stats: null }))
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      setErrors(prev => ({ ...prev, stats: error.response?.data?.error || 'Failed to load statistics' }))
    } finally {
      setLoading(prev => ({ ...prev, stats: false }))
    }
  }

  const fetchCharts = async () => {
    try {
      setLoading(prev => ({ ...prev, charts: true }))
      const data = await adminService.getDashboardCharts()
      setChartsData(data)
      setErrors(prev => ({ ...prev, charts: null }))
    } catch (error) {
      console.error('Failed to fetch charts:', error)
      setErrors(prev => ({ ...prev, charts: error.response?.data?.error || 'Failed to load chart data' }))
    } finally {
      setLoading(prev => ({ ...prev, charts: false }))
    }
  }

  const fetchRecentBookings = async () => {
    try {
      setLoading(prev => ({ ...prev, bookings: true }))
      const data = await adminService.getRecentBookings()
      setRecentBookings(data)
      setErrors(prev => ({ ...prev, bookings: null }))
    } catch (error) {
      console.error('Failed to fetch recent bookings:', error)
      setErrors(prev => ({ ...prev, bookings: error.response?.data?.error || 'Failed to load recent bookings' }))
    } finally {
      setLoading(prev => ({ ...prev, bookings: false }))
    }
  }

  // Calculate payment status distribution for pie chart
  const getPaymentDistribution = () => {
    if (!stats) return []
    return [
      { name: 'Pending', value: stats.pending_payments || 0, color: '#eab308' },
      { name: 'Partial', value: stats.partial_payments || 0, color: '#3b82f6' },
      { name: 'Completed', value: stats.completed_bookings || 0, color: '#22c55e' }
    ]
  }

  const statsConfig = [
    {
      title: 'Total Bookings',
      value: stats?.total_bookings,
      icon: (
        <svg className="w-6 h-6 text-luxury-plum" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'text-luxury-plum'
    },
    {
      title: 'Pending Payments',
      value: stats?.pending_payments,
      icon: (
        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-yellow-600'
    },
    {
      title: 'Partial Payments',
      value: stats?.partial_payments,
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-blue-600',
      subtitle: stats?.deposit_revenue ? `$${stats.deposit_revenue} collected` : null
    },
    {
      title: 'Total Revenue',
      value: stats?.total_revenue !== undefined && stats?.total_revenue !== null ? `$${stats.total_revenue}` : null,
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-green-600'
    }
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-playfair font-bold text-luxury-plum mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">Welcome to your salon management dashboard</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsConfig.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            loading={loading.stats}
            subtitle={stat.subtitle}
          />
        ))}
      </div>
      
      {errors.stats && !loading.stats && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center">
          {errors.stats}
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Booking Trends Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Trends</h3>
          {loading.charts ? (
            <div className="h-80 flex items-center justify-center">
              <div className="animate-pulse text-gray-400">Loading chart data...</div>
            </div>
          ) : errors.charts ? (
            <div className="h-80 flex items-center justify-center text-red-500">
              {errors.charts}
            </div>
          ) : chartsData?.booking_trends && chartsData.booking_trends.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartsData.booking_trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="bookings" stroke="#4c1d6f" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              No booking data available
            </div>
          )}
        </motion.div>

        {/* Payment Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status Distribution</h3>
          {loading.stats ? (
            <div className="h-80 flex items-center justify-center">
              <div className="animate-pulse text-gray-400">Loading chart data...</div>
            </div>
          ) : errors.stats ? (
            <div className="h-80 flex items-center justify-center text-red-500">
              {errors.stats}
            </div>
          ) : (
            <div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={getPaymentDistribution()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getPaymentDistribution().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm text-gray-600">Pending: {stats?.pending_payments || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600">Partial: {stats?.partial_payments || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">Paid: {stats?.completed_bookings || 0}</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Revenue Overview Chart */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
          {loading.charts ? (
            <div className="h-80 flex items-center justify-center">
              <div className="animate-pulse text-gray-400">Loading chart data...</div>
            </div>
          ) : errors.charts ? (
            <div className="h-80 flex items-center justify-center text-red-500">
              {errors.charts}
            </div>
          ) : chartsData?.revenue_overview && chartsData.revenue_overview.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartsData.revenue_overview}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#4c1d6f" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              No revenue data available
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Bookings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
        <BookingsTable
          bookings={recentBookings}
          loading={loading.bookings}
          error={errors.bookings}
        />
      </motion.div>
    </div>
  )
}

export default Dashboard