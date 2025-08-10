import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface FilterTab {
   key: string;
   label: string;
   count?: number;
}

interface PackagingHeaderProps {
   title: string;
   onNewPackaging: () => void;
   onExport: () => void;
   searchTerm: string;
   onSearchChange: (val: string) => void;
   filterTabs: FilterTab[];
   activeTab: string;
   onTabChange: (key: string) => void;
   t: (key: string) => string;
}

const PackagingHeader: React.FC<PackagingHeaderProps> = ({
   title,
   onNewPackaging,
   onExport,
   searchTerm,
   onSearchChange,
   filterTabs,
   activeTab,
   onTabChange,
   t,
}) => (
   <div className="w-full">
      <div className="flex items-center justify-between gap-4">
         <h1 className="text-2xl font-semibold whitespace-nowrap">{title}</h1>
         <div className="flex items-center gap-3">
            <Button
               variant="outline"
               className="rounded-lg px-5 py-2 text-base font-medium"
               onClick={onExport}
            >
               {t("actions.export")}
            </Button>
            <Button
               onClick={onNewPackaging}
               className="rounded-lg px-5 py-2 text-base font-medium bg-primary text-white hover:bg-primary/90"
            >
               {t("actions.newPackaging")}
            </Button>
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input
                  placeholder={t("search.placeholder")}
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 w-64 h-10 rounded-lg text-base"
               />
               <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  ⌘K
               </span>
            </div>
         </div>
      </div>
      <div className="flex items-center gap-2 mt-4 border-b border-muted pb-1">
         {filterTabs.map((tab) => (
            <button
               key={tab.key}
               onClick={() => onTabChange(tab.key)}
               className={`relative px-3 py-1 text-base font-medium rounded-full transition-colors
            ${
               activeTab === tab.key
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-muted-foreground hover:bg-muted"
            }
          `}
               style={{ outline: "none", border: "none", background: "none" }}
            >
               {tab.label}
               {typeof tab.count === "number" && (
                  <span
                     className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                        activeTab === tab.key
                           ? "bg-primary/10 text-primary"
                           : "bg-muted text-muted-foreground"
                     }`}
                  >
                     {tab.count}
                  </span>
               )}
               {activeTab === tab.key && (
                  <span className="absolute left-0 right-0 -bottom-[2px] h-0.5 bg-primary rounded-full" />
               )}
            </button>
         ))}
      </div>
   </div>
);

export default PackagingHeader;
