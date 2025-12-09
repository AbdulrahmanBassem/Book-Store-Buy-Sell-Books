import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_PRODUCTION_ENV === 'true'
    ? import.meta.env.VITE_BACKEND_BASE
    : "http://localhost:5000",
});