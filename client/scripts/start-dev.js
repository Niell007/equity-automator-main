import { execSync } from 'child_process';
import { createServer } from 'net';

async function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = createServer()
      .once('error', () => resolve(true))
      .once('listening', () => {
        server.close();
        resolve(false);
      })
      .listen(port);
  });
}

async function startDevServer() {
  const port = 3000;
  
  if (await isPortInUse(port)) {
    console.error(`Port ${port} is in use. Please run kill-ports.js first.`);
    process.exit(1);
  }

  console.log(`Starting development server on port ${port}...`);
  execSync(`vite --port ${port}`, { stdio: 'inherit' });
}

startDevServer(); 