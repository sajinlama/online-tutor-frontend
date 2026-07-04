import QuizEngine from "./QuizEngine";
import { VITE_BACKEND_URI } from "@/config/env";

export default function Science() {
  return (
    <QuizEngine 
      subjectName="Science"
      getEndpoint={`${VITE_BACKEND_URI}/api/getScienceQuestion`}
      submitEndpoint={`${VITE_BACKEND_URI}/api/updateScince`}
    />
  );
}