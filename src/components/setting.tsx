"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { VITE_BACKEND_URI } from "@/config/env";
import { 
  Save, Moon, Sun, LogOut, User, Lock, Paintbrush, 
  ShieldAlert, AlertCircle, CheckCircle2, Sparkles 
} from "lucide-react";
import { useTheme } from "@/contexapi/themeprovider";

const API_ENDPOINTS = {
  CHANGE_PASSWORD: `${VITE_BACKEND_URI}/api/users/change-password`,
  UPDATE_PROFILE: `${VITE_BACKEND_URI}/api/users/update-profile`,
};

export default function Setting() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    userId: "",
  });

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
    const username = localStorage.getItem("name") || "User";
    const userEmail = localStorage.getItem("email") || "user@example.com";
    const userId = localStorage.getItem("userId") || "";
    
    setUser({ name: username, email: userEmail, userId });
    setNewName(username);
  }, []);

  // Alert cleanup timeouts
  useEffect(() => {
    if (profileAlert.show) {
      const t = setTimeout(() => setProfileAlert(p => ({ ...p, show: false })), 4000);
      return () => clearTimeout(t);
    }
  }, [profileAlert.show]);

  useEffect(() => {
    if (passwordAlert.show) {
      const t = setTimeout(() => setPasswordAlert(p => ({ ...p, show: false })), 4000);
      return () => clearTimeout(t);
    }
  }, [passwordAlert.show]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setPasswordAlert({
        show: true,
        message: "New passwords do not match. Please verify your entry.",
        type: "error",
      });
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordAlert({
        show: true,
        message: "Password must be at least 8 characters long.",
        type: "error",
      });
      return;
    }
    
    setIsUpdatingPassword(true);
    try {
      await axios.post(
        API_ENDPOINTS.CHANGE_PASSWORD, 
        { userId: user.userId, currentPassword, newPassword },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );
      
      setPasswordAlert({
        show: true,
        message: "Password updated successfully.",
        type: "success",
      });
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to update password.";
      setPasswordAlert({ show: true, message: errorMessage, type: "error" });
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
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );
      
      localStorage.setItem("name", newName);
      setUser(prev => ({ ...prev, name: newName }));
      
      setProfileAlert({
        show: true,
        message: "Profile name updated successfully.",
        type: "success",
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to update profile.";
      setProfileAlert({ show: true, message: errorMessage, type: "error" });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${VITE_BACKEND_URI}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout request failed", err);
    } finally {
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("userId");
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fafafa] dark:bg-[#030303] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-indigo-500 selection:text-white antialiased relative overflow-x-hidden p-6 md:p-10 transition-colors duration-300">
      
      {/* Background Mesh Glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-900/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[700px] h-[700px] bg-violet-500/10 dark:bg-violet-900/15 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto space-y-6 relative z-10">
        
        {/* Module Header Bar */}
        <div className="w-full bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Account & System Settings
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Manage your personal profile, security credentials, and interface options
            </p>
          </div>

          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-zinc-100/70 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/80 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            <Sparkles className="h-4 w-4 text-indigo-500 animate-pulse" />
            <span>EduMentor Settings Workspace</span>
          </div>
        </div>

        {/* Master Content Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Form Settings */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Profile Section */}
            <div className="bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-900/60 pb-4">
                <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20">
                  <User size={20} />
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Profile Information</h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Update how your name appears on your dashboard</p>
                </div>
              </div>

              {profileAlert.show && (
                <div className={`p-4 border rounded-xl flex items-start gap-3 text-xs font-medium transition-all duration-300 ${
                  profileAlert.type === "success" 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400" 
                    : "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400"
                }`}>
                  {profileAlert.type === "success" ? <CheckCircle2 size={16} className="flex-shrink-0" /> : <AlertCircle size={16} className="flex-shrink-0" />}
                  <span>{profileAlert.message}</span>
                </div>
              )}

              <form onSubmit={handleProfileUpdate} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={user.email}
                    disabled
                    className="w-full p-3.5 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl bg-zinc-100/70 dark:bg-zinc-900/50 text-zinc-400 dark:text-zinc-500 text-sm select-none outline-none cursor-not-allowed"
                  />
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500 pl-1">Primary email identity cannot be changed.</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Display Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full p-3.5 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl bg-white/80 dark:bg-zinc-900/80 text-zinc-800 dark:text-zinc-200 text-sm focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors outline-none"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] disabled:opacity-30 flex items-center gap-2 group cursor-pointer"
                  >
                    <Save size={16} />
                    <span>{isUpdatingProfile ? "Saving Profile..." : "Save Profile Changes"}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Password Section */}
            <div className="bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-900/60 pb-4">
                <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20">
                  <Lock size={20} />
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Security Credentials</h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Change your password to keep your account safe</p>
                </div>
              </div>

              {passwordAlert.show && (
                <div className={`p-4 border rounded-xl flex items-start gap-3 text-xs font-medium transition-all duration-300 ${
                  passwordAlert.type === "success" 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400" 
                    : "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400"
                }`}>
                  {passwordAlert.type === "success" ? <CheckCircle2 size={16} className="flex-shrink-0" /> : <AlertCircle size={16} className="flex-shrink-0" />}
                  <span>{passwordAlert.message}</span>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="currentPassword" className="block text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-3.5 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl bg-white/80 dark:bg-zinc-900/80 text-zinc-800 dark:text-zinc-200 text-sm focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="newPassword" className="block text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-3.5 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl bg-white/80 dark:bg-zinc-900/80 text-zinc-800 dark:text-zinc-200 text-sm focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-3.5 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl bg-white/80 dark:bg-zinc-900/80 text-zinc-800 dark:text-zinc-200 text-sm focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] disabled:opacity-30 flex items-center gap-2 group cursor-pointer"
                  >
                    <Save size={16} />
                    <span>{isUpdatingPassword ? "Updating Password..." : "Update Password"}</span>
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* Right Column: Theme & Session Controls */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Visual Customization Card */}
            <div className="bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 border-b border-zinc-100 dark:border-zinc-900/60 pb-3">
                <Paintbrush size={16} className="text-indigo-500" />
                <span className="text-xs uppercase font-bold tracking-wider text-zinc-400 dark:text-zinc-500">Appearance Settings</span>
              </div>
              
              <div className="flex items-center justify-between bg-zinc-50/80 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/80 p-4 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Theme Mode</p>
                  <p className="text-xs text-zinc-400">Switch between light and dark themes</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-500/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
                >
                  {theme === "dark" ? (
                    <>
                      <Sun size={15} />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon size={15} />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Session Management Card */}
            <div className="bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 border-b border-zinc-100 dark:border-zinc-900/60 pb-3">
                <ShieldAlert size={16} className="text-rose-500" />
                <span className="text-xs uppercase font-bold tracking-wider text-zinc-400 dark:text-zinc-500">Session Controls</span>
              </div>
              
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Signing out clears active login tokens from this device. You will need your password to log back in.
              </p>

              <button
                onClick={handleLogout}
                className="h-11 w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-semibold rounded-xl text-sm active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut size={16} />
                <span>Log Out of Session</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}