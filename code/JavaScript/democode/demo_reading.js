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
var twirlTimer = (function () {
  var P = ["\\", "|", "/", "-"];
  var x = 0;
  return setInterval(function () {
    process.stdout.write("\r" + "Waiting for response " + P[x++]);
    x &= 3;
  }, 250);
})();
setTimeout(() => {
  clearTimeout(twirlTimer);
}, 5000);
