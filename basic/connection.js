const dns = require('dns');

dns.lookup('globo.com', (err, address) => {
    if(err) return;
    console.log(address);
    dns.reverse(address, (err, hostnames)=>{
        console.log(hostnames);
    });
});

dns.resolve('globo.com', 'MX', ()=> {});