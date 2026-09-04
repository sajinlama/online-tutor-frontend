import QuizEngine from "./QuizEngine";
import { VITE_BACKEND_URI } from "@/config/env";

export default function Maths() {
  return (
    <QuizEngine
      subjectName="Mathematics"
      getEndpoint={`${VITE_BACKEND_URI}/api/v1/maths/getMaths`}
      submitEndpoint={`${VITE_BACKEND_URI}/api/v1/maths/update`}
    />
  );
}