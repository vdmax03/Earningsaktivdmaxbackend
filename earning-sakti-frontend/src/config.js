// API URL configuration for different environments
export const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://mzhyi8cqzng8.manus.space'  // Production backend URL
  : 'http://127.0.0.1:5000';             // Development backend URL
