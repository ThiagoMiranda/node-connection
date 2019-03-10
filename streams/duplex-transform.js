// const { Duplex } = require('stream');

// const inoutStream = new Duplex({
//     write(chunk, encoding, callback) {
//         console.log(chunk.toString());
//         callback();
//     },

//     read(size) {
//         if(this.currentCharCode > 90) {
//             this.push(null);
//             return;
//         }

//         this.push(String.fromCharCode(this.currentCharCode++));
//     }
// });

// inoutStream.currentCharCode = 65;
// process.stdin.pipe(inoutStream).pipe(process.stdout);


// const { Transform } = require('stream');

// const upperCaseTr = new Transform({
//     transform(chunk, encoding, callback) {
//         this.push(chunk.toString().toUpperCase());
//         callback();
//     }
// });

// process.stdin.pipe(upperCaseTr).pipe(process.stdout);

//Gzip
const { Transform } = require('stream');
const fs = require('fs');
const zlib = require('zlib');
const crypto = require('crypto');
const file = process.argv[2];

const progress = new Transform({
    transform(chunk, encoding, callback) {
        process.stdout.write('.');
        callback(null, chunk);
    }
});

fs.createReadStream(file)
    .pipe(zlib.createGzip())
    .on('data', () => process.stdout.write('.'))
    //.pipe(progress)
    .pipe(crypto.createCipher('aes192', 'a_secret'))
    .pipe(fs.createWriteStream(file + '.gz'))
    .on('finish', () => console.log('termino'));




// //Unzip
// const fs = require('fs');
// const zlib = require('zlib');
// const crypto = require('crypto');
// const file = process.argv[2];

// fs.createReadStream(file)
//     .pipe(crypto.createDecipher('aes192', 'a_secret'))
//     .pipe(zlib.createGunzip())
//     .pipe(progress)
//     .pipe(fs.createReadStream(file.slice(0, -3)))
//     .on('finish', () => console.log('termino'));

// const progress = new Transform({
//     transform(chunk, encoding, callback) {
//         process.stdout.write('.');
//         callback(null, chunk);
//     }
// });        