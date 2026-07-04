import QuizEngine from "./QuizEngine";

export default function English() {
  return (
    <QuizEngine 
      subjectName="English"
      getEndpoint="online-tutor-backend-six.vercel.app/api/getEnglishQuestion"
      submitEndpoint="online-tutor-backend-six.vercel.app/api/updateEng"
    />
  );
}