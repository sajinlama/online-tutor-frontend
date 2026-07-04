import QuizEngine from "./QuizEngine";
import { BACKEND_URI } from "@/config/env";

export default function Maths() {
  return (
    <QuizEngine 
      subjectName="Mathematics"
      getEndpoint={`${BACKEND_URI}/api/getMathsQuestion`}
      submitEndpoint={`${BACKEND_URI}/api/updateMaths`}
    />
  );
}