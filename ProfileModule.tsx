import React from 'react';
import { useProgress, BADGES, BadgeType } from '@/hooks/useProgress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ProfileModule: React.FC = () => {
  const { level, levelName, progress, xp, badges, isLoading } = useProgress();

  // Mock completed courses and certificates for demo
  const completedItems = [
    { id: 1, type: 'topic', title: 'Introduction to Bioprinting', completedAt: '2023-10-15' },
    { id: 2, type: 'topic', title: 'Bioprinting Materials', completedAt: '2023-10-18' },
    { id: 3, type: 'quiz', title: 'Bioprinting Basics Quiz', score: '18/20', completedAt: '2023-10-20' },
    { id: 4, type: 'simulation', title: 'Heart Valve Implantation', completedAt: '2023-11-02' },
  ];

  const certificates = [
    { id: 1, title: 'Bioprinting Fundamentals', issuedAt: '2023-10-25' },
    { id: 2, title: 'Cardiovascular Tissue Engineering', issuedAt: '2023-11-10' },
  ];

  if (isLoading) {
    return (
      <section id="profile" className="py-8 px-4 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/4 mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          
          <div className="h-80 bg-gray-200 rounded-xl"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="profile" className="py-8 px-4 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-gray-800">Profile & Progress</h2>
          <p className="text-gray-600">Track your learning journey and achievements in bioprinting</p>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary-700 text-3xl font-bold">
                  {level}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">{levelName}</h3>
              <p className="text-gray-500 mt-1">Current Level</p>
              
              <div className="w-full mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Progress to next level</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">{xp.toLocaleString()}</h3>
              <p className="text-gray-500 mt-1">Total XP Points</p>
              <p className="text-sm text-gray-600 mt-2">Earned through completing modules, quizzes, and challenges</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">{badges.length}</h3>
              <p className="text-gray-500 mt-1">Badges Earned</p>
              <div className="flex mt-2 space-x-1">
                {badges.map((badge) => (
                  <div key={badge} className="text-xl" title={BADGES[badge].name}>
                    {BADGES[badge].icon}
                  </div>
                ))}
                {badges.length === 0 && <p className="text-sm text-gray-600">Complete challenges to earn badges</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Progress */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Learning Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="badges">
            <TabsList className="mb-4">
              <TabsTrigger value="badges">Badges</TabsTrigger>
              <TabsTrigger value="completed">Completed Items</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="badges">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(BADGES).map(([key, badge]) => {
                  const isEarned = badges.includes(key as BadgeType);
                  return (
                    <div 
                      key={key} 
                      className={`p-4 rounded-lg border ${
                        isEarned ? 'bg-primary-50 border-primary-200' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`text-3xl mr-3 ${isEarned ? '' : 'opacity-30'}`}>
                          {badge.icon}
                        </div>
                        <div>
                          <h4 className={`font-medium ${isEarned ? 'text-gray-900' : 'text-gray-500'}`}>
                            {badge.name}
                            {isEarned && (
                              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                Earned
                              </span>
                            )}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="completed">
              <div className="divide-y">
                {completedItems.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <div className="flex items-center mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          item.type === 'topic' ? 'bg-blue-100 text-blue-800' :
                          item.type === 'quiz' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </span>
                        {item.score && (
                          <span className="ml-2 text-xs text-gray-600">
                            Score: {item.score}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        Completed on {new Date(item.completedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="certificates">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="border rounded-lg p-4 bg-gradient-to-r from-primary-50 to-secondary-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <h4 className="text-lg font-medium text-gray-900">{cert.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Issued on {new Date(cert.issuedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button className="text-primary-600 hover:text-primary-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button className="text-sm text-primary-600 hover:text-primary-800 font-medium">
                        View Certificate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-blue-100">
              <h4 className="font-medium text-gray-900 mb-2">Complete Your Learning</h4>
              <p className="text-sm text-gray-600 mb-3">
                You've completed 2 out of 5 bioprinting fundamentals topics.
              </p>
              <button className="text-sm text-primary-600 hover:text-primary-800 font-medium">
                Continue Learning →
              </button>
            </div>
            
            <div className="p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-purple-100">
              <h4 className="font-medium text-gray-900 mb-2">Try a Simulation</h4>
              <p className="text-sm text-gray-600 mb-3">
                Test your knowledge by simulating a cornea implantation.
              </p>
              <button className="text-sm text-primary-600 hover:text-primary-800 font-medium">
                Start Simulation →
              </button>
            </div>
            
            <div className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-green-100">
              <h4 className="font-medium text-gray-900 mb-2">Join the Challenge</h4>
              <p className="text-sm text-gray-600 mb-3">
                Compete in this week's Organ Builder challenge.
              </p>
              <button className="text-sm text-primary-600 hover:text-primary-800 font-medium">
                View Challenge →
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ProfileModule;
