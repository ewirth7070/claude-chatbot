import { useState } from 'react';
import { industries } from '../data/industries';
import useQuizStore from '../store/quizStore';
import IndustrySelect from '../components/IndustrySelect';
import QuizGame from '../components/QuizGame';
import QuizResults from '../components/QuizResults';

export default function Home() {
  const { 
    selectedIndustry, 
    setSelectedIndustry, 
    questions,
    isComplete,
    isLoading,
    setLoading,
    setQuestions,
    resetQuiz
  } = useQuizStore();
  
  const startQuiz = async () => {
    if (!selectedIndustry) return;
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/generateQuiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ industry: selectedIndustry }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }
      
      const data = await response.json();
      setQuestions(data.questions);
    } catch (error) {
      console.error('Error starting quiz:', error);
      alert('Failed to generate quiz questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Pricing Practitioner Quiz Game
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Test your pricing knowledge with industry-specific scenarios
          </p>
        </div>
        
        <div className="mt-10">
          {!questions.length && !isLoading ? (
            <IndustrySelect 
              industries={industries}
              selectedIndustry={selectedIndustry}
              onSelect={setSelectedIndustry}
              onStart={startQuiz}
            />
          ) : isLoading ? (
            <div className="text-center">
              <p className="text-lg font-medium text-gray-700">
                Generating your industry-specific quiz...
              </p>
              <div className="mt-4 flex justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
              </div>
            </div>
          ) : isComplete ? (
            <QuizResults onRestart={() => resetQuiz()} />
          ) : (
            <QuizGame />
          )}
        </div>
      </div>
    </div>
  );
} 