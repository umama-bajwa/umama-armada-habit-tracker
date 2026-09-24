import api from './axios';

/**
 * Fetch habits list from backend.
 * @param {string} status - 'all' | 'active' | 'inactive'
 * @param {string|null} date - YYYY-MM-DD
 */
export const getHabits = async (status = 'all', date = null) => {
  const params = {};
  if (status && status !== 'all') {
    params.status = status;
  }
  if (date) {
    params.date = date;
  }
  const response = await api.get('/habits', { params });
  return response.data;
};

/**
 * Fetch single habit detail by ID.
 * @param {number|string} id
 */
export const getHabit = async (id) => {
  const response = await api.get(`/habits/${id}`);
  return response.data;
};

/**
 * Create a new habit.
 * @param {Object} data - { title, description, is_active }
 */
export const createHabit = async (data) => {
  const response = await api.post('/habits', data);
  return response.data;
};

/**
 * Update an existing habit.
 * @param {number|string} id
 * @param {Object} data - { title, description, is_active }
 */
export const updateHabit = async (id, data) => {
  const response = await api.put(`/habits/${id}`, data);
  return response.data;
};

/**
 * Delete a habit.
 * @param {number|string} id
 */
export const deleteHabit = async (id) => {
  const response = await api.delete(`/habits/${id}`);
  return response.data;
};

/**
 * Mark a habit as completed for today/given date.
 * @param {number|string} id
 * @param {string|null} date - YYYY-MM-DD
 */
export const completeHabit = async (id, date = null) => {
  const payload = date ? { date } : {};
  const response = await api.post(`/habits/${id}/complete`, payload);
  return response.data;
};

/**
 * Mark a habit as incomplete for today/given date.
 * @param {number|string} id
 * @param {string|null} date - YYYY-MM-DD
 */
export const incompleteHabit = async (id, date = null) => {
  const payload = date ? { date } : {};
  const response = await api.post(`/habits/${id}/incomplete`, payload);
  return response.data;
};
