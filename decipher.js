var forge = require("node-forge");

// same settings as in NodeMCU ESP8266 AES example
var key = 'mysecretpassword';
var esp8266_iv = 'QUJDREFCQ0RBQkNEQUJDRA==';
var esp8266_msg = 'fMMUfhDyfFt5kKQJd+pEifNpKEGe6V48azocbYMSyqI=';

// decode BASE64 encoded data from ESP8266
var iv = new Buffer(esp8266_iv, 'base64').toString();
var cipherBuffer = new Buffer(esp8266_msg, 'base64');

console.log("Encrypted message from ESP8266", cipherBuffer.toString('hex'));

// this block of code is just to verify encryption works the same way on both sides
var cipher = forge.cipher.createCipher('AES-CBC', key);
cipher.start({
    iv: iv
});
cipher.update(forge.util.createBuffer("{\"temp\":\"28.5\", \"id\":\"1\" }"));
cipher.finish();
console.log("Encrypted message from Node.js", cipher.output.toHex());

// now decipher the message from ESP8266
var decipher = forge.cipher.createDecipher('AES-CBC', key);
decipher.start({
    iv: iv
});
decipher.update(forge.util.createBuffer(cipherBuffer));
// next line can be used to decipher forge-ciphered message
// decipher.update(cipher.output);
decipher.finish();
console.log("Decrypted mesage", decipher.output.getBytes());