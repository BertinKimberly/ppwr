import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface PackagingFiltersProps {
   activeFilters?: string[];
   onAddFilter: (filterName: string) => void;
   onRemoveFilter: (filterName: string) => void;
   onClearAll: () => void;
}

const PackagingFilters: React.FC<PackagingFiltersProps> = ({
   activeFilters = [],
   onAddFilter,
   onRemoveFilter,
   onClearAll,
}) => {
   const t = useTranslations("Packaging");

   const availableFilters = [
      { key: "material", label: t("filters.material") },
      { key: "ppwrLevel", label: t("filters.ppwrLevel") },
      { key: "status", label: t("filters.status") },
      {
         key: "conformityDeclaration",
         label: t("filters.conformityDeclaration"),
      },
      { key: "creationDate", label: t("filters.creationDate") },
   ];

   return (
      <div className="flex items-center justify-between  border-b p-6">
         {/* Filter buttons */}
         <div className="flex items-center gap-2 flex-wrap">
            {availableFilters.map((filter) => {
               const isActive = activeFilters.includes(filter.key);
               return (
                  <Button
                     key={filter.key}
                     variant="outline"
                     size="sm"
                     className={`h-8 rounded-lg px-3 font-normal ${
                        isActive ? "bg-muted" : ""
                     }`}
                     onClick={() =>
                        isActive
                           ? onRemoveFilter(filter.key)
                           : onAddFilter(filter.key)
                     }
                  >
                     {!isActive && <Plus className="h-3 w-3 mr-1" />}
                     {filter.label}
                     {isActive && <X className="h-3 w-3 ml-1 cursor-pointer" />}
                  </Button>
               );
            })}

            {/* Remove all filters link */}
            {activeFilters.length > 0 && (
               <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-muted-foreground hover:text-foreground px-2"
                  onClick={onClearAll}
               >
                  {t("filters.removeAll")}
               </Button>
            )}
         </div>

         {/* "Ansicht" (View) button */}
         <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-md"
         >
            {t("actions.view")}
         </Button>
      </div>
   );
};

export default PackagingFilters;
