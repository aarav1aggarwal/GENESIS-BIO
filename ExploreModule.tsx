import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TissueCard from './TissueCard';
import { SearchIcon, FilterIcon, AddIcon } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TissueItem } from '@shared/schema';
import { useProgress } from '@/hooks/useProgress';

const ExploreModule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const { completeItem } = useProgress();

  const { data: tissues, isLoading, error } = useQuery<TissueItem[]>({
    queryKey: ['/api/explore/tissues'],
  });

  // Filter pills data
  const filterCategories = [
    { id: 'cellType', label: 'Cell Type' },
    { id: 'category', label: 'Organ' },
    { id: 'bioInk', label: 'Bio-ink' },
    { id: 'successRate', label: 'Success Rate' },
    { id: 'labName', label: 'Lab Name' },
  ];

  // Toggle filter selection
  const toggleFilter = (filterId: string, value?: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      
      if (newFilters[filterId] && (!value || newFilters[filterId] === value)) {
        delete newFilters[filterId];
      } else if (value) {
        newFilters[filterId] = value;
      }
      
      return newFilters;
    });
  };

  // Filter tissues based on search and active filters
  const filteredTissues = tissues?.filter(tissue => {
    // Search filter
    if (searchTerm && !tissue.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !tissue.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Check if matches all active filters
    for (const [key, value] of Object.entries(activeFilters)) {
      const tissueValue = tissue[key as keyof TissueItem];
      if (typeof tissueValue === 'string' && !tissueValue.includes(value)) {
        return false;
      }
    }
    
    return true;
  });

  const handleSubmitTissue = () => {
    completeItem('explore', 'submit_tissue');
  };

  return (
    <section id="explore" className="py-8 px-4 lg:px-8 bg-gray-50">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-gray-800">Explore</h2>
          <p className="text-gray-600">Tissue Vault: A scientific library of printable human tissues and materials</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search tissues..."
              className="pl-10 pr-4 py-2 w-full sm:w-56 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <SearchIcon className="h-5 w-5" />
            </div>
          </div>
          <Button 
            variant="outline" 
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <FilterIcon className="h-5 w-5 mr-2" />
            Filter
          </Button>
        </div>
      </div>
      
      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterCategories.map((category) => (
          <div 
            key={category.id}
            className={`bg-white px-3 py-1 rounded-full text-sm border cursor-pointer
              ${activeFilters[category.id] ? 'border-primary-300 bg-primary-50' : 'border-gray-300'}
            `}
            onClick={() => toggleFilter(category.id)}
          >
            <span className="flex items-center">
              {category.label}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 ml-1 text-gray-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M19 9l-7 7-7-7" 
                />
              </svg>
            </span>
          </div>
        ))}
      </div>
      
      {/* Tissue Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-3 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <p className="text-red-500">Failed to load tissue items. Please try again later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTissues?.map((tissue) => (
            <TissueCard key={tissue.id} tissue={tissue} />
          ))}
          
          {filteredTissues?.length === 0 && (
            <div className="col-span-full bg-white rounded-xl shadow-md p-6 text-center">
              <p className="text-gray-500">No tissue items match your search criteria.</p>
            </div>
          )}
        </div>
      )}
      
      {/* Submit Tissue Button */}
      <div className="mt-8 text-center">
        <Button 
          className="bg-accent-600 hover:bg-accent-700 text-white py-3 px-6"
          onClick={handleSubmitTissue}
        >
          <AddIcon className="h-5 w-5 mr-2" />
          Submit a Tissue
        </Button>
        <p className="mt-2 text-sm text-gray-500">For researchers and institutions to contribute to the database</p>
      </div>
    </section>
  );
};

export default ExploreModule;
