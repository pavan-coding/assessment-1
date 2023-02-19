const readline = require("readline");
process.on("exit", () => {
  console.log("exit");
});
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.question("What is your name? ", (answer) => {
  rl.close();
});
