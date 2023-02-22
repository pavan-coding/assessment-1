const inquirer = require("inquirer");
const chalk = require("chalk");
const terminalkit = require("terminal-kit");
const readline = require("readline");
const net = require("net");
const check_user = require("../Database/check_user_exists");
const register_user = require("../Database/register");
const login_user = require("../Database/login");

const user_update_password = require("../Database/update_password");

const terminal = terminalkit.terminal;
let Status = "shell";
const shell_mode = [
  "$request_accept",
  "$help",
  "$logout",
  "$list",
  "$creategp",
  "$joingp",
  "$clear",
  "$request",
  "$gpinfo",
  "$update_password",
];
const chat_mode = ["$help", "$exit", "$clear"];
const group_mode = ["$gpinfo", "$help", "$exit", "$clear"];
let rl;
let client;
let username_login = "";
var input_readline = "";

function check_in_shell(str) {
  return shell_mode.indexOf(str.toLocaleLowerCase());
}

async function setChatMode() {
  await rotate_animation();
  Status = "chat:1-1";
  print_heading();
  console.log();
  display(Status);
  help_display();
  process.stdout.write(chalk.redBright("➜ "));
}

async function setGroupMode() {
  await rotate_animation();
  Status = "group";
  print_heading();
  console.log();
  display(Status);
  help_display();
  process.stdout.write(chalk.redBright("➜ "));
}

async function setShellMode() {
  await rotate_animation();
  Status = "shell";
  print_heading();
  console.log();
  display(Status);
  help_display();
  process.stdout.write(chalk.redBright("➜ "));
}

function check_in_chat(str) {
  return chat_mode.indexOf(str.toLocaleLowerCase());
}
function check_in_group(str) {
  return group_mode.indexOf(str.toLocaleLowerCase());
}
function is_command(str) {
  if (str.length > 0 && str[0].localeCompare("$") == 0) return true;
  return false;
}

function init_client() {
  client = new net.Socket();
  const options = {
    port: 12345,
    host: "127.0.0.1",
  };
  client.connect(options);
  const server_data = {
    type: "login",
    data: username_login + " Connected to the Server",
  };
  client.write(JSON.stringify(server_data));
  client.on("error", (err) => {
    console.log("Server Disconnected");
    close_client();
    process.exit();
  })
  client.on("data", function (data) {
    readline.clearLine(process.stdout, 0, () => {
      readline.cursorTo(process.stdout, 0, async () => {
        if (data.toString("utf8").localeCompare("$request_accepted") == 0) {
          console.log(" Request Accepted");
          await setChatMode();
        } else if (
          data
            .toString("utf8")
            .localeCompare("$Other Client has disconnected") == 0
        ) {
          console.log("Other Client has disconnected");
          await setShellMode();
        } else if (
          data
            .toString("utf8")
            .localeCompare("$Added in to Group successfully") == 0
        ) {
          console.log(chalk.greenBright("Added in to Group successfully"));
          await setGroupMode();
        } else if (
          data.toString("utf8").localeCompare("$Group Created Successfully") ==
          0
        ) {
          console.log(chalk.greenBright("Group Created Successfully"));
          await setGroupMode();
        } else if (data.toString("utf8").localeCompare("$Admin Left the Chat") == 0 || data.toString("utf8").localeCompare(chalk.greenBright("Server") + ": " + "$Admin Left the Chat") == 0) {

          console.log(chalk.redBright("Admin") + " Left the Chat")
          console.log("Leaving The Group");
          await setShellMode();
        }
        else if (data.toString("utf8").localeCompare("$leave group") == 0) {
          console.log("Leaving The Group")
          await setShellMode();

        } else {
          console.log(data.toString("utf8"));
        }
        rl.write(null, {
          ctrl: true,
          name: "u",
        });
        rl.write(input_readline);
      });
    });
  });
}

function close_client() {
  const data = {
    type: "end",
    data: chalk.redBright(username_login) + " Disconnected From The Server",
  };
  client.end(JSON.stringify(data));
}

