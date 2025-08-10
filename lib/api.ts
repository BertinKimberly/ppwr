import axios from "axios";
import { locales, defaultLocale } from "@/i18n/routing";

// Base configuration for API requests
const BASE_URL =
   process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Function to get token from cookies
const getToken = () => {
   if (typeof window !== "undefined") {
      const cookies = document.cookie.split("; ");
      const tokenCookie = cookies.find((row) =>
         row.startsWith("access_token=")
      );
      return tokenCookie ? tokenCookie.split("=")[1] : null;
   }
   return null;
};

// Unauthorized API instance (for login, signup, etc.)
export const unauthorizedAPI = axios.create({
   baseURL: BASE_URL,
   headers: {
      "Content-Type": "application/json",
   },
});

// Authorized API instance (for protected routes)
export const authorizedAPI = axios.create({
   baseURL: BASE_URL,
   headers: {
      "Content-Type": "application/json",
   },
});

// Interceptor for authorized requests
authorizedAPI.interceptors.request.use(
   (config) => {
      const token = getToken();
      if (token) {
         config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
   },
   (error) => {
      return Promise.reject(error);
   }
);

// Interceptor to handle token expiration or unauthorized access
authorizedAPI.interceptors.response.use(
   (response) => response,
   (error) => {
      if (error.response && error.response.status === 401) {
         // Token expired or invalid, clear authentication
         if (typeof window !== "undefined") {
            // Clear cookies
            document.cookie =
               "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            // Redirect to login page
            const pathParts = window.location.pathname
               .split("/")
               .filter(Boolean);
            const maybeLocale = pathParts[0];
            const locale = (locales as readonly string[]).includes(
               maybeLocale as any
            )
               ? maybeLocale
               : (defaultLocale as string);
            window.location.href = `/${locale}/sign-in`;
         }
      }
      return Promise.reject(error);
   }
);

export default {
   unauthorizedAPI,
   authorizedAPI,
};
