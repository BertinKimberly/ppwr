import React, { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import {
   ChevronDown,
   ChevronRight,
   LayoutDashboard,
   Package,
   Box,
   BarChart,
   Settings,
   Languages,
   LogOut,
   User,
   ChevronsUpDown,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
   DropdownMenuSub,
   DropdownMenuSubContent,
   DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/useAuthStore";

type MenuItemProps = {
   icon: React.ReactNode;
   label: string;
   href?: string;
   children?: MenuItemProps[];
};

export function Sidebar({
   isCollapsed,
   onToggleCollapse,
}: {
   isCollapsed: boolean;
   onToggleCollapse: () => void;
}) {
   const t = useTranslations("Sidebar");
   const { user } = useAuthStore();
   const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
   const router = useRouter();
   const pathname = usePathname();

   const menuItems: MenuItemProps[] = [
      {
         icon: <LayoutDashboard className="h-4 w-4" />,
         label: t("dashboard"),
         children: [
            { label: t("overview"), href: "/dashboard" },
            { label: t("analytics"), href: "/dashboard/analytics" },
         ],
      },
      {
         icon: <Package className="h-4 w-4" />,
         label: t("products"),
         children: [
            { label: t("productList"), href: "/dashboard/products" },
            { label: t("addProduct"), href: "/dashboard/products/add" },
         ],
      },
      {
         icon: <Box className="h-4 w-4" />,
         label: t("packaging"),
         children: [
            { label: t("packagingManagement"), href: "/dashboard/packaging" },
            { label: t("categories"), href: "/dashboard/packaging/categories" },
         ],
      },
      {
         icon: <BarChart className="h-4 w-4" />,
         label: t("reporting"),
         children: [
            { label: t("reports"), href: "/dashboard/reporting" },
            { label: t("exports"), href: "/dashboard/reporting/exports" },
         ],
      },
   ];

   const toggleMenuItem = (label: string) => {
      if (isCollapsed) return;
      setOpenMenus((prev) => ({
         ...prev,
         [label]: !prev[label],
      }));
   };

   const handleLanguageChange = (locale: string) => {
      const currentPath = pathname.replace(/^\/[a-z]{2}/, "") || "/dashboard";
      router.push(`/${locale}${currentPath}`);
   };

   const renderMenuItem = (item: MenuItemProps) => {
      const hasChildren = item.children && item.children.length > 0;
      const isOpen = openMenus[item.label];

      return (
         <div key={item.label}>
            <div
               className={`
                  flex items-center justify-between p-3 hover:bg-accent cursor-pointer rounded-lg
                  ${isCollapsed ? "justify-center " : "px-2"}
               `}
               onClick={() => toggleMenuItem(item.label)}
            >
               <div className="flex items-center space-x-3">
                  {item.icon}
                  {!isCollapsed && (
                     <span className="text-sm">{item.label}</span>
                  )}
               </div>
               {!isCollapsed && (
                  <div className="ml-auto">
                     {isOpen ? (
                        <ChevronDown className="h-4 w-4" />
                     ) : (
                        <ChevronRight className="h-4 w-4" />
                     )}
                  </div>
               )}
            </div>

            {!isCollapsed && hasChildren && isOpen && (
               <div className="bg-muted/30">
                  {item.children?.map((child) => (
                     <Link
                        key={child.label}
                        href={child.href || "#"}
                        className="block pl-11 pr-4 py-2.5 hover:bg-accent text-sm text-muted-foreground hover:text-foreground transition-colors"
                     >
                        {child.label}
                     </Link>
                  ))}
               </div>
            )}
         </div>
      );
   };

   return (
      <aside
         className={`
            bg-background border-r h-screen flex flex-col
            ${isCollapsed ? "w-16" : "w-64"}
            transition-all duration-300 ease-in-out p-4
         `}
      >
         {/* Logo/Title Section */}
         <div
            className={`
                 flex items-center h-16 p-2
               ${isCollapsed ? "justify-center" : "justify-start"}
            `}
         >
            {!isCollapsed && (
               <h1 className="text-xl font-bold text-foreground">PPWRify</h1>
            )}
            {isCollapsed && (
               <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">
                     P
                  </span>
               </div>
            )}
         </div>

         {/* Menu Items Section */}
         <nav className="flex-1 overflow-y-auto py-2">
            <div className="space-y-1">{menuItems.map(renderMenuItem)}</div>
         </nav>

         {/* User Profile Section */}
         <div className="border rounded-lg">
            {!isCollapsed ? (
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <div className="flex items-center p-4 hover:bg-accent cursor-pointer">
                        <div className="flex items-center space-x-3 flex-1">
                           <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-sm">
                                 {user?.fullName
                                    ? user.fullName.charAt(0).toUpperCase()
                                    : "OR"}
                              </AvatarFallback>
                           </Avatar>
                           <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-foreground truncate">
                                 {user?.fullName || "Olivia Rhye"}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                 {user?.email || "olivia@untitledui.com"}
                              </div>
                           </div>
                        </div>
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                     </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                     align="start"
                     className="w-56"
                  >
                     <DropdownMenuLabel>My Account</DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                     </DropdownMenuItem>
                     <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                     </DropdownMenuItem>
                     <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                           <Languages className="mr-2 h-4 w-4" />
                           <span>Language</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                           <DropdownMenuItem
                              onClick={() => handleLanguageChange("en")}
                           >
                              <span>🇺🇸 English</span>
                           </DropdownMenuItem>
                           <DropdownMenuItem
                              onClick={() => handleLanguageChange("de")}
                           >
                              <span>🇩🇪 Deutsch</span>
                           </DropdownMenuItem>
                        </DropdownMenuSubContent>
                     </DropdownMenuSub>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            ) : (
               <div className="p-4 flex justify-center">
                  <Avatar className="h-8 w-8">
                     <AvatarFallback className="text-sm">
                        {user?.fullName
                           ? user.fullName.charAt(0).toUpperCase()
                           : "OR"}
                     </AvatarFallback>
                  </Avatar>
               </div>
            )}
         </div>
      </aside>
   );
}
