import QuizEngine from "./QuizEngine";

export default function English() {
  return (
    <QuizEngine 
      subjectName="English"
      getEndpoint="https://online-tutor-backend-six.vercel.app/api/getEnglishQuestion"
      submitEndpoint="https://online-tutor-backend-six.vercel.app/api/updateEng"
    />
  );
}