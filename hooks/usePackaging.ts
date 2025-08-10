import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authorizedAPI } from "@/lib/api";

// Packaging API functions (moved from lib/api.ts)
export const getAllPackagingItems = () => authorizedAPI.get("/packaging");

export const getPackagingItemById = (id: string) =>
   authorizedAPI.get(`/packaging/${id}`);

export const createPackagingItem = (data: any) =>
   authorizedAPI.post("/packaging", data);

export const updatePackagingItem = (id: string, data: any) =>
   authorizedAPI.put(`/packaging/${id}`, data);

export const deletePackagingItem = (id: string) =>
   authorizedAPI.delete(`/packaging/${id}`);

export const uploadPackagingDocument = (
   id: string,
   file: File,
   type: string
) => {
   const formData = new FormData();
   formData.append("file", file);
   formData.append("type", type);
   return authorizedAPI.post(`/packaging/${id}/documents`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
   });
};

export const deletePackagingDocument = (documentId: string) =>
   authorizedAPI.delete(`/packaging/documents/${documentId}`);

// List all packaging items
export const usePackagingList = () =>
   useQuery({
      queryKey: ["packaging"],
      queryFn: async () => {
         const res = await getAllPackagingItems();
         return res.data.data;
      },
   });

// Get single packaging item by id
export const usePackagingItem = (id: string) =>
   useQuery({
      queryKey: ["packaging", id],
      queryFn: async () => {
         const res = await getPackagingItemById(id);
         return res.data.data;
      },
      enabled: !!id,
   });

// Create packaging item
export const useCreatePackaging = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: createPackagingItem,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["packaging"] });
      },
   });
};

// Update packaging item
export const useUpdatePackaging = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: ({ id, data }: { id: string; data: any }) =>
         updatePackagingItem(id, data),
      onSuccess: (_data, variables) => {
         queryClient.invalidateQueries({ queryKey: ["packaging"] });
         if (variables?.id) {
            queryClient.invalidateQueries({
               queryKey: ["packaging", variables.id],
            });
         }
      },
   });
};

// Delete packaging item
export const useDeletePackaging = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: deletePackagingItem,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["packaging"] });
      },
   });
};

// Upload packaging document
export const useUploadPackagingDocument = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: ({
         id,
         file,
         type,
      }: {
         id: string;
         file: File;
         type: string;
      }) => uploadPackagingDocument(id, file, type),
      onSuccess: (_data, variables) => {
         // Invalidate the specific packaging item and the list
         queryClient.invalidateQueries({
            queryKey: ["packaging", variables.id],
         });
         queryClient.invalidateQueries({
            queryKey: ["packaging"],
         });
      },
      onError: (error) => {
         console.error("Document upload failed", error);
         // Optionally show an error toast
      },
   });
};

// Delete packaging document
export const useDeletePackagingDocument = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: (documentId: string) => deletePackagingDocument(documentId),
      onSuccess: (_data, documentId) => {
         // Invalidate packaging queries to refresh data
         queryClient.invalidateQueries({
            queryKey: ["packaging"],
         });
      },
      onError: (error) => {
         console.error("Document deletion failed", error);
         // Optionally show an error toast
      },
   });
};
