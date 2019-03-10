/************************************* Arquitetura V8 e libuv *************************************

    VMS: V8 ( Chrome ) ou Chakra ( Edge )

    Slide 3:
    node -v
    node -p 'process.versions.v8' 

    Slide 4:
    node --v8-options | grep "harmony"
    node --v8-options | grep "in progress"

    node --v8-options | less
    
    Garbage collector:
    node --v8-options | grep gc
    --trace-gc
    --expose-gc gc()

    node -> v8 //flags em tempo de execução
    v8.getHeapStatistics() //estatísticas processamento e memória

    Slide 5:

---------
                    SEU CÓDIGO

                    V8 - CORE MODULES ( C++ API system )
                        -  C++ BINDINGS ( C++ function templates )
                        - LIBUV ( async non-blocking i/o. Event-loop. Async que o OS não consegue resolver -> usado em julia, rust etc ) - C-ARES, HTTP-PARSER, OpenSSL

                    OPERATING SYSTEM
--------

    Slide 6:
    Apresentar o REPL com auto complete
    global. tab

    rlwrap -> busca reversa

    Mostrar _, .exit, .break, .load, .save, .editor

    Customize:
    const repl = require('repl');
    let r = repl.start({});
    r.context.lodash = require('lodash');

    node -c index.js
    node -p 

    global.x = true;
    Terá em todo escopo

    node -> aperte tab

    ** Alguns precisa de require outros só no REPL ( _ )
    
    Process object:
    Uma ponte entre a aplicação e o ambiente

    process.versions // versões do ambiente
    process.env //lista das variáveis do sistema. Melhor não modificar/usar diretamente ( arquivo separado .json )
    process.release.lts //ver se é um lts
    process //std, write, stderr falar depois
    process é um event emitter
*/

//Slide 7:

process.on('exit', code => {
}); //quando um comando de saída foi disparado //sync only

process.on('uncaughtException', err => {
    //err stack trace
    // evitar

    console.error(err); 
    process.exit(1);
});

process.stdin.resume();
console.doguinho();

//Slide 8
/*
    Buffer class
    Binary streams of data

    Sempre tem um character encoding.
    Buffer.alloc(8);
    Buffer.allocUnsafe(8); //not filled
    Buffer.allocUnsafe(8).fill();
    Buffer.allocUnsafe(8).toString();
    Buffer.from
*/

const string = 'testé';
const buffer = Buffer.from('testé');

console.log(string, string.length);
console.log(buffer, buffer.length);

const fs = require('fs');

const conversionMap = {
'88': '65',
'89': '66',
'90': '67'
};

fs.readFile(__filename, (err, buffer) =>{
    let tag = buffer.slice(-4,-1); //ultimos 3 bytes
    for(let i=0; i<tag.length; i++) {
        tag[i] = conversionMap[tag[i]];
    }
    console.log(buffer.toString());
});

// TAG: XYZ
/*
    Use sempre o StringDecoder
    nodejs.org/api/string_decoder.html
*/

const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

process.stdin.on('readable', () => {
    const chunk = process.stdin.read();
    if(chunk !=null ) {
        const buffer = Buffer.from([chunk]); //array
        console.log('Com .toString():', buffer.toString() );
        console.log('Com StringDecoder:', decoder.write(buffer));
    }
});

//  digitar no terminal e apertar enter
/*
Slide 9:
/************************************* O que é o require? *************************************
 * 
    Fluxo do require:
    -> Resolving 
        Achar o módulo
    -> Loading 
        Carrega o módulo
    -> Wrapping 
        Wrapp o módulo e o deixa disponível para o module
    -> Evaluating 
        Executa o módulo
    -> Caching
        Cachea o módulo para evitar passar por todo processo novamente

    Procura por módulos
    console.log(module)// repl module
    
    Local + demais node_modules
    Procura por um index.js ou o que está no package.json como main

    core modules são resolvidos instantaneamente

    Funções
    require()
    require.resolve() -> checa se existe o Module ( módulos opcionais )

    Exports

    exports.id = 'test-me'

    Loaded:
    Loaded false
    setImmediate(calback) -> loaded true

    Module 1 require 2 e 2 require 1
*/

