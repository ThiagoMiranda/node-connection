// const fs = require('fs');
// const file = fs.createWriteStream('./big-file');

// for(let i=0; i<=1e6;i++) {
    
//     file.write('Connection de nodeJS na Sambatech. Testando streamssssssssssss');
// }

// file.end();
const fs = require('fs');
const server = require('http').createServer(); 
server.on('request', (req, res) => {
    fs.readFile('./big-file', (err, data) => {
        if(err) throw err;

        res.end(data);
    });

    // const src = fs.createReadStream('./big-file');
    // src.pipe(res);
});

server.listen(8000); 