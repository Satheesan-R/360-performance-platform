const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const body = await response.json().catch(() => ({
    success: false,
    message: 'The server returned an invalid response',
  }));

  if (!response.ok) {
    const error = new Error(body.message || 'Request failed');
    error.status = response.status;
    throw error;
  }

  return body;
}

export function authenticatedRequest(path, token, options = {}) {
  return apiRequest(path, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}
