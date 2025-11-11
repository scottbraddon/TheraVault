import {
  type Client,
  type InsertClient,
  type Session,
  type InsertSession,
  type Note,
  type InsertNote,
  type Framework,
  type InsertFramework,
  type FrameworkFile,
  type InsertFrameworkFile,
  type ChatMessage,
  type InsertChatMessage,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Clients
  getClient(id: string): Promise<Client | undefined>;
  getAllClients(): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: string): Promise<boolean>;

  // Sessions
  getSession(id: string): Promise<Session | undefined>;
  getSessionsByClient(clientId: string): Promise<Session[]>;
  getAllSessions(): Promise<Session[]>;
  createSession(session: InsertSession): Promise<Session>;
  updateSession(id: string, session: Partial<InsertSession>): Promise<Session | undefined>;

  // Notes
  getNotesBySession(sessionId: string): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;

  // Frameworks
  getFramework(id: string): Promise<Framework | undefined>;
  getAllFrameworks(): Promise<Framework[]>;
  createFramework(framework: InsertFramework): Promise<Framework>;
  updateFramework(id: string, framework: Partial<InsertFramework>): Promise<Framework | undefined>;
  deleteFramework(id: string): Promise<boolean>;

  // Framework Files
  getFrameworkFiles(frameworkId: string): Promise<FrameworkFile[]>;
  createFrameworkFile(file: InsertFrameworkFile): Promise<FrameworkFile>;

  // Chat Messages
  getChatMessages(clientId?: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private clients: Map<string, Client>;
  private sessions: Map<string, Session>;
  private notes: Map<string, Note>;
  private frameworks: Map<string, Framework>;
  private frameworkFiles: Map<string, FrameworkFile>;
  private chatMessages: Map<string, ChatMessage>;

  constructor() {
    this.clients = new Map();
    this.sessions = new Map();
    this.notes = new Map();
    this.frameworks = new Map();
    this.frameworkFiles = new Map();
    this.chatMessages = new Map();
  }

  // Clients
  async getClient(id: string): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async getAllClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = randomUUID();
    const client: Client = {
      id,
      name: insertClient.name,
      email: insertClient.email ?? null,
      phone: insertClient.phone ?? null,
      status: insertClient.status ?? "active",
      firstSession: insertClient.firstSession ?? null,
      createdAt: new Date(),
    };
    this.clients.set(id, client);
    return client;
  }

  async updateClient(id: string, updateData: Partial<InsertClient>): Promise<Client | undefined> {
    const client = this.clients.get(id);
    if (!client) return undefined;

    const updated: Client = { ...client, ...updateData };
    this.clients.set(id, updated);
    return updated;
  }

  async deleteClient(id: string): Promise<boolean> {
    // Cascade delete: remove all associated sessions, notes, and chat messages
    const sessions = await this.getSessionsByClient(id);
    
    // Delete notes for each session
    for (const session of sessions) {
      const notes = await this.getNotesBySession(session.id);
      for (const note of notes) {
        this.notes.delete(note.id);
      }
      // Delete the session itself
      this.sessions.delete(session.id);
    }
    
    // Delete chat messages for this client
    const chatMessages = await this.getChatMessages(id);
    for (const message of chatMessages) {
      this.chatMessages.delete(message.id);
    }
    
    // Finally delete the client
    return this.clients.delete(id);
  }

  // Sessions
  async getSession(id: string): Promise<Session | undefined> {
    return this.sessions.get(id);
  }

  async getSessionsByClient(clientId: string): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter(
      (session) => session.clientId === clientId
    );
  }

  async getAllSessions(): Promise<Session[]> {
    return Array.from(this.sessions.values());
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = randomUUID();
    const session: Session = {
      id,
      clientId: insertSession.clientId,
      date: insertSession.date,
      duration: insertSession.duration,
      type: insertSession.type,
      status: insertSession.status ?? "pending",
      audioFilePath: insertSession.audioFilePath ?? null,
      transcription: insertSession.transcription ?? null,
      createdAt: new Date(),
    };
    this.sessions.set(id, session);
    return session;
  }

  async updateSession(id: string, updateData: Partial<InsertSession>): Promise<Session | undefined> {
    const session = this.sessions.get(id);
    if (!session) return undefined;

    const updated: Session = { ...session, ...updateData };
    this.sessions.set(id, updated);
    return updated;
  }

  // Notes
  async getNotesBySession(sessionId: string): Promise<Note[]> {
    return Array.from(this.notes.values()).filter(
      (note) => note.sessionId === sessionId
    );
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const id = randomUUID();
    const note: Note = {
      id,
      sessionId: insertNote.sessionId,
      content: insertNote.content,
      isAiGenerated: insertNote.isAiGenerated ?? false,
      createdAt: new Date(),
    };
    this.notes.set(id, note);
    return note;
  }

  // Frameworks
  async getFramework(id: string): Promise<Framework | undefined> {
    return this.frameworks.get(id);
  }

  async getAllFrameworks(): Promise<Framework[]> {
    return Array.from(this.frameworks.values());
  }

  async createFramework(insertFramework: InsertFramework): Promise<Framework> {
    const id = randomUUID();
    const framework: Framework = {
      id,
      name: insertFramework.name,
      description: insertFramework.description ?? null,
      tags: insertFramework.tags ?? null,
      templateStructure: insertFramework.templateStructure ?? null,
      createdAt: new Date(),
    };
    this.frameworks.set(id, framework);
    return framework;
  }

  async updateFramework(id: string, updateData: Partial<InsertFramework>): Promise<Framework | undefined> {
    const framework = this.frameworks.get(id);
    if (!framework) return undefined;

    const updated: Framework = { ...framework, ...updateData };
    this.frameworks.set(id, updated);
    return updated;
  }

  async deleteFramework(id: string): Promise<boolean> {
    return this.frameworks.delete(id);
  }

  // Framework Files
  async getFrameworkFiles(frameworkId: string): Promise<FrameworkFile[]> {
    return Array.from(this.frameworkFiles.values()).filter(
      (file) => file.frameworkId === frameworkId
    );
  }

  async createFrameworkFile(insertFile: InsertFrameworkFile): Promise<FrameworkFile> {
    const id = randomUUID();
    const file: FrameworkFile = {
      ...insertFile,
      id,
      createdAt: new Date(),
    };
    this.frameworkFiles.set(id, file);
    return file;
  }

  // Chat Messages
  async getChatMessages(clientId?: string): Promise<ChatMessage[]> {
    const messages = Array.from(this.chatMessages.values());
    if (clientId) {
      return messages.filter((msg) => msg.clientId === clientId);
    }
    return messages.filter((msg) => msg.clientId === null);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      id,
      clientId: insertMessage.clientId ?? null,
      role: insertMessage.role,
      content: insertMessage.content,
      timestamp: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
