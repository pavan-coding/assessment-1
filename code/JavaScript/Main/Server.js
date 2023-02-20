const net = require("net");
const chalk = require("chalk");
const randomcolor = require("randomcolor");
const send_request = require("../Database/send_request");
const sockets = [];
const one_to_one = [];
const group = [];

function getid(name) {
  let count = 0;
  for (let i = 0; i < sockets.length; i++) {
    let dummy = sockets[i][0].split("-");
    if (dummy[0].localeCompare(name) == 0) {
      count = parseInt(dummy[1]);
    }
  }
  count += 1;
  return name + "-" + count;
}
function getsocket(name) {
  let count = 0;
  for (let i = 0; i < sockets.length; i++) {
    //  console.log(sockets[i][0], name);

    if (sockets[i][0].localeCompare(name) == 0) {
      return sockets[i][1];
    }
  }
  return -1;
}
const server = net.createServer((socket) => {
  socket.on("data", async (data) => {
    data = JSON.parse(data);
    if (data.type.toLowerCase().localeCompare("login") == 0) {
      let dummy = data.data.split(" ");
      socket.in_one_to_one = false;
      socket.in_group = false;
      const id = getid(dummy[0]);
      console.log(chalk.green(dummy[0]) + " Connected to the server");
      socket.id = id;
      sockets.push([id, socket]);
      //console.log(sockets);
    }
    if (data.type.toLowerCase().localeCompare("-clients") == 0) {
      if (sockets.length > 1) {
        for (let i = 0; i < sockets.length; i++) {
          if (sockets[i][1].id.localeCompare(socket.id) != 0)
            socket.write(sockets[i][1].id);
        }
      } else {
        socket.write("No Clients in Online " + "😞");
      }
    }
    if (data.type.toLowerCase().localeCompare("request") == 0) {
      let dummy = getsocket(data.request_to);
      console.log(dummy);
      console.log(data);
      if (
        dummy != -1 &&
        dummy.in_one_to_one == false &&
        dummy.in_group == false
      ) {
        socket.write(
          chalk.greenBright("Request Sent Successfully to :") +
            chalk.yellowBright(data.request_to)
        );
        dummy.write(
          chalk.greenBright(socket.id) + " has Sent a Request to You"
        );
        await send_request.add_request(socket.id, data.request_to);
      } else {
        socket.write(
          chalk.redBright(
            "User is not in Online or Not Exits or in Another Chat"
          )
        );
      }
    }
    if (data.type.toLowerCase().localeCompare("end") == 0) {
      console.log(data.data);
      for (let i = 0; i < sockets.length; i++) {
        if (sockets[i][1].id.localeCompare(socket.id) == 0) {
          sockets.splice(i, 1);
          break;
        }
      }
      console.log("No of user conected to the Server" + sockets.length);
    }
  });
  socket.on("error", (err) => {});
});
server.listen(12345);
