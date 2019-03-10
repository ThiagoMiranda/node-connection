const http = require('http');

//req: http.ClientRequest
const req = http.request({  //.get('http://www.google.com', cb) 
    hostname: 'www.google.com', 
    method: 'get' 
}, (res) => {
    // res: http.IncomingMessage
    console.log(res.statusCode);
    console.log(res.headers);

    let dataAppend = '';
    res.on('data', data => {
        console.log(data.toString());
        dataAppend += data;
    });

    res.on('end', data => {
        console.log(dataAppend)
    })
});

req.on('error', () => {}); //http.Agent
req.end();