function init_readline() {
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.redBright("➜ "),
  });
  rl.on("line", async function (line) {
    if (Status.localeCompare("shell") == 0) {
      if (is_command(line) == false) {
        console.log(
          chalk.redBright("ERROR:") +
          " You are in Shell mode only Commands are allowed\nIf you don't know commands Enter " +
          chalk.yellow("$help") +
          " If you Need commands list with Discription"
        );
        process.stdout.write(chalk.redBright("➜ "));
        return;
      }
    }

    if (Status.localeCompare("chat:1-1") == 0) {
      if (is_command(line) == true) {
        let dummy = line.split(" ");
        if (dummy.length > 0 && check_in_chat(dummy[0]) == -1) {
          console.log(
            chalk.redBright("ERROR:") +
            "Invalid Command: only $help and $exit and $clear are allowed in chat 1-1 mode"
          );
          process.stdout.write(chalk.redBright("➜ "));
          return;
        }
      } else {
        const data = { type: "message", chat: "1-1", message: line };
        client.write(JSON.stringify(data));
      }
    }

    if (Status.localeCompare("group") == 0) {
      if (is_command(line) == true) {
        let dummy = line.split(" ");
        if (dummy.length > 0 && check_in_group(dummy[0]) == -1) {
          console.log(
            chalk.redBright("ERROR:") +
            "Invalid Command: only $gpinfo, $help, $exit, $clear are allowed in group mode"
          );
          process.stdout.write(chalk.redBright("➜ "));
          return;
        }
      } else {
        const data = { type: "message", chat: "group", message: line };
        client.write(JSON.stringify(data));
      }
    }

    if (is_command(line) == true) {
      let command_parts = line.split(" ");
      if (
        check_in_shell(command_parts[0]) == -1 &&
        check_in_chat(command_parts[0]) == -1
      ) {
        console.log(
          chalk.redBright("ERROR:") +
          " Invalid Command\nIf you don't know commands Enter " +
          chalk.yellow("$help") +
          " If you Need commands list with Discription"
        );
        process.stdout.write(chalk.redBright("➜ "));
        return;
      }
    }

    terminal.up(1);
    terminal.eraseLine();

    if (is_command(line) == true) console.log(chalk.blue("➜ ") + line);
    else console.log(chalk.redBright("You: ") + line);

    if (is_command(line) == true) {
      const parts = line.split(" ");

      if (line.toLocaleLowerCase().localeCompare("$logout") == 0) {
        close_readline();
        close_client();
        return;
      } else if (line.toLocaleLowerCase().localeCompare("$help") == 0) {
        print_help_table();
      } else if (
        parts.length == 2 &&
        parts[0].toLocaleLowerCase().localeCompare("$list") == 0
      ) {
        if (parts[1].toLocaleLowerCase().localeCompare("-clients") == 0) {
          client.write(JSON.stringify({ type: "-clients" }));
        } else if (
          parts[1].toLocaleLowerCase().localeCompare("-requests") == 0
        ) {
          client.write(JSON.stringify({ type: "list_requests" }));
        } else if (parts[1].toLocaleLowerCase().localeCompare("-groups") == 0) {
          client.write(JSON.stringify({ type: "list_groups" }));
        } else {
          display_invalid();
          return;
        }
      } else if (line.toLocaleLowerCase().localeCompare("$clear") == 0) {
        terminal.clear();
        print_heading();
        console.log();
        display(Status);
        help_display();
      } else if (
        parts.length == 3 &&
        parts[0].toLocaleLowerCase().localeCompare("$update_password") == 0
      ) {
        const result = await user_update_password.user_update_password(
          username_login,
          parts[1],
          parts[2]
        );
        if (result == true) {
          console.log(chalk.greenBright("Password Updated Successfully"));
        } else {
          console.log(result);
        }
      } else if (
        parts.length == 2 &&
        parts[0].toLocaleLowerCase().localeCompare("$request") == 0
      ) {
        const data = {
          type: "request",
          request_to: parts[1],
          request_from: username_login,
        };

        client.write(JSON.stringify(data));
      } else if (
        parts.length == 2 &&
        parts[0].toLocaleLowerCase().localeCompare("$request_accept") == 0
      ) {
        const data = {
          type: "request_accept",
          user: parts[1],
        };
        client.write(JSON.stringify(data));

        return;
      } else if (
        parts.length == 2 &&
        parts[0].toLocaleLowerCase().localeCompare("$exit") == 0
      ) {
        if (parts[1].toLocaleLowerCase().localeCompare("-chat") == 0) {
          let data = { type: "exit-chat" };
          client.write(JSON.stringify(data));
          if (Status.localeCompare("chat:1-1") == 0) {
            await setShellMode();
          }
          return;
        } else if (parts[1].toLocaleLowerCase().localeCompare("-group") == 0) {
          let data = { type: "exit-group" };
          client.write(JSON.stringify(data));
          //  await setShellMode();
        } else {
          display_invalid();
          return;
        }
      } else if (
        parts.length == 3 &&
        parts[0].toLocaleLowerCase().localeCompare("$creategp") == 0
      ) {
        let data = {
          type: "create_group",
          group_name: parts[1],
          group_password: parts[2],
        };
        client.write(JSON.stringify(data));
      } else if (
        parts.length == 2 &&
        parts[0].toLocaleLowerCase().localeCompare("$gpinfo") == 0
      ) {
        let data = { type: "group_info", name: parts[1] };
        client.write(JSON.stringify(data));
      } else if (
        parts.length == 3 &&
        parts[0].toLocaleLowerCase().localeCompare("$joingp") == 0
      ) {
        let data = {
          type: "join_group",
          group_name: parts[1],
          group_password: parts[2],
        };
        client.write(JSON.stringify(data));
      } else {
        display_invalid();
        return;
      }
    }
    process.stdout.write(chalk.redBright("➜ "));
  });
  rl.input.on("keypress", (character, key) => {
    input_readline += character;
    if (character == "\r") {
      input_readline = "";
    }
  });
}
function display_invalid() {
  console.log(
    chalk.redBright("ERROR:") +
    " Invalid Command\nIf you don't know commands Enter " +
    chalk.yellow("$help") +
    " If you Need commands list with Discription"
  );
  process.stdout.write(chalk.redBright("➜ "));
}
function close_readline() {
  process.stdin.destroy();
  rl.close();
}

