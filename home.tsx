import React from 'react';
import { useLocation } from 'wouter';
import LearnModule from '@/components/learn/LearnModule';
import ExploreModule from '@/components/explore/ExploreModule';
import SimulateModule from '@/components/simulate/SimulateModule';
import BioCaseModule from '@/components/biocase/BioCaseModule';
import ChallengesModule from '@/components/challenges/ChallengesModule';
import ProfileModule from '@/components/profile/ProfileModule';

const Home: React.FC = () => {
  const [location] = useLocation();
  
  // Determine which module to show based on the current route
  const renderModule = () => {
    const path = location.slice(1); // Remove the leading slash
    
    switch (path) {
      case '':
        return <LearnModule />;
      case 'explore':
        return <ExploreModule />;
      case 'simulate':
        return <SimulateModule />;
      case 'biocase':
        return <BioCaseModule />;
      case 'challenges':
        return <ChallengesModule />;
      case 'profile':
        return <ProfileModule />;
      default:
        return <LearnModule />;
    }
  };
  
  return (
    <div>
      {renderModule()}
    </div>
  );
};

export default Home;
