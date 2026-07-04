import QuizEngine from "./QuizEngine";

export default function Maths() {
  return (
    <QuizEngine 
      subjectName="Mathematics"
      getEndpoint="online-tutor-backend-six.vercel.app/api/getMathsQuestion"
      submitEndpoint="online-tutor-backend-six.vercel.app/api/updateMaths"
    />
  );
}