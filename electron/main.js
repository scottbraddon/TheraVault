import { app, BrowserWindow, dialog } from 'electron';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFileSync, appendFileSync } from 'fs';
import isDev from 'electron-is-dev';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;
let httpServer;

// Setup logging to file in user's temp directory
const logPath = join(app.getPath('temp'), 'theravault-error.log');

function logToFile(message, error = null) {
  const timestamp = new Date().toISOString();
  let logMessage = `[${timestamp}] ${message}\n`;
  
  if (error) {
    logMessage += `Error: ${error.message}\n`;
    if (error.stack) {
      logMessage += `Stack: ${error.stack}\n`;
    }
  }
  
  try {
    appendFileSync(logPath, logMessage);
    console.log(message);
    if (error) console.error(error);
  } catch (e) {
    console.error('Failed to write to log file:', e);
  }
}

// Initialize log file
try {
  writeFileSync(logPath, `TheraVault Error Log - Started at ${new Date().toISOString()}\n`);
  logToFile(`Log file created at: ${logPath}`);
  logToFile(`Running in ${isDev ? 'development' : 'production'} mode`);
  logToFile(`App path: ${app.getAppPath()}`);
} catch (e) {
  console.error('Failed to initialize log file:', e);
}

function showErrorDialog(message, error = null) {
  const errorDetails = error ? `\n\nError: ${error.message}` : '';
  dialog.showErrorBox(
    'TheraVault Startup Error',
    `${message}${errorDetails}\n\nLog file: ${logPath}\n\nPlease check the log file for more details.`
  );
}

function createWindow() {
  logToFile('Creating main window...');
  
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
    logToFile('Window ready to show');
    mainWindow.show();
  });

  const startURL = 'http://localhost:5000';
  logToFile(`Loading URL: ${startURL}`);

  mainWindow.loadURL(startURL);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    logToFile('Main window closed');
    mainWindow = null;
  });
}

async function startServer() {
  try {
    // Set NODE_ENV to production for packaged builds
    if (!isDev) {
      process.env.NODE_ENV = 'production';
      logToFile('Set NODE_ENV to production');
    }
    
    let serverModule;
    
    if (isDev) {
      // Development: Electron dev mode expects the regular dev server
      // to be running separately via `npm run dev`
      logToFile('Development mode: Expecting external dev server at localhost:5000');
      logToFile('Make sure "npm run dev" is running in a separate terminal');
      return null;
    } else {
      // Production: import bundled JavaScript server
      logToFile('Starting production server...');
      
      // Use app.getAppPath() for proper path resolution in packaged apps
      const appPath = app.getAppPath();
      const serverPath = join(appPath, 'dist', 'index.js');
      logToFile(`Attempting to import server from: ${serverPath}`);
      
      try {
        // Try importing with proper path resolution
        serverModule = await import(serverPath);
        logToFile('Server module imported successfully');
      } catch (importError) {
        logToFile('Failed to import server module', importError);
        throw new Error(`Cannot find server module at ${serverPath}: ${importError.message}`);
      }
    }

    // The server module exports a default function that returns the HTTP server
    if (serverModule && typeof serverModule.default === 'function') {
      logToFile('Calling server module default function...');
      httpServer = await serverModule.default();
      logToFile('Express server started successfully');
    } else if (isDev) {
      // Dev mode: server should be running separately
      return null;
    } else {
      const errorMsg = 'Server module did not export a default function';
      logToFile(errorMsg);
      throw new Error(errorMsg);
    }
  } catch (error) {
    logToFile('Failed to start server', error);
    throw error;
  }
}

app.whenReady().then(async () => {
  logToFile('App ready event fired');
  
  try {
    await startServer();
    
    // Wait for server to be ready (longer in dev mode since it's external)
    const waitTime = isDev ? 3000 : 2000;
    logToFile(`Waiting ${waitTime}ms for server to be ready...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    createWindow();
  } catch (error) {
    logToFile('Fatal error during startup', error);
    showErrorDialog('Failed to start TheraVault application', error);
    app.quit();
  }

  app.on('activate', () => {
    logToFile('App activate event');
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  logToFile('All windows closed');
  if (httpServer) {
    httpServer.close();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  logToFile('App quitting...');
  if (httpServer) {
    httpServer.close();
  }
});
