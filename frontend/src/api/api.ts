import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:8080/api"
      : "https://",
  validateStatus: (status) => {
    return status < 500;
  },
});

// Setup bearer token interceptor
api.interceptors.request.use(function (config) {
  const token = localStorage.getItem("access_token");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Setup expiry checker
api.interceptors.request.use(function (config) {
  const event = new Event("local_storage_cleared");
  dispatchEvent(event);
  return config;
});

export default api;
