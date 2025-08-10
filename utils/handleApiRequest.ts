"use client";
import { AxiosResponse, AxiosError } from "axios";

// Define a generic API response structure
interface ApiResponse<T> {
   success: boolean;
   message?: string;
   data: T;
   error?: any;
}

// Extract a human-friendly error message from various API error shapes
function extractErrorMessage(error: unknown): string {
   const defaultMessage = "An unexpected error occurred";
   const networkMessage = "Network error. Please check your connection.";

   if (!(error as AxiosError)?.isAxiosError) return defaultMessage;
   const axiosError = error as AxiosError<any>;

   if (!axiosError.response) return networkMessage;
   const data = axiosError.response.data as any;

   return (
      data?.message ||
      data?.error?.msg ||
      data?.error?.message ||
      data?.error ||
      data?.msg ||
      (Array.isArray(data?.errors) && data.errors[0]?.message) ||
      axiosError.message ||
      defaultMessage
   );
}

// Generic error handling function for API requests
const handleApiRequest = async <T>(
   apiCall: () => Promise<AxiosResponse<ApiResponse<T>>>
): Promise<ApiResponse<T>> => {
   try {
      const response = await apiCall();
      return response.data;
   } catch (error) {
      throw new Error(extractErrorMessage(error));
   }
};

export default handleApiRequest;