function display(string_val) {
  const width = terminal.width;
  const position = Math.round((width - string_val.length) / 2);
  let spaces = "";
  for (let i = 0; i < position; i++) {
    spaces += " ";
  }
  console.log(spaces + chalk.black.bgYellow(string_val));
}

function help_display() {
  const help =
    "Type " +
    chalk.yellow("$help") +
    " If you Need commands list with Discription";
  console.log(help);
}

function print_heading() {
  const width = terminal.width;
  const title = "  Tcp Server - Client Terminal Application  ";
  const position = Math.round((width - title.length) / 2);
  let spaces = "";
  for (let i = 0; i < position; i++) {
    spaces += " ";
  }
  terminal.clear();
  console.log(spaces + chalk.black.bgYellow(title));
}
async function rotate_animation() {
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
  await terminal_obj.then(() => {
    print_heading();
  });
}
async function prompt_user_login_or_register() {
  await user_login_or_register();
  await rotate_animation();
}
async function user_login_or_register() {
  let login_status = false;
  while (login_status == false) {
    let answers = await inquirer.prompt(login_or_register);
    if (answers["login_or_register"].localeCompare("Exit") == 0) {
      process.exit();
    }

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
process.on("SIGINT", async () => {
  if (username_login != "") {
    close_client();
    process.exit();
  }
});
process.on("beforeExit", async () => {
  if (username_login != "") {
    close_client();
    process.exit();
  }
});
process.on("exit", () => {
  console.log(
    chalk.yellowBright.bold("Have a Nice Day! ") +
    "😊 " +
    chalk.yellowBright.bold("Bye ") +
    "👋"
  );
});
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

function print_help_table() {
  terminal.table(
    [
      ["^Y$help", "To get the List Of commands with Description"],
      ["^Y$list -clients", "To get the List of Clients who are Online"],
      ["^Y$list -groups", "To get the List of Groups which are Online"],
      ["^Y$list -requests", "To get the List of Request received from clients"],
      [
        "^Y$creategp name password",
        "To Create a Group with name {name} and password {password}",
      ],
      [
        "^Y$joingp name password",
        "To Join a Group with name {name} and authenticated with password {password}",
      ],
      ["^Y$exit -group", "To Exit from The Group Chat"],
      ["^Y$exit -chat", "To exit from the 1:1 chat"],
      ["^Y$request name", "To send request to a client with name {name}"],
      [
        "^Y$request_accept name",
        "To Accept the  request got from a client with name {name}",
      ],
      ["^Y$gpinfo name", "To get the List of Clients who are in the group"],
      [
        "^Y$update_password oldpassword newpassword",
        "To get the List of Clients who are Online",
      ],
      ["^Y$logout", "To quit from the app"],
    ],
    {
      hasBorder: true,
      contentHasMarkup: true,
      borderChars: "lightRounded",
      width: Math.round((terminal.width / 100) * 70),
      fit: true,
    }
  );
}
print_heading();
let password_register;

const login_or_register = [
  {
    type: "list",
    prefix: "",
    name: "login_or_register",
    choices: ["Login", "Register", "Exit"],
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
      if (input.indexOf("-") != -1) {
        return chalk.red("Username ") + " Cannot contain '-'";
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
const demo = async () => {
  await prompt_user_login_or_register();
  console.log();
  display("  Shell  ");
  help_display();
  init_readline();
  init_client();
  process.stdout.write(chalk.redBright("➜ "));
};
demo();
