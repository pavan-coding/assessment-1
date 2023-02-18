// const net = require("net");
// const readline = require("readline");
// var input = "";
// process.stdout.write(">");
// const client = net.Socket();
// var rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });
// rl.on("line", function (line) {
//   console.log(line);
//   process.stdout.write(">");
// });
// const options = { port: 12345, host: "127.0.0.1" };
// client.connect(options);
// client.on("data", function (data) {
//   readline.clearLine(process.stdout, 0, () => {
//     readline.cursorTo(process.stdout, 0, () => {
//       console.log(data.toString("utf8"));
//       readline.clearLine(process.stdout, 0, () => {
//         readline.cursorTo(process.stdout, 0, () => {
//           rl.write(null, { ctrl: true, name: "u" });
//           rl.write(input);
//         });
//       });
//     });
//   });
// });
// rl.input.on("keypress", (character, key) => {
//   input += character;
// });
// client.write("1");

const crypto = require("crypto");

// Generate key pair
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});
console.log(publicKey.toString("base64"), privateKey.toString("base64"));
// Encrypt data with public key
const data = "Hello, world!";
const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(data));
console.log(encrypted.toString("base64"));

// Decrypt data with private key
const decrypted = crypto.privateDecrypt(
  privateKey,
  Buffer.from(encrypted.toString("base64"), "base64")
);
console.log(decrypted.toString());
