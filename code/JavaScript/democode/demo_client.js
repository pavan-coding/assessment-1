const net = require("net");
const readline = require("readline");
const terminal = require("terminal-kit").terminal;
const chalk = require("chalk");

var input = "";
process.stdout.write(chalk.redBright("➜ "));
const client = net.Socket();
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: chalk.redBright("➜ "),
});
rl.on("line", function (line) {
  terminal.up(1);
  terminal.eraseLine();
  console.log(line);
  process.stdout.write(chalk.redBright("➜ "));
});
const options = { port: 12345, host: "127.0.0.1" };
client.connect(options);
client.on("data", function (data) {
  readline.clearLine(process.stdout, 0, () => {
    readline.cursorTo(process.stdout, 0, () => {
      console.log(data.toString("utf8"));
      rl.write(null, { ctrl: true, name: "u" });
      rl.write(input);
    });
  });
});
rl.input.on("keypress", (character, key) => {
  input += character;
  if (character == "\r") input = "";
});
client.write("1");
process.on("exit", () => {
  console.log("bye");
});
