import { useParams, Navigate } from "react-router-dom";
import QuizEngine from "./QuizEngine";
import { BACKEND_URI } from "@/config/env";

// Map URL parameter names to specific endpoint setups
const SUBJECT_CONFIG: Record<string, { name: string; get: string; submit: string }> = {
  maths: {
    name: "Mathematics",
    get: `${BACKEND_URI}/api/getmathQuestion`,
    submit: `{BACKEND_URI}/api/updateScore`
  },
  science: {
    name: "Science",
    get: `${BACKEND_URI}/api/getScienceQuestion`,
    submit: `{BACKEND_URI}/api/updateScince`
  },
  english: {
    name: "English",
    get: `${BACKEND_URI}/api/getEnglishQuestion`,
    submit: `${BACKEND_URI}/api/updateEng`
  }
};

export default function SubjectQuizWrapper() {
  const { subjectId } = useParams<{ subjectId: string }>();
  console.log("this is subject id ",subjectId)

  const config = subjectId ? SUBJECT_CONFIG[subjectId.toLowerCase()] : null;

  // Fallback if someone types an invalid subject like /home/quiz/history
  if (!config) {
    return <Navigate to="/home" replace />;
  }

  return (
    <QuizEngine 
      subjectName={config.name}
      getEndpoint={config.get}
      submitEndpoint={config.submit}
    />
  );
}