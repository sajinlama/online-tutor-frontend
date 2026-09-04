"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { VITE_BACKEND_URI } from "@/config/env";
import { 
  Save, Moon, Sun, LogOut, User, Lock, Paintbrush, 
  ShieldAlert, AlertCircle, CheckCircle2, Sparkles, BookOpen 
} from "lucide-react";
import { useTheme } from "@/contexapi/themeprovider";

const API_ENDPOINTS = {
  CHANGE_PASSWORD: `${VITE_BACKEND_URI}/api/v1/profile/update-password`,
  UPDATE_PROFILE: `${VITE_BACKEND_URI}/api/v1/profile/update-profile`,
};

export default function Setting() {
  const [user, setUser] = useState({ name: "", email: "", userId: "" });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newName, setNewName] = useState("");
  
  const [passwordAlert, setPasswordAlert] = useState({ show: false, message: "", type: "" });
  const [profileAlert, setProfileAlert] = useState({ show: false, message: "", type: "" });
  
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const username = localStorage.getItem("name") || "Student";
    const userEmail = localStorage.getItem("email") || "student@edumentor.com";
    const userId = localStorage.getItem("userId") || "";
    
    setUser({ name: username, email: userEmail, userId });
    setNewName(username);
  }, []);

  useEffect(() => {
    if (profileAlert.show) {
      const t = setTimeout(() => setProfileAlert(p => ({ ...p, show: false })), 3000);
      return () => clearTimeout(t);
    }
  }, [profileAlert.show]);

  useEffect(() => {
    if (passwordAlert.show) {
      const t = setTimeout(() => setPasswordAlert(p => ({ ...p, show: false })), 3000);
      return () => clearTimeout(t);
    }
  }, [passwordAlert.show]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordAlert({ show: true, message: "New passwords do not match.", type: "error" });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordAlert({ show: true, message: "Password must be at least 8 characters long.", type: "error" });
      return;
    }
    
    setIsUpdatingPassword(true);
    try {
      await axios.post(
        API_ENDPOINTS.CHANGE_PASSWORD, 
        { userId: user.userId, currentPassword, newPassword },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      setPasswordAlert({ show: true, message: "Password updated successfully.", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setPasswordAlert({ 
        show: true, 
        message: error.response?.data?.message || "Failed to update password.", 
        type: "error" 
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      await axios.put(
        API_ENDPOINTS.UPDATE_PROFILE,
        { userId: user.userId, name: newName },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      localStorage.setItem("name", newName);
      setUser(prev => ({ ...prev, name: newName }));
      setProfileAlert({ show: true, message: "Profile name updated successfully.", type: "success" });
    } catch (error: any) {
      setProfileAlert({ 
        show: true, 
        message: error.response?.data?.message || "Failed to update profile.", 
        type: "error" 
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${VITE_BACKEND_URI}/api/logout`, { method: "POST", credentials: "include" });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  return (
    <div className="w-full h-full bg-[#fafafa] dark:bg-[#030303] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black antialiased relative p-4 md:p-6 transition-colors duration-300 flex flex-col justify-between overflow-hidden">
      
      {/* Background Mesh Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/5 dark:bg-purple-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-900/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col justify-between min-h-0 relative z-10 gap-3">
        
        {/* Header Profile Ribbon */}
        <div className="w-full bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-sm flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3.5 min-w-0">
            <div className="w-11 h-11 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black rounded-xl flex items-center justify-center font-bold text-base shadow-sm shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 truncate">
                  {user.name}
                </h1>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate mt-0.5">
                {user.email}
              </p>
            </div>
          </div>

          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 text-xs font-semibold text-zinc-600 dark:text-zinc-400 shrink-0">
            <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
            <span>Workspace Security Active</span>
          </div>
        </div>

        {/* Settings Matrix */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
          
          {/* Main Form Area */}
          <div className="lg:col-span-8 h-full min-h-0">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 md:p-5 shadow-sm h-full flex flex-col justify-start gap-4 overflow-hidden">
              
              {/* Profile Name Form */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900/60 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-center shrink-0">
                      <User className="h-4 w-4 text-zinc-800 dark:text-zinc-200" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Profile Configuration
                      </h2>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500">
                        Update your public display name
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleProfileUpdate}
                    disabled={isUpdatingProfile}
                    className="h-8 px-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-all active:scale-95 disabled:opacity-30 flex items-center gap-2 shadow-sm cursor-pointer shrink-0"
                  >
                    <Save size={13} />
                    <span>{isUpdatingProfile ? "Saving..." : "Save Identity"}</span>
                  </button>
                </div>

                {profileAlert.show && (
                  <div className={`p-2.5 border rounded-xl flex items-center gap-2 text-xs font-medium ${
                    profileAlert.type === "success" 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
                      : "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
                  }`}>
                    {profileAlert.type === "success" ? <CheckCircle2 size={14} className="shrink-0" /> : <AlertCircle size={14} className="shrink-0" />}
                    <span className="truncate">{profileAlert.message}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full h-9 px-3 border border-zinc-200 dark:border-zinc-800/80 rounded-xl bg-zinc-100/70 dark:bg-zinc-900/50 text-zinc-400 text-xs cursor-not-allowed outline-none select-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full h-9 px-3 border border-zinc-200 dark:border-zinc-800/80 rounded-xl bg-[#fafafa] dark:bg-[#0b0b0e] text-zinc-900 dark:text-zinc-100 text-xs focus:border-zinc-400 dark:focus:border-zinc-600 outline-none transition-colors"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password Form */}
              <form onSubmit={handlePasswordChange} className="space-y-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-900/60">
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-center shrink-0">
                      <Lock className="h-4 w-4 text-zinc-800 dark:text-zinc-200" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Security Access
                      </h2>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500">
                        Manage your secret authentication key
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="h-8 px-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-all active:scale-95 disabled:opacity-30 flex items-center gap-2 shadow-sm cursor-pointer shrink-0"
                  >
                    <Save size={13} />
                    <span>{isUpdatingPassword ? "Updating..." : "Update Key"}</span>
                  </button>
                </div>

                {passwordAlert.show && (
                  <div className={`p-2.5 border rounded-xl flex items-center gap-2 text-xs font-medium ${
                    passwordAlert.type === "success" 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
                      : "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
                  }`}>
                    {passwordAlert.type === "success" ? <CheckCircle2 size={14} className="shrink-0" /> : <AlertCircle size={14} className="shrink-0" />}
                    <span className="truncate">{passwordAlert.message}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full h-9 px-3 border border-zinc-200 dark:border-zinc-800/80 rounded-xl bg-[#fafafa] dark:bg-[#0b0b0e] text-zinc-900 dark:text-zinc-100 text-xs focus:border-zinc-400 dark:focus:border-zinc-600 outline-none transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full h-9 px-3 border border-zinc-200 dark:border-zinc-800/80 rounded-xl bg-[#fafafa] dark:bg-[#0b0b0e] text-zinc-900 dark:text-zinc-100 text-xs focus:border-zinc-400 dark:focus:border-zinc-600 outline-none transition-colors"
                      placeholder="8+ characters"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      Confirm New
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-9 px-3 border border-zinc-200 dark:border-zinc-800/80 rounded-xl bg-[#fafafa] dark:bg-[#0b0b0e] text-zinc-900 dark:text-zinc-100 text-xs focus:border-zinc-400 dark:focus:border-zinc-600 outline-none transition-colors"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Aside: Controls & Session */}
          <div className="lg:col-span-4 h-full flex flex-col justify-start gap-3 min-h-0">
            
            {/* Visual Customization Card */}
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-sm flex items-center justify-between shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Paintbrush size={15} className="text-zinc-500" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 dark:text-zinc-500">
                    Interface Theme
                  </span>
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {theme === "dark" ? "Dark Interface" : "Light Interface"}
                </h3>
              </div>

              <button
                onClick={toggleTheme}
                className="relative p-2.5 rounded-xl border flex items-center justify-center bg-white/80 dark:bg-zinc-950/40 border-zinc-200/80 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-300 backdrop-blur-md transition-all duration-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700 active:scale-95 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] group overflow-hidden"
                aria-label="Toggle theme"
              >
                <div className="relative w-4 h-4 transition-transform duration-500 group-hover:rotate-[15deg]">
                  <Sun className="absolute inset-0 h-4 w-4 transform transition-all duration-500 scale-0 rotate-90 dark:scale-100 dark:rotate-0 text-amber-400" />
                  <Moon className="absolute inset-0 h-4 w-4 transform transition-all duration-500 scale-100 rotate-0 dark:scale-0 dark:-rotate-90 text-indigo-500" />
                </div>
              </button>
            </div>

            {/* Logout Card */}
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900/60 pb-2">
                  <ShieldAlert size={15} className="text-rose-500" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-rose-500">
                    Session Protocol
                  </span>
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Terminate Access
                </h3>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
                  Logging out revokes your authentication token and resets local sessions. You will be prompted to verify your password upon re-entry.
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="h-9 w-full bg-rose-500/10 hover:bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-bold text-xs uppercase tracking-wider rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <LogOut size={14} />
                <span>Log Out</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}