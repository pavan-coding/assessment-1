const inquirer = require("inquirer");
const chalk = require("chalk");
const terminalkit = require("terminal-kit");
const check_user = require("../Database/check_user_exists");

const terminal = terminalkit.terminal;

function print_heading() {
  const width = terminal.width;
  const title = "Tcp Server - Client Terminal Application";
  const position = Math.round((width - title.length) / 2);
  let spaces = "";
  for (let i = 0; i < position; i++) {
    spaces += " ";
  }
  terminal.clear();
  console.log(spaces + chalk.black.bgYellow(title));
}

print_heading();
let password;
const login_or_reginster = [
  {
    type: "list",
    prefix: "",
    name: "login_or_register",
    choices: ["Login", "Register"],
  },
];

const login = [
  {
    type: "input",
    prefix: "",
    name: "username",
  },
];

const register = [
  {
    type: "input",
    prefix: "",
    name: "username",
    message: "Enter Username:",
    validate: async (input) => {
      const result = await check_user.check(input);
      if (result == false) {
        return chalk.red("Sorry ") + "😐: User name already exists";
      }
      return true;
    },
  },
  {
    type: "password",
    prefix: "",
    name: "password",
    message: "Enter Password:",
    mask: "•",
    validate(value) {
      const passwordRegex =
        /^(?=.*[!@#$%^&*(),.?":{}|<>0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
      const is_valid_password = passwordRegex.test(value);
      if (is_valid_password == false) {
        return "password must have the following:\n   1.at least 8 characters \n   2.should contain one uppercase letter \n   3.should contain one lowercase letter \n   4.should contain a number\n   5.should contain a symbol";
      }
      return true;
    },
  },
  {
    type: "password",
    prefix: "",
    name: "re-type password",
    message: "Re-Type Password:",
    mask: "•",
  },
];

inquirer.prompt(register).then((answers) => {
  console.log(answers);
});
