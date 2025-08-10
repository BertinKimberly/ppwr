"use client";

import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import PackagingHeader from "@/components/dashboard/packaging/PackagingHeader";
import PackagingTable from "@/components/dashboard/packaging/PackagingTable";
import PackagingDetailView from "@/components/dashboard/packaging/PackagingDetailView";
import PackagingCreateView from "@/components/dashboard/packaging/PackagingCreateView";
import PackagingCreateComponentsForm from "@/components/dashboard/packaging/PackagingCreateComponentsForm";
import PackagingEditView from "@/components/dashboard/packaging/PackagingEditView";
import {
   usePackagingList,
   usePackagingItem,
   useUpdatePackaging,
   useCreatePackaging,
   useUploadPackagingDocument,
   useDeletePackagingDocument,
} from "@/hooks/usePackaging";
import { authorizedAPI } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { PackagingComponentDraft } from "@/components/dashboard/packaging/PackagingCreateComponentsForm";

// Types for local mock and sorting
interface PackagingComponentItem {
   id: string;
   name: string;
   format: string;
   weight: string;
   volume: string;
   ppwrCategory: string;
   ppwrLevel: string;
   type?: "separat" | "integriert";
   materials?: MaterialLayer[];
   quantity?: number;
   supplier?: string;
   manufacturingProcess?: string;
   color?: string;
}

interface MaterialLayer {
   name: string;
   material: string;
   weight: string;
   thickness: string;
   percentage: string;
}

interface PackagingDocumentItem {
   id: string;
   name: string;
   type: string;
   fileUrl: string;
   fileSize: number;
   uploadDate?: string;
}

interface PackagingItem {
   id: string;
   name: string;
   internalCode: string;
   materials: string[];
   status: string;
   weight: string;
   ppwrLevel: string;
   conformityStatus?: string;
   creationDate?: string;
   components: PackagingComponentItem[];
   documents?: PackagingDocumentItem[];
}

type SortableKeys =
   | "name"
   | "internalCode"
   | "status"
   | "weight"
   | "ppwrLevel"
   | "conformityStatus"
   | "creationDate";

// Map backend enum status to localized UI labels
const backendStatusToGerman: Record<string, string> = {
   DRAFT: "Entwurf",
   ACTIVE: "Aktiv",
   INACTIVE: "Inaktiv",
   DEACTIVATED: "Deaktiviert",
};

