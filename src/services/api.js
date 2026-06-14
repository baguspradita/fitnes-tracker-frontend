import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
};

export const exerciseAPI = {
  getAll: (params) => api.get("/exercises", { params }),
  getById: (id) => api.get(`/exercises/${id}`),
  create: (data) => api.post("/exercises", data),
  update: (id, data) => api.put(`/exercises/${id}`, data),
  delete: (id) => api.delete(`/exercises/${id}`),
};

export const workoutAPI = {
  getAll: () => api.get("/workouts"),
  getById: (id) => api.get(`/workouts/${id}`),
  create: (data) => api.post("/workouts", data),
  update: (id, data) => api.put(`/workouts/${id}`, data),
  delete: (id) => api.delete(`/workouts/${id}`),
  addExercise: (workoutId, data) => api.post(`/workouts/${workoutId}/exercises`, data),
  removeExercise: (workoutId, weId) => api.delete(`/workouts/${workoutId}/exercises/${weId}`),
  addSet: (weId, data) => api.post(`/workouts/exercises/${weId}/sets`, data),
  updateSet: (setId, data) => api.put(`/workouts/sets/${setId}`, data),
  deleteSet: (setId) => api.delete(`/workouts/sets/${setId}`),
};

export const nutritionAPI = {
  getAll: (params) => api.get("/nutrition", { params }),
  getSummary: (date) => api.get("/nutrition/summary", { params: { date } }),
  create: (data) => api.post("/nutrition", data),
  update: (id, data) => api.put(`/nutrition/${id}`, data),
  delete: (id) => api.delete(`/nutrition/${id}`),
};

export const bodyAPI = {
  getAll: () => api.get("/body"),
  create: (data) => api.post("/body", data),
  update: (id, data) => api.put(`/body/${id}`, data),
  delete: (id) => api.delete(`/body/${id}`),
};

export const goalAPI = {
  getAll: () => api.get("/goals"),
  create: (data) => api.post("/goals", data),
  update: (id, data) => api.put(`/goals/${id}`, data),
  delete: (id) => api.delete(`/goals/${id}`),
};

export const dashboardAPI = {
  summary: () => api.get("/dashboard/summary"),
  volume: () => api.get("/dashboard/volume"),
  strength: (exerciseId) => api.get(`/dashboard/strength/${exerciseId}`),
};

export const settingsAPI = {
  updateProfile: (data) => api.put("/settings/profile", data),
  changePassword: (data) => api.put("/settings/password", data),
};

export const adminAPI = {
  getStats: () => api.get("/admin/stats"),
  getUsers: (params) => api.get("/admin/users", { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export default api;