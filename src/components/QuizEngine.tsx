"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  BookOpen,
  Timer,
  Award,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  XCircle,
  ArrowUpRight,
  CornerDownLeft,
  CheckCircle2,
  Sparkles,
  Activity,
} from "lucide-react";

interface QuizEngineProps {
  getEndpoint: string;
  submitEndpoint: string;
  subjectName: string;
}

export default function QuizEngine({
  getEndpoint,
  submitEndpoint,
  subjectName,
}: QuizEngineProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timerValue, setTimerValue] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [animateQuestion, setAnimateQuestion] = useState(false);

  useEffect(() => {
    const getQuestions = async () => {
      try {
        const res = await axios.get(getEndpoint);
        setQuestions(res.data);
        setLoading(false);
        setTimerActive(true);
      } catch (err) {
        console.error(`Error fetching ${subjectName} questions:`, err);
        setError("Failed to load evaluation questions. Please verify your connection.");
        setLoading(false);
      }
    };
    getQuestions();
  }, [getEndpoint, subjectName]);

  const handleNextQuestion = useCallback(
    (answersToSubmit: any[]) => {
      setSelectedOptionIndex(null);
      setTimerValue(60);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        setTimerActive(false);
        setQuizComplete(true);
        submitAllAnswers(answersToSubmit);
      }
    },
    [currentQuestion, questions.length]
  );

  useEffect(() => {
    let timer: any;
    if (timerActive && timerValue > 0) {
      timer = setInterval(() => {
        setTimerValue((prev) => prev - 1);
      }, 1000);
    } else if (timerValue === 0 && !quizComplete) {
      handleNextQuestion(userAnswers);
    }
    return () => clearInterval(timer);
  }, [timerActive, timerValue, quizComplete, userAnswers, handleNextQuestion]);

  useEffect(() => {
    setAnimateQuestion(true);
    const timeout = setTimeout(() => setAnimateQuestion(false), 180);
    return () => clearTimeout(timeout);
  }, [currentQuestion]);

  const handleOptionSelect = (index: number) => {
    if (submitting) return;
    setSelectedOptionIndex(index);
  };

  const handleSubmitAnswer = useCallback(() => {
    if (selectedOptionIndex === null || submitting) return;

    const currentQ = questions[currentQuestion];
    const selectedAnswer = currentQ.options[selectedOptionIndex];
    const correctAnswer = currentQ.correctOption;

    const updatedAnswers = [
      ...userAnswers,
      {
        questionId: currentQ._id,
        selectedAnswer: selectedAnswer,
        chapterName: currentQ.chapterName,
      },
    ];
    setUserAnswers(updatedAnswers);

    if (selectedAnswer === correctAnswer) {
      setScore((prev) => prev + 1);
    }

    handleNextQuestion(updatedAnswers);
  }, [
    selectedOptionIndex,
    submitting,
    questions,
    currentQuestion,
    userAnswers,
    handleNextQuestion,
  ]);

  useEffect(() => {
    if (quizComplete || loading || error) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "a") handleOptionSelect(0);
      if (key === "b") handleOptionSelect(1);
      if (key === "c") handleOptionSelect(2);
      if (key === "d") handleOptionSelect(3);
      if (e.key === "Enter" && selectedOptionIndex !== null) {
        handleSubmitAnswer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedOptionIndex, quizComplete, loading, error, handleSubmitAnswer]);

  const submitAllAnswers = async (answersToSubmit: any[]) => {
    setSubmitting(true);
    try {
      const userId = localStorage.getItem("userId");
      if (!userId)
        throw new Error("User credentials expired. Please re-authenticate.");

      const chapterName = questions[0]?.chapterName || "General Evaluation";
      const level = questions[0]?.level || "Standard";

      const response = await axios.post(submitEndpoint, {
        userId,
        chapterName,
        answers: answersToSubmit,
        level,
      });

      setScore(response.data.correctAnswers);
      setFeedback(response.data.feedback);
    } catch (err: any) {
      console.error("Submission pipeline error:", err);
      setError(
        err.message || "Server synchronisation failure. Data failed to submit."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOptionIndex(null);
    setScore(0);
    setTimerValue(60);
    setQuizComplete(false);
    setTimerActive(true);
    setUserAnswers([]);
    setFeedback(null);
    setError("");
  };

  /* Loading State */
  if (loading) {
    return (
      <div className="h-full w-full bg-[#fafafa] dark:bg-[#030303] flex flex-col justify-center items-center gap-4 font-sans antialiased">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-zinc-200 dark:border-zinc-800 border-t-zinc-900 dark:border-t-zinc-100 rounded-full animate-spin" />
          <BookOpen className="w-4 h-4 absolute text-zinc-900 dark:text-zinc-100" />
        </div>
        <span className="text-[11px] font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500">
          Initializing Diagnostic Vector...
        </span>
      </div>
    );
  }

  /* Error State */
  if (error) {
    return (
      <div className="h-full w-full bg-[#fafafa] dark:bg-[#030303] flex items-center justify-center p-6 antialiased font-sans">
        <div className="w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-8 text-center shadow-xl space-y-5 backdrop-blur-sm">
          <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center mx-auto border border-rose-500/20">
            <AlertCircle size={22} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Pipeline Disruption
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {error}
            </p>
          </div>
          <button
            onClick={resetQuiz}
            className="h-11 w-full bg-zinc-900 dark:bg-zinc-100 hover:opacity-90 text-white dark:text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95"
          >
            <RefreshCw size={14} />
            <span>Re-initialize Session</span>
          </button>
        </div>
      </div>
    );
  }

  /* Quiz Complete View */
  if (quizComplete) {
    const accuracy = questions.length ? Math.round((score / questions.length) * 100) : 0;

    return (
      <div className="h-full w-full bg-[#fafafa] dark:bg-[#030303] text-zinc-900 dark:text-zinc-100 font-sans antialiased p-4 md:p-6 transition-colors duration-300 relative overflow-hidden">
        {/* Dynamic Background Mesh Flares */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/5 dark:bg-purple-900/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[700px] h-[700px] bg-blue-500/5 dark:bg-blue-900/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="h-full max-w-5xl mx-auto space-y-4 relative z-10 flex flex-col">
          
          {/* Header Bar */}
          <div className="flex-shrink-0 w-full bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black rounded-xl flex items-center justify-center shadow-sm">
                <Award size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
                  {subjectName} Pipeline
                </span>
                <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  Assessment Completed
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900/40 p-1.5 px-3 border border-zinc-100 dark:border-zinc-800/60 rounded-xl w-full md:w-auto justify-around">
              <div className="text-center px-2 border-r border-zinc-200/80 dark:border-zinc-800">
                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Score</p>
                <p className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">{score} / {questions.length}</p>
              </div>
              <div className="text-center px-2">
                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Accuracy</p>
                <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">{accuracy}%</p>
              </div>
            </div>
          </div>

          {submitting ? (
            <div className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl flex flex-col items-center justify-center gap-4 shadow-sm">
              <div className="w-10 h-10 border-2 border-zinc-200 dark:border-zinc-800 border-t-zinc-900 dark:border-t-zinc-100 rounded-full animate-spin" />
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                Synthesizing Analytical Vectors...
              </p>
            </div>
          ) : feedback ? (
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
              
              <div className="lg:col-span-7 flex flex-col gap-3 min-h-0">
                <div className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-sm space-y-2 overflow-y-auto min-h-0">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Activity size={14} className="text-indigo-500 animate-pulse" />
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      Performance Diagnostics
                    </h3>
                  </div>
                  <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      <CheckCircle2 size={12} />
                      <span>AI Evaluation</span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {feedback.overallPerformance}
                    </p>
                  </div>
                </div>

                <div className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-sm space-y-2 overflow-y-auto min-h-0">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Sparkles size={14} className="text-amber-500" />
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      Remediation
                    </h3>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/60 rounded-xl p-3">
                    {Array.isArray(feedback.personalizedSuggestions) ? (
                      <ol className="space-y-2">
                        {feedback.personalizedSuggestions.slice(0, 3).map((suggestion: string, idx: number) => {
                          const cleanText = suggestion
                            .replace(/^\d+\.\s*/, "")
                            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
                          return (
                            <li key={idx} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                              <span className="w-5 h-5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 shadow-sm">
                                {idx + 1}
                              </span>
                              <span dangerouslySetInnerHTML={{ __html: cleanText }} className="leading-relaxed" />
                            </li>
                          );
                        })}
                      </ol>
                    ) : (
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">
                        {feedback.personalizedSuggestions}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-3 min-h-0">
                {feedback.weakChapters && feedback.weakChapters.length > 0 && (
                  <div className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-sm space-y-2 overflow-y-auto min-h-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-rose-500 block flex-shrink-0">
                      Knowledge Gaps
                    </span>
                    <div className="space-y-1.5">
                      {feedback.weakChapters.slice(0, 3).map((ch: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-rose-500/5 border border-rose-500/10 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400">
                          <XCircle size={14} className="flex-shrink-0" />
                          <span className="truncate">{ch}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-sm space-y-2 overflow-y-auto min-h-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block flex-shrink-0">
                    Focus Topics
                  </span>
                  <div className="space-y-1.5">
                    {feedback.chaptersToFocusOn?.slice(0, 3).map((ch: string, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-[#fafafa] dark:bg-[#0b0b0e] border border-zinc-200 dark:border-zinc-800/80 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-300">
                        <span className="truncate">{ch}</span>
                        <ArrowUpRight size={13} className="text-zinc-400 dark:text-zinc-500 flex-shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={resetQuiz}
                  className="flex-shrink-0 h-9 w-full bg-zinc-900 dark:bg-zinc-100 hover:opacity-90 text-white dark:text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw size={14} />
                  <span>Restart</span>
                </button>
              </div>

            </div>
          ) : null}
        </div>
      </div>
    );
  }

  /* Full Screen Interactive Engine View - No Scroll */
  const current = questions[currentQuestion];
  const progress = questions.length ? ((currentQuestion + 1) / questions.length) * 100 : 0;
  const isTimeCritical = timerValue < 10;

  return (
    <div className="h-full w-full bg-[#fafafa] dark:bg-[#030303] text-zinc-900 dark:text-zinc-100 font-sans antialiased flex flex-col overflow-hidden transition-colors duration-300">
      
      {/* Subtle Background Mesh Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/5 dark:bg-purple-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[700px] h-[700px] bg-blue-500/5 dark:bg-blue-900/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Header - Fixed Height */}
      <header className="w-full max-w-5xl mx-auto px-4 pt-4 pb-2 flex-shrink-0 relative z-10">
        <div className="flex items-center justify-between gap-3 pb-2">
          
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 bg-zinc-900 dark:bg-zinc-100 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <BookOpen className="h-3.5 w-3.5 text-white dark:text-black" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100 truncate">
                {current?.chapterName}
              </h2>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                Q{currentQuestion + 1} of {questions.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div
              className={`h-8 px-3 rounded-xl border flex items-center gap-1.5 text-xs font-mono font-bold transition-all ${
                isTimeCritical
                  ? "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400 animate-pulse"
                  : "bg-white/80 dark:bg-zinc-950/40 border-zinc-200/80 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-300 backdrop-blur-md"
              }`}
            >
              <Timer size={12} />
              <span>{timerValue}s</span>
            </div>

            <div className="h-8 px-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-zinc-500 font-bold text-[10px] items-center uppercase tracking-wider hidden sm:flex">
              {current?.level || "Standard"}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-zinc-200/80 dark:bg-zinc-800/80 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ease-out rounded-full ${
              isTimeCritical ? "bg-rose-500" : "bg-zinc-900 dark:bg-zinc-100"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Main Workspace - Fills remaining height */}
      <main className="w-full max-w-4xl mx-auto px-4 flex-1 flex flex-col justify-center relative z-10 min-h-0 py-2">
        <div
          className={`space-y-4 transition-all duration-200 ${
            animateQuestion ? "opacity-30 translate-y-1" : "opacity-100 translate-y-0"
          }`}
        >
          {/* Diagnostic Context Pill */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 text-xs font-semibold text-zinc-600 dark:text-zinc-400 flex-shrink-0 w-fit">
            <Sparkles className="h-3 w-3 text-amber-500 animate-pulse" />
            <span>Active Test Query</span>
          </div>

          {/* Question Display Card */}
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 md:p-5 shadow-sm">
            <h1 className="text-sm md:text-base font-semibold leading-relaxed text-zinc-900 dark:text-zinc-100">
              {current?.question}
            </h1>
          </div>

          {/* Answer Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {current?.options.map((opt: string, idx: number) => {
              const isSelected = selectedOptionIndex === idx;
              return (
                <button
                  key={idx}
                  disabled={submitting}
                  onClick={() => handleOptionSelect(idx)}
                  className={`p-3 rounded-xl text-left border transition-all duration-150 flex items-center justify-between group cursor-pointer ${
                    isSelected
                      ? "bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100 text-white dark:text-black shadow-sm"
                      : "bg-[#fafafa] dark:bg-[#0b0b0e] border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-800 dark:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center border transition-colors flex-shrink-0 ${
                        isSelected
                          ? "bg-white/10 dark:bg-black/10 border-white/20 dark:border-black/20 text-white dark:text-black"
                          : "bg-white dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800 group-hover:text-zinc-900 dark:group-hover:text-zinc-100"
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-xs sm:text-sm font-medium leading-snug truncate">
                      {opt}
                    </span>
                  </div>

                  {isSelected && (
                    <CheckCircle2 size={14} className="text-white dark:text-black flex-shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer Navigation Bar - Fixed Height */}
      <footer className="w-full max-w-5xl mx-auto px-4 py-3 flex-shrink-0 flex items-center justify-between border-t border-zinc-200/60 dark:border-zinc-900/80 relative z-10">
        <div className="hidden sm:flex items-center gap-2 text-[10px] text-zinc-400">
          <span>Shortcuts</span>
          <div className="flex gap-0.5">
            {["A", "B", "C", "D"].map((k) => (
              <kbd key={k} className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded font-mono text-[10px] font-bold text-zinc-600 dark:text-zinc-300">
                {k}
              </kbd>
            ))}
          </div>
          <span>to select</span>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {selectedOptionIndex !== null && (
            <span className="text-[10px] text-zinc-400 font-medium hidden sm:flex items-center gap-1">
              Press <kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded font-mono text-[10px] font-bold text-zinc-600 dark:text-zinc-300 inline-flex items-center gap-0.5">Enter <CornerDownLeft size={9} /></kbd>
            </span>
          )}

          <button
            onClick={handleSubmitAnswer}
            disabled={selectedOptionIndex === null || submitting}
            className="h-8 px-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-all active:scale-95 disabled:opacity-20 disabled:pointer-events-none flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>Proceed</span>
            <ChevronRight size={13} />
          </button>
        </div>
      </footer>

    </div>
  );
}