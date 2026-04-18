const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

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

export const getMetrics = () => request('/metrics');

export const submitFeedback = (scanId, isCorrect, comment) =>
  request('/feedback', {
    method: 'POST',
    body: JSON.stringify({ scanId, isCorrect, comment }),
  });

export const login = (email, password) =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const register = (email, password, name) =>
  request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
