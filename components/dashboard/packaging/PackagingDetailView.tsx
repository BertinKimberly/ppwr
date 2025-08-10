import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import PackagingDetailInfoCard from "./PackagingDetailInfoCard";
import PackagingDetailComponentsTable from "./PackagingDetailComponentsTable";

interface PackagingDetailViewProps {
   currentItem: any;
   activeTab: string;
   setActiveTab: (tab: string) => void;
   onBack: () => void;
   onUploadDocument?: (
      id: string,
      file: File,
      type: "CONFORMITY_DECLARATION" | "TECHNICAL_DOCUMENTATION"
   ) => Promise<void>;
   onDeleteDocument?: (documentId: string) => Promise<void>;
   onEditComponents?: () => void;
   onEdit?: () => void;
   t: (key: string) => string;
}

const PackagingDetailView: React.FC<PackagingDetailViewProps> = ({
   currentItem,
   activeTab,
   setActiveTab,
   onBack,
   onUploadDocument,
   onDeleteDocument,
   onEditComponents,
   onEdit,
   t,
}) => {
   const handleFileChange = async (
      e: React.ChangeEvent<HTMLInputElement>,
      type: "CONFORMITY_DECLARATION" | "TECHNICAL_DOCUMENTATION"
   ) => {
      const file = e.target.files?.[0];
      if (!file || !onUploadDocument) return;

      try {
         await onUploadDocument(currentItem.id, file, type);
         e.currentTarget.value = "";
      } catch (error) {
         console.error("Document upload failed", error);
      }
   };

   // Calculate document count for badge
   const documentCount = currentItem.documents?.length || 0;

   return (
      <div className="flex h-screen">
         {/* Left Section - Main Content */}
         <div className="flex-1 flex flex-col">
            <div className="p-6 space-y-6">
               <div className="flex items-center justify-between">
                  <div>
                     <div className="flex items-center space-x-4">
                        <Button
                           variant="ghost"
                           size="sm"
                           onClick={onBack}
                        >
                           <ArrowLeft className="h-4 w-4 mr-2" />
                           {t("actions.back")}
                        </Button>
                        <div>
                           <h1 className="text-2xl font-semibold">
                              {currentItem.name}
                           </h1>
                           <p className="text-muted-foreground mt-1">
                              {t("information.internalCode")}:{" "}
                              {currentItem.internalCode}
                           </p>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <Button onClick={onEdit}>{t("actions.edit")}</Button>
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
                     <PackagingDetailInfoCard
                        currentItem={currentItem}
                        t={t}
                     />
                  </TabsContent>

                  <TabsContent
                     value="bestandteile"
                     className="space-y-6 mt-6"
                  >
                     <PackagingDetailComponentsTable
                        components={currentItem.components || []}
                        t={t}
                        onEditComponents={onEditComponents}
                     />
                  </TabsContent>

                  <TabsContent
                     value="dokumente"
                     className="space-y-6 mt-6"
                  >
                     <Card>
                        <CardHeader>
                           <CardTitle>{t("tabs.documents")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                           {!currentItem.documents ||
                           currentItem.documents.length === 0 ? (
                              <div className="text-center py-8 text-muted-foreground">
                                 <p>{t("documents.noDocuments")}</p>
                              </div>
                           ) : (
                              <div className="space-y-2">
                                 {currentItem.documents.map((doc: any) => (
                                    <div
                                       key={doc.id}
                                       className="flex items-center justify-between border rounded-md px-3 py-2"
                                    >
                                       <div className="flex items-center gap-3">
                                          <a
                                             href={doc.fileUrl}
                                             target="_blank"
                                             rel="noopener noreferrer"
                                             className="text-blue-600 hover:underline"
                                          >
                                             {doc.name}
                                          </a>
                                          <span className="text-xs text-muted-foreground">
                                             {(doc.fileSize / 1024).toFixed(0)}{" "}
                                             KB
                                          </span>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           )}
                        </CardContent>
                     </Card>
                  </TabsContent>
               </Tabs>
            </div>
         </div>

         {/* Right Section - Products (only show on info tab) */}
         {activeTab === "informationen" && (
            <div className="w-80 border-l bg-[#DBD6D6] -mt-8 self-stretch lg:-mr-8">
               <Card className="h-full rounded-none border-0 shadow-none bg-[#DBD6D6]">
                  <CardHeader className="border-b bg-[#DBD6D6]">
                     <CardTitle>{t("products.assign")}</CardTitle>
                     <p className="text-sm text-muted-foreground">
                        {t("products.assignDescription")}
                     </p>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4 bg-[#DBD6D6]">
                     <div className="space-y-2">
                        {/* Placeholder for assigned products */}
                        <div className="text-center text-muted-foreground">
                           {t("products.noProductsAssigned")}
                        </div>
                     </div>

                     <Button className="w-full mt-4 bg-white text-black">
                        {t("products.addProduct")}
                     </Button>
                  </CardContent>
               </Card>
            </div>
         )}
      </div>
   );
};

export default PackagingDetailView;
