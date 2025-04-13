import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@/lib/icons';
import { LearnTopic } from '@shared/schema';
import { useProgress } from '@/hooks/useProgress';

interface TopicAccordionProps {
  topic: LearnTopic;
}

const TopicAccordion: React.FC<TopicAccordionProps> = ({ topic }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { completeItem } = useProgress();

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    
    // If first time expanding, mark as started
    if (!isExpanded) {
      completeItem('learn', `view_topic_${topic.id}`);
    }
  };

  const handleContinueLearning = () => {
    // Mark as completed
    completeItem('learn', `complete_topic_${topic.id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">{topic.title}</h3>
          <button 
            className="text-primary-600 hover:text-primary-800 focus:outline-none" 
            aria-expanded={isExpanded}
            aria-controls={`topic-${topic.id}-content`}
            onClick={toggleExpanded}
          >
            {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </button>
        </div>
        
        <div id={`topic-${topic.id}-content`} className={isExpanded ? '' : 'hidden'}>
          <p className="text-gray-600 mb-4">{topic.content}</p>
          <ul className="text-gray-600 list-disc pl-5 mb-4">
            {topic.bulletPoints.map((point, index) => (
              <li key={index} className="mb-1">{point}</li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between">
            <span className="text-xs text-gray-500">{topic.readTime} min read</span>
            <a 
              href="#" 
              className="text-primary-600 hover:text-primary-800 text-sm font-medium"
              onClick={(e) => {
                e.preventDefault();
                handleContinueLearning();
              }}
            >
              Continue Learning →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicAccordion;
