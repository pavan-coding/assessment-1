const inquirer = require("inquirer");
const password = [
  {
    type: "password",
    name: "password",
    message: "Enter Passwrod:",
    mask: "*",
    validate(value) {
      if (value.length < 6) {
        return "password must have the following:\n   1.at least 8 characters \n   2.should contain one uppercase letter \n   3.should contain one lowercase letter \n   4.should contain a number\n   5.should contain a symbol";
      }
      return true;
    },
  },
];
inquirer.prompt(password).then((answers) => {
  console.log();
});
