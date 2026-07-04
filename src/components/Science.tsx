import QuizEngine from "./QuizEngine";

export default function Science() {
  return (
    <QuizEngine 
      subjectName="Science"
      getEndpoint="online-tutor-backend-six.vercel.app/api/getScienceQuestion"
      submitEndpoint="online-tutor-backend-six.vercel.app/api/updateScince" 
    />
  );
}