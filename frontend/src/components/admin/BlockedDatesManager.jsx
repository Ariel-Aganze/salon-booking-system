// frontend/src/components/admin/BlockedDatesManager.jsx
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { blockedDatesService } from '../../services/blockedDatesService';
import ErrorState from '../common/ErrorState';
import LoadingSpinner from '../common/LoadingSpinner';

const BlockedDatesManager = () => {
  const [blockedDates, setBlockedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newReason, setNewReason] = useState('');
  const [bulkDates, setBulkDates] = useState('');
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBlockedDates();
  }, []);

  const fetchBlockedDates = async () => {
    try {
      setLoading(true);
      const data = await blockedDatesService.getBlockedDates();
      setBlockedDates(data);
      setError(null);
    } catch (err) {
      setError('Failed to load blocked dates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBlockedDate = async (e) => {
    e.preventDefault();
    if (!newDate) {
      setError('Please select a date');
      return;
    }

    try {
      setSubmitting(true);
      await blockedDatesService.createBlockedDate(newDate, newReason);
      await fetchBlockedDates();
      setNewDate('');
      setNewReason('');
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to block date');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnblockDate = async (id, date) => {
    if (window.confirm(`Are you sure you want to unblock ${date}?`)) {
      try {
        setSubmitting(true);
        await blockedDatesService.deleteBlockedDate(id);
        await fetchBlockedDates();
        setError(null);
      } catch (err) {
        setError('Failed to unblock date');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleBulkBlock = async (e) => {
    e.preventDefault();
    if (!bulkDates) {
      setError('Please enter dates to block');
      return;
    }

    // Parse dates from textarea (one per line or comma separated)
    let datesArray = bulkDates.split(/\n|,/).map(d => d.trim()).filter(d => d);
    
    // Validate date format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const invalidDates = datesArray.filter(d => !dateRegex.test(d));
    
    if (invalidDates.length > 0) {
      setError(`Invalid date format for: ${invalidDates.join(', ')}. Use YYYY-MM-DD`);
      return;
    }

    try {
      setSubmitting(true);
      const result = await blockedDatesService.bulkBlockDates(datesArray, newReason);
      await fetchBlockedDates();
      setBulkDates('');
      setNewReason('');
      setShowBulkForm(false);
      setError(null);
      alert(result.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to block dates');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error && !blockedDates.length) return <ErrorState message={error} onRetry={fetchBlockedDates} />;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Blocked Dates</h2>
        <div className="space-x-2">
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setShowBulkForm(false);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Block Single Date
          </button>
          <button
            onClick={() => {
              setShowBulkForm(!showBulkForm);
              setShowAddForm(false);
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
          >
            Bulk Block Dates
          </button>
        </div>
      </div>

      {/* Add Single Date Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50"
        >
          <h3 className="text-lg font-semibold mb-3">Block a Date</h3>
          <form onSubmit={handleAddBlockedDate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date to Block
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason (Optional)
                </label>
                <input
                  type="text"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="e.g., Holiday, Maintenance, Private Event"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="mt-4 space-x-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
              >
                {submitting ? 'Blocking...' : 'Block Date'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Bulk Block Form */}
      {showBulkForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50"
        >
          <h3 className="text-lg font-semibold mb-3">Bulk Block Dates</h3>
          <form onSubmit={handleBulkBlock}>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dates (One per line or comma separated)
              </label>
              <textarea
                value={bulkDates}
                onChange={(e) => setBulkDates(e.target.value)}
                placeholder="2024-12-25
2024-12-26
2025-01-01"
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 font-mono"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Format: YYYY-MM-DD</p>
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason (Optional - applies to all)
              </label>
              <input
                type="text"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                placeholder="e.g., Holiday Closure"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-x-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
              >
                {submitting ? 'Blocking...' : 'Block Selected Dates'}
              </button>
              <button
                type="button"
                onClick={() => setShowBulkForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Blocked Dates List */}
      {blockedDates.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No blocked dates. All dates are available for booking.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blocked On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blockedDates.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.reason || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleUnblockDate(item.id, item.date)}
                      disabled={submitting}
                      className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                    >
                      Unblock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BlockedDatesManager;