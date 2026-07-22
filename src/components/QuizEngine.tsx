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
  HelpCircle,
  CornerDownLeft,
  CheckCircle2,
  Sparkles,
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
    const timeout = setTimeout(() => setAnimateQuestion(false), 200);
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
      <div className="fixed inset-0 min-h-screen w-screen bg-[#fafafa] dark:bg-[#030303] flex flex-col justify-center items-center gap-4 font-sans antialiased z-50">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-950 border-t-indigo-600 rounded-full animate-spin" />
          <BookOpen className="w-5 h-5 absolute text-indigo-600 dark:text-indigo-400" />
        </div>
        <span className="text-xs font-semibold tracking-widest uppercase text-zinc-400 dark:text-zinc-500">
          Loading Evaluation Session...
        </span>
      </div>
    );
  }

  /* Error State */
  if (error) {
    return (
      <div className="fixed inset-0 min-h-screen w-screen bg-[#fafafa] dark:bg-[#030303] flex items-center justify-center p-6 antialiased font-sans z-50">
        <div className="w-full max-w-md bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-8 text-center shadow-2xl space-y-4">
          <div className="w-14 h-14 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/20">
            <AlertCircle size={28} />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Pipeline Interruption
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {error}
          </p>
          <button
            onClick={resetQuiz}
            className="h-12 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 cursor-pointer active:scale-[0.99]"
          >
            <RefreshCw size={16} />
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
      <div className="min-h-screen w-full bg-[#fafafa] dark:bg-[#030303] text-zinc-900 dark:text-zinc-100 font-sans antialiased p-6 md:p-10 transition-colors duration-300 relative overflow-x-hidden">
        {/* Background Mesh Glows */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-6 relative z-10">
          
          {/* Header Bar */}
          <div className="w-full bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Award size={28} />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {subjectName} Workspace
                </span>
                <h1 className="text-2xl font-bold tracking-tight">Assessment Completed</h1>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-zinc-100/70 dark:bg-zinc-900/60 p-3.5 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl w-full md:w-auto justify-around">
              <div className="text-center px-4 border-r border-zinc-200 dark:border-zinc-800">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Score</p>
                <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{score} / {questions.length}</p>
              </div>
              <div className="text-center px-4">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Accuracy</p>
                <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{accuracy}%</p>
              </div>
            </div>
          </div>

          {submitting ? (
            <div className="bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-20 flex flex-col items-center justify-center gap-4 shadow-sm">
              <div className="w-10 h-10 border-4 border-indigo-200 dark:border-indigo-950 border-t-indigo-600 rounded-full animate-spin" />
              <p className="text-xs uppercase tracking-widest text-zinc-400 font-bold">
                Evaluating Performance Metrics...
              </p>
            </div>
          ) : feedback ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <Sparkles size={16} />
                    <span>Performance Matrix Evaluation</span>
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900/60 p-4 border border-zinc-200/60 dark:border-zinc-800/80 rounded-xl">
                    {feedback.overallPerformance}
                  </p>
                </div>

                <div className="bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
                    <HelpCircle size={16} />
                    <span>Targeted Strategic Vector Tasks</span>
                  </h3>
                  <div className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/80 rounded-xl p-4">
                    {Array.isArray(feedback.personalizedSuggestions) ? (
                      <ol className="space-y-3">
                        {feedback.personalizedSuggestions.map((suggestion: string, idx: number) => {
                          const cleanText = suggestion
                            .replace(/^\d+\.\s*/, "")
                            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
                          return (
                            <li key={idx} className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-300">
                              <span className="w-5 h-5 bg-indigo-600 text-white rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 shadow-sm">
                                {idx + 1}
                              </span>
                              <span dangerouslySetInnerHTML={{ __html: cleanText }} className="leading-relaxed" />
                            </li>
                          );
                        })}
                      </ol>
                    ) : (
                      <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                        {feedback.personalizedSuggestions}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                {feedback.weakChapters && feedback.weakChapters.length > 0 && (
                  <div className="bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm space-y-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500 block">
                      Critical Weak Frameworks
                    </span>
                    <div className="space-y-2">
                      {feedback.weakChapters.map((ch: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2.5 p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs font-medium text-amber-700 dark:text-amber-400">
                          <XCircle size={14} className="flex-shrink-0" />
                          <span>{ch}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm space-y-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
                    Subsequent Optimization Modules
                  </span>
                  <div className="space-y-2">
                    {feedback.chaptersToFocusOn?.map((ch: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2.5 p-2.5 bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/80 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-300">
                        <ArrowUpRight size={14} className="text-indigo-500" />
                        <span>{ch}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={resetQuiz}
                  className="h-12 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw size={16} />
                  <span>Restart Core Module</span>
                </button>
              </div>

            </div>
          ) : null}
        </div>
      </div>
    );
  }

  /* Full Screen Interactive Engine View */
  const current = questions[currentQuestion];
  const progress = questions.length ? ((currentQuestion + 1) / questions.length) * 100 : 0;
  const isTimeCritical = timerValue < 10;

  return (
    <div className="fixed inset-0 min-h-screen w-screen bg-[#fafafa] dark:bg-[#030303] text-zinc-900 dark:text-zinc-100 font-sans antialiased flex flex-col justify-between overflow-y-auto transition-colors duration-300">
      
      {/* Background Lighting */}
      <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-900/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-5xl mx-auto px-6 pt-6 pb-2 flex-shrink-0 relative z-10">
        <div className="flex items-center justify-between gap-4 pb-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight line-clamp-1">
                {current?.chapterName}
              </h2>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`h-10 px-4 rounded-xl border flex items-center gap-2 text-xs font-mono font-bold transition-all ${
                isTimeCritical
                  ? "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400 animate-pulse"
                  : "bg-white/80 dark:bg-zinc-900/80 border-zinc-200/80 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-300 shadow-sm"
              }`}
            >
              <Timer size={16} />
              <span>{timerValue}s</span>
            </div>

            <div className="h-10 px-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 font-semibold text-xs items-center uppercase tracking-wider hidden sm:flex">
              {current?.level || "Standard"}
            </div>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full h-1.5 bg-zinc-200/80 dark:bg-zinc-800/80 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ease-out rounded-full ${
              isTimeCritical ? "bg-rose-500" : "bg-gradient-to-r from-indigo-600 to-violet-600"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Main Workspace */}
      <main className="w-full max-w-4xl mx-auto px-6 py-6 flex-1 flex flex-col justify-center relative z-10">
        <div
          className={`space-y-6 transition-all duration-200 ${
            animateQuestion ? "opacity-30 translate-y-1" : "opacity-100 translate-y-0"
          }`}
        >
          {/* Question Display */}
          <div className="bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 md:p-8 shadow-sm">
            <h1 className="text-lg md:text-xl font-medium leading-relaxed text-zinc-800 dark:text-zinc-200">
              {current?.question}
            </h1>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {current?.options.map((opt: string, idx: number) => {
              const isSelected = selectedOptionIndex === idx;
              return (
                <button
                  key={idx}
                  disabled={submitting}
                  onClick={() => handleOptionSelect(idx)}
                  className={`p-4 md:p-5 rounded-2xl text-left border-2 transition-all duration-150 flex items-center justify-between group cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20 transform scale-[1.005]"
                      : "bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xl border-zinc-200/80 dark:border-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:border-indigo-400 dark:hover:border-indigo-600"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center border transition-colors flex-shrink-0 ${
                        isSelected
                          ? "bg-white text-indigo-600 border-transparent shadow-sm"
                          : "bg-zinc-100 dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-800"
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm font-medium leading-snug">
                      {opt}
                    </span>
                  </div>

                  {isSelected && (
                    <CheckCircle2 size={18} className="text-white flex-shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="w-full max-w-5xl mx-auto px-6 py-6 flex-shrink-0 flex items-center justify-between border-t border-zinc-200/60 dark:border-zinc-800/60 relative z-10">
        <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400">
          <span>Use keyboard</span>
          <div className="flex gap-1">
            {["A", "B", "C", "D"].map((k) => (
              <kbd key={k} className="px-2 py-0.5 bg-zinc-200/60 dark:bg-zinc-800/60 rounded font-mono text-[10px] font-bold text-zinc-600 dark:text-zinc-300">
                {k}
              </kbd>
            ))}
          </div>
          <span>to pick answer</span>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          {selectedOptionIndex !== null && (
            <span className="text-xs text-zinc-400 font-medium hidden sm:flex items-center gap-1.5">
              Press <kbd className="px-2 py-0.5 bg-zinc-200/60 dark:bg-zinc-800/60 rounded font-mono text-[10px] font-bold text-zinc-600 dark:text-zinc-300 inline-flex items-center gap-0.5">Enter <CornerDownLeft size={10} /></kbd>
            </span>
          )}

          <button
            onClick={handleSubmitAnswer}
            disabled={selectedOptionIndex === null || submitting}
            className="h-11 px-7 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] disabled:opacity-20 disabled:pointer-events-none flex items-center gap-2 group cursor-pointer"
          >
            <span>Submit Answer</span>
            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </footer>

    </div>
  );
}