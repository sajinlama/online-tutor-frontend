import { useParams, Navigate } from "react-router-dom";
import QuizEngine from "./QuizEngine";

// Map URL parameter names to specific endpoint setups
const SUBJECT_CONFIG: Record<string, { name: string; get: string; submit: string }> = {
  maths: {
    name: "Mathematics",
    get: "online-tutor-backend-six.vercel.app/api/getmathQuestion",
    submit: "online-tutor-backend-six.vercel.app/api/updateScore"
  },
  science: {
    name: "Science",
    get: "online-tutor-backend-six.vercel.app/api/getScienceQuestion",
    submit: "online-tutor-backend-six.vercel.app/api/updateScince"
  },
  english: {
    name: "English",
    get: "online-tutor-backend-six.vercel.app/api/getEnglishQuestion",
    submit: "online-tutor-backend-six.vercel.app/api/updateEng"
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