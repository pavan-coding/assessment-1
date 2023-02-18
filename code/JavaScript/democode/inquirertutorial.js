const inquirer = require("inquirer");
const readline = require("readline");
let rl;
// const question = [
//   {
//     type: "list",
//     name: "action",
//     message: "Select an action:",
//     choices: ["login", "register", "exit"],
//   },
// ];
// inquirer.prompt(question).then((answers) => {
//   console.log(answers);
// });

// const passord = [
//   {
//     type: "password",
//     name: "password",
//     message: "Enter your password:",
//     mask: "•",
//     validate(value) {
//       if (value.length < 8) {
//         return "Please enter at least 8 characters";
//       } else return true;
//     },
//   },
// ];
// inquirer.prompt(passord).then((answers) => {
//   console.log(answers);
// });

const username = [
  {
    type: "input",
    name: "username",
    message: "enter userName",
    validate(value) {
      if (value.localeCompare("pavan") == 0) return "already exist";
      return true;
    },
  },
];
inquirer.prompt(username).then((answers) => {
  console.log(answers);
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.addListener("line", (line) => {
    console.log(line);
  });
});
