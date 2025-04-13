import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useProgress } from '@/hooks/useProgress';

// Question type for MCQs
interface MCQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct answer
  explanation: string;
}

// Props for the component
interface QuizComponentProps {
  topicId: string;
  quizTitle: string;
  questions: MCQuestion[];
  onComplete?: () => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ 
  topicId, 
  quizTitle, 
  questions, 
  onComplete 
}) => {
  const { toast } = useToast();
  const { completeItem, awardBadge } = useProgress();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  const currentQuestion = questions[currentQuestionIndex];
  
  const handleOptionSelect = (optionIndex: number) => {
    if (!answered) {
      setSelectedOption(optionIndex);
    }
  };
  
  const handleCheckAnswer = () => {
    if (selectedOption === null) {
      toast({
        title: "Selection Required",
        description: "Please select an answer before checking.",
        variant: "destructive"
      });
      return;
    }
    
    setAnswered(true);
    
    if (selectedOption === currentQuestion.correctAnswer) {
      setCorrectAnswers(prev => prev + 1);
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setAnswered(false);
    } else {
      // Quiz completed
      setQuizCompleted(true);
      
      // Record progress
      completeItem('learn', `quiz_${topicId}`);
      
      // Award badge if score is high enough
      const scorePercentage = (correctAnswers + (selectedOption === currentQuestion.correctAnswer ? 1 : 0)) / questions.length * 100;
      if (scorePercentage >= 80) {
        awardBadge('quiz_master');
      }
      
      if (onComplete) {
        onComplete();
      }
    }
  };
  
  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswered(false);
    setCorrectAnswers(0);
    setQuizCompleted(false);
  };
  
  // Calculate final score
  const finalScore = quizCompleted 
    ? (correctAnswers / questions.length) * 100 
    : ((correctAnswers + (selectedOption === currentQuestion.correctAnswer ? 1 : 0)) / questions.length) * 100;
  
  return (
    <div className="border rounded-lg shadow-sm p-6">
      {!quizCompleted ? (
        <>
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-medium">{quizTitle}</h3>
            <div className="text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>
          
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary-600 h-2.5 rounded-full" 
                style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-base font-medium mb-4">{currentQuestion.question}</h4>
            
            <div className="space-y-2">
              {currentQuestion.options.map((option, index) => (
                <div 
                  key={index}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedOption === index 
                      ? answered 
                        ? index === currentQuestion.correctAnswer 
                          ? 'bg-green-50 border-green-500' 
                          : 'bg-red-50 border-red-500'
                        : 'bg-primary-50 border-primary-500'
                      : answered && index === currentQuestion.correctAnswer
                        ? 'bg-green-50 border-green-500'
                        : 'hover:border-gray-400'
                  }`}
                  onClick={() => handleOptionSelect(index)}
                >
                  <div className="flex items-start">
                    <div className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 flex-shrink-0 ${
                      selectedOption === index 
                        ? answered 
                          ? index === currentQuestion.correctAnswer 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                          : 'bg-primary-500 text-white'
                        : answered && index === currentQuestion.correctAnswer
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div>{option}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {answered && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 font-medium">Explanation:</p>
              <p className="text-blue-700">{currentQuestion.explanation}</p>
            </div>
          )}
          
          <div className="flex justify-between">
            {!answered ? (
              <Button 
                onClick={handleCheckAnswer}
                disabled={selectedOption === null}
                className="bg-primary-600 hover:bg-primary-700"
              >
                Check Answer
              </Button>
            ) : (
              <Button 
                onClick={handleNextQuestion}
                className="bg-accent-600 hover:bg-accent-700"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
              </Button>
            )}
          </div>
        </>
      ) : (
        // Quiz Results
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">Quiz Results</h3>
          
          <div className="mb-6">
            <div className="w-36 h-36 mx-auto relative">
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#eee"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={finalScore >= 80 ? "#4ade80" : finalScore >= 60 ? "#fcd34d" : "#f87171"}
                  strokeWidth="3"
                  strokeDasharray={`${finalScore}, 100`}
                  className="rotate-90 origin-center"
                  transform="rotate(-90 18 18)"
                />
                <text x="18" y="20.35" className="text-3xl font-bold fill-current" textAnchor="middle">
                  {Math.round(finalScore)}%
                </text>
              </svg>
            </div>
          </div>
          
          <p className="text-lg mb-2">
            You answered <span className="font-bold">{correctAnswers}</span> out of <span className="font-bold">{questions.length}</span> questions correctly.
          </p>
          
          <p className="mb-6">
            {finalScore >= 80 
              ? 'Excellent work! You have a solid understanding of the topic.' 
              : finalScore >= 60 
              ? 'Good job! You have a decent understanding, but there\'s room for improvement.' 
              : 'You might want to review the material and try again.'}
          </p>
          
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={restartQuiz}
              variant="outline"
            >
              Retake Quiz
            </Button>
            
            <Button 
              onClick={() => {
                if (onComplete) onComplete();
              }}
              className="bg-primary-600 hover:bg-primary-700"
            >
              Continue Learning
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizComponent;