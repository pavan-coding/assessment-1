const inquirer = require("inquirer");
const password = [
  {
    type: "password",
    name: "password",
    message: "Enter Passwrod:",
    mask: "*",
    validate(value) {
      if (value.length < 6) {
        return "password must have the following:\n at least 6 characters \n should contain at least one uppercase letter \n should contain at least one lowercase letter \n should contain";
      }
      return true;
    },
  },
];
inquirer.prompt(password).then((answers) => {
  console.log();
});
