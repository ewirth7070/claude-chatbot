import { create } from 'zustand';

const useQuizStore = create((set) => ({
  selectedIndustry: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  score: 0,
  isLoading: false,
  isComplete: false,
  
  setSelectedIndustry: (industry) => set({ selectedIndustry: industry }),
  
  setQuestions: (questions) => set({ 
    questions,
    currentQuestionIndex: 0,
    answers: [],
    score: 0,
    isComplete: false
  }),
  
  answerQuestion: (answerIndex) => set((state) => {
    const isCorrect = answerIndex === state.questions[state.currentQuestionIndex].correctAnswerIndex;
    const newAnswers = [...state.answers, { questionIndex: state.currentQuestionIndex, answerIndex, isCorrect }];
    const newScore = isCorrect ? state.score + 1 : state.score;
    
    const isLastQuestion = state.currentQuestionIndex === state.questions.length - 1;
    
    return {
      answers: newAnswers,
      score: newScore,
      currentQuestionIndex: isLastQuestion ? state.currentQuestionIndex : state.currentQuestionIndex + 1,
      isComplete: isLastQuestion
    };
  }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  resetQuiz: () => set({
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    score: 0,
    isComplete: false
  })
}));

export default useQuizStore; 