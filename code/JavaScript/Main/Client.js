const inquirer = require("inquirer");
const chalk = require("chalk");
const terminalkit = require("terminal-kit");
const check_user = require("../Database/check_user_exists");
const register_user = require("../Database/register");
const login_user = require("../Database/login");
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

async function user_login_or_register() {
  let login_status = false;
  while (login_status == false) {
    let answers = await inquirer.prompt(login_or_register);
    if (answers["login_or_register"].localeCompare("Login") == 0) {
      login_status = true;
      await inquirer_login();
    } else {
      await inquirer_registration();
    }
  }
}
async function inquirer_registration() {
  let answers = await inquirer.prompt(register);
  await register_user.register_user(answers["username"], answers["password"]);
}

async function inquirer_login() {
  let answers = await inquirer.prompt(login);
  console.log(
    " " +
      chalk.green.bold("Hurry! ") +
      "🥳 " +
      chalk.green.bold("Login Successfull ") +
      "👍"
  );
}

print_heading();
let password_register;
let username_login;
const login_or_register = [
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
    Message: "Enter Username",
    validate: async (input) => {
      if (input.length == 0) {
        return chalk.red("Username ") + "cannot be empty";
      }
      const result = await check_user.check(input);
      if (result == true) {
        return chalk.red("User ") + " Name Doesn't exists";
      }
      username_login = input;
      return true;
    },
  },
  {
    type: "password",
    prefix: "",
    name: "password",
    message: "Enter Password:",
    mask: "•",
    validate: async (input) => {
      return login_user.login_user(username_login, input);
    },
  },
];

const register = [
  {
    type: "input",
    prefix: "",
    name: "username",
    message: "Enter Username:",
    validate: async (input) => {
      if (input.length == 0) {
        return chalk.red("Username ") + "Cannot Be Empty";
      }
      const result = await check_user.check(input);
      if (result == false) {
        return chalk.red("Sorry ") + "😐: User Name already Exists";
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
      password_register = value;
      return true;
    },
  },
  {
    type: "password",
    prefix: "",
    name: "re-type password",
    message: "Re-Type Password:",
    mask: "•",
    validate(value) {
      if (value.localeCompare(password_register) == 0) {
        return true;
      }
      return "Password does not match 😑";
    },
  },
];
user_login_or_register();
