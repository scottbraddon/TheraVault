import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  status: text("status").notNull().default("active"),
  firstSession: timestamp("first_session"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
});

export const updateClientSchema = insertClientSchema.partial();

export type InsertClient = z.infer<typeof insertClientSchema>;
export type UpdateClient = z.infer<typeof updateClientSchema>;
export type Client = typeof clients.$inferSelect;

export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull().references(() => clients.id),
  date: timestamp("date").notNull(),
  duration: integer("duration").notNull(),
  sessionType: text("session_type").notNull(),
  status: text("status").notNull().default("pending"),
  audioFilePath: text("audio_file_path"),
  transcription: text("transcription"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  createdAt: true,
}).extend({
  date: z.union([z.string(), z.date()]).transform((val) => 
    typeof val === "string" ? new Date(val) : val
  ),
});

export const updateSessionSchema = insertSessionSchema.partial();

export type InsertSession = z.infer<typeof insertSessionSchema>;
export type UpdateSession = z.infer<typeof updateSessionSchema>;
export type Session = typeof sessions.$inferSelect;

export const notes = pgTable("notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => sessions.id),
  content: text("content").notNull(),
  isAiGenerated: boolean("is_ai_generated").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  createdAt: true,
});

export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = typeof notes.$inferSelect;

export const frameworks = pgTable("frameworks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  tags: text("tags").array(),
  templateStructure: text("template_structure"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertFrameworkSchema = createInsertSchema(frameworks).omit({
  id: true,
  createdAt: true,
});

export const updateFrameworkSchema = insertFrameworkSchema.partial();

export type InsertFramework = z.infer<typeof insertFrameworkSchema>;
export type UpdateFramework = z.infer<typeof updateFrameworkSchema>;
export type Framework = typeof frameworks.$inferSelect;

export const frameworkFiles = pgTable("framework_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  frameworkId: varchar("framework_id").notNull().references(() => frameworks.id),
  fileName: text("file_name").notNull(),
  filePath: text("file_path").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertFrameworkFileSchema = createInsertSchema(frameworkFiles).omit({
  id: true,
  createdAt: true,
});

export type InsertFrameworkFile = z.infer<typeof insertFrameworkFileSchema>;
export type FrameworkFile = typeof frameworkFiles.$inferSelect;

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").references(() => clients.id),
  role: text("role").notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
