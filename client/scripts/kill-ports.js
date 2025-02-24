import { execSync } from 'child_process';

// Kill processes on common development ports
const ports = [3000, 3001, 3002, 3003, 3004, 3005, 3006];

console.log('Killing any running development servers...');

ports.forEach(port => {
  try {
    // On Windows, find and kill process using the port
    const command = `for /f "tokens=5" %a in ('netstat -aon ^| find ":${port}"') do taskkill /F /PID %a`;
    execSync(command, { stdio: 'inherit' });
    console.log(`Killed process on port ${port}`);
  } catch (error) {
    // Ignore errors if no process is found
    console.log(`No process found on port ${port}`);
  }
});

console.log('All development servers stopped.'); 