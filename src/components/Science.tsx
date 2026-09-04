import QuizEngine from "./QuizEngine";
import { BACKEND_URI } from "@/config/env";

export default function Science() {
  return (
    <QuizEngine
      subjectName="Science"
      getEndpoint={`${BACKEND_URI}/api/v1/science/getScience`}
      submitEndpoint={`${BACKEND_URI}/api/v1/science/update`}
    />
  );
}