export default function PackagingPage() {
   const t = useTranslations("Packaging");
   const router = useRouter();
   const searchParams = useSearchParams();
   const queryClient = useQueryClient();

   const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
   const [searchTerm, setSearchTerm] = useState("");
   const [statusFilter, setStatusFilter] = useState<string>("all");
   const [materialFilter, setMaterialFilter] = useState<string>("all");
   const [ppwrFilter, setPpwrFilter] = useState<string>("all");
   const [conformityFilter, setConformityFilter] = useState<string>("all");
   const [creationDateFilter, setCreationDateFilter] = useState<string>("all");
   const [currentPage, setCurrentPage] = useState(1);
   const [sortBy, setSortBy] = useState<SortableKeys | "">("");
   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

   // New packaging create view state
   const [isCreateOpen, setIsCreateOpen] = useState(false);

   // Edit mode state
   const [isEditMode, setIsEditMode] = useState(false);

   // Detail view state
   const packagingId = searchParams.get("id");
   const isDetailView = !!packagingId;
   const [activeTab, setActiveTab] = useState("all");

   // Data fetching
   const {
      data: packagingList,
      isLoading: isListLoading,
      isError: isListError,
   } = usePackagingList();
   const {
      data: packagingItem,
      isLoading: isItemLoading,
      isError: isItemError,
   } = usePackagingItem(packagingId || "");

   const uploadDocMutation = useUploadPackagingDocument();
   const deleteDocMutation = useDeletePackagingDocument();
   const updateMutation = useUpdatePackaging();

   // Mock data for demonstration
   const mockPackagingData: PackagingItem[] = [
      {
         id: "1",
         name: "Kaffeetasse mit Deckel",
         internalCode: "SDF-12343",
         materials: ["PET-T", "PET-U", "PET-V"],
         status: "Aktiv",
         weight: "300g",
         ppwrLevel: "Stufe 1",
         conformityStatus: "Konform",
         creationDate: "2024-01-15",
         components: [
            {
               id: "c1",
               name: "Joghurtbecher",
               format: "Becher",
               weight: "300g",
               volume: "300g",
               ppwrCategory: "Kategorie 1",
               ppwrLevel: "Stufe A",
               type: "separat",
            },
            {
               id: "c2",
               name: "Platine",
               format: "Platine",
               weight: "300g",
               volume: "300g",
               ppwrCategory: "Kategorie 3",
               ppwrLevel: "",
               type: "integriert",
            },
            {
               id: "c3",
               name: "Deckel",
               format: "Stülpdeckel",
               weight: "300g",
               volume: "300g",
               ppwrCategory: "Kategorie 5",
               ppwrLevel: "Stufe A",
               type: "separat",
            },
         ],
         documents: [],
      },
      {
         id: "2",
         name: "Tee-Set aus Porzellan",
         internalCode: "SDF-12344",
         materials: ["PET-H", "PET-I", "PET-J"],
         status: "Entwurf",
         weight: "300g",
         ppwrLevel: "Stufe 2",
         conformityStatus: "Prüfung",
         creationDate: "2024-02-20",
         components: [],
         documents: [],
      },
      {
         id: "3",
         name: "Glasflasche mit Korken",
         internalCode: "SDF-12345",
         materials: ["PET-AL", "PET-AM", "PET-AN", "PET-AQ"],
         status: "Deaktiviert",
         weight: "300g",
         ppwrLevel: "Stufe 3",
         conformityStatus: "Nicht konform",
         creationDate: "2024-03-10",
         components: [],
         documents: [],
      },
   ];

   // Normalize backend data to UI format when available
   const normalizedData: PackagingItem[] | undefined = useMemo(() => {
      if (!Array.isArray(packagingList)) return undefined;
      return packagingList.map((item: any) => ({
         id: item.id,
         name: item.name,
         internalCode: item.internalCode,
         materials: item.materials || [],
         status: backendStatusToGerman[item.status] || item.status,
         weight: item.weight,
         ppwrLevel: item.ppwrLevel,
         conformityStatus: item.conformityStatus,
         creationDate: item.createdAt,
         components: (item.components || []).map((c: any) => ({
            id: c.id,
            name: c.name,
            format: c.format,
            weight: c.weight,
            volume: c.volume,
            ppwrCategory: c.ppwrCategory,
            ppwrLevel: c.ppwrLevel,
         })),
         documents: (item.documents || []).map((d: any) => ({
            id: d.id,
            name: d.name,
            type: d.type,
            fileUrl: d.fileUrl,
            fileSize: d.fileSize,
            uploadDate: d.uploadDate,
         })),
      }));
   }, [packagingList]);

   const data: PackagingItem[] = normalizedData || mockPackagingData;

   // Filter tab definitions (multilingual)
   const filterTabs = [
      { key: "all", label: "Alle", count: data?.length || 0 },
      {
         key: "active",
         label: "Aktiv",
         count: data?.filter((p: any) => p.status === "Aktiv").length || 0,
      },
      {
         key: "inactive",
         label: "Inaktiv",
         count: data?.filter((p: any) => p.status === "Inaktiv").length || 0,
      },
      {
         key: "draft",
         label: "Entwurf",
         count: data?.filter((p: any) => p.status === "Entwurf").length || 0,
      },
   ];

   // Filtered and sorted data
   const getFilteredData = () => {
      if (!Array.isArray(data)) return [];

      let filtered = data.filter((item: PackagingItem) => {
         const matchesSearch =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.internalCode.toLowerCase().includes(searchTerm.toLowerCase());

         let matchesTab = true;
         if (activeTab === "active") matchesTab = item.status === "Aktiv";
         else if (activeTab === "inactive")
            matchesTab = item.status === "Inaktiv";
         else if (activeTab === "draft") matchesTab = item.status === "Entwurf";

         const matchesStatus =
            statusFilter === "all" || item.status === statusFilter;
         const matchesMaterial =
            materialFilter === "all" ||
            item.materials.some((m: string) => m.includes(materialFilter));
         const matchesPpwr =
            ppwrFilter === "all" || item.ppwrLevel === ppwrFilter;
         const matchesConformity =
            conformityFilter === "all" ||
            item.conformityStatus === conformityFilter;

         return (
            matchesSearch &&
            matchesTab &&
            matchesStatus &&
            matchesMaterial &&
            matchesPpwr &&
            matchesConformity
         );
      });

      // Apply sorting
      if (sortBy) {
         filtered.sort((a, b) => {
            const aValRaw = a[sortBy as SortableKeys];
            const bValRaw = b[sortBy as SortableKeys];

            const aVal =
               typeof aValRaw === "string"
                  ? aValRaw.toLowerCase()
                  : String(aValRaw ?? "");
            const bVal =
               typeof bValRaw === "string"
                  ? bValRaw.toLowerCase()
                  : String(bValRaw ?? "");

            if (sortOrder === "asc") {
               return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            } else {
               return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
            }
         });
      }

      return filtered;
   };

   const filteredData = getFilteredData();

   // Pagination
   const itemsPerPage = 10;
   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
   const paginatedData = filteredData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
   );

   // Row expand/collapse
   const toggleRow = (id: string) => {
      const newExpanded = new Set(expandedRows);
      if (newExpanded.has(id)) {
         newExpanded.delete(id);
      } else {
         newExpanded.add(id);
      }
      setExpandedRows(newExpanded);
   };

   // Handlers
   const handleRowClick = (id: string) => {
      router.push({ pathname: "/dashboard/packaging", query: { id } });
   };

   const [isComponentsEditorOpen, setIsComponentsEditorOpen] = useState(false);
   const [editingComponents, setEditingComponents] = useState<
      PackagingComponentDraft[]
   >([]);

   const handleAddComponent = () => {
      setEditingComponents((prev) => [
         ...prev,
         {
            name: "",
            format: "",
            weight: "",
            volume: "",
            ppwrCategory: "",
            ppwrLevel: "",
            type: "separat",
            quantity: 1,
            supplier: "",
            manufacturingProcess: "",
            color: "",
            materials: [],
         },
      ]);
   };

   const handleSort = (column: string) => {
      const key = column as SortableKeys;
      if (sortBy === key) {
         setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
         setSortBy(key);
         setSortOrder("asc");
      }
   };

   const clearAllFilters = () => {
      setStatusFilter("all");
      setMaterialFilter("all");
      setPpwrFilter("all");
      setConformityFilter("all");
      setCreationDateFilter("all");
      setSearchTerm("");
   };

   const handleUploadDocument = async (
      id: string,
      file: File,
      type: "CONFORMITY_DECLARATION" | "TECHNICAL_DOCUMENTATION"
   ) => {
      await uploadDocMutation.mutateAsync({ id, file, type });
   };

   const handleDeleteDocument = async (documentId: string) => {
      await deleteDocMutation.mutateAsync(documentId);
   };

   // Render views
   const renderView = () => {
      // If creating new packaging, render create view
      if (isCreateOpen) {
         return (
            <PackagingCreateView
               t={t}
               onCancel={() => setIsCreateOpen(false)}
               onSaved={(createdId) => {
                  setIsCreateOpen(false);
                  router.replace("/dashboard/packaging");
               }}
            />
         );
      }

      // Render detail view
      if (isDetailView) {
         const normalizedItem = packagingItem
            ? {
                 id: packagingItem.id,
                 name: packagingItem.name,
                 internalCode: packagingItem.internalCode,
                 materials: packagingItem.materials || [],
                 status:
                    backendStatusToGerman[packagingItem.status] ||
                    packagingItem.status,
                 weight: packagingItem.weight,
                 ppwrLevel: packagingItem.ppwrLevel,
                 conformityStatus: (packagingItem as any).conformityStatus,
                 creationDate: (packagingItem as any).createdAt,
                 gtin: packagingItem.gtin,
                 assemblyCountries: packagingItem.assemblyCountries || [],
                 salesCountries: packagingItem.salesCountries || [],
                 components: (packagingItem.components || []).map((c: any) => ({
                    id: c.id,
                    name: c.name,
                    format: c.format,
                    weight: c.weight,
                    volume: c.volume,
                    ppwrCategory: c.ppwrCategory,
                    ppwrLevel: c.ppwrLevel,
                    type: c.type,
                    materials: c.materials,
                    quantity: c.quantity,
                    supplier: c.supplier,
                    manufacturingProcess: c.manufacturingProcess,
                    color: c.color,
                 })),
                 documents: (packagingItem.documents || []).map((d: any) => ({
                    id: d.id,
                    name: d.name,
                    type: d.type,
                    fileUrl: d.fileUrl,
                    fileSize: d.fileSize,
                    uploadDate: d.uploadDate,
                 })),
              }
            : undefined;

         const currentItem =
            normalizedItem || data?.find((item) => item.id === packagingId);
         if (isItemLoading) return <div>Loading...</div>;
         if (isItemError || !currentItem) return <div>Item not found</div>;

         // If in edit mode, render edit view
         if (isEditMode) {
            return (
               <PackagingEditView
                  t={t}
                  currentItem={currentItem}
                  onCancel={() => setIsEditMode(false)}
                  onSaved={(updatedId) => {
                     setIsEditMode(false);
                     router.replace("/dashboard/packaging");
                  }}
               />
            );
         }

         // Otherwise, render detail view
         return (
            <PackagingDetailView
               currentItem={currentItem}
               activeTab={activeTab}
               setActiveTab={setActiveTab}
               onBack={() => router.push("/dashboard/packaging")}
               onUploadDocument={handleUploadDocument}
               onDeleteDocument={handleDeleteDocument}
               onEditComponents={() => {
                  setEditingComponents(currentItem.components || []);
                  setIsComponentsEditorOpen(true);
               }}
               onEdit={() => setIsEditMode(true)}
               t={t} // Add translation function
            />
         );
      }

      // Render list view
      return (
         <div className="p-6 space-y-6">
            <PackagingHeader
               title={t("title")}
               onNewPackaging={() => setIsCreateOpen(true)}
               onExport={() => {}}
               searchTerm={searchTerm}
               onSearchChange={setSearchTerm}
               filterTabs={filterTabs}
               activeTab={activeTab}
               onTabChange={setActiveTab}
               t={t}
            />

            {isListLoading ? (
               <div>Loading...</div>
            ) : isListError ? (
               <div>Error loading data</div>
            ) : filteredData.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground border rounded-lg bg-muted/30">
                  <span className="text-2xl mb-2">🗂️</span>
                  <span className="font-medium text-lg mb-1">{t("empty")}</span>
                  <span className="text-sm">{t("emptyHint")}</span>
               </div>
            ) : (
               <PackagingTable
                  data={paginatedData}
                  expandedRows={expandedRows}
                  toggleRow={toggleRow}
                  onEdit={(item) => {
                     router.push({
                        pathname: "/dashboard/packaging",
                        query: { id: item.id },
                     });
                  }}
                  onRowClick={handleRowClick}
                  onEditComponents={(id) => {
                     router.push({
                        pathname: "/dashboard/packaging",
                        query: { id },
                     });
                     setActiveTab("bestandteile");
                  }}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={filteredData.length}
                  t={t}
               />
            )}

            {/* Components editor modal remains the same */}
            {isComponentsEditorOpen && (
               <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                  <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto p-6">
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">
                           {t("components.edit")}
                        </h2>
                        <button
                           onClick={() => setIsComponentsEditorOpen(false)}
                           className="text-gray-500 hover:text-gray-700"
                        >
                           ✕
                        </button>
                     </div>
                     <PackagingCreateComponentsForm
                        t={t}
                        components={editingComponents}
                        onAdd={handleAddComponent}
                        onRemove={(index) => {
                           setEditingComponents((prev) =>
                              prev.filter((_, i) => i !== index)
                           );
                        }}
                        onChange={(index, field, value) => {
                           setEditingComponents((prev) =>
                              prev.map((component, i) =>
                                 i === index
                                    ? { ...component, [field]: value }
                                    : component
                              )
                           );
                        }}
                        onMaterialChange={(
                           componentIndex,
                           materialIndex,
                           field,
                           value
                        ) => {
                           setEditingComponents((prev) =>
                              prev.map((component, i) => {
                                 if (i === componentIndex) {
                                    const updatedMaterials = [
                                       ...(component.materials || []),
                                    ];
                                    updatedMaterials[materialIndex] = {
                                       ...(updatedMaterials[materialIndex] ||
                                          {}),
                                       [field]: value,
                                    };
                                    return {
                                       ...component,
                                       materials: updatedMaterials,
                                    };
                                 }
                                 return component;
                              })
                           );
                        }}
                     />
                     <div className="flex justify-end mt-4 space-x-2">
                        <button
                           onClick={() => setIsComponentsEditorOpen(false)}
                           className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                        >
                           {t("actions.back")}
                        </button>
                        <button
                           onClick={async () => {
                              if (!packagingId) return;
                              const original = (packagingItem as any) || {};
                              const payload = {
                                 name: original.name,
                                 internalCode: original.internalCode,
                                 materials: original.materials || [],
                                 status: original.status || "DRAFT",
                                 weight: original.weight || "",
                                 ppwrLevel: original.ppwrLevel || "",
                                 components: editingComponents,
                              } as any;

                              try {
                                 await updateMutation.mutateAsync({
                                    id: packagingId,
                                    data: payload,
                                 });
                              } finally {
                                 setIsComponentsEditorOpen(false);
                              }
                           }}
                           className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                           {t("actions.savePackaging")}
                        </button>
                     </div>
                  </div>
               </div>
            )}
         </div>
      );
   };

   return renderView();
}
