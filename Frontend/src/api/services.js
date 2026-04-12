import api from "./client";

// ─── AUTH ───────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  getProfile: () => api.get("/auth/profile"),
  changePassword: (data) => api.put("/auth/change-password", data),
};

// ─── USERS ──────────────────────────────────────────────────────────────────
export const usersAPI = {
  getAll: () => api.get("/users"),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post("/users", data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  toggleStatus: (id) => api.patch(`/users/${id}/status`),
};

// ─── SERVICE DEPARTMENTS ────────────────────────────────────────────────────
export const deptAPI = {
  getAll: () => api.get("/service-departments"),
  getById: (id) => api.get(`/service-departments/${id}`),
  create: (data) => api.post("/service-departments", data),
  update: (id, data) => api.put(`/service-departments/${id}`, data),
  delete: (id) => api.delete(`/service-departments/${id}`),
};

// ─── DEPT PERSONS ───────────────────────────────────────────────────────────
export const deptPersonAPI = {
  getAll: () => api.get("/service-dept-persons"),
  create: (data) => api.post("/service-dept-persons", data),
  update: (id, data) => api.put(`/service-dept-persons/${id}`, data),
  delete: (id) => api.delete(`/service-dept-persons/${id}`),
};

// ─── SERVICE TYPES ──────────────────────────────────────────────────────────
export const serviceTypeAPI = {
  getAll: () => api.get("/service-types"),
  create: (data) => api.post("/service-types", data),
  update: (id, data) => api.put(`/service-types/${id}`, data),
  delete: (id) => api.delete(`/service-types/${id}`),
};

// ─── REQUEST TYPES ──────────────────────────────────────────────────────────
export const requestTypeAPI = {
  getAll: () => api.get("/service-request-types"),
  getById: (id) => api.get(`/service-request-types/${id}`),
  create: (data) => api.post("/service-request-types", data),
  update: (id, data) => api.put(`/service-request-types/${id}`, data),
  delete: (id) => api.delete(`/service-request-types/${id}`),
};

// ─── REQUEST TYPE PERSON MAPPING ────────────────────────────────────────────
export const typePersonAPI = {
  getAll: () => api.get("/request-type-persons"),
  create: (data) => api.post("/request-type-persons", data),
  update: (id, data) => api.put(`/request-type-persons/${id}`, data),
  delete: (id) => api.delete(`/request-type-persons/${id}`),
};

// ─── STATUSES ───────────────────────────────────────────────────────────────
export const statusAPI = {
  getAll: () => api.get("/service-statuses"),
  create: (data) => api.post("/service-statuses", data),
  update: (id, data) => api.put(`/service-statuses/${id}`, data),
  delete: (id) => api.delete(`/service-statuses/${id}`),
};

// ─── SERVICE REQUESTS ───────────────────────────────────────────────────────
export const requestAPI = {
  getStats: () => api.get("/service-requests/stats"),
  getAll: () => api.get("/service-requests"),
  getById: (id) => api.get(`/service-requests/${id}`),
  create: (data) => api.post("/service-requests", data),
  update: (id, data) => api.put(`/service-requests/${id}`, data),
  delete: (id) => api.delete(`/service-requests/${id}`),
  assign: (id, data) => api.patch(`/service-requests/${id}/assign`, data),
  updateStatus: (id, data) => api.patch(`/service-requests/${id}/status`, data),
  approve: (id, data) => api.patch(`/service-requests/${id}/approve`, data),
};

// ─── REPLIES ────────────────────────────────────────────────────────────────
export const replyAPI = {
  getByRequest: (requestId) => api.get(`/service-request-replies/${requestId}`),
  create: (data) => api.post("/service-request-replies", data),
  delete: (id) => api.delete(`/service-request-replies/${id}`),
};
