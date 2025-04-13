import React, { useState } from 'react';
import { 
  PrintIcon, 
  CellIcon, 
  LabIcon,
  ViewIcon, 
  ChevronRightIcon, 
  CloudIcon
} from '@/lib/icons';
import { TissueItem } from '@shared/schema';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ThreeDViewer from '@/components/ui/ThreeDViewer';
import { useProgress } from '@/hooks/useProgress';

interface TissueCardProps {
  tissue: TissueItem;
}

const TissueCard: React.FC<TissueCardProps> = ({ tissue }) => {
  const { completeItem } = useProgress();
  const [showDialog, setShowDialog] = useState(false);

  const handleViewDetails = () => {
    completeItem('explore', `view_tissue_${tissue.id}`);
  };

  const handleView3D = () => {
    setShowDialog(true);
    completeItem('explore', `view_3d_${tissue.id}`);
  };

  // Calculate success rate styling
  const getSuccessRateClass = (rate: number) => {
    if (rate >= 90) return 'bg-green-100 text-green-800';
    if (rate >= 75) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 bg-gray-200">
        {/* Image */}
        <img 
          src={tissue.imageUrl || ''}
          alt={`${tissue.name} visualization`} 
          className="w-full h-full object-cover"
        />
        
        {/* Success rate badge */}
        <div className="absolute top-0 right-0 p-2">
          <span className={`${getSuccessRateClass(tissue.successRate)} text-xs font-medium px-2.5 py-0.5 rounded`}>
            Success Rate: {tissue.successRate}%
          </span>
        </div>
        
        {/* Save to cloud button */}
        <button 
          className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={() => completeItem('explore', `save_tissue_${tissue.id}`)}
          aria-label="Save item"
        >
          <CloudIcon className="h-5 w-5 text-primary-600" />
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-gray-800">{tissue.name}</h3>
            <p className="text-sm text-gray-500">{tissue.description}</p>
          </div>
          <span className={`
            ${tissue.category === 'Cardiovascular' ? 'bg-primary-100 text-primary-800' : 
              tissue.category === 'Dermatology' ? 'bg-secondary-100 text-secondary-800' : 
              'bg-accent-100 text-accent-800'} 
            text-xs font-semibold px-2.5 py-0.5 rounded`}>
            {tissue.category}
          </span>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="flex items-center">
            <div className="text-gray-500 mr-1.5">
              <PrintIcon />
            </div>
            <span className="text-xs">Print Time: {tissue.printTime} hrs</span>
          </div>
          <div className="flex items-center">
            <div className="text-gray-500 mr-1.5">
              <CellIcon />
            </div>
            <span className="text-xs">Cells: {tissue.cellType}</span>
          </div>
          <div className="flex items-center">
            <div className="text-gray-500 mr-1.5">
              <PrintIcon />
            </div>
            <span className="text-xs">Bio-ink: {tissue.bioInk}</span>
          </div>
          <div className="flex items-center">
            <div className="text-gray-500 mr-1.5">
              <LabIcon />
            </div>
            <span className="text-xs">Lab: {tissue.labName}</span>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <button 
            className="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center"
            onClick={handleViewDetails}
          >
            View Details
            <ChevronRightIcon className="ml-1" />
          </button>
          
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <button 
                className="text-gray-600 hover:text-gray-800 flex items-center text-sm"
                onClick={handleView3D}
              >
                <ViewIcon className="h-5 w-5 mr-1" />
                <span>3D View</span>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{tissue.name} - 3D Model</DialogTitle>
              </DialogHeader>
              <div className="h-[300px]">
                {(tissue.modelUrl && tissue.modelUrl.endsWith('.svg')) ? (
                  <div className="flex items-center justify-center h-full p-4">
                    <img 
                      src={tissue.modelUrl || ''}
                      alt={`${tissue.name} 3D model`} 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <ThreeDViewer 
                    model={tissue.modelUrl ? { modelUrl: tissue.modelUrl } : undefined}
                    height="100%"
                    backgroundColor="#f8fafc"
                  />
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                This is a 3D model of {tissue.name}. You can rotate and zoom to explore its structure.
              </p>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default TissueCard;
