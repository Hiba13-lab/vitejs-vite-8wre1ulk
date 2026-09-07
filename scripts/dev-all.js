import { spawn } from 'node:child_process';
import path from 'node:path';

const cwd=process.cwd();
const viteBin=path.join(cwd,'node_modules','vite','bin','vite.js');

const backend=spawn(process.execPath,['server/server.js'],{
  stdio:'inherit',
  cwd,
});

const frontend=spawn(process.execPath,[viteBin],{
  stdio:'inherit',
  cwd,
});

function stop(){
  if(!backend.killed)backend.kill();
  if(!frontend.killed)frontend.kill();
}

process.on('SIGINT',()=>{stop();process.exit(0)});
process.on('SIGTERM',()=>{stop();process.exit(0)});

backend.on('error',err=>{
  console.error('\n[OSRAH] Impossible de lancer le backend:',err.message);
});
frontend.on('error',err=>{
  console.error('\n[OSRAH] Impossible de lancer Vite:',err.message);
});
backend.on('exit',code=>{
  if(code&&code!==0)console.log('\n[OSRAH] Le backend s’est arrêté. Vérifiez si le port 5000 est déjà utilisé.');
});
frontend.on('exit',code=>{
  stop();
  process.exit(code??0);
});
