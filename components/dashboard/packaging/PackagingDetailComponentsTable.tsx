import React from "react";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface Component {
   id: string;
   name: string;
   format: string;
   weight: string;
   volume: string;
   ppwrCategory: string;
   ppwrLevel: string;
   type?: string;
   materials?: any[];
   quantity?: number;
   supplier?: string;
   manufacturingProcess?: string;
   color?: string;
}

interface PackagingDetailComponentsTableProps {
   components: Component[];
   onEditComponents?: () => void;
   t: (key: string) => string;
}

const PackagingDetailComponentsTable: React.FC<
   PackagingDetailComponentsTableProps
> = ({ components, onEditComponents, t }) => {
   const getComponentIcon = (name: string, type?: string) => {
      if (
         name.toLowerCase().includes("joghurt") ||
         name.toLowerCase().includes("becher")
      ) {
         return "🥤";
      }
      if (name.toLowerCase().includes("platine")) {
         return "🔧";
      }
      if (name.toLowerCase().includes("deckel")) {
         return "⚪";
      }
      return type === "separat" ? "🔵" : "🔶";
   };

   const getPpwrBadgeColor = (level: string) => {
      if (!level) return "bg-gray-100 text-gray-700";
      return "bg-green-100 text-green-700";
   };

   if (!components || components.length === 0) {
      return (
         <div className="bg-gray-50 border-t p-8 text-center text-muted-foreground">
            <p>{t("components.noComponents")}</p>
         </div>
      );
   }

   return (
      <div className="bg-gray-50 border-t">
         <div className="p-4">
            <div className="flex items-center justify-between mb-4">
               <h4 className="text-sm font-medium text-gray-900">
                  {t("tabs.components")}
               </h4>
               {onEditComponents && (
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={onEditComponents}
                  >
                     {t("components.edit")}
                  </Button>
               )}
            </div>

            <div className="bg-white rounded-lg border">
               <Table>
                  <TableHeader>
                     <TableRow className="bg-gray-50">
                        <TableHead className="text-xs font-medium text-gray-500">
                           {t("components.name")}
                        </TableHead>
                        <TableHead className="text-xs font-medium text-gray-500">
                           {t("components.format")}
                        </TableHead>
                        <TableHead className="text-xs font-medium text-gray-500">
                           {t("components.weight")}
                        </TableHead>
                        <TableHead className="text-xs font-medium text-gray-500">
                           {t("components.volume")}
                        </TableHead>
                        <TableHead className="text-xs font-medium text-gray-500">
                           {t("components.quantity")}
                        </TableHead>
                        <TableHead className="text-xs font-medium text-gray-500">
                           {t("components.supplier")}
                        </TableHead>
                        <TableHead className="text-xs font-medium text-gray-500">
                           {t("components.manufacturingProcess")}
                        </TableHead>
                        <TableHead className="text-xs font-medium text-gray-500">
                           {t("components.color")}
                        </TableHead>
                        <TableHead className="text-xs font-medium text-gray-500">
                           {t("components.ppwrCategory")}
                        </TableHead>
                        <TableHead className="text-xs font-medium text-gray-500">
                           {t("components.ppwrLevel")}
                        </TableHead>
                        <TableHead className="w-12"></TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {components.map((component) => (
                        <TableRow
                           key={component.id}
                           className="hover:bg-gray-50"
                        >
                           <TableCell className="py-3">
                              <div className="flex items-center space-x-3">
                                 <div className="flex-shrink-0">
                                    <span className="text-lg">
                                       {getComponentIcon(
                                          component.name,
                                          component.type
                                       )}
                                    </span>
                                 </div>
                                 <div>
                                    <div className="text-sm font-medium text-gray-900">
                                       {component.name}
                                    </div>
                                    <div className="text-xs text-gray-500 capitalize">
                                       {component.type || "-"}
                                    </div>
                                 </div>
                              </div>
                           </TableCell>
                           <TableCell className="py-3 text-sm text-gray-900">
                              {component.format}
                           </TableCell>
                           <TableCell className="py-3 text-sm text-gray-900">
                              {component.weight}
                           </TableCell>
                           <TableCell className="py-3 text-sm text-gray-900">
                              {component.volume}
                           </TableCell>
                           <TableCell className="py-3 text-sm text-gray-900">
                              {component.quantity ?? "-"}
                           </TableCell>
                           <TableCell className="py-3 text-sm text-gray-900">
                              {component.supplier || "-"}
                           </TableCell>
                           <TableCell className="py-3 text-sm text-gray-900">
                              {component.manufacturingProcess || "-"}
                           </TableCell>
                           <TableCell className="py-3 text-sm text-gray-900">
                              {component.color || "-"}
                           </TableCell>
                           <TableCell className="py-3">
                              <Badge
                                 variant="outline"
                                 className="text-xs"
                              >
                                 {component.ppwrCategory}
                              </Badge>
                           </TableCell>
                           <TableCell className="py-3">
                              {component.ppwrLevel ? (
                                 <Badge
                                    className={`text-xs ${getPpwrBadgeColor(
                                       component.ppwrLevel
                                    )}`}
                                 >
                                    {component.ppwrLevel}
                                 </Badge>
                              ) : (
                                 <span className="text-xs text-gray-400">
                                    -
                                 </span>
                              )}
                           </TableCell>
                           <TableCell className="py-3">
                              <Button
                                 variant="ghost"
                                 size="sm"
                                 className="h-8 w-8 p-0"
                              >
                                 <MoreHorizontal className="h-4 w-4" />
                              </Button>
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </div>
         </div>
      </div>
   );
};

export default PackagingDetailComponentsTable;
