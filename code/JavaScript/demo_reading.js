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
const term = require("terminal-kit").terminal;
console.log(term.width);
console.log("d".padStart(148));

var term = require("terminal-kit").terminal;

function question() {
  term("Do you like javascript? [Y|n]\n");

  // Exit on y and ENTER key
  // Ask again on n
  term.yesOrNo({ yes: ["y", "ENTER"], no: ["n"] }, function (error, result) {
    if (result) {
      term.green("'Yes' detected! Good bye!\n");
      process.exit();
    } else {
      term.red("'No' detected, are you sure?\n");
      question();
    }
  });
}

question();
