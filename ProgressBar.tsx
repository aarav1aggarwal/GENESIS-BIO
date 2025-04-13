import React from 'react';
import { useProgress } from '@/hooks/useProgress';
import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ className = '' }) => {
  const { level, levelName, progress, xp, isLoading } = useProgress();

  if (isLoading) {
    return (
      <div className={`p-4 mt-4 bg-primary-50 mx-2 rounded-lg ${className}`}>
        <div className="flex items-center mb-2">
          <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse mr-2"></div>
          <span className="text-xs text-primary-800 font-medium">LOADING PROGRESS...</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-gray-300 animate-pulse h-2.5 rounded-full" style={{ width: '50%' }}></div>
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-600">
          <span>Loading...</span>
          <span>-</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 mt-4 bg-primary-50 mx-2 rounded-lg ${className}`}>
      <div className="flex items-center mb-2">
        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
        <span className="text-xs text-primary-800 font-medium">YOUR PROGRESS</span>
      </div>
      <Progress value={progress} className="h-2.5" />
      <div className="mt-2 flex justify-between text-xs text-gray-600">
        <span>Level {level}: {levelName}</span>
        <span>{progress}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;
