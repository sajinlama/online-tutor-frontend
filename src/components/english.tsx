import QuizEngine from "./QuizEngine";
import { VITE_BACKEND_URI } from "@/config/env";

export default function English() {
  return (
    <QuizEngine 
      subjectName="English"
      getEndpoint={`${VITE_BACKEND_URI}/api/getEnglishQuestion`}
      submitEndpoint={`${VITE_BACKEND_URI}/api/updateEng"`}
    />
  );
}