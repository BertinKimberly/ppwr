"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardNavbar } from "@/components/dashboard/navbar";

export default function DashboardLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   const [isCollapsed, setIsCollapsed] = useState(false);

   const toggleSidebar = () => {
      setIsCollapsed(!isCollapsed);
   };

   return (
      <div className="flex h-screen">
         {/* Sidebar - Fixed positioning */}
         <div className={`fixed left-0 top-0 h-full z-40 ${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
            <Sidebar
               isCollapsed={isCollapsed}
               onToggleCollapse={toggleSidebar}
            />
         </div>
         
         {/* Main Content Area - Adjusted for sidebar */}
         <div className={`flex-1 flex flex-col ${isCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
            {/* Navbar - Full width of remaining space */}
            <DashboardNavbar
               isCollapsed={isCollapsed}
               onToggleCollapse={toggleSidebar}
            />
            
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6">
               <div className="w-full mx-auto">
                  {children}
               </div>
            </main>
         </div>
      </div>
   );
}