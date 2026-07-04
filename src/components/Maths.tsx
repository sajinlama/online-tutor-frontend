import QuizEngine from "./QuizEngine";

export default function Maths() {
  return (
    <QuizEngine 
      subjectName="Mathematics"
      getEndpoint="https://online-tutor-backend-six.vercel.app/api/getMathsQuestion"
      submitEndpoint="https://online-tutor-backend-six.vercel.app/api/updateMaths"
    />
  );
}