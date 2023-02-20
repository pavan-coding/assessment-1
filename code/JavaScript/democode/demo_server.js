const net = require("net");
const chalk = require("chalk");
var count = 0;
const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    count++;
    console.log(data.toString("utf8"));

    setTimeout(() => {
      const welcome = chalk.green;
      socket.write(welcome("data received") + count);
    }, 5000);
  });
  socket.on("error", (err) => {
    console.log(err);
  });
  socket.on("end", () => {
    console.log("user disconnected");
  });
});
server.on("error", (err) => {});
server.listen(12345);
