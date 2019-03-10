const server = require('http').createServer(); 

server.on('request', (req, res) => {
    for (let i=0; i<1e7; i++); //simular peso
    res.writeHead(200, {'content-type': 'text/plain'});
    res.end('Hello world\n');

});

server.listen(8000, () => {
    console.info('Servidor conectado');
}); 

process.on('message', msg => {
    console.log(`Message from maser: ${msg}`);
});

// setTimeout(()=> {
//     process.exit(1);
// }, Math.random() * 10000);

//apache benchtool
//ab -c200 -t10 http://localhost:8000/