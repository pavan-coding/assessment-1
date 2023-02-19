const net = require("net");
const chalk = require("chalk");
const server = net.createServer((socket) => {
  socket.on("data", (data) => {});
  socket.on("error:", (err) => {});
});
server.listen(12345);
