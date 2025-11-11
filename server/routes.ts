import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertClientSchema, 
  insertSessionSchema, 
  insertNoteSchema, 
  insertFrameworkSchema, 
  insertChatMessageSchema,
  updateClientSchema,
  updateSessionSchema,
  updateFrameworkSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Client routes
  app.get("/api/clients", async (_req, res) => {
    try {
      const clients = await storage.getAllClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  app.get("/api/clients/:id", async (req, res) => {
    try {
      const client = await storage.getClient(req.params.id);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch client" });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const data = insertClientSchema.parse(req.body);
      const client = await storage.createClient(data);
      res.status(201).json(client);
    } catch (error) {
      res.status(400).json({ error: "Invalid client data" });
    }
  });

  app.patch("/api/clients/:id", async (req, res) => {
    try {
      const data = updateClientSchema.parse(req.body);
      const client = await storage.updateClient(req.params.id, data);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid client data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update client" });
    }
  });

  app.delete("/api/clients/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteClient(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete client" });
    }
  });

  // Session routes
  app.get("/api/sessions", async (_req, res) => {
    try {
      const sessions = await storage.getAllSessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });

  app.get("/api/sessions/:id", async (req, res) => {
    try {
      const session = await storage.getSession(req.params.id);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch session" });
    }
  });

  app.get("/api/clients/:clientId/sessions", async (req, res) => {
    try {
      const sessions = await storage.getSessionsByClient(req.params.clientId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });

  app.post("/api/sessions", async (req, res) => {
    try {
      const data = insertSessionSchema.parse(req.body);
      const session = await storage.createSession(data);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid session data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create session" });
    }
  });

  app.patch("/api/sessions/:id", async (req, res) => {
    try {
      const data = updateSessionSchema.parse(req.body);
      const session = await storage.updateSession(req.params.id, data);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid session data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update session" });
    }
  });

  // Note routes
  app.get("/api/sessions/:sessionId/notes", async (req, res) => {
    try {
      const notes = await storage.getNotesBySession(req.params.sessionId);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  });

  app.post("/api/notes", async (req, res) => {
    try {
      const data = insertNoteSchema.parse(req.body);
      const note = await storage.createNote(data);
      res.status(201).json(note);
    } catch (error) {
      res.status(400).json({ error: "Invalid note data" });
    }
  });

  // Framework routes
  app.get("/api/frameworks", async (_req, res) => {
    try {
      const frameworks = await storage.getAllFrameworks();
      res.json(frameworks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch frameworks" });
    }
  });

  app.get("/api/frameworks/:id", async (req, res) => {
    try {
      const framework = await storage.getFramework(req.params.id);
      if (!framework) {
        return res.status(404).json({ error: "Framework not found" });
      }
      res.json(framework);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch framework" });
    }
  });

  app.post("/api/frameworks", async (req, res) => {
    try {
      const data = insertFrameworkSchema.parse(req.body);
      const framework = await storage.createFramework(data);
      res.status(201).json(framework);
    } catch (error) {
      res.status(400).json({ error: "Invalid framework data" });
    }
  });

  app.patch("/api/frameworks/:id", async (req, res) => {
    try {
      const data = updateFrameworkSchema.parse(req.body);
      const framework = await storage.updateFramework(req.params.id, data);
      if (!framework) {
        return res.status(404).json({ error: "Framework not found" });
      }
      res.json(framework);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid framework data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update framework" });
    }
  });

  app.delete("/api/frameworks/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteFramework(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Framework not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete framework" });
    }
  });

  // Chat message routes
  app.get("/api/chat/messages", async (req, res) => {
    try {
      const clientId = req.query.clientId as string | undefined;
      const messages = await storage.getChatMessages(clientId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/chat/messages", async (req, res) => {
    try {
      const data = insertChatMessageSchema.parse(req.body);
      const message = await storage.createChatMessage(data);
      
      // Here we would call Ollama for AI response
      // For now, return the user message
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ error: "Invalid message data" });
    }
  });

  // AI chat endpoint that generates responses
  app.post("/api/chat/generate", async (req, res) => {
    try {
      // Validate request body
      const chatRequestSchema = z.object({
        message: z.string().min(1).max(5000),
        clientId: z.string().optional(),
      });
      
      const { message, clientId } = chatRequestSchema.parse(req.body);
      
      // Save user message
      await storage.createChatMessage({
        role: "user",
        content: message,
        clientId: clientId || null,
      });

      // TODO: Call Ollama API here
      // For now, return a placeholder response
      const aiResponse = clientId
        ? "Based on this client's session history, I would recommend a cognitive-behavioral approach focusing on thought pattern recognition."
        : "Looking across all your clients, I can help you identify patterns and suggest treatment approaches.";

      // Save AI response
      const aiMessage = await storage.createChatMessage({
        role: "assistant",
        content: aiResponse,
        clientId: clientId || null,
      });

      res.json(aiMessage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to generate response" });
    }
  });

  // Placeholder transcription endpoint
  app.post("/api/transcribe", async (req, res) => {
    try {
      // TODO: Implement faster-whisper integration
      res.json({
        transcription: "Transcription placeholder - faster-whisper integration pending",
        status: "pending",
      });
    } catch (error) {
      res.status(500).json({ error: "Transcription failed" });
    }
  });

  // Placeholder note generation endpoint
  app.post("/api/generate-notes", async (req, res) => {
    try {
      const { sessionId, transcription } = req.body;
      
      // TODO: Implement Ollama note generation
      const generatedNote = "AI-generated note placeholder - Ollama integration pending";

      const note = await storage.createNote({
        sessionId,
        content: generatedNote,
        isAiGenerated: true,
      });

      res.json(note);
    } catch (error) {
      res.status(500).json({ error: "Note generation failed" });
    }
  });

  // Download endpoint for desktop installers
  app.get("/api/download/:platform", async (req, res) => {
    const { platform } = req.params;
    
    // Map platform to installer filename
    const installerFiles: Record<string, string> = {
      windows: "TheraVault-Setup.exe",
      mac: "TheraVault.dmg",
      linux: "TheraVault.AppImage",
    };

    const filename = installerFiles[platform];
    
    if (!filename) {
      return res.status(400).json({ error: "Invalid platform. Use: windows, mac, or linux" });
    }

    const filePath = `release/${filename}`;
    
    // Check if installer file exists
    try {
      await import("fs").then(fs => fs.promises.access(filePath));
      // File exists, serve it
      res.download(filePath, filename, (err) => {
        if (err) {
          res.status(500).json({ 
            error: "Failed to download installer",
            details: err.message 
          });
        }
      });
    } catch (error) {
      // File doesn't exist yet
      res.status(404).json({
        error: "Installer not yet built",
        message: "To build the desktop installer, run: npm run electron:build",
        platform,
        filename,
        buildPath: filePath,
        instructions: [
          "1. Run 'npm run build' to build the web app",
          "2. Run 'npm run electron:build' to create the installer",
          `3. The installer will be created at ${filePath}`
        ]
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