exports.id = 'm1';
exports.content = [1];
const m2 = require('./m2');

exports.content.push(11);
exports.content.push(111);

// ------

exports.id = 'm2';
exports.content = [2];
exports.content.push(22);
exports.content.push(222);
const m1 = require('./m1');
console.log('m1 não carregou', m1);

//-------
const m1 = require('m1');
console.log(m1);

/*
    Require json ou C++ addons
    require('config.json') -> não exatamente precisa do .json
    ordem: 'js', 'json', 'node'

    carregar c++ : nodejs.org/api/addons.html

    require.extensions
    require.extensions['js'].toString()

    Slide 10:
    
    Wrapping and caching

    exports.id = 1; //ok
    exports = {id: 1}; // não ok

    module.exports = {id: 1}; //ok

    require('module').wrapper

    exports é apenas referência ao module.exports. Se mudar o exports não será mais.

    Teste:
*/
require = () => {mocked: true};
const fs = require('fs');
console.log(fs);

/*
Para usar REPL ou Require */
if( require.main == module ) {//as script}
} else {} //é require

    /*node printStars.js 5 hello

    Caching:
    Só será evaluado uma vez.
    require.cache
    delete require.cache['filepath.js']; 
*/    


/************************************* NPM *************************************
 * 
 * Slide 11:
    Facebook -> yarnpkg.com

    Npm cli -> pode trabalhar com registries diferentes ou mesmo github
    Npm registry

    Npm-cli

Slide 12:

    Por github:
    npm i expressjs/express
    npm ls express

    npm i expressjs/express#4.14.0 //branches e commits

    Checar antes de instalar
    npm i --dry-run

    Todos packages globais
    npm ll -g --depth=0 --json

    Use sempre package.json
    {
        "name": "nome", //lower case
        "version": "1.0.0"
    }

    Para instalar instale junto 
    npm i -S //production dependency
    npm i -D ou --save-dev //development dependency
    npm i -O //optional dependency

    npm update // update

    Operadores:
    <= < > // maior ou menor
    * ou x //pega o maior valor
    ~ //é o mesmo que x (*) no último level mas o x tem que ser maior que o especificado
    ^ //maior versão menos o "mais zero" na esquerda. Exemplo: ^0.4.x
    Checar outdated
    npm outdated -g

    Configurações:
    npm config list -l

    Default name
    npm config set init-author-name "Thiago Miranda"

    npm config delete init-author-name

    npm config set save true //--save flag sempre

    npm help install
    npm help-search remove
    npm search //procurar
    npm shrinkwrap //lock dependencies
    npm dedupe //otimiza mesmas dependencias

    npm home express
    npm repo express

    npm prune //limpar o node_modules local

    Easter eggs:
    npm xmas
    npm visnup
*/


/************************************* Event Model -> Event Loop *************************************

    Slide 13:
    Nodejs -> libuv
    Ruby -> EventMachine
    Python -> Twisted

    O que é I/O

    Comunicação entre um processo de uma CPU e qualquer coisa externa ao CPU. Memória, disco, network ou outro processo. Input quando é recebido pela CPU e output quando enviado pelo processo. No caso do Node normalmente é acesso ao disco e network 

    Slide 14:
    Slow i/o
    Sincrono -> lento e blocante. Mais fácil
    fork() -> não vai escalar muito com vários requests
    threads -> Multthread apache, tomcat. Nginx é single thread. ST simplifica.
    Event Loop -> para resolver o problema de slow i/o com st

    Definição event loop

    Entidade que trata eventos externos os transformando em chamadas de callback

    É o loop que pega eventos do event queue e manda eles para o call stack

    Stack: Heap e Stack
    Heap - area é alocada para escopo da função
    Stack - ordem de disparo

    Callstack

    const f1 = () => {f2();};
    const f2 = () => {f3();};
    const f3 = () => {f4();};
    const f4 = () => {f4();};

    Ordem:
    f4()
    f3()
    f2()
    f1()

    const add = (a,b) => a + b;
    const double = a => add(a,a);

    const printDouble = a => {
        const output = double(a);
        console.log(output);
    }

    printDouble(9);

    const add = (a,b) => a + x;
    const double = a => add(a,a);

    const printDouble = a => {
        const output = double(a);
        console.log(output);
    }

    printDouble(9);

    add(9,9);
    double(9);
    printDouble(9);
    anonymous(); //IIFE


    double(9);
    printDouble(9);
    anonymous(); //IIFE

    console.log(18);
    printDouble(9);
    anonymous(); //IIFE

    printDouble(9);
    anonymous(); //IIFE

    anonymous(); //IIFE

    --- vazio ---- //stackFrame 

    Em um browser sempre com error vai mandar o callstack

    Tratando slow i/o 
*/

