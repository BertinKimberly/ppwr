import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const PackagingDetailInfoCard = ({ currentItem, t }: any) => {
   const getStatusColor = (status: string) => {
      switch (status) {
         case "Aktiv":
            return "bg-green-100 text-green-700 border-green-200";
         case "Inaktiv":
            return "bg-red-100 text-red-700 border-red-200";
         case "Entwurf":
            return "bg-blue-100 text-blue-700 border-blue-200";
         case "Deaktiviert":
            return "bg-red-100 text-red-700 border-red-200";
         default:
            return "bg-gray-100 text-gray-700 border-gray-200";
      }
   };

   return (
      <Card className="border-none shadow-none">
         <CardHeader>
            <CardTitle>{t("information.basic")}</CardTitle>
         </CardHeader>
         <CardContent className="border-none">
            <div className="grid grid-cols-2 gap-6">
               <div>
                  <Label>{t("information.name")}</Label>
                  <Input
                     value={currentItem.name}
                     className="mt-1"
                     readOnly
                  />
               </div>
               <div>
                  <Label>{t("information.internalCode")}</Label>
                  <Input
                     value={currentItem.internalCode}
                     className="mt-1"
                     readOnly
                  />
               </div>
               <div>
                  <Label>{t("information.gtin")}</Label>
                  <Input
                     value={currentItem.gtin || ""}
                     className="mt-1"
                     readOnly
                  />
               </div>
               <div>
                  <Label>{t("information.status")}</Label>
                  <div className="mt-1">
                     <Badge className={getStatusColor(currentItem.status)}>
                        {currentItem.status}
                     </Badge>
                  </div>
               </div>
               <div>
                  <Label>{t("information.weight")}</Label>
                  <Input
                     value={currentItem.weight || ""}
                     className="mt-1"
                     readOnly
                  />
               </div>
               <div>
                  <Label>{t("information.ppwrLevel")}</Label>
                  <div className="mt-1">
                     <Badge className="bg-green-100 text-green-700">
                        {currentItem.ppwrLevel || "-"}
                     </Badge>
                  </div>
               </div>
               <div>
                  <Label>{t("information.assemblyCountry")}</Label>
                  <div className="mt-1 flex flex-wrap gap-2 min-h-[40px] border rounded-md p-2">
                     {(currentItem.assemblyCountries || []).map(
                        (country: string) => (
                           <Badge
                              key={country}
                              variant="secondary"
                              className="flex items-center gap-1"
                           >
                              {country}
                           </Badge>
                        )
                     )}
                     {(currentItem.assemblyCountries || []).length === 0 && (
                        <span className="text-muted-foreground">-</span>
                     )}
                  </div>
               </div>
               <div>
                  <Label>{t("information.salesCountries")}</Label>
                  <div className="mt-1 flex flex-wrap gap-2 min-h-[40px] border rounded-md p-2">
                     {(currentItem.salesCountries || []).map(
                        (country: string) => (
                           <Badge
                              key={country}
                              variant="secondary"
                              className="flex items-center gap-1"
                           >
                              {country}
                           </Badge>
                        )
                     )}
                     {(currentItem.salesCountries || []).length === 0 && (
                        <span className="text-muted-foreground">-</span>
                     )}
                  </div>
               </div>
            </div>
         </CardContent>
      </Card>
   );
};

export default PackagingDetailInfoCard;
