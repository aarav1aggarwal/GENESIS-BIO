import React, { useState, useEffect } from 'react';
import { useThreeJS, ThreeSceneProps, ThreeModel } from '@/lib/three-utils';
import { LoaderPinwheel } from 'lucide-react';

interface ThreeDViewerProps {
  model?: ThreeModel;
  width?: string | number;
  height?: string | number;
  backgroundColor?: string;
  className?: string;
  interactive?: boolean;
  showLoadingIndicator?: boolean;
  showPlaceholder?: boolean;
}

const ThreeDViewer: React.FC<ThreeDViewerProps> = ({
  model,
  width = '100%',
  height = '300px',
  backgroundColor = '#f3f4f6',
  className = '',
  interactive = true,
  showLoadingIndicator = true,
  showPlaceholder = true,
}) => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isSvgModel, setIsSvgModel] = useState(false);
  
  useEffect(() => {
    // Check if model is an SVG
    if (model?.modelUrl && model.modelUrl.toLowerCase().endsWith('.svg')) {
      setIsSvgModel(true);
    } else {
      setIsSvgModel(false);
    }
  }, [model]);
  
  const threeOptions: ThreeSceneProps = {
    models: (model && !isSvgModel) ? [model] : [],
    backgroundColor,
    interactive,
    onLoad: () => setIsModelLoaded(true),
    onError: (error) => console.error("Failed to load 3D model:", error)
  };
  
  const { containerRef, isLoading, error } = useThreeJS(threeOptions);
  
  const renderContent = () => {
    if (error && !isSvgModel) {
      return (
        <div className="text-center p-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-red-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">Failed to load the 3D model. Please try again later.</p>
        </div>
      );
    }
    
    if (isLoading && showLoadingIndicator && !isSvgModel) {
      return (
        <div className="flex items-center justify-center h-full">
          <LoaderPinwheel className="h-8 w-8 text-primary-600 animate-spin" />
          <span className="ml-2 text-gray-500">Loading 3D model...</span>
        </div>
      );
    }
    
    if (!model && showPlaceholder) {
      return (
        <div className="text-center p-6">
          <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">Select a model to view in 3D</p>
          <p className="text-xs text-gray-400 mt-2">Rotate and zoom with mouse or touch controls</p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div 
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{ width, height, backgroundColor }}
    >
      {isSvgModel && model?.modelUrl ? (
        <div className="w-full h-full flex items-center justify-center p-4">
          <object 
            data={model.modelUrl} 
            type="image/svg+xml" 
            className="max-w-full max-h-full object-contain"
            aria-label="3D model visualization"
          >
            Your browser does not support SVG
          </object>
        </div>
      ) : (
        <>
          <div ref={containerRef} className="w-full h-full" />
          {renderContent()}
        </>
      )}
      
      {isModelLoaded && interactive && !isSvgModel && (
        <div className="absolute bottom-2 right-2 flex space-x-2">
          <button 
            className="bg-white/80 rounded-full p-2 shadow hover:bg-white"
            aria-label="Rotate model"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button 
            className="bg-white/80 rounded-full p-2 shadow hover:bg-white"
            aria-label="Reset view"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ThreeDViewer;
