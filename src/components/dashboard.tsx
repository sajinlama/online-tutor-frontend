"use client";

import { Award, Mail, Sparkles, BookOpen, BookCheck, ShieldAlert, GraduationCap, TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";
import { useEffect, useState } from "react";
import { VITE_BACKEND_URI } from "@/config/env";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

function Dashboard() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const username = localStorage.getItem('name') || "Student";
  const useremail = localStorage.getItem('email') || "student@edumentor.com";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${VITE_BACKEND_URI}/api/getTotal`, {
          credentials: "include"
        });
        const data = await response.json();
        setUserData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#fafafa] dark:bg-[#030303] flex flex-col justify-center items-center gap-3 font-sans antialiased">
        <div className="w-10 h-10 border-2 border-indigo-200 dark:border-indigo-950 border-t-indigo-600 rounded-full animate-spin" />
        <span className="text-xs font-semibold tracking-wider uppercase text-zinc-400 dark:text-zinc-500">Compiling Analytics...</span>
      </div>
    );
  }

  const mathsScore = userData?.subjects?.maths?.totalScore ?? 0;
  const scienceScore = userData?.subjects?.science?.totalScore ?? 0;
  const englishScore = userData?.subjects?.english?.totalScore ?? 0;
  const totalMarks = mathsScore + scienceScore + englishScore;

  const chartData = [
    { subject: "maths", score: mathsScore, fill: "#6366f1" }, 
    { subject: "science", score: scienceScore, fill: "#10b981" }, 
    { subject: "english", score: englishScore, fill: "#f59e0b" } 
  ];

  const chartConfig: ChartConfig = {
    score: { label: "Score" },
    maths: { label: "Mathematics", color: "#6366f1" },
    science: { label: "Science", color: "#10b981" },
    english: { label: "English", color: "#f59e0b" }
  };

  return (
    <div className="min-h-screen w-full bg-[#fafafa] dark:bg-[#030303] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-indigo-500 selection:text-white antialiased relative overflow-x-hidden p-6 md:p-10 transition-colors duration-300">
      
      {/* Background Lighting Effects */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-900/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[700px] h-[700px] bg-emerald-500/10 dark:bg-emerald-900/15 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto space-y-6 relative z-10">
        
        {/* Navigation / Profile Banner */}
        <div className="w-full bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20 group hover:rotate-3 transition-transform duration-300">
                {username?.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{username}</h2>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-900/60 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    Active Student
                  </div>
                </div>
                <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400 gap-1.5">
                  <Mail className="h-4 w-4 opacity-70" />
                  <span>{useremail}</span>
                </div>
              </div>
            </div>

            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-zinc-100/70 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/80 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
              <span>Academic Workspace Optimized</span>
            </div>
          </div>
        </div>
  
        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Pie Chart Panel */}
          <div className="lg:col-span-7 h-full">
            <Card className="bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xl border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col justify-between transition-all duration-300">
              <CardHeader className="items-center pb-2 border-b border-zinc-100 dark:border-zinc-900/60 p-6">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl flex items-center justify-center border border-indigo-200/60 dark:border-indigo-900/60 mb-2">
                  <Award className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Subject Performance Metrics</CardTitle>
                <CardDescription className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-4 text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">
                  <span className="flex items-center gap-1"><BookCheck className="h-3.5 w-3.5 text-zinc-400" /> Average Score: <strong className="text-zinc-800 dark:text-zinc-200">{userData?.overallPerformance?.averageScore ?? 0}</strong></span>
                  <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">•</span>
                  <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5 text-zinc-400" /> Cumulative Marks: <strong className="text-zinc-800 dark:text-zinc-200">{totalMarks}</strong></span>
                </CardDescription>
              </CardHeader>

              <CardContent className="flex justify-center items-center py-12 relative flex-1">
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square w-full max-w-[260px] [&_.recharts-text]:fill-background"
                >
                  <PieChart>
                    <ChartTooltip
                      content={<ChartTooltipContent nameKey="score" className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950" />}
                    />
                    <Pie data={chartData} dataKey="score" nameKey="subject" innerRadius={5} strokeWidth={3} stroke={themeInsideCssHack()}>
                      <LabelList
                        dataKey="subject"
                        className="fill-white dark:fill-zinc-100 font-semibold"
                        stroke="none"
                        fontSize={11}
                        formatter={(value: any) => String(chartConfig[value as string]?.label ?? value).substring(0, 5)}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>

              <CardFooter className="flex-col gap-4 text-sm bg-zinc-50/50 dark:bg-zinc-900/20 p-6 border-t border-zinc-100 dark:border-zinc-900/60">
                {/* Custom Color Legend */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                  <div className="flex items-center justify-between sm:justify-start gap-3 p-3 bg-white/50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#6366f1]" />
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Mathematics</span>
                    </div>
                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 ml-auto">{mathsScore}</span>
                  </div>

                  <div className="flex items-center justify-between sm:justify-start gap-3 p-3 bg-white/50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Science</span>
                    </div>
                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 ml-auto">{scienceScore}</span>
                  </div>

                  <div className="flex items-center justify-between sm:justify-start gap-3 p-3 bg-white/50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">English</span>
                    </div>
                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 ml-auto">{englishScore}</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Strategic Insight Column */}
          <div className="lg:col-span-5 space-y-4 h-full flex flex-col">
            
            {/* Strong Area */}
            <div className="bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm flex items-center justify-between group hover:border-emerald-500/40 transition-all duration-300">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 dark:text-zinc-500 block">Strongest Field</span>
                <h3 className="text-lg font-bold capitalize text-zinc-800 dark:text-zinc-100">
                  {userData?.overallPerformance?.strongestSubject || "Not Evaluated"}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shadow-inner">
                <TrendingUp className="h-5 w-5 group-hover:translate-y-[-2px] transition-transform" />
              </div>
            </div>

            {/* Weak Area */}
            <div className="bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm flex items-center justify-between group hover:border-amber-500/40 transition-all duration-300">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 dark:text-zinc-500 block">Requires Attention</span>
                <h3 className="text-lg font-bold capitalize text-zinc-800 dark:text-zinc-100">
                  {userData?.overallPerformance?.weakestSubject || "Not Evaluated"}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shadow-inner">
                <ShieldAlert className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </div>
            </div>

            {/* EduMentor Insight Box */}
            <div className="bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-bold text-sm tracking-tight">
                  <GraduationCap className="h-4 w-4 text-indigo-500" />
                  <span>EduMentor Pipeline Insight</span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Your metrics update live based on your completed evaluations. Dedicating extra focus toward weaker chapters will help balance your score across all subjects.
                </p>
              </div>
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-900/60 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>Data sync state: verified</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

function themeInsideCssHack() {
  if (typeof window !== "undefined") {
    return window.document.documentElement.classList.contains("dark") ? "#030303" : "#ffffff";
  }
  return "#ffffff";
}

export default Dashboard;