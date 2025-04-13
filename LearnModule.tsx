import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TopicAccordion from './TopicAccordion';
import { PlayIcon, ClockIcon, QuestionIcon } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useProgress } from '@/hooks/useProgress';
import { type LearnTopic } from '@shared/schema';
import QuizComponent from './QuizComponent';

// Bioprinting MCQ questions 
const bioQuizQuestions = [
  {
    id: "q1",
    question: "What is bioprinting?",
    options: [
      "A technique for printing biological textbooks",
      "A 3D printing process that uses living cells and biomaterials to create tissue-like structures",
      "A medical imaging technique similar to MRI",
      "A method to detect biological contaminants in water"
    ],
    correctAnswer: 1,
    explanation: "Bioprinting is a specialized form of 3D printing that uses living cells, growth factors, and biomaterials to fabricate structures that mimic natural tissues and organs."
  },
  {
    id: "q2",
    question: "Which of the following is NOT a common bioink component?",
    options: [
      "Collagen",
      "Gelatin",
      "Polyethylene terephthalate (PET)",
      "Alginate"
    ],
    correctAnswer: 2,
    explanation: "Polyethylene terephthalate (PET) is a synthetic polymer commonly used in traditional plastics manufacturing, not in bioinks. Collagen, gelatin, and alginate are all natural biomaterials frequently used in bioink formulations."
  },
  {
    id: "q3",
    question: "What is a major challenge in bioprinting vascularized tissues?",
    options: [
      "Creating channels small enough for blood vessel formation",
      "Maintaining cell viability during the printing process",
      "Preventing immune rejection",
      "Achieving sufficient mechanical strength"
    ],
    correctAnswer: 0,
    explanation: "Creating microchannels small enough to mimic capillaries (5-10 micrometers in diameter) is a significant challenge in bioprinting, as most bioprinters have resolution limitations that make it difficult to print such fine structures."
  },
  {
    id: "q4",
    question: "Which bioprinting approach uses droplets of bioink dispensed in a controlled manner?",
    options: [
      "Laser-assisted bioprinting",
      "Extrusion-based bioprinting",
      "Inkjet bioprinting",
      "Stereolithography"
    ],
    correctAnswer: 2,
    explanation: "Inkjet bioprinting uses thermal or piezoelectric actuators to eject droplets of bioink in a precise, controlled manner. This technique offers high resolution but lower cell density compared to extrusion methods."
  },
  {
    id: "q5",
    question: "What property is most critical for scaffolds used in tissue engineering?",
    options: [
      "Biodegradability",
      "Porosity",
      "Color",
      "Weight"
    ],
    correctAnswer: 1,
    explanation: "Porosity is critical as it allows for cell migration, nutrient diffusion, waste removal, and vascularization. Without adequate porosity, cells in the interior of the scaffold would die due to lack of nutrients and oxygen."
  }
];

const LearnModule: React.FC = () => {
  const { completeItem } = useProgress();
  const [showQuiz, setShowQuiz] = useState(false);
  
  const { data: topics, isLoading, error } = useQuery<LearnTopic[]>({
    queryKey: ['/api/learn/topics'],
  });

  const handleStartQuiz = () => {
    setShowQuiz(true);
    completeItem('learn', 'start_quiz');
  };
  
  const handleQuizComplete = () => {
    setShowQuiz(false);
  };

  return (
    <section id="learn" className="py-8 px-4 lg:px-8">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-gray-800">Learn</h2>
          <p className="text-gray-600">BioLearning XR: Understand the fundamentals of bioprinting</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            className="bg-accent-600 hover:bg-accent-700 text-white"
            onClick={() => completeItem('learn', 'xr_experience')}
          >
            <PlayIcon className="h-5 w-5 mr-2" />
            Start XR Experience
          </Button>
        </div>
      </div>

      {/* Learning Topics */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden p-5 animate-pulse">
              <div className="flex justify-between items-center mb-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-20 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">Failed to load learning topics. Please try again later.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topics?.map((topic) => (
            <TopicAccordion key={topic.id} topic={topic} />
          ))}
        </div>
      )}
      
      {/* Bio Quiz */}
      {showQuiz ? (
        <div className="mt-8">
          <QuizComponent 
            topicId="bioprinting_fundamentals" 
            quizTitle="Bioprinting Fundamentals Quiz" 
            questions={bioQuizQuestions} 
            onComplete={handleQuizComplete}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mt-8">
          <div className="bg-primary-600 px-6 py-4">
            <h3 className="text-white text-xl font-bold">Test Your Knowledge: Bioprinting Quiz</h3>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-6">
              Put your bioprinting knowledge to the test with our comprehensive quiz. 
              Cover all fundamental aspects from materials to applications.
            </p>
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="flex items-center mb-4 sm:mb-0">
                <div className="text-primary-600 mr-2">
                  <ClockIcon className="h-5 w-5" />
                </div>
                <span className="text-gray-600 text-sm">5 minutes</span>
                <div className="text-primary-600 mx-2">
                  <QuestionIcon className="h-5 w-5" />
                </div>
                <span className="text-gray-600 text-sm">{bioQuizQuestions.length} questions</span>
              </div>
              <Button 
                className="bg-primary-600 hover:bg-primary-700 text-white"
                onClick={handleStartQuiz}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Start Quiz
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LearnModule;
