// require("dotenv").config();
// console.log(process.env.USER);
const inquirer = require("inquirer");

async function getUserInput() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "input",
      message: "Enter input: ",
    },
  ]);
  return answers.input;
}

async function run() {
  while (true) {
    const userInput = await getUserInput();
    console.log(`You entered: ${userInput}`);
  }
}

run();
