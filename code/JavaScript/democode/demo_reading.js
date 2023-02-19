// const readline = require("readline");

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// rl.on("line", (input) => {});
// // Increase the font size of printed text
// console.log("\x1b[30m\x1b[1m%s\x1b[0m", "Hello, World!");

// // Decrease the font size of printed text
// console.log("\x1b[30m\x1b[2m%s\x1b[0m", "Hello, World!");

// console.log("pad".padStart(-1));
// const term = require("terminal-kit").terminal;
// console.log(term.width);
// console.log("d".padStart(148));

// var term = require("terminal-kit").terminal;
// term.windowTitle("user2");
// while (true) {
//   process.stdout.write("/");
//   term.backDelete();
//   process.stdout.write(``);
// }
//process.stdout.write("Waiting for authentication ");
const terminal = require("terminal-kit").terminal;
function CleanTerminal() {
  let promise_terminal = new Promise((resolve, reject) => {
    let P = ["\\", "|", "/", "-"];
    let x = 0;
    let count = 20;
    var twirlTimer = setInterval(function () {
      process.stdout.write(
        "\r" +
          ` Terminal will Reset in  ${Math.round(count / 4)} Seconds ` +
          P[x++]
      );
      count -= 1;
      if (count < 0) {
        terminal.clear();
        clearTimeout(twirlTimer);
        resolve();
      }
      x &= 3;
    }, 250);
    return twirlTimer;
  });
  const terminal_obj = promise_terminal;
  terminal_obj.then(() => {
    console.log("hello");
  });
}
CleanTerminal();
