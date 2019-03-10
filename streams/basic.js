// const { Writable } = require('stream');

// const outStream = new Writable({
//     write(chunk, encoding, callback) {
//         console.log(chunk.toString());
//         callback();
//     }
// });

// process.stdin.pipe(outStream);

// // process.stdin.pipe(process.stdout);

const { Readable } = require('stream');

// const inStream = new Readable();

// inStream.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
// inStream.push(null);

const inStream = Readable({
    read(size) {
        this.push(String.fromCharCode(this.currentCharCode++));
        if(this.currentCharCode > 90) {
            this.push(null);
        }
    }
});

inStream.currentCharCode = 65;

inStream.pipe(process.stdout);

process.on('exit', () => {
    console.error(`\n\ncurrentCharCode is ${inStream.currentCharCode}`);
});

process.stdout.on('error', process.exit);

// //node readable.js | head -c3