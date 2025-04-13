import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CaseStudy } from '@shared/schema';
import { useProgress } from '@/hooks/useProgress';

const BioCaseModule: React.FC = () => {
  const { completeItem } = useProgress();
  
  const { data: caseStudies, isLoading, error } = useQuery<CaseStudy[]>({
    queryKey: ['/api/biocase/studies'],
  });

  const handleViewCaseStudy = (caseId: number) => {
    completeItem('biocase', `view_case_${caseId}`);
  };

  return (
    <section id="biocase" className="py-8 px-4 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-gray-800">BioCase Vault</h2>
          <p className="text-gray-600">Real-Life Stories: Showcase of medical success stories where 3D bioprinting saved lives</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-white overflow-hidden animate-pulse">
              <div className="h-40 bg-gray-300"></div>
              <CardContent className="p-5">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-3 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">Failed to load case studies. Please try again later.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {caseStudies?.map((caseStudy) => (
            <Card key={caseStudy.id} className="bg-white overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-40 bg-gradient-to-r from-primary-100 to-secondary-100 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-5xl opacity-30">🧬</div>
                </div>
                <div className="z-10 text-center px-4">
                  <h3 className="text-xl font-bold text-gray-800">{caseStudy.title}</h3>
                  <p className="text-sm text-gray-600">{caseStudy.date} - {caseStudy.location}</p>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">PATIENT</p>
                    <p className="text-sm text-gray-700">{caseStudy.patientProfile}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">ORGAN/TISSUE</p>
                    <p className="text-sm text-gray-700">{caseStudy.organ}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">MATERIALS</p>
                    <p className="text-sm text-gray-700">{caseStudy.materials}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">TECHNIQUE</p>
                    <p className="text-sm text-gray-700">{caseStudy.technique}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 mb-1">OUTCOME</p>
                  <p className="text-sm text-gray-700">{caseStudy.outcome}</p>
                </div>

                <div className="flex justify-between items-center">
                  <Button 
                    variant="outline" 
                    className="text-primary-600 border-primary-600 hover:bg-primary-50"
                    onClick={() => handleViewCaseStudy(caseStudy.id)}
                  >
                    View Full Case Study
                  </Button>
                  
                  {caseStudy.videoUrl && (
                    <Button 
                      variant="ghost" 
                      className="text-gray-600 hover:text-gray-800"
                      onClick={() => completeItem('biocase', `view_video_${caseStudy.id}`)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Watch Video
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};

export default BioCaseModule;
