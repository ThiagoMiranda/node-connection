const EventEmitter = require('events');

class Server extends EventEmitter {
    
    constructor(client) {
        super();

        client.on('command', (command, args) => {
            console.log(`Command: ${command}`);

            //process.nextTick(()=>{});
            //this.emit('response', 'Digite um comando ( help para lista de comandos )');
            
            switch(command) {
                case 'help':
                case 'add':
                case 'ls':
                case 'delete':
                    this[command](args);
                    break;
                default: 
                    this.emit('response', 'não reconhecido');    
            }

        });
    }

    help() {
        this.emit('response', 'help...');
    }

    add() {
        this.emit('response', args.join(' '));
    }

    ls() {
        this.emit('response', 'ls...');
    }

    delete() {
        this.emit('response', 'delete...');
    }

}

module.exports = (client) => new Server(client);