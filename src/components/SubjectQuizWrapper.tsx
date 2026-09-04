import { useParams, Navigate } from "react-router-dom";
import QuizEngine from "./QuizEngine";
import { VITE_BACKEND_URI } from "@/config/env";

type SubjectConfig = {
  name: string;
  get: string;
  submit: string;
};

const SUBJECT_CONFIG: Record<string, SubjectConfig> = {
  maths: {
    name: "Mathematics",
    get: `${VITE_BACKEND_URI}/api/v1/maths/getMaths`,
    submit: `${VITE_BACKEND_URI}/api/v1/maths/update`,
  },

  science: {
    name: "Science",
    get: `${VITE_BACKEND_URI}/api/v1/science/getScience`,
    submit: `${VITE_BACKEND_URI}/api/v1/science/update`,
  },

  english: {
    name: "English",
    get: `${VITE_BACKEND_URI}/api/v1/english/getEnglish`,
    submit: `${VITE_BACKEND_URI}/api/v1/english/update`,
  },
};

export default function SubjectQuizWrapper() {
  const { subjectId } = useParams<{ subjectId: string }>();

  console.log("this is subject id:", subjectId);

  const config = subjectId
    ? SUBJECT_CONFIG[subjectId.toLowerCase()]
    : null;

  // Invalid subject → go back to home
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