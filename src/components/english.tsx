import QuizEngine from "./QuizEngine";
import { VITE_BACKEND_URI } from "@/config/env";

export default function English() {
  return (
    <QuizEngine
      subjectName="English"
      getEndpoint={`${VITE_BACKEND_URI}/api/v1/english/getEnglish`}
      submitEndpoint={`${VITE_BACKEND_URI}/api/v1/english/update`}
    />
  );
}