const slowAdd = (a,b) => {
    for(let i=0; i<999999999; i++) {}
    return a + b;
}

const a = slowAdd(3,3);

//REPL
//Callbacks como funcionam:

const slowAdd = (a,b) => {
    setTimeout(() => {
        console.log(a+b);
    }, 5000); //minimo de 5
}

// slowAdd(3,3);

// //Call stack
// slowAdd(3,3);
// anonymous();

// setTimeout();
// slowAdd(3,3);
// anonymous();

// slowAdd(3,3);
// anonymous();

// anonymous();

// console.log(6);

//Slider 17:

// Queue stack // monitors the call stack. Se o call stack tiver vazio e tiver algo no queue ele manda para o call stack
// cb1()

// //Node //thread separada
// Timer();

// //Callstack
// cb1();

// console.log(8)
// cb1();

//Quando o callstack esta vazio e queue não está vazio: queue manda para o callstack. event loop é chamado assim pois da loop até o queue tiver vazio. Node sairá se o callstack e queue estiver vazio

/************************************* setImmediate e Process.nextTick *************************************


Se você quer que algo seja executado no próximo evento do eventLoop use setImmediate
*/
const fs = require('fs');

function fileSize(filename, cb) {
    if( typeof fileName !== 'string') {
        return cb(new TypeError('argumento deve ser string')); //process.nextTick(cb, new TypeError(''));
    }
   fs.stat(fileName, (err, stats) => {
       if (err) return cb(err);
      cb(null, stats.size);
   });
}

fileSize(__fileName, (err,size) => {
    if(err) throw err;
    console.log(`Size in kb: ${size/1024}`);
});

console.log('Hello!');


/************************************* Event driven architecture *************************************/

const fs = require('fs');

const readFileAsArray = (file, cb) => {
    fs.readFile(file, (err, data) => {
        if(err) return cb(err);

        const lines = data.toString().trim().split('\n');
    })
};

readFileAsArray('./numbers', (err, lines) => {
    if(err) throw err;

    const numbers = lines.map(Number);
    const oddNumbers = numbers.filter(number => number % 2 === 1);
    console.log("odd numbers count:" , oddNumbers.length);
});

//Promises Slide 18
const fs = require('fs');

const readFileAsArray = (file, cb= ()=>{} ) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if(err) return reject(err); //cb(err)
            const lines = data.toString().trim().split('\n');
            resolve(lines);
            cb(null, lines)
        });
    });
};

readFileAsArray('./numbers', (err, lines)=> {
    console.info(lines);
})

readFileAsArray('./numbers').then(lines => {
    const numbers = lines.map(Number);
    const oddNumbers = numbers.filter(number => number % 2 === 1);
    console.log("odd numbers count:" , oddNumbers.length);
}).catch(console.error);

//Async
async function countAdd() {
    try { //necessário
        const lines = await readFileAsArray('./numbers');
        const numbers = lines.map(Number);
        const oddCount = numbers.filter(number => number % 2 === 1).length;
        console.log(`odd numbers count: ${oddCount}`);
    } catch(err) {
        console.error(err);
    }
}

countAdd(); //node --harmony-async-await 

//Event Emitter Slide 19:
//Pode ser sync ou async
const EventEmitter = require('events');

