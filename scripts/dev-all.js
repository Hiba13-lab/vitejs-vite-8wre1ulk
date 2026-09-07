import { spawn } from 'node:child_process';

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const backend = spawn(process.execPath, ['server/server.js'], {
  stdio: 'inherit',
  cwd: process.cwd(),
});

const frontend = spawn(npmCmd, ['run', 'dev:front'], {
  stdio: 'inherit',
  cwd: process.cwd(),
});

function stop() {
  if (!backend.killed) backend.kill();
  if (!frontend.killed) frontend.kill();
}

process.on('SIGINT', () => {
  stop();
  process.exit(0);
});
process.on('SIGTERM', () => {
  stop();
  process.exit(0);
});

backend.on('exit', (code) => {
  if (code && code !== 0) {
    console.log('\n[OSRAH] Le backend s’est arrêté. Vérifiez si le port 5000 est déjà utilisé.');
  }
});

frontend.on('exit', (code) => {
  stop();
  process.exit(code ?? 0);
});
