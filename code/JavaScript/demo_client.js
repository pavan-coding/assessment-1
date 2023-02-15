const net = require("net");
const readline = require("readline");
var input = "";
process.stdout.write(">");
const client = net.Socket();
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.on("line", function (line) {
  console.log(line);
  process.stdout.write(">");
});
const options = { port: 12345, host: "127.0.0.1" };
client.connect(options);
client.on("data", function (data) {
  readline.clearLine(process.stdout, 0, () => {
    readline.cursorTo(process.stdout, 0, () => {
      console.log(data.toString("utf8"));
      readline.clearLine(process.stdout, 0, () => {
        readline.cursorTo(process.stdout, 0, () => {
          rl.write(null, { ctrl: true, name: "u" });
          rl.write(input);
        });
      });
    });
  });
});
rl.input.on("keypress", (character, key) => {
  input += character;
});
client.write("1");
