import QuizEngine from "./QuizEngine";
import { VITE_BACKEND_URI } from "@/config/env";

export default function Maths() {
  return (
    <QuizEngine 
      subjectName="Mathematics"
      getEndpoint={`${VITE_BACKEND_URI}/api/getMathsQuestion`}
      submitEndpoint={`${VITE_BACKEND_URI}/api/updateMaths`}
    />
  );
}