class Logger extends EventEmitter{};

const logger = new Logger();

logger.on('event', (evt) => {
    console.log('oi');
});

logger.emit('event');

//Exemplo
const EventEmitter = require('events');

class WithLog extends EventEmitter {
    execute(taskFunc) {
        console.log('Antes de executar');
        this.emit('begin'); //this.emit('begin', data);
        taskFunc();
        this.emit('end');xw
        console.log('Depois de executar');
    }
}

const withLog = new WithLog();

withLog.on('begin', () => console.log('Vai executar'));
withLog.on('end', () => console.log('Executou'));

//on e once diferenças
//Mais de um on vai ser por ordem
//prependeListener
//removeListener

/************************************* DNS *************************************/
//Slide 20
const dns = require('dns');

dns.lookup('globo.com', (err, address) => {
    if(err) return;
    console.log(address);
    dns.reverse(address, (err, hostnames)=>{
        console.log(hostnames);
    });
});

dns.resolve('globo.com', 'MX', ()=> {});


/************************************* UDP *************************************/
const dgram = require('dgram');

const server = dgram.createSocket('udp4');

server.on('listening', () => console.log('UDP Server'));
server.on('message', (msg, rinfo) => {
    console.log(`${rinfo.address}:${rinfo.address} - ${msg}`);
});

const PORT = 3333;
const HOST = '127.0.0.1';
server.bind(PORT, HOST);

const client = dgram.createSocket('udp4');
//const msg = Buffer.from('Sambatech connection');

//msg start end
//client.send(msg, 0, msg.length)
client.send('Sambatech connection', PORT, HOST, (err) => {
    if(err) throw err;

    console.log('Sambatech message enviada');
    client.close();
})

/************************************* Http *************************************/
// server: http.Server
const server = require('http').createServer(); //https createServer({key: fs.readFileSync('./key.pem'),cert:}); usar openSSL

server.on('request', (req, res) => {
    // req: http.IncomingMessage
    // res: http.ServerResponse
    res.writeHead(200, {'content-type': 'text/plain'});
    //res.write('Hello world');
    res.end('Hello world\n');

    // setTimeout(() => {
    //     res.write('Hello world de novo');
    // }, 2000); //timeout 2 minutes default server.timeout = 1000;
});

server.listen(8000); //443
//curl -i localhost:8000

/************************************* REQUESTS *************************************/
//Slide 22
const http = require('http');

//req: http.ClientRequest
const req = http.request({  //.get('http://www.globo.com', cb) 
    hostname: 'www.globo.com', 
    method: 'get' 
}, (res) => {
    // res: http.IncomingMessage
    console.log(res.statusCode);
    console.log(res.headers);

    res.on('data', data => {
        console.log(data.toString());
    });
});

req.on('error', () => {
    
}); 
req.end();

/************************************* ROUTES *************************************/
//Slide 24
const server = require('http').createServer(); 
server.on('request', (req, res) => {
    
    switch(req.url) {
        case '/home':
        case '/about':
            res.writeHead(200, {'Content-type': 'text/html'});
            res.end(fs.readFileSync(`${req.url}.html`));
            break;
        case '/':
            res.writeHead(301, {'Location': '/home'});
            res.end();
            break;

    }

    res.writeHead(200, {'content-type': 'text/plain'});
    res.end('Hello world\n');

});

server.listen(8000); //443
//curl -i localhost:8000

/************************************* URL *************************************/
// nodejs.org/api/url.html
//REPL
const url = url.parse('https://www.google.com/search?q=teste'); //,true
url.format(url); //volta
querystring.stringify({});
querystring.parse('q=&t=');

/************************************* OS *************************************/
//Slide 25
os.freemem();
os.type();
os.release();
os.userInfo();

/************************************* FS *************************************/
//Todas funções tem o sync e o async
//Iniciando sempre use o sync

//Task 1
//Remover arquivos com dados duplicados

const fs = require('fs');
const path = require('path');
const dirname = path.join(__dirname, 'files'); //multiplas plataformas

