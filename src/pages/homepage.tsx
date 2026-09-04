"use client";

import { 
  Award, 
  Mail, 
  Sparkles, 
  BookOpen, 
  BookCheck, 
  ShieldAlert, 
  GraduationCap, 
  TrendingUp 
} from "lucide-react";
import { LabelList, Pie, PieChart, Cell } from "recharts";
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
  
  const username = localStorage.getItem("name") || "Student";
  const useremail = localStorage.getItem("email") || "student@edumentor.com";

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
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full min-h-[350px] bg-transparent flex flex-col justify-center items-center gap-4 font-sans antialiased">
        <div className="relative flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-zinc-200 dark:border-zinc-800 border-t-zinc-900 dark:border-t-zinc-100 rounded-full animate-spin" />
          <BookOpen className="w-4 h-4 absolute text-zinc-900 dark:text-zinc-100" />
        </div>
        <span className="text-[11px] font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500">
          Compiling Analytics...
        </span>
      </div>
    );
  }

  const mathsScore = userData?.subjects?.maths?.totalScore ?? 0;
  const scienceScore = userData?.subjects?.science?.totalScore ?? 0;
  const englishScore = userData?.subjects?.english?.totalScore ?? 0;
  const totalMarks = mathsScore + scienceScore + englishScore;
  const averageScore = userData?.overallPerformance?.averageScore ?? 0;

  const rawChartData = [
    { subject: "maths", label: "Maths", score: mathsScore, fill: "#6366f1" }, 
    { subject: "science", label: "Science", score: scienceScore, fill: "#10b981" }, 
    { subject: "english", label: "English", score: englishScore, fill: "#f59e0b" } 
  ];

  const chartData = totalMarks > 0 
    ? rawChartData.filter(item => item.score > 0)
    : [{ subject: "empty", label: "No Tests", score: 1, fill: "#27272a" }];

  const chartConfig: ChartConfig = {
    score: { label: "Score" },
    maths: { label: "Maths", color: "#6366f1" },
    science: { label: "Science", color: "#10b981" },
    english: { label: "English", color: "#f59e0b" },
    empty: { label: "Pending Tests", color: "#71717a" }
  };

  return (
    <div className="w-full h-full bg-[#fafafa] dark:bg-[#030303] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black antialiased relative p-3 sm:p-4 md:p-6 transition-colors duration-300 flex flex-col justify-between overflow-hidden">
      
      {/* Background Mesh Glows */}
      <div className="absolute top-0 left-1/4 w-[450px] h-[450px] bg-purple-500/5 dark:bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-900/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col justify-between min-h-0 relative z-10 gap-3">
        
        {/* Navigation / Profile Header */}
        <div className="w-full bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-3.5 sm:p-4 shadow-sm flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3.5 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black rounded-xl flex items-center justify-center font-bold text-base shadow-sm shrink-0">
              {username ? username.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 truncate">
                  {username}
                </h1>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate mt-0.5">
                {useremail}
              </p>
            </div>
          </div>

          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 text-xs font-semibold text-zinc-600 dark:text-zinc-400 shrink-0">
            <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
            <span className="hidden sm:inline">Workspace Optimized</span>
            <span className="sm:hidden">Active</span>
          </div>
        </div>
  
        {/* Analytics Grid */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
          
          {/* Main Chart Section */}
          <div className="lg:col-span-8 h-full min-h-0">
            <Card className="bg-white dark:bg-zinc-950 border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-sm h-full flex flex-col justify-between transition-all duration-300 p-0 overflow-hidden border">
              
              <CardHeader className="items-center pb-2 border-b border-zinc-100 dark:border-zinc-900/60 p-3 sm:p-4 shrink-0">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                      <Award className="h-4 w-4 text-zinc-800 dark:text-zinc-200" />
                    </div>
                    <div>
                      <CardTitle className="text-sm sm:text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Subject Performance
                      </CardTitle>
                      <CardDescription className="text-[11px] text-zinc-400 dark:text-zinc-500 hidden sm:block">
                        Distribution across verified evaluations
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100/70 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60 text-xs text-zinc-600 dark:text-zinc-300">
                      <BookCheck className="h-3.5 w-3.5 text-indigo-500" /> 
                      <span className="text-[11px] text-zinc-400">Avg:</span>
                      <strong className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">{averageScore}</strong>
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100/70 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60 text-xs text-zinc-600 dark:text-zinc-300">
                      <BookOpen className="h-3.5 w-3.5 text-emerald-500" /> 
                      <span className="text-[11px] text-zinc-400">Total:</span>
                      <strong className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">{totalMarks}</strong>
                    </span>
                  </div>
                </div>
              </CardHeader>

              {/* Responsive Expanded Chart Canvas */}
              <CardContent className="flex justify-center items-center py-1 sm:py-2 relative flex-1 min-h-0">
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square w-full max-w-[210px] sm:max-w-[230px] md:max-w-[250px] [&_.recharts-text]:fill-background"
                >
                  <PieChart>
                    <ChartTooltip
                      content={<ChartTooltipContent nameKey="score" className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-semibold" />}
                    />
                    <Pie 
                      data={chartData} 
                      dataKey="score" 
                      nameKey="subject" 
                      innerRadius={totalMarks > 0 ? 35 : 55}
                      outerRadius={totalMarks > 0 ? 88 : 88}
                      strokeWidth={3} 
                      stroke={themeInsideCssHack()}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                      {totalMarks > 0 && (
                        <LabelList
                          dataKey="label"
                          className="fill-white dark:fill-zinc-100 font-bold text-xs"
                          stroke="none"
                          formatter={(value: any) => String(value)}
                        />
                      )}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>

              {/* Subject Badges Footer */}
              <CardFooter className="flex-col gap-2 text-sm bg-zinc-50/50 dark:bg-zinc-900/20 p-2.5 sm:p-3 border-t border-zinc-100 dark:border-zinc-900/60 shrink-0">
                <div className="grid grid-cols-3 gap-2 w-full">
                  <div className="flex items-center justify-between p-2 sm:p-2.5 bg-[#fafafa] dark:bg-[#0b0b0e] border border-zinc-200 dark:border-zinc-800/80 rounded-xl">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#6366f1] shrink-0" />
                      <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium truncate">Maths</span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200 ml-1">{mathsScore}</span>
                  </div>

                  <div className="flex items-center justify-between p-2 sm:p-2.5 bg-[#fafafa] dark:bg-[#0b0b0e] border border-zinc-200 dark:border-zinc-800/80 rounded-xl">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] shrink-0" />
                      <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium truncate">Science</span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200 ml-1">{scienceScore}</span>
                  </div>

                  <div className="flex items-center justify-between p-2 sm:p-2.5 bg-[#fafafa] dark:bg-[#0b0b0e] border border-zinc-200 dark:border-zinc-800/80 rounded-xl">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shrink-0" />
                      <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium truncate">English</span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200 ml-1">{englishScore}</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Strategic Insights */}
          <div className="lg:col-span-4 h-full flex flex-col justify-between gap-3 min-h-0">
            
            {/* Strong Area */}
            <div className="shrink-0 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-3.5 sm:p-4 shadow-sm flex items-center justify-between group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 dark:text-zinc-500 block">
                  Strongest Field
                </span>
                <h3 className="text-sm sm:text-base font-bold capitalize text-zinc-900 dark:text-zinc-100 truncate">
                  {userData?.overallPerformance?.strongestSubject || "Not Evaluated"}
                </h3>
              </div>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0 ml-3">
                <TrendingUp className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            {/* Weak Area */}
            <div className="shrink-0 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-3.5 sm:p-4 shadow-sm flex items-center justify-between group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-500 block">
                  Requires Attention
                </span>
                <h3 className="text-sm sm:text-base font-bold capitalize text-zinc-900 dark:text-zinc-100 truncate">
                  {userData?.overallPerformance?.weakestSubject || "Not Evaluated"}
                </h3>
              </div>
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center shrink-0 ml-3">
                <ShieldAlert className="h-4 w-4 group-hover:scale-105 transition-transform" />
              </div>
            </div>

            {/* Insight Module */}
            <div className="flex-1 min-h-0 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-3.5 sm:p-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-xs sm:text-sm tracking-tight">
                  <GraduationCap className="h-4 w-4 text-zinc-900 dark:text-zinc-100 shrink-0" />
                  <span>EduMentor Insight</span>
                </div>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed line-clamp-4">
                  Your metrics update live based on completed evaluations. Dedicating extra focus toward weaker chapters will help balance your score across all subjects.
                </p>
              </div>
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-900/60 flex items-center justify-between text-[10px] font-mono text-zinc-400 shrink-0">
                <span>Data sync: verified</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
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
    return window.document.documentElement.classList.contains("dark") ? "#030303" : "#fafafa";
  }
  return "#fafafa";
}

export default Dashboard;