const { app, BrowserWindow, utilityProcess } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');

let serverChild;
let mainWindow = null;
const PORT = 3000;

const userDataPath = app.getPath('userData');
const dbFile = path.join(userDataPath, 'shop.db');
// Ensure folder exists
if (!fs.existsSync(userDataPath)) fs.mkdirSync(userDataPath, { recursive: true });
console.log('Database path:', dbFile);

function createWindow() {
  // Only create window once
  if (mainWindow) {
    return;
  }

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  mainWindow.loadURL(`http://localhost:${PORT}`).catch(err => {
    console.error('Failed to load URL:', err);
  });
  
  // Optional: Open dev tools in packaged app to see errors
  mainWindow.webContents.openDevTools();

  // Handle page load failures
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Page load failed:', errorCode, errorDescription);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

let pollCount = 0;
const MAX_POLL_ATTEMPTS = 100; // Stop polling after 30 seconds (100 * 300ms)

function pollServer() {
  pollCount++;
  
  if (pollCount > MAX_POLL_ATTEMPTS) {
    console.error('Server failed to start after maximum poll attempts');
    if (!mainWindow) {
      createWindow(); // Create window anyway to show error
    }
    return;
  }

  const request = http.request({ port: PORT, timeout: 1000 }, (res) => {
    if (res.statusCode === 200) {
      console.log('Server is ready!');
      createWindow();
    } else {
      setTimeout(pollServer, 300);
    }
  });
  
  request.on('error', (err) => {
    if (pollCount % 10 === 0) { // Log every 10 attempts
      console.log(`Polling server... (attempt ${pollCount})`);
    }
    setTimeout(pollServer, 300);
  });
  
  request.end();
}

app.whenReady().then(() => {
  // CORRECT PATH LOGIC
  let serverPath;
  
  if (!app.isPackaged) {
    // Development path
    serverPath = path.join(__dirname, '../.output/server/index.mjs');
  } else {
    // Production path (macOS /app/ folder inside Resources)
    serverPath = path.join(process.resourcesPath, 'app/.output/server/index.mjs');
    
    // Fallback check for Windows or different builder configs
    if (!fs.existsSync(serverPath)) {
      serverPath = path.join(process.resourcesPath, '.output/server/index.mjs');
    }
  }

  console.log('Final server path:', serverPath);

  // Verify server file exists
  if (!fs.existsSync(serverPath)) {
    console.error('Server file not found at:', serverPath);
    createWindow(); // Create window to show error in devtools
    return;
  }

  try {
    const serverDir = path.dirname(serverPath);
    const nodeModulesPath = path.join(serverDir, 'node_modules');
    
    // Build NODE_PATH to include the server's node_modules
    const nodePath = process.env.NODE_PATH 
      ? `${nodeModulesPath}:${process.env.NODE_PATH}`
      : nodeModulesPath;
    
    serverChild = utilityProcess.fork(serverPath, [], {
      // CRITICAL: Set the current working directory to the server folder
      // Nitro needs this to find its chunks and node_modules
      cwd: serverDir, 
      env: { 
        ...process.env, 
        PORT: PORT.toString(), 
        NITRO_PORT: PORT.toString(),
        NODE_ENV: 'production',
        DB_PATH: dbFile,  // <-- pass database path here
        NODE_PATH: nodePath  // Explicitly set NODE_PATH for native module resolution
      },
      stdio: 'inherit'
    });

    // Handle utility process errors
    serverChild.on('spawn', () => {
      console.log('Server process spawned successfully');
    });

    serverChild.on('exit', (code, signal) => {
      console.error('Server process exited:', code, signal);
      if (code !== 0 && code !== null) {
        console.error('Server crashed!');
      }
    });

    pollServer();
  } catch (error) {
    console.error('Failed to start server:', error);
    createWindow(); // Create window to show error in devtools
  }
});

app.on('window-all-closed', () => {
  if (serverChild) serverChild.kill();
  if (process.platform !== 'darwin') app.quit();
});