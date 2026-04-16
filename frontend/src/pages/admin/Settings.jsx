import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import AdminUsersForm from '../../components/admin/AdminUsersForm'
import BlockedDatesManager from '../../components/admin/BlockedDatesManager'
import BusinessHoursForm from '../../components/admin/BusinessHoursForm'
import DepositSettingsForm from '../../components/admin/DepositSettingsForm'
import EmailTemplatesForm from '../../components/admin/EmailTemplatesForm'
import TimeSlotManager from '../../components/admin/TimeSlotManager'
import { settingsAdminService } from '../../services/settingsAdminService'

const Settings = () => {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('hours')

  const tabs = [
    { id: 'hours', label: 'Working Hours' },
    { id: 'timeslots', label: 'Time Slots' },
    { id: 'deposit', label: 'Deposit Settings' },
    { id: 'blocked-dates', label: 'Blocked Dates' },
    { id: 'email', label: 'Email Templates' },
    { id: 'users', label: 'Admin Users' }
  ]

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const data = await settingsAdminService.getSettings()
      setSettings(data)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch settings:', err)
      setError(err.response?.data?.message || 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = () => {
    fetchSettings()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-pulse text-gray-400">Loading settings...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-playfair font-bold text-luxury-plum mb-2">
          Settings
        </h1>
        <p className="text-gray-600">Configure salon preferences and system settings</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'border-luxury-plum text-luxury-plum'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'hours' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-playfair font-semibold text-luxury-plum mb-4">
              Working Hours Configuration
            </h2>
            <p className="text-gray-500 mb-6">Set your salon's operating hours for each day</p>
            <BusinessHoursForm settings={settings} onUpdate={handleUpdate} />
          </div>
        )}

        {activeTab === 'timeslots' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-playfair font-semibold text-luxury-plum mb-4">
              Time Slots Management
            </h2>
            <p className="text-gray-500 mb-6">Generate and manage available time slots for bookings</p>
            <TimeSlotManager settings={settings} />
          </div>
        )}

        {activeTab === 'deposit' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-playfair font-semibold text-luxury-plum mb-4">
              Deposit Settings
            </h2>
            <p className="text-gray-500 mb-6">Configure deposit requirements for bookings</p>
            <DepositSettingsForm settings={settings} onUpdate={handleUpdate} />
          </div>
        )}

        {activeTab === 'blocked-dates' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-playfair font-semibold text-luxury-plum mb-4">
              Blocked Dates Management
            </h2>
            <p className="text-gray-500 mb-6">
              Block specific dates when the salon is closed or unavailable for bookings
            </p>
            <BlockedDatesManager />
          </div>
        )}

        {activeTab === 'email' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-playfair font-semibold text-luxury-plum mb-4">
              Email Templates
            </h2>
            <p className="text-gray-500 mb-6">Customize email notifications sent to customers</p>
            <EmailTemplatesForm settings={settings} onUpdate={handleUpdate} />
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-playfair font-semibold text-luxury-plum mb-4">
              Admin Users Management
            </h2>
            <p className="text-gray-500 mb-6">Manage administrator accounts and permissions</p>
            <AdminUsersForm settings={settings} onUpdate={handleUpdate} />
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Settings