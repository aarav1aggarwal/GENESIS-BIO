import { 
  users, 
  userProgress, 
  badges, 
  learnTopics, 
  tissueItems, 
  caseStudies, 
  challenges,
  type User, 
  type InsertUser,
  type UserProgress,
  type InsertUserProgress,
  type Badge,
  type InsertBadge,
  type LearnTopic,
  type InsertLearnTopic,
  type TissueItem,
  type InsertTissueItem,
  type CaseStudy,
  type InsertCaseStudy,
  type Challenge,
  type InsertChallenge
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserProgress(userId: number, xpToAdd: number): Promise<User>;
  
  // User Progress methods
  getUserProgress(userId: number): Promise<UserProgress[]>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  
  // Badge methods
  getUserBadges(userId: number): Promise<Badge[]>;
  createBadge(badge: InsertBadge): Promise<Badge>;
  
  // Learn Topic methods
  getAllLearnTopics(): Promise<LearnTopic[]>;
  getLearnTopic(id: number): Promise<LearnTopic | undefined>;
  createLearnTopic(topic: InsertLearnTopic): Promise<LearnTopic>;
  
  // Tissue Item methods
  getAllTissueItems(): Promise<TissueItem[]>;
  getTissueItem(id: number): Promise<TissueItem | undefined>;
  getTissueItemsByFilter(filter: Partial<TissueItem>): Promise<TissueItem[]>;
  createTissueItem(item: InsertTissueItem): Promise<TissueItem>;
  
  // Case Study methods
  getAllCaseStudies(): Promise<CaseStudy[]>;
  getCaseStudy(id: number): Promise<CaseStudy | undefined>;
  createCaseStudy(study: InsertCaseStudy): Promise<CaseStudy>;
  
  // Challenge methods
  getAllChallenges(): Promise<Challenge[]>;
  getChallenge(id: number): Promise<Challenge | undefined>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userProgressMap: Map<number, UserProgress>;
  private badgesMap: Map<number, Badge>;
  private learnTopicsMap: Map<number, LearnTopic>;
  private tissueItemsMap: Map<number, TissueItem>;
  private caseStudiesMap: Map<number, CaseStudy>;
  private challengesMap: Map<number, Challenge>;
  
  // Counters for IDs
  private userIdCounter: number;
  private progressIdCounter: number;
  private badgeIdCounter: number;
  private learnTopicIdCounter: number;
  private tissueItemIdCounter: number;
  private caseStudyIdCounter: number;
  private challengeIdCounter: number;

  constructor() {
    this.users = new Map();
    this.userProgressMap = new Map();
    this.badgesMap = new Map();
    this.learnTopicsMap = new Map();
    this.tissueItemsMap = new Map();
    this.caseStudiesMap = new Map();
    this.challengesMap = new Map();
    
    this.userIdCounter = 1;
    this.progressIdCounter = 1;
    this.badgeIdCounter = 1;
    this.learnTopicIdCounter = 1;
    this.tissueItemIdCounter = 1;
    this.caseStudyIdCounter = 1;
    this.challengeIdCounter = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      level: 1, 
      xpPoints: 0, 
      lastActiveAt: now 
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserProgress(userId: number, xpToAdd: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    const newXp = user.xpPoints + xpToAdd;
    // Simple level calculation, adjust as needed
    const newLevel = Math.floor(newXp / 1000) + 1;
    
    const updatedUser: User = {
      ...user,
      xpPoints: newXp,
      level: newLevel,
      lastActiveAt: new Date()
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  // User Progress methods
  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgressMap.values()).filter(
      (progress) => progress.userId === userId
    );
  }
  
  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const id = this.progressIdCounter++;
    const progress: UserProgress = {
      ...insertProgress,
      id,
      completed: insertProgress.completed ?? false,
      completedAt: insertProgress.completedAt ?? null
    };
    this.userProgressMap.set(id, progress);
    return progress;
  }
  
  // Badge methods
  async getUserBadges(userId: number): Promise<Badge[]> {
    return Array.from(this.badgesMap.values()).filter(
      (badge) => badge.userId === userId
    );
  }
  
  async createBadge(insertBadge: InsertBadge): Promise<Badge> {
    const id = this.badgeIdCounter++;
    const badge: Badge = {
      ...insertBadge,
      id,
      earnedAt: new Date()
    };
    this.badgesMap.set(id, badge);
    return badge;
  }
  
  // Learn Topic methods
  async getAllLearnTopics(): Promise<LearnTopic[]> {
    return Array.from(this.learnTopicsMap.values());
  }
  
  async getLearnTopic(id: number): Promise<LearnTopic | undefined> {
    return this.learnTopicsMap.get(id);
  }
  
  async createLearnTopic(insertTopic: InsertLearnTopic): Promise<LearnTopic> {
    const id = this.learnTopicIdCounter++;
    // Ensure bulletPoints is properly typed as string[]
    const bulletPoints = Array.isArray(insertTopic.bulletPoints) ? 
      insertTopic.bulletPoints as string[] : 
      [];
    
    const topic: LearnTopic = {
      ...insertTopic,
      id,
      bulletPoints
    };
    this.learnTopicsMap.set(id, topic);
    return topic;
  }
  
  // Tissue Item methods
  async getAllTissueItems(): Promise<TissueItem[]> {
    return Array.from(this.tissueItemsMap.values());
  }
  
  async getTissueItem(id: number): Promise<TissueItem | undefined> {
    return this.tissueItemsMap.get(id);
  }
  
  async getTissueItemsByFilter(filter: Partial<TissueItem>): Promise<TissueItem[]> {
    return Array.from(this.tissueItemsMap.values()).filter(item => {
      for (const [key, value] of Object.entries(filter)) {
        if (item[key as keyof TissueItem] !== value) return false;
      }
      return true;
    });
  }
  
  async createTissueItem(insertItem: InsertTissueItem): Promise<TissueItem> {
    const id = this.tissueItemIdCounter++;
    const item: TissueItem = {
      ...insertItem,
      id,
      imageUrl: insertItem.imageUrl ?? null,
      modelUrl: insertItem.modelUrl ?? null,
      printTime: insertItem.printTime?.toString() ?? "0" // Convert to string for schema compatibility
    };
    this.tissueItemsMap.set(id, item);
    return item;
  }
  
  // Case Study methods
  async getAllCaseStudies(): Promise<CaseStudy[]> {
    return Array.from(this.caseStudiesMap.values());
  }
  
  async getCaseStudy(id: number): Promise<CaseStudy | undefined> {
    return this.caseStudiesMap.get(id);
  }
  
  async createCaseStudy(insertStudy: InsertCaseStudy): Promise<CaseStudy> {
    const id = this.caseStudyIdCounter++;
    const study: CaseStudy = {
      ...insertStudy,
      id,
      videoUrl: insertStudy.videoUrl ?? null
    };
    this.caseStudiesMap.set(id, study);
    return study;
  }
  
  // Challenge methods
  async getAllChallenges(): Promise<Challenge[]> {
    return Array.from(this.challengesMap.values());
  }
  
  async getChallenge(id: number): Promise<Challenge | undefined> {
    return this.challengesMap.get(id);
  }
  
  async createChallenge(insertChallenge: InsertChallenge): Promise<Challenge> {
    const id = this.challengeIdCounter++;
    const challenge: Challenge = {
      ...insertChallenge,
      id
    };
    this.challengesMap.set(id, challenge);
    return challenge;
  }
  
  // Initialize sample data for demonstration
  private initializeData() {
    // Learn Topics
    this.createLearnTopic({
      title: "Introduction to Bioprinting",
      content: "Bioprinting is the process of creating cell patterns using 3D printing technologies, where cell function and viability are preserved within the printed construct.",
      bulletPoints: [
        "Historical development of bioprinting",
        "Core principles and techniques",
        "Current applications in medicine",
        "Ethical considerations"
      ],
      readTime: 20
    });
    
    this.createLearnTopic({
      title: "Bioprinting Materials",
      content: "Understanding the biomaterials used in bioprinting is essential for successful tissue engineering.",
      bulletPoints: [
        "Natural vs synthetic bioinks",
        "Cell sources and preparation",
        "Scaffold materials and structures",
        "Material characterization techniques"
      ],
      readTime: 25
    });
    
    this.createLearnTopic({
      title: "Design and Modeling",
      content: "Creating accurate digital models is crucial for successfully bioprinting functional tissues and organs.",
      bulletPoints: [
        "3D modeling software for bioprinting",
        "Converting medical images to printable models",
        "Optimizing designs for cellular viability",
        "Vascularization strategies"
      ],
      readTime: 30
    });
    
    this.createLearnTopic({
      title: "Printing Technologies",
      content: "Different bioprinting technologies offer varying capabilities and constraints for tissue fabrication.",
      bulletPoints: [
        "Extrusion-based bioprinting",
        "Inkjet bioprinting",
        "Laser-assisted bioprinting",
        "Stereolithography in bioprinting"
      ],
      readTime: 35
    });
    
    this.createLearnTopic({
      title: "Post Processing",
      content: "After printing, bioprinted constructs require specific treatments to ensure functionality and viability.",
      bulletPoints: [
        "Crosslinking methods",
        "Maturation in bioreactors",
        "Quality control and testing",
        "Preservation techniques"
      ],
      readTime: 22
    });
    
    // Tissue Items
    this.createTissueItem({
      name: "Heart Valve",
      description: "Aortic valve replacement tissue",
      category: "Cardiovascular",
      imageUrl: "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe",
      cellType: "Human Fibroblasts",
      printTime: "6.5",
      bioInk: "Fibrin-Collagen",
      labName: "Boston Medical",
      successRate: 87,
      modelUrl: "/models/heart-valve.svg"
    });
    
    this.createTissueItem({
      name: "Skin Patch",
      description: "Dermal regeneration matrix",
      category: "Dermatology",
      imageUrl: "https://images.unsplash.com/photo-1624727828489-a1e03b79bba8",
      cellType: "Keratinocytes",
      printTime: "2.5",
      bioInk: "Alginate-Gelatin",
      labName: "Wake Forest",
      successRate: 94,
      modelUrl: "/models/skin-patch.svg"
    });
    
    this.createTissueItem({
      name: "Cornea",
      description: "Transparent corneal structure",
      category: "Ophthalmology",
      imageUrl: "/images/cornea.svg",
      cellType: "Keratocytes",
      printTime: "4.0",
      bioInk: "Collagen-HA",
      labName: "AIIMS Delhi",
      successRate: 76,
      modelUrl: "/models/cornea.svg"
    });
    
    // Case Studies
    this.createCaseStudy({
      title: "First 3D Printed Heart with Blood Vessels",
      location: "Tel Aviv, Israel",
      date: "2019",
      patientProfile: "Male, 65, heart disease patient",
      organ: "Heart",
      materials: "Patient-derived cells and personalized hydrogel",
      technique: "Extrusion-based bioprinting",
      outcome: "Successful creation of personalized cardiac patches with blood vessels",
      videoUrl: "https://www.youtube.com/watch?v=example1"
    });
    
    this.createCaseStudy({
      title: "Bladder Organoids Printed and Tested",
      location: "Boston, USA",
      date: "2020",
      patientProfile: "Testing phase in mice models",
      organ: "Bladder",
      materials: "Stem cell-derived organoids",
      technique: "Droplet-based bioprinting",
      outcome: "Functional integration in animal models",
      videoUrl: "https://www.youtube.com/watch?v=example2"
    });
    
    this.createCaseStudy({
      title: "Skin Printing on Burn Victims",
      location: "Stockholm, Sweden",
      date: "2022",
      patientProfile: "Female, 38, severe third-degree burns",
      organ: "Skin",
      materials: "Patient's own skin cells, collagen-based bioink",
      technique: "In-situ bioprinting",
      outcome: "Accelerated healing, reduced scarring",
      videoUrl: "https://www.youtube.com/watch?v=example3"
    });
    
    this.createCaseStudy({
      title: "Cornea Patch Printed for Blind Patient",
      location: "Delhi, India",
      date: "2023",
      patientProfile: "Male, 42, corneal blindness",
      organ: "Cornea",
      materials: "Stem cell-derived corneal cells, transparent bioink",
      technique: "Laser-assisted bioprinting",
      outcome: "Partial restoration of vision",
      videoUrl: "https://www.youtube.com/watch?v=example4"
    });
    
    // Challenges
    this.createChallenge({
      title: "Organ Builder Game",
      description: "Drag-and-drop cells and materials to print an organ",
      type: "game",
      points: 500,
      difficulty: "medium"
    });
    
    this.createChallenge({
      title: "Time Attack Quiz",
      description: "Rapid-fire questions on organs, bioprinters, materials",
      type: "quiz",
      points: 300,
      difficulty: "easy"
    });
    
    this.createChallenge({
      title: "Simulation Challenge",
      description: "Implant 3 different organs in 3 patients — save all 3!",
      type: "simulation",
      points: 1000,
      difficulty: "hard"
    });
  }
}

export const storage = new MemStorage();
