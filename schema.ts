import { pgTable, text, serial, integer, boolean, numeric, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  level: integer("level").default(1).notNull(),
  xpPoints: integer("xp_points").default(0).notNull(),
  lastActiveAt: timestamp("last_active_at").defaultNow().notNull(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  moduleId: text("module_id").notNull(),
  itemId: text("item_id").notNull(),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
});

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  badgeType: text("badge_type").notNull(),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});

export const learnTopics = pgTable("learn_topics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  bulletPoints: json("bullet_points").$type<string[]>().notNull(),
  readTime: integer("read_time").notNull(), // In minutes
});

export const tissueItems = pgTable("tissue_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  cellType: text("cell_type").notNull(),
  printTime: numeric("print_time").notNull(), // In hours
  bioInk: text("bio_ink").notNull(),
  labName: text("lab_name").notNull(),
  successRate: integer("success_rate").notNull(), // Percentage
  modelUrl: text("model_url"), // URL for 3D model
});

export const caseStudies = pgTable("case_studies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  location: text("location").notNull(),
  date: text("date").notNull(),
  patientProfile: text("patient_profile").notNull(),
  organ: text("organ").notNull(),
  materials: text("materials").notNull(),
  technique: text("technique").notNull(),
  outcome: text("outcome").notNull(),
  videoUrl: text("video_url"),
});

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // e.g., "quiz", "game", "simulation"
  points: integer("points").notNull(),
  difficulty: text("difficulty").notNull(), // e.g., "easy", "medium", "hard"
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).pick({
  userId: true,
  moduleId: true,
  itemId: true,
  completed: true,
  completedAt: true,
});

export const insertBadgeSchema = createInsertSchema(badges).pick({
  userId: true,
  badgeType: true,
});

export const insertLearnTopicSchema = createInsertSchema(learnTopics).pick({
  title: true,
  content: true,
  bulletPoints: true,
  readTime: true,
});

export const insertTissueItemSchema = createInsertSchema(tissueItems).pick({
  name: true,
  description: true,
  category: true,
  imageUrl: true,
  cellType: true,
  printTime: true,
  bioInk: true,
  labName: true,
  successRate: true,
  modelUrl: true,
});

export const insertCaseStudySchema = createInsertSchema(caseStudies).pick({
  title: true,
  location: true,
  date: true,
  patientProfile: true,
  organ: true,
  materials: true,
  technique: true,
  outcome: true,
  videoUrl: true,
});

export const insertChallengeSchema = createInsertSchema(challenges).pick({
  title: true,
  description: true,
  type: true,
  points: true,
  difficulty: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;

export type Badge = typeof badges.$inferSelect;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;

export type LearnTopic = typeof learnTopics.$inferSelect;
export type InsertLearnTopic = z.infer<typeof insertLearnTopicSchema>;

export type TissueItem = typeof tissueItems.$inferSelect;
export type InsertTissueItem = z.infer<typeof insertTissueItemSchema>;

export type CaseStudy = typeof caseStudies.$inferSelect;
export type InsertCaseStudy = z.infer<typeof insertCaseStudySchema>;

export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
