// frontend/src/services/blockedDatesService.js
import api from './api';

export const blockedDatesService = {
  // Get all blocked dates - PUBLIC endpoint (for customers)
  getPublicBlockedDates: async () => {
    try {
      // Use public endpoint that doesn't require authentication
      const response = await api.get('/bookings/blocked-dates/');
      return response.data;
    } catch (error) {
      console.error('Error fetching public blocked dates:', error);
      // Return empty array on error so booking flow can continue
      return [];
    }
  },

  // Get all blocked dates - ADMIN only
  getBlockedDates: async () => {
    try {
      const response = await api.get('/bookings/admin/blocked-dates/');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin blocked dates:', error);
      throw error;
    }
  },

  // Create a new blocked date (admin only)
  createBlockedDate: async (date, reason = '') => {
    try {
      const response = await api.post('/bookings/admin/blocked-dates/create/', {
        date: date,
        reason: reason
      });
      return response.data;
    } catch (error) {
      console.error('Error creating blocked date:', error);
      throw error;
    }
  },

  // Delete/unblock a date (admin only)
  deleteBlockedDate: async (id) => {
    try {
      const response = await api.delete(`/bookings/admin/blocked-dates/${id}/delete/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting blocked date:', error);
      throw error;
    }
  },

  // Update blocked date reason (admin only)
  updateBlockedDate: async (id, reason) => {
    try {
      const response = await api.patch(`/bookings/admin/blocked-dates/${id}/update/`, {
        reason: reason
      });
      return response.data;
    } catch (error) {
      console.error('Error updating blocked date:', error);
      throw error;
    }
  },

  // Bulk block multiple dates (admin only)
  bulkBlockDates: async (dates, reason = '') => {
    try {
      const response = await api.post('/bookings/admin/blocked-dates/bulk-block/', {
        dates: dates,
        reason: reason
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk blocking dates:', error);
      throw error;
    }
  },

  // Check if a specific date is blocked (public)
  checkDateBlocked: async (date) => {
    try {
      const blockedDates = await blockedDatesService.getPublicBlockedDates();
      return blockedDates.some(blocked => blocked.date === date);
    } catch (error) {
      console.error('Error checking if date is blocked:', error);
      return false;
    }
  }
};