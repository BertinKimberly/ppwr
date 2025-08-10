"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Trash2 } from "lucide-react";
import {
   useUpdatePackaging,
   useUploadPackagingDocument,
} from "@/hooks/usePackaging";
import PackagingCreateInfoForm, {
   PackagingCreateInfoValues,
} from "./PackagingCreateInfoForm";
import PackagingCreateComponentsForm, {
   PackagingComponentDraft,
   MaterialLayer,
} from "./PackagingCreateComponentsForm";
import PackagingCreateDocuments, {
   DocumentType,
} from "./PackagingCreateDocuments";

interface PackagingEditViewProps {
   t: (key: string) => string;
   currentItem: any;
   onCancel: () => void;
   onSaved: (updatedId: string) => void;
}

const PackagingEditView: React.FC<PackagingEditViewProps> = ({
   t,
   currentItem,
   onCancel,
   onSaved,
}) => {
   const [activeTab, setActiveTab] = useState("informationen");

   const [infoValues, setInfoValues] = useState<PackagingCreateInfoValues>({
      name: currentItem.name || "",
      internalCode: currentItem.internalCode || "",
      gtin: currentItem.gtin || "",
      weight: currentItem.weight || "",
      ppwrLevel: currentItem.ppwrLevel || "",
      materialsInput: (currentItem.materials || []).join(", "),
      assemblyCountries: currentItem.assemblyCountries || [],
      salesCountries: currentItem.salesCountries || [],
   });

   const [components, setComponents] = useState<PackagingComponentDraft[]>(
      currentItem.components?.map((c: any) => ({
         name: c.name || "",
         format: c.format || "",
         weight: c.weight || "",
         volume: c.volume || "",
         ppwrCategory: c.ppwrCategory || "",
         ppwrLevel: c.ppwrLevel || "",
         type: c.type || "separat",
         quantity: c.quantity || 1,
         supplier: c.supplier || "",
         manufacturingProcess: c.manufacturingProcess || "",
         color: c.color || "",
         materials: c.materials || [],
      })) || []
   );

   const [docFiles, setDocFiles] = useState<{ [K in DocumentType]?: File[] }>(
      {}
   );

   const updateMutation = useUpdatePackaging();
   const uploadDocMutation = useUploadPackagingDocument();

   const handleInfoChange = (
      field: keyof PackagingCreateInfoValues,
      value: string
   ) => {
      setInfoValues((prev) => ({ ...prev, [field]: value }));
   };

   const handleCountriesChange = (
      field: "assemblyCountries" | "salesCountries",
      countries: string[]
   ) => {
      setInfoValues((prev) => ({ ...prev, [field]: countries }));
   };

   const handleAddComponent = () => {
      setComponents((prev) => [
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

   const handleRemoveComponent = (index: number) => {
      setComponents((prev) => prev.filter((_, i) => i !== index));
   };

   const handleChangeComponent = (
      index: number,
      field: keyof PackagingComponentDraft,
      value: string | number
   ) => {
      setComponents((prev) =>
         prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
      );
   };

   const handleChangeMaterial = (
      componentIndex: number,
      materialIndex: number,
      field: keyof MaterialLayer,
      value: string
   ) => {
      setComponents((prev) =>
         prev.map((component, i) => {
            if (i === componentIndex) {
               const updatedMaterials = [...(component.materials || [])];
               updatedMaterials[materialIndex] = {
                  ...(updatedMaterials[materialIndex] || {}),
                  [field]: value,
               };
               return { ...component, materials: updatedMaterials };
            }
            return component;
         })
      );
   };

   const handleSave = async () => {
      const payload = {
         name: infoValues.name,
         internalCode: infoValues.internalCode,
         gtin: infoValues.gtin,
         materials: infoValues.materialsInput
            .split(",")
            .map((m) => m.trim())
            .filter(Boolean),
         status: currentItem.status || "DRAFT",
         weight: infoValues.weight,
         ppwrLevel: infoValues.ppwrLevel,
         assemblyCountries: infoValues.assemblyCountries,
         salesCountries: infoValues.salesCountries,
         components,
      };

      const res = await updateMutation.mutateAsync({
         id: currentItem.id,
         data: payload as any,
      });
      const updatedId = (res as any)?.data?.data?.id;

      if (updatedId) {
         // Upload documents if any
         const uploadPromises = Object.entries(docFiles).map(([type, files]) =>
            Promise.all(
               files.map((file) =>
                  uploadDocMutation.mutateAsync({
                     id: updatedId,
                     file,
                     type,
                  })
               )
            )
         );

         await Promise.all(uploadPromises);
         onSaved(updatedId);
      } else {
         onCancel();
      }
   };

   const availableProducts = [
      { id: "P00011", name: "Erdbeere Joghurt", status: "Öffnen" },
      { id: "P00012", name: "Erdbeere Joghurt", status: "Öffnen" },
      { id: "P00013", name: "Erdbeere Joghurt", status: "Öffnen" },
   ];

   // Calculate document count for badge
   const documentCount = Object.values(docFiles).reduce(
      (total, files) => total + (files?.length || 0),
      0
   );

   return (
      <div className="flex h-screen">
         {/* Left Section - Main Content */}
         <div className="flex-1 flex flex-col">
            <div className="p-6 space-y-6">
               <div className="flex items-center justify-between">
                  <div>
                     <h1 className="text-2xl font-semibold">{t("title")}</h1>
                     <p className="text-muted-foreground">
                        ID: {currentItem.internalCode}
                     </p>
                  </div>
                  <div className="flex items-center gap-2">
                     <Button onClick={handleSave}>
                        {t("actions.savePackaging")}
                     </Button>
                  </div>
               </div>

               <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="flex-1"
               >
                  <div className="relative">
                     <TabsList className="bg-transparent border-0 py-2 h-auto space-x-8">
                        <TabsTrigger
                           value="informationen"
                           className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none border-0 p-0 pb-4 relative data-[state=active]:text-primary text-muted-foreground font-normal data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary data-[state=active]:after:content-['']"
                        >
                           {t("tabs.information")}
                        </TabsTrigger>
                        <TabsTrigger
                           value="bestandteile"
                           className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none border-0 p-0 pb-4 relative data-[state=active]:text-primary text-muted-foreground font-normal data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary data-[state=active]:after:content-['']"
                        >
                           {t("tabs.components")}
                        </TabsTrigger>
                        <TabsTrigger
                           value="dokumente"
                           className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none border-0 p-0 pb-4 relative data-[state=active]:text-primary text-muted-foreground font-normal data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary data-[state=active]:after:content-[''] flex items-center gap-2"
                        >
                           {t("tabs.documents")}
                           {documentCount > 0 && (
                              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-primary rounded-full">
                                 {documentCount}
                              </span>
                           )}
                        </TabsTrigger>
                     </TabsList>

                     {/* Full width line below tabs */}
                     <div className="absolute bottom-0 left-0 right-0 h-px bg-border"></div>
                  </div>

                  <TabsContent
                     value="informationen"
                     className="space-y-6 mt-6"
                  >
                     <PackagingCreateInfoForm
                        t={t}
                        values={infoValues}
                        onChange={handleInfoChange}
                        onCountriesChange={handleCountriesChange}
                     />
                  </TabsContent>

                  <TabsContent
                     value="bestandteile"
                     className="space-y-6 mt-6"
                  >
                     <PackagingCreateComponentsForm
                        t={t}
                        components={components}
                        onAdd={handleAddComponent}
                        onRemove={handleRemoveComponent}
                        onChange={handleChangeComponent}
                        onMaterialChange={handleChangeMaterial}
                     />
                  </TabsContent>

                  <TabsContent
                     value="dokumente"
                     className="space-y-6 mt-6"
                  >
                     <PackagingCreateDocuments
                        onChange={(type, files) =>
                           setDocFiles((prev) => ({ ...prev, [type]: files }))
                        }
                        initialConformity={currentItem.documents?.filter(
                           (d: any) => d.type === "CONFORMITY_DECLARATION"
                        )}
                        initialTechnical={currentItem.documents?.filter(
                           (d: any) => d.type === "TECHNICAL_DOCUMENTATION"
                        )}
                     />
                  </TabsContent>
               </Tabs>
            </div>
         </div>

         {/* Right Section - Products (only show on info tab) */}
         {activeTab === "informationen" && (
            <div className="w-80 border-l bg-[#DBD6D6] -mt-8 self-stretch lg:-mr-8">
               <Card className="h-full rounded-none border-0 shadow-none bg-[#DBD6D6]">
                  <CardHeader className="border-b bg-[#DBD6D6]">
                     <CardTitle>Produkte zuweisen</CardTitle>
                     <p className="text-sm text-muted-foreground">
                        Weisen Sie der Verpackung verschiedene Produkte zu.
                     </p>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4 bg-[#DBD6D6]">
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                           placeholder="Suche"
                           className="pl-10"
                        />
                     </div>

                     <div className="space-y-2">
                        {availableProducts.map((product) => (
                           <div
                              key={product.id}
                              className="flex items-center justify-between p-3 border rounded-md bg-white"
                           >
                              <div>
                                 <p className="font-medium text-sm">
                                    {product.name}
                                 </p>
                                 <p className="text-xs text-muted-foreground">
                                    {product.id}
                                 </p>
                              </div>
                              <div className="flex items-center gap-2">
                                 <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-blue-600 border-blue-200 text-xs"
                                 >
                                    {product.status}
                                 </Button>
                                 <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 p-1"
                                 >
                                    <Trash2 className="h-4 w-4" />
                                 </Button>
                              </div>
                           </div>
                        ))}
                     </div>

                     <Button className="w-full mt-4 bg-white text-black">
                        Produkt hinzufügen
                     </Button>
                  </CardContent>
               </Card>
            </div>
         )}
      </div>
   );
};

export default PackagingEditView;
