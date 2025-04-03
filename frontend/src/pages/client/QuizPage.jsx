import React, { useState, useEffect } from "react";
import { useGetQuizByCourseQuery, useSubmitQuizMutation } from "@/features/api/quizApi";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const QuizPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetQuizByCourseQuery(courseId);
  const [submitQuiz] = useSubmitQuizMutation();

  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false); // prevent multiple submissions

  const questions = data?.quiz?.questions || [];
  const quizId = data?.quiz?._id;
  const timeLimitFromBackend = data?.quiz?.timeLimit || 600; // fallback 10 mins
  const currentQuestion = questions[currentQuestionIndex];

  // Initialize timer when quiz loads
  useEffect(() => {
    if (timeLimitFromBackend) {
      setTimer(timeLimitFromBackend);
    }
  }, [timeLimitFromBackend]);

  // Initialize timer only when timeLimit is loaded from backend
useEffect(() => {
  if (data?.quiz?.timeLimit && timer === 0) {
    setTimer(data.quiz.timeLimit);
  }
}, [data, timer]);

// Countdown + Auto-submit when timer reaches 0
useEffect(() => {
  if (timer <= 0 || hasSubmitted) return;

  const interval = setInterval(() => {
    setTimer((prev) => {
      if (prev <= 1) {
        clearInterval(interval);
        handleSubmit(); 
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [timer]);


  const handleSubmit = async () => {
    if (!quizId || hasSubmitted) return;

    setHasSubmitted(true); 

    try {
      const answersArray = questions.map((q) => answers[q._id] || []);
      const result = await submitQuiz({ quizId, answers: answersArray }).unwrap();

      toast.success("Quiz submitted!");
      navigate(`/quiz/result/${courseId}`, {
        state: {
          score: result.score,
          correctAnswers: result.correctAnswers,
        },
      });
    } catch (error) {
      toast.error("Failed to submit quiz.");
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  if (isLoading) return <p>Loading quiz...</p>;
  if (!data?.quiz) return <p>No quiz found.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto mt-24">
      {/* Timer */}
      <div className="flex justify-between items-center mb-8 sticky top-16 z-10 bg-white shadow-md p-4 rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800">Course Quiz</h1>
        <div className="text-xl font-bold text-red-600 bg-gray-100 border border-red-400 px-5 py-2 rounded shadow">
          ⏱ {formatTime(timer)}
        </div>
      </div>

      {/* Question Card */}
      <Card className="p-6 shadow-lg border border-gray-300 bg-white rounded-xl mb-6">
        <p className="text-lg font-semibold mb-4 text-gray-800">
          Q{currentQuestionIndex + 1}. {currentQuestion.questionText}
        </p>

        {currentQuestion.options.map((option, optIndex) => (
          <label
            key={optIndex}
            className={`block p-3 border rounded-lg mb-3 cursor-pointer transition-all ${
              answers[currentQuestion._id] === option
                ? "bg-blue-100 border-blue-500"
                : "hover:bg-gray-50 border-gray-300"
            }`}
          >
            <input
              type="radio"
              name={`question_${currentQuestionIndex}`}
              value={option}
              checked={answers[currentQuestion._id] === option}
              onChange={() =>
                setAnswers({ ...answers, [currentQuestion._id]: option })
              }
              className="mr-3 accent-blue-600"
            />
            {option}
          </label>
        ))}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          disabled={currentQuestionIndex === 0}
          onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
        >
          ⬅ Previous
        </Button>

        {currentQuestionIndex < questions.length - 1 ? (
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
          >
            Next ➡
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={hasSubmitted}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            ✅ Submit Quiz
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
