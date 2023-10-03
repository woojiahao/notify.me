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

api.interceptors.request.use(function (config) {
  const token = localStorage.getItem("access_token");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
