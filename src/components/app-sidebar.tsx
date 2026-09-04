"use client";

import { 
  LogOut, 
  Settings, 
  SquareDashedBottom, 
  Atom, 
  Globe, 
  Variable, 
  BookOpen
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { BACKEND_URI } from "@/config/env";
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
      const response = await fetch(`${BACKEND_URI}/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
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
      className="border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 shadow-sm font-sans transition-colors duration-300"
    >
      {/* Brand Header */}
      <SidebarHeader className="p-4 border-b border-zinc-100 dark:border-zinc-900/60">
        <Link to="/" className="flex items-center space-x-2.5 group cursor-pointer">
          <div className="w-9 h-9 bg-zinc-900 dark:bg-zinc-100 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shadow-sm flex-shrink-0">
            <BookOpen className="h-4 w-4 text-white dark:text-black" />
          </div>
          <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 group-data-[collapsible=icon]:hidden">
            EduMentor
          </span>
        </Link>
      </SidebarHeader>

      {/* Navigation Sections */}
      <SidebarContent className="px-3 py-4 space-y-5">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-3 mb-2">
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
                      className={`w-full h-10 px-3.5 rounded-xl transition-all text-xs font-bold uppercase tracking-wider flex items-center gap-3 cursor-pointer ${
                        isActive
                          ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black shadow-sm"
                          : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                      }`}
                    >
                      <Link to={item.url}>
                        <item.icon className={`h-4 w-4 ${isActive ? "text-white dark:text-black" : "text-zinc-400"}`} />
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
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-3 mb-2">
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
                      className={`w-full h-10 px-3.5 rounded-xl transition-all text-xs font-bold uppercase tracking-wider flex items-center gap-3 cursor-pointer ${
                        isActive
                          ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black shadow-sm"
                          : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                      }`}
                    >
                      <Link to={item.url}>
                        <item.icon className={`h-4 w-4 ${isActive ? "text-white dark:text-black" : "text-zinc-400"}`} />
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

      {/* User Profile Footer */}
      <SidebarFooter className="p-3 border-t border-zinc-100 dark:border-zinc-900/60">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between w-full p-2 bg-[#fafafa] dark:bg-[#0b0b0e] rounded-xl border border-zinc-200 dark:border-zinc-800/80 shadow-sm transition-all group-data-[collapsible=icon]:justify-center">
              
              <div className="flex items-center gap-2.5 min-w-0 group-data-[collapsible=icon]:hidden">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
                  {username?.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200 truncate">
                    {username}
                  </span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate">
                    Student Workspace
                  </span>
                </div>
              </div>

              <button 
                onClick={handleLogout}
                className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors p-2 rounded-lg hover:bg-rose-500/10 text-zinc-400 cursor-pointer flex-shrink-0 active:scale-95"
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