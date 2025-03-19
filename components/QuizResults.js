import useQuizStore from '../store/quizStore';

export default function QuizResults({ onRestart }) {
  const { score, questions, selectedIndustry } = useQuizStore();
  const percentage = Math.round((score / questions.length) * 100);
  
  let feedbackMessage;
  if (percentage >= 90) {
    feedbackMessage = "Outstanding! You're a pricing expert in this industry.";
  } else if (percentage >= 75) {
    feedbackMessage = "Great job! You have strong pricing knowledge.";
  } else if (percentage >= 60) {
    feedbackMessage = "Good effort! Keep building your pricing expertise.";
  } else {
    feedbackMessage = "You've taken the first step in learning about pricing in this industry.";
  }
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Quiz Results: {selectedIndustry} Industry
        </h3>
      </div>
      
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div className="text-center">
          <p className="text-5xl font-bold text-blue-600">{score} / {questions.length}</p>
          <p className="mt-1 text-xl text-gray-500">{percentage}% Correct</p>
          
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
          
          <p className="mt-6 text-lg text-gray-800">{feedbackMessage}</p>
          
          <div className="mt-8">
            <button
              onClick={onRestart}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Another Industry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 