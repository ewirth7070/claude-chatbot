import useQuizStore from '../store/quizStore';

export default function QuizGame() {
  const { 
    questions, 
    currentQuestionIndex, 
    answerQuestion,
    answers
  } = useQuizStore();
  
  const currentQuestion = questions[currentQuestionIndex];
  
  // Check if this question has already been answered
  const existingAnswer = answers.find(a => a.questionIndex === currentQuestionIndex);
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h3>
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {currentQuestionIndex + 1}/{questions.length}
          </span>
        </div>
      </div>
      
      <div className="border-t border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            {currentQuestion.question}
          </h4>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = existingAnswer && existingAnswer.answerIndex === index;
              const isCorrect = existingAnswer && index === currentQuestion.correctAnswerIndex;
              const isIncorrect = isSelected && !isCorrect;
              
              let buttonClass = "block w-full text-left px-4 py-3 border rounded-md focus:outline-none";
              
              if (existingAnswer) {
                if (isCorrect) {
                  buttonClass += " bg-green-100 border-green-500 text-green-900";
                } else if (isIncorrect) {
                  buttonClass += " bg-red-100 border-red-500 text-red-900";
                } else {
                  buttonClass += " bg-white border-gray-300 text-gray-700";
                }
              } else {
                buttonClass += " bg-white border-gray-300 text-gray-700 hover:bg-gray-50";
              }
              
              return (
                <button
                  key={index}
                  onClick={() => !existingAnswer && answerQuestion(index)}
                  disabled={existingAnswer !== undefined}
                  className={buttonClass}
                >
                  {option}
                </button>
              );
            })}
          </div>
          
          {existingAnswer && (
            <div className="mt-6 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-md">
              <h5 className="text-blue-700 font-medium">Explanation:</h5>
              <p className="text-blue-700 mt-1">{currentQuestion.explanation}</p>
              
              {currentQuestionIndex < questions.length - 1 && (
                <button
                  onClick={() => answerQuestion(existingAnswer.answerIndex)}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Next Question
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 