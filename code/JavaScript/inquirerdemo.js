const inquirer = require("inquirer");
const prompt = inquirer.createPromptModule();

const question = [
  {
    type: "list",
    name: "action",
    Message: "Welcome to the Chat Room",
    choices: ["login", "register", "exit"],
  },
];
inquirer.prompt(question).then((answers) => {
  console.log(answers);
});
