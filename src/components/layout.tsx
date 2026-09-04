import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-[#fafafa] dark:bg-[#030303]">
        <AppSidebar />
        <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden">
          {/* Header Bar with Sidebar Trigger */}
          <div className="flex-shrink-0 flex items-center gap-3 p-4 border-b border-zinc-200/60 dark:border-zinc-900/80 bg-white/50 dark:bg-zinc-950/30 backdrop-blur-sm">
            <SidebarTrigger className="cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900 p-2 rounded-lg transition-colors" />
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Dashboard
            </span>
          </div>
          
          {/* Main Content Area - Takes remaining height */}
          <div className="flex-1 min-h-0 overflow-hidden relative">
            <div className="absolute inset-0 overflow-auto">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}