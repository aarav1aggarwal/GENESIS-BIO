import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlayIcon } from '@/lib/icons';
import ThreeDViewer from '@/components/ui/ThreeDViewer';
import { useProgress } from '@/hooks/useProgress';

// Interface for simulation results
interface SimulationResults {
  rejectionProbability: number;
  integrationSuccess: number;
  functionalRecovery: number;
  longTermStability: number;
  timeline: {
    day1: boolean;
    day7: boolean;
    day14: boolean;
    day30: boolean;
    day90: boolean;
  };
}

const SimulateModule: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<'male' | 'female' | null>(null);
  const [selectedOrgan, setSelectedOrgan] = useState<string>('Heart Valve');
  const [collagenValue, setCollagenValue] = useState<number>(68);
  const [scaffoldValue, setScaffoldValue] = useState<number>(50);
  const [growthFactorsValue, setGrowthFactorsValue] = useState<number>(75);
  const [simulationRun, setSimulationRun] = useState<boolean>(false);
  const [simulationResults, setSimulationResults] = useState<SimulationResults | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  const { completeItem, awardBadge } = useProgress();

  // Calculate simulation results based on inputs
  const calculateResults = (): SimulationResults => {
    // Base values that depend on the selected organ
    let baseRejection = 0;
    let baseIntegration = 0;
    let baseFunctional = 0;
    let baseStability = 0;
    
    switch(selectedOrgan) {
      case 'Heart Valve':
        baseRejection = 15;
        baseIntegration = 80;
        baseFunctional = 70;
        baseStability = 75;
        break;
      case 'Skin Patch':
        baseRejection = 8;
        baseIntegration = 90;
        baseFunctional = 85;
        baseStability = 88;
        break;
      case 'Cornea':
        baseRejection = 12;
        baseIntegration = 85;
        baseFunctional = 78;
        baseStability = 82;
        break;
      default:
        baseRejection = 10;
        baseIntegration = 85;
        baseFunctional = 80;
        baseStability = 85;
    }
    
    // Apply modifications based on material parameters
    // Higher collagen reduces rejection and improves integration
    const rejectionMod = -0.1 * collagenValue;
    const integrationMod = 0.12 * collagenValue;
    
    // Higher scaffold density improves stability but may reduce integration rate
    const stabilityMod = 0.15 * scaffoldValue;
    const integrationScaffoldMod = scaffoldValue > 80 ? -0.05 * scaffoldValue : 0.05 * scaffoldValue;
    
    // Growth factors improve functional recovery and integration
    const functionalMod = 0.2 * growthFactorsValue;
    const integrationGrowthMod = 0.1 * growthFactorsValue;
    
    // Calculate final values with constraints
    const rejection = Math.max(1, Math.min(baseRejection + rejectionMod, 100));
    const integration = Math.max(1, Math.min(baseIntegration + integrationMod + integrationScaffoldMod + integrationGrowthMod, 100));
    const functional = Math.max(1, Math.min(baseFunctional + functionalMod, 100));
    const stability = Math.max(1, Math.min(baseStability + stabilityMod, 100));
    
    // Timeline stage completion based on overall score
    const overallScore = (integration + functional + stability) / 3;
    
    return {
      rejectionProbability: Math.round(rejection),
      integrationSuccess: Math.round(integration),
      functionalRecovery: Math.round(functional),
      longTermStability: Math.round(stability),
      timeline: {
        day1: true, // Always completed
        day7: true, // Always completed
        day14: overallScore > 60,
        day30: overallScore > 75,
        day90: overallScore > 85
      }
    };
  };
  
  const handleRunSimulation = () => {
    setLoading(true);
    
    // Simulate loading time for realism
    setTimeout(() => {
      const results = calculateResults();
      setSimulationResults(results);
      setSimulationRun(true);
      setLoading(false);
      
      completeItem('simulate', `simulation_${selectedOrgan.toLowerCase().replace(/\s+/g, '_')}`);
      
      // Award badges based on simulated organ
      if (selectedOrgan === 'Heart Valve') {
        awardBadge('heart_hero');
      } else if (selectedOrgan === 'Skin Patch') {
        awardBadge('skin_savior');
      } else if (selectedOrgan === 'Cornea') {
        awardBadge('cornea_creator');
      }
      
      // Award simulation expert badge if overall performance is excellent
      if (results.integrationSuccess > 90 && results.functionalRecovery > 85 && results.longTermStability > 85) {
        awardBadge('simulation_expert');
      }
    }, 1500); // 1.5 second simulated calculation time
  };

  const getScaffoldDensity = (value: number) => {
    if (value < 33) return 'Low';
    if (value < 66) return 'Medium';
    return 'High';
  };

  const getGrowthFactorDensity = (value: number) => {
    if (value < 33) return 'Low';
    if (value < 66) return 'Medium';
    return 'High';
  };

  // Get color class based on value
  const getValueColorClass = (value: number) => {
    if (value < 33) return 'text-red-700';
    if (value < 66) return 'text-yellow-700';
    return 'text-green-700';
  };

  // Get bar color class based on value
  const getBarColorClass = (value: number) => {
    if (value < 33) return 'bg-red-500';
    if (value < 66) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Get text label based on value
  const getValueLabel = (value: number) => {
    if (value < 33) return 'Low';
    if (value < 66) return 'Medium';
    return 'High';
  };

  return (
    <section id="simulate" className="py-8 px-4 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-gray-800">Simulate</h2>
          <p className="text-gray-600">BioTwin AI: Test implantation outcomes in a virtual human model</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Simulation Setup Panel */}
          <div className="lg:w-1/3 p-6 border-r border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Simulation Setup</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">1. Select Body Model</label>
              <div className="grid grid-cols-2 gap-3">
                <div 
                  className={`bg-gray-50 border rounded-lg p-3 cursor-pointer transition-colors ${
                    selectedModel === 'male' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-500'
                  }`}
                  onClick={() => setSelectedModel('male')}
                >
                  <div className="flex items-center">
                    <div className={`rounded-full p-2 mr-3 ${
                      selectedModel === 'male' ? 'bg-primary-100' : 'bg-gray-100'
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${
                        selectedModel === 'male' ? 'text-primary-600' : 'text-gray-500'
                      }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Male</div>
                      <div className="text-xs text-gray-500">45 years</div>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`bg-gray-50 border rounded-lg p-3 cursor-pointer transition-colors ${
                    selectedModel === 'female' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-500'
                  }`}
                  onClick={() => setSelectedModel('female')}
                >
                  <div className="flex items-center">
                    <div className={`rounded-full p-2 mr-3 ${
                      selectedModel === 'female' ? 'bg-primary-100' : 'bg-gray-100'
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${
                        selectedModel === 'female' ? 'text-primary-600' : 'text-gray-500'
                      }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Female</div>
                      <div className="text-xs text-gray-500">38 years</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <button className="text-sm text-primary-600 hover:text-primary-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add medical conditions
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">2. Choose Organ to Implant</label>
              <select 
                className="block w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={selectedOrgan}
                onChange={(e) => setSelectedOrgan(e.target.value)}
              >
                <option>Heart Valve</option>
                <option>Skin Patch</option>
                <option>Cornea</option>
                <option>Liver Segment</option>
                <option>Cartilage</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">3. Edit Bio-Ink</label>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Collagen %</span>
                    <span>{collagenValue}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={collagenValue}
                    onChange={(e) => setCollagenValue(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Scaffold Density</span>
                    <span>{getScaffoldDensity(scaffoldValue)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={scaffoldValue}
                    onChange={(e) => setScaffoldValue(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Growth Factors</span>
                    <span>{getGrowthFactorDensity(growthFactorsValue)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={growthFactorsValue}
                    onChange={(e) => setGrowthFactorsValue(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full bg-accent-600 hover:bg-accent-700 text-white font-bold"
              disabled={!selectedModel}
              onClick={handleRunSimulation}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                <>
                  <PlayIcon className="h-5 w-5 mr-2" />
                  Run Simulation
                </>
              )}
            </Button>
          </div>
          
          {/* Simulation Results Panel */}
          <div className="lg:w-2/3 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Simulation Results</h3>
            
            <div className="flex flex-col md:flex-row h-full">
              {/* 3D Model Visualization */}
              <div className="md:w-1/2 h-80 md:h-auto md:mr-4 mb-4 md:mb-0">
                {simulationRun && selectedModel ? (
                  <div className="flex items-center justify-center h-full p-4 bg-gray-50 rounded-lg">
                    <img 
                      src={`/models/${selectedOrgan.toLowerCase().replace(/\s+/g, '-')}.svg`} 
                      alt={`${selectedOrgan} 3D model`} 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center h-full flex flex-col justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-600">Select a body model and run the simulation to see results.</p>
                  </div>
                )}
              </div>
              
              {/* Simulation Metrics */}
              <div className="md:w-1/2">
                {!simulationRun ? (
                  <div className="bg-gray-50 rounded-lg p-6 text-center h-full flex flex-col justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-600">Select a body model and run the simulation to see results.</p>
                  </div>
                ) : simulationResults && (
                  <>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-gray-800 mb-3">Predicted Outcomes</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Rejection Probability</span>
                            <span className={`font-medium ${getValueColorClass(100 - simulationResults.rejectionProbability)}`}>
                              {simulationResults.rejectionProbability < 10 ? 'Low' : simulationResults.rejectionProbability > 20 ? 'High' : 'Medium'} ({simulationResults.rejectionProbability}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className={`${getBarColorClass(100 - simulationResults.rejectionProbability)} h-1.5 rounded-full`} style={{ width: `${simulationResults.rejectionProbability}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Integration Success</span>
                            <span className={`font-medium ${getValueColorClass(simulationResults.integrationSuccess)}`}>
                              {getValueLabel(simulationResults.integrationSuccess)} ({simulationResults.integrationSuccess}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className={`${getBarColorClass(simulationResults.integrationSuccess)} h-1.5 rounded-full`} style={{ width: `${simulationResults.integrationSuccess}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Functional Recovery</span>
                            <span className={`font-medium ${getValueColorClass(simulationResults.functionalRecovery)}`}>
                              {getValueLabel(simulationResults.functionalRecovery)} ({simulationResults.functionalRecovery}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className={`${getBarColorClass(simulationResults.functionalRecovery)} h-1.5 rounded-full`} style={{ width: `${simulationResults.functionalRecovery}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Long-term Stability</span>
                            <span className={`font-medium ${getValueColorClass(simulationResults.longTermStability)}`}>
                              {getValueLabel(simulationResults.longTermStability)} ({simulationResults.longTermStability}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className={`${getBarColorClass(simulationResults.longTermStability)} h-1.5 rounded-full`} style={{ width: `${simulationResults.longTermStability}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-3">Healing Timeline</h4>
                      <div className="flex space-x-1">
                        <div className="flex-1">
                          <div className={`h-20 ${simulationResults.timeline.day1 ? 'bg-green-100 border-l-4 border-green-500' : 'bg-gray-100 border-l-4 border-gray-300'} rounded-r p-2 flex flex-col justify-between`}>
                            <span className="text-xs font-medium">Day 1</span>
                            <span className="text-xs text-gray-500">Initial</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className={`h-20 ${simulationResults.timeline.day7 ? 'bg-green-100 border-l-4 border-green-500' : 'bg-gray-100 border-l-4 border-gray-300'} rounded-r p-2 flex flex-col justify-between`}>
                            <span className="text-xs font-medium">Day 7</span>
                            <span className="text-xs text-gray-500">Inflam.</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className={`h-20 ${simulationResults.timeline.day14 ? 'bg-green-100 border-l-4 border-green-500' : 'bg-gray-100 border-l-4 border-gray-300'} rounded-r p-2 flex flex-col justify-between`}>
                            <span className="text-xs font-medium">Day 14</span>
                            <span className="text-xs text-gray-500">Prolif.</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className={`h-20 ${simulationResults.timeline.day30 ? 'bg-green-100 border-l-4 border-green-500' : 'bg-gray-100 border-l-4 border-gray-300'} rounded-r p-2 flex flex-col justify-between`}>
                            <span className="text-xs font-medium">Day 30</span>
                            <span className="text-xs text-gray-500">Remod.</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className={`h-20 ${simulationResults.timeline.day90 ? 'bg-green-100 border-l-4 border-green-500' : 'bg-gray-100 border-l-4 border-gray-300'} rounded-r p-2 flex flex-col justify-between`}>
                            <span className="text-xs font-medium">Day 90</span>
                            <span className="text-xs text-gray-500">Final</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        className="mt-3 w-full text-primary-600 border border-primary-600 hover:bg-primary-50 font-medium py-2 px-4 rounded-lg"
                        onClick={() => awardBadge('simulation_expert')}
                      >
                        View Time-Lapse
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimulateModule;