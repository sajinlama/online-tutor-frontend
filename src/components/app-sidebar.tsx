"use client";

import { 
  LogOut, 
  Settings, 
  SquareDashedBottom, 
  Atom, 
  Globe, 
  Variable, 
  Sparkles 
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { VITE_BACKEND_URI } from "@/config/env";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const NAV_ITEMS = [
  { title: "Dashboard", url: "/home", icon: SquareDashedBottom },
  { title: "Settings", url: "/home/setting", icon: Settings },
];

const SUBJECTS = [
  { title: "Mathematics", url: "/home/quiz/maths", icon: Variable },
  { title: "Science", url: "/home/quiz/science", icon: Atom },
  { title: "English", url: "/home/quiz/english", icon: Globe },
];

export function AppSidebar() {
  const [username, setUsername] = useState("User");
  const location = useLocation();
  
  useEffect(() => {
    const storedUsername = localStorage.getItem("name");
    if (storedUsername) setUsername(storedUsername);
  }, []);

  const handleLogout = async () => {
  try {
    console.log(VITE_BACKEND_URI);
    const response = await fetch(`${VITE_BACKEND_URI}/api/logout`, {
      method: "POST",
      credentials: "include",
    });

    console.log("clicked in the logout");

    if (response.ok) {
      // success — clear storage and redirect
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("userId");
      window.location.href = "/";
    } else {
      console.error("Logout failed with status:", response.status);
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
};

  return (
    <Sidebar 
      collapsible="icon" 
      variant="floating" 
      className="border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl bg-white/70 dark:bg-zinc-950/60 shadow-lg font-sans transition-all duration-300"
    >
      {/* Brand Header */}
      <SidebarHeader className="p-4 border-b border-zinc-100 dark:border-zinc-900/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-500/20 flex-shrink-0">
            <Sparkles size={16} />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-extrabold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
              EduMentor
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Learning Suite
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* Navigation Sections */}
      <SidebarContent className="px-2 py-3 space-y-4">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-3 mb-1">
            Overview
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      tooltip={item.title}
                      className={`w-full h-10 px-3 rounded-xl transition-all font-medium text-xs flex items-center gap-3 cursor-pointer ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-semibold"
                          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
                      }`}
                    >
                      <Link to={item.url}>
                        <item.icon className={`h-4 w-4 ${isActive ? "text-white" : "text-zinc-400"}`} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Subjects Quiz Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-3 mb-1">
            Assessment Quizzes
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {SUBJECTS.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      tooltip={item.title}
                      className={`w-full h-10 px-3 rounded-xl transition-all font-medium text-xs flex items-center gap-3 cursor-pointer ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-semibold"
                          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
                      }`}
                    >
                      <Link to={item.url}>
                        <item.icon className={`h-4 w-4 ${isActive ? "text-white" : "text-zinc-400"}`} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Footer Card */}
      <SidebarFooter className="p-3 border-t border-zinc-100 dark:border-zinc-900/60">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between w-full p-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm transition-all group-data-[collapsible=icon]:justify-center">
              
              <div className="flex items-center gap-2.5 min-w-0 group-data-[collapsible=icon]:hidden">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-900/60 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {username?.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-xs text-zinc-800 dark:text-zinc-200 truncate">
                    {username}
                  </span>
                  <span className="text-[10px] text-zinc-400 truncate">
                    Student Account
                  </span>
                </div>
              </div>

              <button 
                onClick={handleLogout}
                className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors p-2 rounded-lg hover:bg-rose-500/10 text-zinc-400 cursor-pointer flex-shrink-0"
                aria-label="Log out"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
