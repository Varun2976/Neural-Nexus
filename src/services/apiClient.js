const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function getToken() {
  return localStorage.getItem('nn_token');
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.error || `API error: ${response.status}`;
    throw new Error(message);
  }

  return data;
}

// ---- Auth ----
export const loginUser = (email, password) =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const registerUser = (name, email, password) =>
  request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });

export const getMe = () => request('/auth/me');

// ---- Scan ----
export const scanUrl = (url) =>
  request('/scan/url', {
    method: 'POST',
    body: JSON.stringify({ url }),
  });

export const scanText = (text) =>
  request('/scan/text', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });

// ---- Metrics ----
export const getMetrics = () => request('/metrics');

// ---- Feedback ----
export const submitFeedback = (scanId, isCorrect, comment) =>
  request('/feedback', {
    method: 'POST',
    body: JSON.stringify({ scanId, isCorrect, comment }),
  });
