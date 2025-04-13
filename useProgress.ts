import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Define progress levels and their XP requirements
const LEVELS = [
  { level: 1, name: 'Novice', minXp: 0, maxXp: 999 },
  { level: 2, name: 'BioScientist', minXp: 1000, maxXp: 2499 },
  { level: 3, name: 'BioEngineer', minXp: 2500, maxXp: 4999 },
  { level: 4, name: 'BioMaster', minXp: 5000, maxXp: 9999 },
  { level: 5, name: 'BioVisionary', minXp: 10000, maxXp: Infinity }
];

// Define badge types
export type BadgeType = 'skin_savior' | 'heart_hero' | 'cornea_creator' | 'quiz_master' | 'simulation_expert';

// Define badge metadata
export const BADGES = {
  skin_savior: { 
    name: 'Skin Savior', 
    description: 'Successfully simulated a skin graft implantation',
    icon: '🧪'
  },
  heart_hero: { 
    name: 'Heart Hero', 
    description: 'Completed all heart valve learning modules', 
    icon: '❤️' 
  },
  cornea_creator: { 
    name: 'Cornea Creator', 
    description: 'Achieved 90% success rate in cornea bioprinting',
    icon: '👁️'
  },
  quiz_master: { 
    name: 'Quiz Master', 
    description: 'Earned 100% on the bioprinting materials quiz',
    icon: '🧠'
  },
  simulation_expert: { 
    name: 'Simulation Expert', 
    description: 'Completed 10 successful organ implant simulations',
    icon: '🧬'
  }
};

interface ProgressHookResult {
  xp: number;
  level: number;
  levelName: string;
  progress: number; // 0-100 percentage through current level
  badges: BadgeType[];
  completeItem: (moduleId: string, itemId: string) => Promise<void>;
  awardBadge: (badgeType: BadgeType) => Promise<void>;
  isLoading: boolean;
}

// This is a mock implementation as we don't have authentication yet
// In a real app, this would retrieve the actual user ID from auth context
const getUserId = () => 1;

export const useProgress = (): ProgressHookResult => {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [levelName, setLevelName] = useState('Novice');
  const [progress, setProgress] = useState(0);
  const [badges, setBadges] = useState<BadgeType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Calculate level and progress based on XP
  const calculateLevel = (xpPoints: number) => {
    const currentLevel = LEVELS.find(l => 
      xpPoints >= l.minXp && xpPoints <= l.maxXp
    ) || LEVELS[0];
    
    setLevel(currentLevel.level);
    setLevelName(currentLevel.name);
    
    // Calculate percentage progress in current level
    const levelXpRange = currentLevel.maxXp - currentLevel.minXp;
    const xpInCurrentLevel = xpPoints - currentLevel.minXp;
    const percentage = levelXpRange === Infinity 
      ? 100 
      : Math.min(100, Math.round((xpInCurrentLevel / levelXpRange) * 100));
    
    setProgress(percentage);
  };

  // Fetch user progress
  useEffect(() => {
    const fetchUserProgress = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would fetch from the API
        // For now, let's use mock data
        const mockUserData = {
          id: 1,
          username: "user",
          level: 2,
          xpPoints: 1450,
        };
        
        setXp(mockUserData.xpPoints);
        calculateLevel(mockUserData.xpPoints);
        
        // Fetch badges
        const mockBadges: BadgeType[] = ['heart_hero', 'quiz_master'];
        setBadges(mockBadges);
      } catch (error) {
        console.error("Failed to fetch user progress:", error);
        toast({
          title: "Error",
          description: "Failed to load your progress. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProgress();
  }, []);

  // Complete a learning item or activity
  const completeItem = async (moduleId: string, itemId: string) => {
    setIsLoading(true);
    try {
      const userId = getUserId();
      
      // In a real implementation, this would send to the API
      // const response = await apiRequest('POST', `/api/users/${userId}/progress`, {
      //   moduleId,
      //   itemId,
      //   completed: true,
      //   completedAt: new Date().toISOString()
      // });
      
      // Mock response: add 100 XP
      const newXp = xp + 100;
      setXp(newXp);
      calculateLevel(newXp);
      
      toast({
        title: "Progress Updated",
        description: "You earned 100 XP!",
      });
    } catch (error) {
      console.error("Failed to update progress:", error);
      toast({
        title: "Error",
        description: "Failed to update your progress. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Award a badge
  const awardBadge = async (badgeType: BadgeType) => {
    // Check if badge already earned
    if (badges.includes(badgeType)) return;
    
    setIsLoading(true);
    try {
      const userId = getUserId();
      
      // In a real implementation, this would send to the API
      // const response = await apiRequest('POST', `/api/users/${userId}/badges`, {
      //   badgeType
      // });
      
      // Mock response: add badge and 250 XP
      const newBadges = [...badges, badgeType];
      setBadges(newBadges);
      
      const newXp = xp + 250;
      setXp(newXp);
      calculateLevel(newXp);
      
      toast({
        title: "Badge Earned!",
        description: `You earned the ${BADGES[badgeType].name} badge and 250 XP!`,
      });
    } catch (error) {
      console.error("Failed to award badge:", error);
      toast({
        title: "Error",
        description: "Failed to award badge. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    xp,
    level,
    levelName,
    progress,
    badges,
    completeItem,
    awardBadge,
    isLoading
  };
};
