import React, { useState } from "react";
import { useCreateQuizMutation } from "@/features/api/quizApi";
import { useGetPublishedCourseQuery } from "@/features/api/courseApi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const CreateQuiz = () => {
  const { data: coursesData, isLoading: coursesLoading } = useGetPublishedCourseQuery();
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [timeLimit, setTimeLimit] = useState(10); 
  const navigate = useNavigate();
  const [createQuiz, { isLoading }] = useCreateQuizMutation();

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        questionType: "multiple_choice",
        options: ["", "", "", ""],
        correctAnswer: [],
      },
    ]);
  };

  const handleSubmit = async () => {
    if (!selectedCourseId) {
      toast.error("Please select a course!");
      return;
    }

    try {
      await createQuiz({
        courseId: selectedCourseId,
        timeLimit: timeLimit * 60, 
        questions,
      }).unwrap();

      toast.success("Quiz created successfully!");
      navigate("/admin/quiz-management");
    } catch (error) {
      toast.error("Failed to create quiz. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Quiz</h1>

      {/* Select Course */}
      <label className="font-semibold">Select Course:</label>
      {coursesLoading ? (
        <p>Loading courses...</p>
      ) : (
        <select
          className="border rounded p-2 w-full mb-4"
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
        >
          <option value="">Select a course</option>
          {coursesData?.courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.courseTitle}
            </option>
          ))}
        </select>
      )}

      {/* Timer */}
      <div className="mb-4">
        <label className="font-semibold block mb-1">Time Limit (in minutes):</label>
        <input
          type="number"
          min={1}
          value={timeLimit}
          onChange={(e) => setTimeLimit(Number(e.target.value))}
          className="border rounded p-2 w-full"
        />
      </div>

      {/* Questions */}
      {questions.map((q, index) => (
        <div key={index} className="mb-4 border rounded-lg p-4">
          <input
            type="text"
            placeholder="Enter Question"
            value={q.questionText}
            onChange={(e) => {
              const updated = [...questions];
              updated[index].questionText = e.target.value;
              setQuestions(updated);
            }}
            className="border rounded p-2 w-full"
          />

          <select
            value={q.questionType}
            onChange={(e) => {
              const updated = [...questions];
              updated[index].questionType = e.target.value;
              updated[index].options = e.target.value === "true_false" ? ["True", "False"] : ["", "", "", ""];
              updated[index].correctAnswer = [];
              setQuestions(updated);
            }}
            className="border rounded p-2 w-full mt-2"
          >
            <option value="multiple_choice">Multiple Choice</option>
            <option value="fill_in_the_blank">Fill in the Blank</option>
            <option value="true_false">True / False</option>
          </select>

          {/* Options and Correct Answer */}
          {q.questionType === "multiple_choice" && (
            <>
              {q.options.map((opt, optIndex) => (
                <input
                  key={optIndex}
                  type="text"
                  placeholder={`Option ${optIndex + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const updated = [...questions];
                    updated[index].options[optIndex] = e.target.value;
                    setQuestions(updated);
                  }}
                  className="border p-2 w-full mt-2"
                />
              ))}
              <label className="block mt-2 font-semibold">Correct Answer:</label>
              <select
                className="border p-2 w-full"
                onChange={(e) => {
                  const updated = [...questions];
                  updated[index].correctAnswer = [e.target.value];
                  setQuestions(updated);
                }}
              >
                <option value="">Select Correct Answer</option>
                {q.options.map((option, optIndex) => (
                  <option key={optIndex} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </>
          )}

          {q.questionType === "fill_in_the_blank" && (
            <>
              {[...Array(3)].map((_, optIndex) => (
                <input
                  key={optIndex}
                  type="text"
                  placeholder={`Option ${optIndex + 1}`}
                  value={q.options[optIndex] || ""}
                  onChange={(e) => {
                    const updated = [...questions];
                    updated[index].options[optIndex] = e.target.value;
                    setQuestions(updated);
                  }}
                  className="border p-2 w-full mt-2"
                />
              ))}
              <label className="block mt-2 font-semibold">Correct Answer:</label>
              <select
                className="border p-2 w-full"
                onChange={(e) => {
                  const updated = [...questions];
                  updated[index].correctAnswer = [e.target.value];
                  setQuestions(updated);
                }}
              >
                <option value="">Select Correct Answer</option>
                {q.options.map((option, optIndex) => (
                  <option key={optIndex} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </>
          )}

          {q.questionType === "true_false" && (
            <>
              {["True", "False"].map((option, optIndex) => (
                <label key={optIndex} className="block mt-2">
                  <input
                    type="radio"
                    name={`true_false_${index}`}
                    value={option}
                    checked={q.correctAnswer.includes(option)}
                    onChange={() => {
                      const updated = [...questions];
                      updated[index].correctAnswer = [option];
                      setQuestions(updated);
                    }}
                  />
                  {option}
                </label>
              ))}
            </>
          )}
        </div>
      ))}

      {/* Buttons */}
      <button onClick={addQuestion} className="bg-black rounded-lg text-white px-4 py-2 mt-4">
        Add Question
      </button>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 rounded-lg text-white px-4 py-2 mt-4 ml-2"
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save Quiz"}
      </button>
    </div>
  );
};

export default CreateQuiz;
