"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { jwtDecode } from "jwt-decode";
import { authorizedAPI } from "@/lib/api";

interface AuthProviderProps {
   children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
   const { setUser, setIsAuthenticated, clearUser } = useAuthStore();
   const [loading, setLoading] = useState(true);

   const fetchUserData = async () => {
      try {
         const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("access_token="))
            ?.split("=")[1];

         // If no token is found, just set authenticated to false and continue
         if (!token) {
            clearUser();
            setLoading(false);
            return;
         }

         try {
            // Decode token to check expiration
            const decodedToken: any = jwtDecode(token);

            // Check token expiration
            if (decodedToken.exp * 1000 < Date.now()) {
               clearUser();
               document.cookie =
                  "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
               setLoading(false);
               return;
            }

            // Fetch full user details from API
            const response = await authorizedAPI.get(
               `/users/${decodedToken.id}`
            );
            const userData = response.data.data;

            setUser({
               id: userData.id,
               fullName: userData.fullName,
               email: userData.email,
               role: userData.role,
               token: token,
            });

            setIsAuthenticated(true);
         } catch (tokenError) {
            // Invalid token or decode error, handle as unauthenticated
            clearUser();
         }
      } catch (error) {
         // API or network error
         clearUser();
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchUserData();
   }, []);

   // Optional: Show loading state only if it takes longer than a threshold
   const [showLoading, setShowLoading] = useState(false);

   useEffect(() => {
      const timer = setTimeout(() => {
         if (loading) {
            setShowLoading(true);
         }
      }, 500); // Show loading spinner after 500ms

      return () => clearTimeout(timer);
   }, [loading]);

   if (loading && showLoading) {
      return (
         <div className="items-center justify-center flex min-h-screen">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-main mx-auto"></div>
               <p className="mt-4 text-main">Loading...</p>
            </div>
         </div>
      );
   }

   return <>{children}</>;
};

export default AuthProvider;
