import React from "react";
import { useGetAllQuizzesQuery, useDeleteQuizMutation } from "@/features/api/quizApi";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, Trash, Edit } from "lucide-react";
import { toast } from "sonner";

const QuizManagement = () => {
  const { data, isLoading, refetch } = useGetAllQuizzesQuery();
  const [deleteQuiz] = useDeleteQuizMutation();

  const handleDelete = async (quizId) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      await deleteQuiz(quizId);
      toast.success("Quiz deleted successfully!");
      refetch(); // ✅ Refresh quiz list after deletion
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mt-10">
      <h1 className="text-2xl font-bold">Quiz Management</h1>
      
      <div className="flex justify-end my-4">
        <Link to="/admin/quiz/create">
          <Button className="bg-blue-600 text-white">Create New Quiz</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
        </div>
      ) : !data?.quizzes || data.quizzes.length === 0 ? (
        <p className="text-center text-gray-500">No quizzes found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Course</th>
              <th className="border border-gray-300 p-2">Total Questions</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.quizzes.map((quiz) => (
              <tr key={quiz._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{quiz.courseId?.courseTitle || "Unknown Course"}</td>
                <td className="border border-gray-300 p-2">{quiz.questions.length}</td>
                <td className="border border-gray-300 p-2 flex gap-2">
                  <Link to={`/admin/quiz/edit/${quiz._id}`}>
                    <Button size="sm" className="bg-yellow-500 text-white">
                      <Edit size={16} />
                    </Button>
                  </Link>
                  <Button size="sm" className="bg-red-500 text-white" onClick={() => handleDelete(quiz._id)}>
                    <Trash size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default QuizManagement;
