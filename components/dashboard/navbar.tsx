import React from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ChevronRight, ArrowLeft, Menu, PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardNavbar({
   isCollapsed,
   onToggleCollapse,
}: {
   isCollapsed: boolean;
   onToggleCollapse: () => void;
}) {
   const pathname = usePathname();
   const t = useTranslations("Breadcrumbs");

   // Clean pathname by removing locale prefix and 'dashboard' prefix
   const cleanPathname = pathname.replace(/^\/[a-z]{2}\/dashboard/, "") || "/";

   // Generate breadcrumbs based on clean pathname
   const segments = cleanPathname.split("/").filter(Boolean);
   const breadcrumbs =
      segments.length === 0
         ? [
              {
                 label: t("dashboard"),
                 href: "/dashboard",
                 isLast: true,
              },
           ]
         : segments.map((segment: string, index: number) => {
              const href = "/" + segments.slice(0, index + 1).join("/");
              return {
                 label:
                    t(segment) ||
                    segment.charAt(0).toUpperCase() + segment.slice(1),
                 href,
                 isLast: index === segments.length - 1,
              };
           });

   // Determine if back button should be shown (not on root and has more than one segment)
   const showBackButton = cleanPathname !== "/" && segments.length > 1;

   return (
      <nav className="w-full bg-background border-b h-16 px-6 flex items-center justify-between">
         <div className="flex items-center space-x-4">
            {/* Sidebar Toggle */}
            <Button
               variant="ghost"
               size="icon"
               onClick={onToggleCollapse}
               className="h-9 w-9"
            >
               {isCollapsed ? (
                  <Menu className="h-5 w-5" />
               ) : (
                  <PanelLeftClose className="h-5 w-5" />
               )}
            </Button>

            {/* Back Button (only show on nested pages) */}
            {showBackButton && (
               <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-9 rounded-md border-primary/20 hover:bg-primary/5"
               >
                  <Link href="/dashboard">
                     <ArrowLeft className="h-4 w-4 mr-2 text-primary" />
                     {t("actions.back")}
                  </Link>
               </Button>
            )}

            {/* Breadcrumbs */}
            {breadcrumbs.length > 0 && (
               <nav className="flex items-center space-x-1 text-sm">
                  {breadcrumbs.map((crumb, index) => (
                     <div
                        key={crumb.href}
                        className="flex items-center"
                     >
                        {index > 0 && (
                           <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
                        )}
                        {crumb.isLast ? (
                           <span className="text-foreground font-medium">
                              {crumb.label}
                           </span>
                        ) : (
                           <Link
                              href={crumb.href}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                           >
                              {crumb.label}
                           </Link>
                        )}
                     </div>
                  ))}
               </nav>
            )}
         </div>

         {/* Right side - can be used for additional navigation items */}
         <div className="flex items-center space-x-2">
            {/* Add any additional navbar items here */}
         </div>
      </nav>
   );
}
