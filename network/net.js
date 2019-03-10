process.stdout.write('\u001B[2J\u001B[0;0f');

const server = require('net').createServer();
let counter = 0;

// let sockets = {};

function timestamp() {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes()}`;
}

//require('moment');

server.on('connection', socket => {
    socket.id = counter++;
    sockets[socket.id] = socket;
    console.log('Cliente conectado');
    socket.write('Bem vindo cliente!\n');

    socket.write('Digite seu nome');

    socket.on('data', data => {
        // if(!sockets[socket.id]) {
        //     socket.name = data.toString().trim();
        //     sockets[socket.id] = socket;
        //     socket.write(`Bem vindo cliente ${socket.name}!\n`);
        //     return;
        // }
        // Object.entries(sockets).forEach(([key, cs]) => {
        //     if(socket.id == key) return;
        //     cs.write(`data ${socket.id}: `);
        //     cs.write(data);    
        // });
        socket.write(`data ${socket.id}: `);
        socket.write(data);
    });

    socket.on('end', () => {
        //delete sockets[socket.id];
        console.log('Cliente desconectado');
    });

    //socket.setEncoding('utf8');
});

server.listen(8000, () => console.log('Server iniciado'));

//nc localhost 8000