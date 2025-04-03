import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useGetQuizByCourseQuery } from "@/features/api/quizApi";

const QuizResult = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [result, setResult] = useState(location.state || null);
  const { data, isLoading } = useGetQuizByCourseQuery(courseId);

  useEffect(() => {
    if (!location.state) {
      // Optional fallback to fetch from server or show error
      // In a real scenario, you would store result in DB or state management
      setResult(null);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-6">🎉 Quiz Result</h1>

        {result ? (
          <>
            <p className="text-lg mb-4 text-gray-700">
              <span className="font-semibold text-black">Your Score:</span>{" "}
              <span className="text-2xl font-bold text-blue-700">{result.score}</span>
            </p>
            <p className="text-lg mb-8 text-gray-700">
              <span className="font-semibold text-black">Correct Answers:</span>{" "}
              <span className="text-xl font-semibold text-blue-500">{result.correctAnswers}</span>
            </p>
          </>
        ) : (
          <p className="text-gray-500 mb-8">
            No quiz result found. Please do not refresh the page after submitting the quiz.
          </p>
        )}

        <Button
          onClick={() => navigate("/my-learning")}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          📚 Back to My Learning
        </Button>
      </div>
    </div>
  );
};

export default QuizResult;
