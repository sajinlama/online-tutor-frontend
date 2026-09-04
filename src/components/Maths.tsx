import QuizEngine from "./QuizEngine";
import { BACKEND_URI } from "@/config/env";

export default function Maths() {
  return (
    <QuizEngine
      subjectName="Mathematics"
      getEndpoint={`${BACKEND_URI}/api/v1/maths/getMaths`}
      submitEndpoint={`${BACKEND_URI}/api/v1/maths/update`}
    />
  );
}