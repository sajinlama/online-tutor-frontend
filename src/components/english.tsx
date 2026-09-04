import QuizEngine from "./QuizEngine";
import { BACKEND_URI } from "@/config/env";

export default function English() {
  return (
    <QuizEngine
      subjectName="English"
      getEndpoint={`${BACKEND_URI}/api/v1/english/getEnglish`}
      submitEndpoint={`${BACKEND_URI}/api/v1/english/update`}
    />
  );
}