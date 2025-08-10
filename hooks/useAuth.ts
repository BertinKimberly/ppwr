// Update type definitions and API response handling
import { create } from "zustand";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authorizedAPI, unauthorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";
import { useAuthStore } from "@/store/useAuthStore";
import { locales, defaultLocale } from "@/i18n/routing";

// Define ApiResponse type to match the structure of API responses
interface ApiResponse<T> {
   success: boolean;
   data: T;
   message?: string;
}

// User Interface
export interface User {
   id: string;
   fullName: string;
   email: string;
   role: string;
   token?: string;
}

// Data Interfaces
interface LoginData {
   email: string;
   password: string;
}

interface RegisterData {
   fullName: string;
   email: string;
   password: string;
}

interface UpdateUserData {
   userId: string;
   formData: Partial<User>;
}

// API call functions
const loginUser = (userData: LoginData): Promise<ApiResponse<User>> => {
   return handleApiRequest(() =>
      unauthorizedAPI.post("/users/login", userData)
   );
};

const registerUser = (userData: RegisterData): Promise<ApiResponse<User>> => {
   return handleApiRequest(() =>
      unauthorizedAPI.post("/users/register", userData)
   );
};

const fetchUserById = (userId: string): Promise<ApiResponse<User>> => {
   return handleApiRequest(() => authorizedAPI.get(`/users/${userId}`));
};

const fetchAllUsers = (): Promise<ApiResponse<User[]>> => {
   return handleApiRequest(() => authorizedAPI.get("/users/all/admin"));
};

const modifyUser = ({
   userId,
   formData,
}: UpdateUserData): Promise<ApiResponse<void>> => {
   return handleApiRequest(() =>
      authorizedAPI.put(`/users/update/${userId}`, formData)
   );
};

const removeUser = (userId: string): Promise<ApiResponse<void>> => {
   return handleApiRequest(() => authorizedAPI.delete(`/users/${userId}`));
};

// React Query Hooks
export const useLoginUser = () => {
   const { setUser, setIsAuthenticated } = useAuthStore();

   return useMutation<ApiResponse<User>, Error, LoginData>({
      mutationFn: loginUser,
      onSuccess: (data) => {
         if (data && data.success) {
            // Set user in global store
            setUser(data.data);

            // Set authentication token in cookie (omit secure for localhost)
            document.cookie = `access_token=${data.data.token}; path=/; samesite=strict`;

            // Update authentication state
            setIsAuthenticated(true);
         }
      },
      onError: (error) => {
         console.error("Login error:", error);
      },
   });
};

export const useRegisterUser = () => {
   return useMutation<ApiResponse<User>, Error, RegisterData>({
      mutationFn: registerUser,
      // Do NOT auto-login after registration. Let the page handle redirect to sign-in.
      onError: (error) => {
         console.error("Signup error:", error);
      },
   });
};

export const useFetchUserById = (userId: string) => {
   return useQuery<User, Error>({
      queryKey: ["user", userId],
      queryFn: async () => {
         const response = await fetchUserById(userId);
         return response.data;
      },
      enabled: !!userId,
   });
};

export const useFetchAllUsers = () => {
   return useQuery<User[], Error>({
      queryKey: ["users"],
      queryFn: async () => {
         const response = await fetchAllUsers();
         return response.data;
      },
   });
};

export const useModifyUser = () => {
   const queryClient = useQueryClient();

   return useMutation<void, Error, UpdateUserData>({
      mutationFn: async (data) => {
         await modifyUser(data);
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["users"] });
      },
   });
};

export const useRemoveUser = () => {
   const queryClient = useQueryClient();

   return useMutation<void, Error, string>({
      mutationFn: async (userId) => {
         await removeUser(userId);
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["users"] });
      },
   });
};

// Logout Hook
export const useLogoutUser = () => {
   const { clearUser } = useAuthStore();

   return () => {
      // Clear user from store
      clearUser();

      // Remove authentication token
      document.cookie =
         "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Optional: Redirect to login page or home page
      const pathParts = window.location.pathname.split("/").filter(Boolean);
      const maybeLocale = pathParts[0];
      const locale = (locales as readonly string[]).includes(maybeLocale as any)
         ? maybeLocale
         : (defaultLocale as string);
      window.location.href = `/${locale}/sign-in`;
   };
};
