import express from 'express';
import { generateTemplate } from '../templates/templatePartnership.js';
import { mockPartnershipData } from './mockData.js';
import path from 'path';
import { fileURLToPath } from 'url';
import chokidar from 'chokidar';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
let PORT = 3000;
let WS_PORT = 3001;

// Function to find available port
async function findAvailablePort(startPort: number): Promise<number> {
  return new Promise((resolve) => {
    const server = createServer();
    server.listen(startPort, () => {
      const port = (server.address() as any)?.port;
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      resolve(findAvailablePort(startPort + 1));
    });
  });
}

// WebSocket server setup function
function setupWebSocket(port: number) {
  const wss = new WebSocketServer({ port });

  wss.on('error', (error) => {
    if ((error as any).code === 'EADDRINUSE') {
      console.log(`WebSocket port ${port} in use, trying ${port + 1}...`);
      return setupWebSocket(port + 1);
    }
    console.error('WebSocket error:', error);
  });

  return wss;
}

// Serve the generated HTML
app.get('/', (req, res) => {
  try {
    const html = generateTemplate(mockPartnershipData);
    res.send(html);
  } catch (error) {
    console.error('Error generating template:', error);
    res
      .status(500)
      .send(
        `Error generating template: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
  }
});

// Hot reload endpoint
app.get('/hot-reload', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const keepAlive = setInterval(() => {
    res.write('data: ping\n\n');
  }, 30000);

  req.on('close', () => {
    clearInterval(keepAlive);
  });
});

// Start server with port detection
async function startServer() {
  try {
    PORT = await findAvailablePort(PORT);
    WS_PORT = await findAvailablePort(WS_PORT);

    // Setup WebSocket server
    const wss = setupWebSocket(WS_PORT);

    // Watch for file changes
    const watchPaths = [
      path.join(__dirname, '../components'),
      path.join(__dirname, '../templates'),
      path.join(__dirname, './mockData.ts'),
    ];

    const watcher = chokidar.watch(watchPaths, {
      ignored: /node_modules/,
      persistent: true,
    });

    watcher.on('change', () => {
      console.log('Files changed, reloading...');
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          // WebSocket.OPEN
          client.send('reload');
        }
      });
    });

    app.listen(PORT, () => {
      console.log(`🚀 Development server running at http://localhost:${PORT}`);
      console.log(`🔌 WebSocket server running on port ${WS_PORT}`);
      console.log('📝 Edit your components and templates to see live changes!');
      console.log('💡 To stop the server, press Ctrl+C');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
