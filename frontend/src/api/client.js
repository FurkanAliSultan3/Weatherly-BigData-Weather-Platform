import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  return config;
});


export const reportApi = {
  getPublic: () => api.get('/reports/public').then(res => res.data),
  getAdmin: (params) => api.get('/reports/admin', { params }).then(res => res.data),
  verify: (id, status, notes) => api.patch(`/reports/${id}/verify`, { status, notes }).then(res => res.data),
  submit: (report) => api.post('/reports/', report).then(res => res.data),
};

export const analyticsApi = {
  getKPIs: () => api.get('/analytics/kpis').then(res => res.data),
  getCharts: () => api.get('/analytics/charts').then(res => res.data),
  getAuditLogs: () => api.get('/analytics/audit').then(res => res.data),
};

export const systemApi = {
  getHealth: () => api.get('/health').then(res => res.data),
};

export const createLiveFeedSocket = () => {
  const apiUrl = new URL(API_BASE_URL, window.location.origin);
  const socketUrl = new URL('/ws/live-feed', apiUrl);
  socketUrl.protocol = socketUrl.protocol === 'https:' ? 'wss:' : 'ws:';
  return new WebSocket(socketUrl);
};

export default api;
