import React from "react";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
   TableFooter,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
   ChevronDown,
   ChevronRight,
   MoreHorizontal,
   ArrowUpDown,
   ChevronLeft,
   ChevronRight as ChevronRightIcon,
} from "lucide-react";
import PackagingComponentsTable from "./PackagingComponentsTable";
import PackagingFilters from "./PackagingFilters";

interface PackagingTableItem {
   id: string;
   name: string;
   internalCode: string;
   materials?: string[];
   status: string;
   weight: string;
   ppwrLevel: string;
   components?: any[];
}

interface PackagingTableProps {
   data: PackagingTableItem[];
   expandedRows: Set<string>;
   toggleRow: (id: string) => void;
   onEdit: (item: any) => void;
   onRowClick: (id: string) => void;
   onEditComponents?: (id: string) => void;
   sortBy: string;
   sortOrder: "asc" | "desc";
   onSort: (column: string) => void;
   currentPage: number;
   totalPages: number;
   onPageChange: (page: number) => void;
   totalItems: number;
   t: (key: string) => string;
}

const PackagingTable: React.FC<PackagingTableProps> = ({
   data,
   expandedRows,
   toggleRow,
   onEdit,
   onRowClick,
   onEditComponents,
   sortBy,
   sortOrder,
   onSort,
   currentPage,
   totalPages,
   onPageChange,
   totalItems,
   t,
}) => {
   const [activeFilters, setActiveFilters] = React.useState<string[]>([]);

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

   const getSortIcon = (column: string) => {
      if (sortBy !== column) {
         return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
      }
      return (
         <ArrowUpDown
            className={`h-4 w-4 ${
               sortOrder === "asc"
                  ? "text-blue-600"
                  : "text-blue-600 rotate-180"
            }`}
         />
      );
   };

   const renderPagination = () => {
      const pages: (number | string)[] = [];

      // Always show first page
      pages.push(1);

      // Add ellipsis if current page is far from start
      if (currentPage > 4) {
         pages.push("...");
      }

      // Add pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
         if (!pages.includes(i)) {
            pages.push(i);
         }
      }

      // Add ellipsis if current page is far from end
      if (currentPage < totalPages - 3) {
         pages.push("...");
      }

      // Always show last page if it's not already included
      if (totalPages > 1 && !pages.includes(totalPages)) {
         pages.push(totalPages);
      }

      return (
         <div className="w-full flex items-center justify-end px-2">
            <div className="inline-flex items-center rounded-md border bg-background overflow-hidden divide-x">
               <button
                  className="h-8 px-3 inline-flex items-center gap-2 text-sm hover:bg-muted disabled:opacity-50"
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
               >
                  <ChevronLeft className="h-4 w-4" />
                  <span>{t("pagination.back")}</span>
               </button>

               {pages.map((page, index) => (
                  <React.Fragment key={index}>
                     {page === "..." ? (
                        <div className="h-8 px-3 flex items-center justify-center text-sm text-muted-foreground">
                           ...
                        </div>
                     ) : (
                        <button
                           className={`h-8 w-8 text-sm hover:bg-muted ${
                              currentPage === page ? "bg-muted font-medium" : ""
                           }`}
                           onClick={() => onPageChange(page as number)}
                        >
                           {page}
                        </button>
                     )}
                  </React.Fragment>
               ))}

               <button
                  className="h-8 px-3 inline-flex items-center gap-2 text-sm hover:bg-muted disabled:opacity-50"
                  onClick={() =>
                     onPageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage >= totalPages}
               >
                  <span>{t("pagination.next")}</span>
                  <ChevronRightIcon className="h-4 w-4" />
               </button>
            </div>
         </div>
      );
   };

   const handleAddFilter = (filterName: string) => {
      setActiveFilters((prev) =>
         prev.includes(filterName) ? prev : [...prev, filterName]
      );
   };

   const handleRemoveFilter = (filterName: string) => {
      setActiveFilters((prev) => prev.filter((f) => f !== filterName));
   };

   const handleClearAll = () => {
      setActiveFilters([]);
   };

   return (
      <div className="space-y-4">
         <div className="border rounded-lg">
            <PackagingFilters
               activeFilters={activeFilters}
               onAddFilter={handleAddFilter}
               onRemoveFilter={handleRemoveFilter}
               onClearAll={handleClearAll}
            />
            <Table>
               <TableHeader className="bg-muted p-4">
                  <TableRow>
                     <TableHead className="w-12"></TableHead>
                     <TableHead
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => onSort("name")}
                     >
                        <div className="flex items-center space-x-2">
                           <span>{t("table.name")}</span>
                           {getSortIcon("name")}
                        </div>
                     </TableHead>
                     <TableHead
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => onSort("internalCode")}
                     >
                        <div className="flex items-center space-x-2">
                           <span>{t("table.internalCode")}</span>
                           {getSortIcon("internalCode")}
                        </div>
                     </TableHead>
                     <TableHead>{t("table.materials")}</TableHead>
                     <TableHead
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => onSort("status")}
                     >
                        <div className="flex items-center space-x-2">
                           <span>{t("table.status")}</span>
                           {getSortIcon("status")}
                        </div>
                     </TableHead>
                     <TableHead
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => onSort("weight")}
                     >
                        <div className="flex items-center space-x-2">
                           <span>{t("table.weight")}</span>
                           {getSortIcon("weight")}
                        </div>
                     </TableHead>
                     <TableHead
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => onSort("ppwrLevel")}
                     >
                        <div className="flex items-center space-x-2">
                           <span>{t("table.ppwrLevel")}</span>
                           {getSortIcon("ppwrLevel")}
                        </div>
                     </TableHead>
                     <TableHead className="w-12"></TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {data.map((item) => (
                     <React.Fragment key={item.id}>
                        <TableRow
                           className="cursor-pointer hover:bg-muted/50"
                           onClick={() => onRowClick(item.id)}
                        >
                           <TableCell>
                              <Button
                                 variant="ghost"
                                 size="sm"
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    toggleRow(item.id);
                                 }}
                                 className="p-0 h-8 w-8"
                              >
                                 {expandedRows.has(item.id) ? (
                                    <ChevronDown className="h-4 w-4" />
                                 ) : (
                                    <ChevronRight className="h-4 w-4" />
                                 )}
                              </Button>
                           </TableCell>
                           <TableCell className="font-medium">
                              {item.name}
                           </TableCell>
                           <TableCell className="text-muted-foreground">
                              {item.internalCode}
                           </TableCell>
                           <TableCell>
                              <div className="flex flex-wrap gap-1">
                                 {(item.materials || [])
                                    .slice(0, 3)
                                    .map((material: string, idx: number) => (
                                       <Badge
                                          key={idx}
                                          variant="outline"
                                          className="text-xs"
                                       >
                                          {material}
                                       </Badge>
                                    ))}
                                 {item.materials &&
                                    item.materials.length > 3 && (
                                       <Badge
                                          variant="outline"
                                          className="text-xs"
                                       >
                                          +{item.materials.length - 3}
                                       </Badge>
                                    )}
                              </div>
                           </TableCell>
                           <TableCell>
                              <Badge
                                 className={`${getStatusColor(item.status)}`}
                              >
                                 {item.status}
                              </Badge>
                           </TableCell>
                           <TableCell>{item.weight}</TableCell>
                           <TableCell>
                              <Badge
                                 variant="outline"
                                 className="bg-green-50 text-green-700"
                              >
                                 {item.ppwrLevel}
                              </Badge>
                           </TableCell>
                           <TableCell>
                              <Button
                                 variant="ghost"
                                 size="sm"
                                 className="h-8 w-8 p-0"
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(item);
                                 }}
                              >
                                 <MoreHorizontal className="h-4 w-4" />
                              </Button>
                           </TableCell>
                        </TableRow>
                        {expandedRows.has(item.id) && item.components && (
                           <TableRow>
                              <TableCell
                                 colSpan={8}
                                 className="p-0 bg-gray-50"
                              >
                                 <PackagingComponentsTable
                                    components={item.components as any}
                                    onEditComponents={() =>
                                       onEditComponents?.(item.id)
                                    }
                                 />
                              </TableCell>
                           </TableRow>
                        )}
                     </React.Fragment>
                  ))}
               </TableBody>
               <TableFooter>
                  <TableRow>
                     <TableCell
                        colSpan={8}
                        className="py-3"
                     >
                        <div className="flex items-center justify-end">
                           {renderPagination()}
                        </div>
                     </TableCell>
                  </TableRow>
               </TableFooter>
            </Table>
         </div>
      </div>
   );
};

export default PackagingTable;
