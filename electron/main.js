import { app, BrowserWindow } from 'electron';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import isDev from 'electron-is-dev';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;
let httpServer;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    show: false,
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  const startURL = isDev
    ? 'http://localhost:5000'
    : 'http://localhost:5000';

  mainWindow.loadURL(startURL);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

async function startServer() {
  try {
    // Set NODE_ENV to production for packaged builds
    if (!isDev) {
      process.env.NODE_ENV = 'production';
    }
    
    let serverModule;
    
    if (isDev) {
      // Development: For now, Electron dev mode expects the regular dev server
      // to be running separately via `npm run dev`
      // This avoids TypeScript loading complexity in Electron
      console.log('Development mode: Connect to existing dev server at localhost:5000');
      console.log('Make sure "npm run dev" is running in a separate terminal');
      return null;
    } else {
      // Production: import bundled JavaScript server
      console.log('Starting production server...');
      console.log('NODE_ENV:', process.env.NODE_ENV);
      serverModule = await import('../dist/index.js');
    }

    // The server module exports a default function that returns the HTTP server
    if (serverModule && typeof serverModule.default === 'function') {
      httpServer = await serverModule.default();
      console.log('Express server started successfully');
    } else if (isDev) {
      // Dev mode: server should be running separately
      return null;
    } else {
      throw new Error('Server module did not export a default function');
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    throw error;
  }
}

app.whenReady().then(async () => {
  try {
    await startServer();
    
    // Wait for server to be ready (longer in dev mode since it's external)
    const waitTime = isDev ? 3000 : 2000;
    console.log(`Waiting ${waitTime}ms for server to be ready...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    createWindow();
  } catch (error) {
    console.error('Failed to start application:', error);
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (httpServer) {
    httpServer.close();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (httpServer) {
    httpServer.close();
  }
});
