import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
   id: string;
   fullName: string;
   email: string;
   role: string;
   token?: string;
}

interface AuthState {
   user: User | null;
   isAuthenticated: boolean;
   roles: string[];
   setUser: (user: User | null) => void;
   clearUser: () => void;
   setIsAuthenticated: (isAuthenticated: boolean) => void;
   setRoles: (roles: string[]) => void;
}

export const useAuthStore = create(
   persist<AuthState>(
      (set) => ({
         user: null,
         isAuthenticated: false,
         roles: [],
         setUser: (user: User | null) =>
            set({
               user,
               isAuthenticated: !!user,
               roles: user ? [user.role] : [],
            }),
         clearUser: () =>
            set({
               user: null,
               isAuthenticated: false,
               roles: [],
            }),
         setIsAuthenticated: (isAuthenticated: boolean) =>
            set({ isAuthenticated }),
         setRoles: (roles: string[]) => set({ roles }),
      }),
      {
         name: "auth-storage", 
         partialize: (state) => ({
            user: state.user,
            isAuthenticated: state.isAuthenticated,
            roles: state.roles,
            setUser: () => {}, 
            clearUser: () => {}, 
            setIsAuthenticated: () => {}, 
            setRoles: () => {}, 
         }),
      }
   )
);