const files = fs.readdirSync(dirname);

files.forEach(file => {
    const filePath = path.join(dirname, file);
    fs.stat(filePath, (err, stats) => {
        if(err) throw err;

        fs.truncate(filePath, stats.size/2, (err) => {
            if(err) throw err;
        });
    });
});

//Task 2
//Remover arquivos com mais de 7 dias
const fs = require('fs');
const path = require('path');
const dirname = path.join(__dirname, 'files'); //multiplas plataformas

fs.mkdirSync(dirname);
const ms1Day = 24*60*60*1000;

for(let i=0; i<10; i++) {
    const filePath = path.join(dirname, `file${i}`);

    fs.writeFile(filePath, i, (err) => {
        if(err) throw err;

        const time = (Date.now() - i*ms1Day)/1000;
        fs.utimes(filePath, time, time, (err) => { //access time e modified
            if(err) throw err;
        });
    });
}

//Deletar
const ms1Day = 24*60*60*1000;

files.forEach(file => {
    const filePath = path.join(dirname, file);
    fs.stat(filePath, (err, stats) => {
        if(err) throw err;

        if((Date.now() - stats.mtime.getTime() > 7*ms1Day)) {
            fs.unlink(filePath, (err) => {
                if(err) throw err;
                console.log(`deleted ${filePath}`);
            });
        }
    });
});

//Task 3
//Ver um diretorio e reportar adição, remoção e mudança ( watch do gulp )
const fs = require('fs');
const path = require('path');
const dirname = path.join(__dirname, 'files'); //multiplas plataformas
const currentFiles = fs.readdirSync(dirname);

const logWithTime = (message) => console.log(`${new Date().toUTCString()}: ${message}`);

fs.watch(dirname, (eventType, filename) => {
    if(eventType === 'rename') { //add ou deleção
        const index = currentFiles.indexOf(filename);
        if(index >= 0) {
            currentFiles.splice(index, 1);
            logWithTime(`${filename} foi removido`);
            return;
        }

        currentFiles.push(filename);
        logWithTime(`${filename} was added`);
        return;
    }

    logWithTime(`${filename} was changed`);
});

/************************************* CONSOLE e UTILITIES *************************************/
const fs = require('fs');

const out = fs.createWriteStream('./out.log');
const err = fs.createWriteStream('./err.log');

const console2 = new console.Console(out, err);

setInterval(() => {
    console2.log(new Date());
    console2.error(new Error('Whoops'));
}, 5000);

console.log('Teste %j %d %s', {name: 'João'}, 1, 'oi');
console.trace()
console.time()
console.timeEnd()

/************************************* DEBUGGING *************************************/

function negativeSum(...args) {
    return args.reduce((total, arg) => {
        return total-arg;
    }, 0);
}

console.log(
    negativeSum(1,5,10)
);

    //node debug index.js
    //help
    //restart
    //sb(2) adicionar debug linha 2
    //args
    //watch('arg')
    //watch('total')
    //list(3) // quantas linhas após o breakpoint

    //node --inspect --debug-brk index.js

/************************************* STREAMS!!! *************************************/
/*
    O que é um Stream?
    Pipe do Linux
    Coleções de data que podem não estar totalmente disponíveis e não precisam caber na memória

    Tipos de stream
    Readable fs.createReadStream
    Writable fs.createWriteStream
    Duplex net.socket //read and write
    Transform zlib.createGzip //transform duplex and stream
    Todas emitem eventos
    src.pipe(dst); //primeira readableStream -> writableStream
    Linux a | b | c | d
    a.pipe(b).pipe(c).pipe(d);

    Implementing require('stream')

    Consuming pippin/events

    Readable stream
    Eventos mais importantes: data, end
    pipe(),unpipe()
    read(), unshift(), resume()

    Paused Flowing stream.read(), EventEmitter


    Writable Streams:
    Eventos mais importantes: drain, finish
    write(), end()

  */  

  /*

    Cloning - duplicar a aplicação
    Decomposing - microservices
    Splitting - Dividir usuários das aplicações 

    round robin
  */