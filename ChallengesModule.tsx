import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Challenge } from '@shared/schema';
import { useProgress } from '@/hooks/useProgress';
import { BADGES, type BadgeType } from '@/hooks/useProgress';

const ChallengesModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { completeItem, awardBadge, badges } = useProgress();
  
  const { data: challenges, isLoading, error } = useQuery<Challenge[]>({
    queryKey: ['/api/challenges'],
  });

  const handleStartChallenge = (challenge: Challenge) => {
    completeItem('challenges', `start_challenge_${challenge.id}`);
    
    // Award a badge based on challenge type
    if (challenge.type === 'quiz' && challenge.title.includes('Time Attack')) {
      awardBadge('quiz_master');
    } else if (challenge.type === 'simulation' && challenge.title.includes('Simulation Challenge')) {
      awardBadge('simulation_expert');
    }
  };

  // Filter challenges based on active tab
  const filteredChallenges = challenges?.filter(challenge => {
    if (activeTab === 'all') return true;
    return challenge.type === activeTab;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getChallengeTypeIcon = (type: string) => {
    switch (type) {
      case 'game':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'quiz':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'simulation':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
    }
  };

  return (
    <section id="challenges" className="py-8 px-4 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-gray-800">Challenges & Games</h2>
          <p className="text-gray-600">Test your bioprinting knowledge with fun tasks and competitions</p>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Challenges</TabsTrigger>
          <TabsTrigger value="game">Games</TabsTrigger>
          <TabsTrigger value="quiz">Quizzes</TabsTrigger>
          <TabsTrigger value="simulation">Simulations</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-white overflow-hidden animate-pulse">
                  <CardHeader className="p-5">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent className="p-5 pt-0">
                    <div className="h-20 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-8 bg-gray-300 rounded w-24"></div>
                      <div className="h-8 bg-gray-200 rounded w-24"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-red-500">Failed to load challenges. Please try again later.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChallenges?.map((challenge) => (
                <Card key={challenge.id} className="bg-white overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="p-5 pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold text-gray-800">{challenge.title}</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">{challenge.description}</p>
                      </div>
                      <div className="ml-4">
                        {getChallengeTypeIcon(challenge.type)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 pt-2">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium">{challenge.points} XP Points</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </span>
                    </div>
                    
                    <Button 
                      className={challenge.type === 'game' ? 
                        "w-full bg-primary-600 hover:bg-primary-700 text-white" : 
                        challenge.type === 'quiz' ? 
                          "w-full bg-accent-600 hover:bg-accent-700 text-white" :
                          "w-full bg-secondary-600 hover:bg-secondary-700 text-white"
                      }
                      onClick={() => handleStartChallenge(challenge)}
                    >
                      Start Challenge
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {filteredChallenges?.length === 0 && (
                <div className="col-span-full text-center p-8 bg-white rounded-lg shadow">
                  <p className="text-gray-500">No challenges available in this category.</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Leaderboard Section */}
      <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-primary-600 px-6 py-4">
          <h3 className="text-white text-xl font-bold">Global Leaderboard</h3>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div className="flex items-center mb-4 sm:mb-0">
              <span className="bg-yellow-400 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">1</span>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-2">
                  <span className="text-primary-700 font-medium">JD</span>
                </div>
                <span className="font-medium">JohnDoe</span>
              </div>
              <div className="ml-4 flex">
                {['heart_hero', 'quiz_master'].map((badge) => (
                  <div key={badge} className="ml-1 text-lg" title={BADGES[badge as BadgeType].name}>
                    {BADGES[badge as BadgeType].icon}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-bold">4,350 XP</span>
              <span className="ml-4 text-green-600 font-medium">Level 5: BioVisionary</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div className="flex items-center mb-4 sm:mb-0">
              <span className="bg-gray-300 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">2</span>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-2">
                  <span className="text-primary-700 font-medium">AS</span>
                </div>
                <span className="font-medium">AliceSmith</span>
              </div>
              <div className="ml-4 flex">
                {['skin_savior', 'simulation_expert', 'cornea_creator'].map((badge) => (
                  <div key={badge} className="ml-1 text-lg" title={BADGES[badge as BadgeType].name}>
                    {BADGES[badge as BadgeType].icon}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-bold">3,875 XP</span>
              <span className="ml-4 text-green-600 font-medium">Level 4: BioMaster</span>
            </div>
          </div>
          
          <div className="flex justify-center mt-6">
            <Button variant="outline">View Full Leaderboard</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChallengesModule;
