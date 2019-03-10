//Spawn
const { spawn } = require('child_process');

const child = spawn('pwd');
//const child = spawn('find', ['.', '-type', 'f']);

child.on('exit', function(code, signal) {
    console.info(`o child process saiu com código ${code}, sinal ${signal}`);
});

//Exec
const { exec } = require('child_process');

const exec = spawn('find', ['.', '-type', 'f'], (err, stdout, stderr) => {
    if(err) console.error(`erro do exec: ${err}`);

    console.log(`Número de linhas ${stdout}`);
});

