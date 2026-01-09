const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

const storageKey = 'ecom_token';
export const setToken = (t) => localStorage.setItem(storageKey, t);
export const getToken = () => localStorage.getItem(storageKey);
export const clearToken = () => localStorage.removeItem(storageKey);

async function request(method, path, body = null, auth = true) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (auth && token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw { status: res.status, body: data };
  return data;
}

export const api = {
  post: (p, b, a = true) => request('POST', p, b, a),
  get: (p, a = true) => request('GET', p, null, a),
  put: (p, b, a = true) => request('PUT', p, b, a),
  del: (p, a = true) => request('DELETE', p, null, a),
};
