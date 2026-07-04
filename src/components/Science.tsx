import QuizEngine from "./QuizEngine";

export default function Science() {
  return (
    <QuizEngine 
      subjectName="Science"
      getEndpoint="https://online-tutor-backend-six.vercel.app/api/getScienceQuestion"
      submitEndpoint="https://online-tutor-backend-six.vercel.app/api/updateScince" 
    />
  );
}